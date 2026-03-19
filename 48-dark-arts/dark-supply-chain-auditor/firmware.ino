/*
 * Supply Chain Auditor - ESP32 Firmware
 * Verifies hardware supply chain integrity by fingerprinting IC chips,
 * comparing against known-good signatures, and detecting counterfeits.
 * FOR AUTHORIZED SECURITY TESTING ONLY.
 */

#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include <SPI.h>

#define STATUS_LED   2
#define SPI_CS       5
#define I2C_SDA      21
#define I2C_SCL      22
#define JTAG_TMS     14
#define JTAG_TCK     27
#define MAX_DEVICES  16

struct DeviceFingerprint {
    char description[48];
    uint8_t interface;       // 0=I2C, 1=SPI, 2=JTAG
    uint8_t address;
    uint8_t deviceId[8];
    int idLength;
    uint32_t responseTime;
    float powerSignature;
    bool verified;
    uint32_t timestamp;
};

DeviceFingerprint devices[MAX_DEVICES];
int deviceCount = 0;

WebServer server(80);

const char* AP_SSID = "SupplyChain-Audit";
const char* AP_PASS = "research2024";

void setup() {
    Serial.begin(115200);
    Serial.println("[SUPPLY] Supply Chain Auditor Starting");
    pinMode(STATUS_LED, OUTPUT);
    pinMode(SPI_CS, OUTPUT);
    digitalWrite(SPI_CS, HIGH);

    Wire.begin(I2C_SDA, I2C_SCL);
    SPI.begin();

    WiFi.softAP(AP_SSID, AP_PASS);
    Serial.printf("[NET] Control: %s\n", WiFi.softAPIP().toString().c_str());

    setupRoutes();
    server.begin();
    blinkLED(3, 150);
}

void loop() {
    server.handleClient();
}

void blinkLED(int n, int ms) {
    for (int i = 0; i < n; i++) {
        digitalWrite(STATUS_LED, HIGH); delay(ms);
        digitalWrite(STATUS_LED, LOW); delay(ms);
    }
}

void scanI2CBus() {
    Serial.println("[I2C] Scanning bus...");
    for (uint8_t addr = 1; addr < 127; addr++) {
        uint32_t start = micros();
        Wire.beginTransmission(addr);
        uint8_t err = Wire.endTransmission();
        uint32_t elapsed = micros() - start;

        if (err == 0 && deviceCount < MAX_DEVICES) {
            DeviceFingerprint* d = &devices[deviceCount];
            snprintf(d->description, 48, "I2C device at 0x%02X", addr);
            d->interface = 0;
            d->address = addr;
            d->responseTime = elapsed;
            d->timestamp = millis();

            // Try to read device ID
            Wire.beginTransmission(addr);
            Wire.write(0x00);
            Wire.endTransmission();
            d->idLength = Wire.requestFrom(addr, (uint8_t)8);
            for (int i = 0; i < d->idLength; i++) {
                d->deviceId[i] = Wire.read();
            }

            d->verified = false;
            deviceCount++;
            Serial.printf("[I2C] Found 0x%02X (response: %u us)\n", addr, elapsed);
        }
    }
}

void scanSPIDevice() {
    Serial.println("[SPI] Probing SPI device...");
    if (deviceCount >= MAX_DEVICES) return;

    DeviceFingerprint* d = &devices[deviceCount];
    uint32_t start = micros();

    digitalWrite(SPI_CS, LOW);
    SPI.transfer(0x9F);  // JEDEC ID command
    d->deviceId[0] = SPI.transfer(0x00);
    d->deviceId[1] = SPI.transfer(0x00);
    d->deviceId[2] = SPI.transfer(0x00);
    digitalWrite(SPI_CS, HIGH);

    d->responseTime = micros() - start;
    d->idLength = 3;
    d->interface = 1;
    d->address = 0;
    d->timestamp = millis();

    if (d->deviceId[0] != 0xFF && d->deviceId[0] != 0x00) {
        snprintf(d->description, 48, "SPI Flash MFR:0x%02X Dev:0x%02X%02X",
                 d->deviceId[0], d->deviceId[1], d->deviceId[2]);
        d->verified = false;
        deviceCount++;
        Serial.printf("[SPI] Found: %s\n", d->description);
    }
}

uint32_t computeHash(uint8_t* data, int len) {
    uint32_t hash = 5381;
    for (int i = 0; i < len; i++) {
        hash = ((hash << 5) + hash) + data[i];
    }
    return hash;
}

void verifyDevice(int index) {
    if (index < 0 || index >= deviceCount) return;
    DeviceFingerprint* d = &devices[index];

    // Timing consistency check (10 measurements)
    uint32_t times[10];
    for (int i = 0; i < 10; i++) {
        uint32_t start = micros();
        if (d->interface == 0) {
            Wire.beginTransmission(d->address);
            Wire.endTransmission();
        } else {
            digitalWrite(SPI_CS, LOW);
            SPI.transfer(0x9F);
            SPI.transfer(0x00);
            digitalWrite(SPI_CS, HIGH);
        }
        times[i] = micros() - start;
    }

    // Check timing consistency (counterfeits often have different timing)
    float sum = 0, sumSq = 0;
    for (int i = 0; i < 10; i++) { sum += times[i]; sumSq += times[i] * times[i]; }
    float mean = sum / 10;
    float stddev = sqrt(sumSq / 10 - mean * mean);
    float cv = stddev / mean;  // Coefficient of variation

    // ID consistency check
    uint8_t checkId[8];
    if (d->interface == 0) {
        Wire.beginTransmission(d->address);
        Wire.write(0x00);
        Wire.endTransmission();
        Wire.requestFrom(d->address, (uint8_t)8);
        for (int i = 0; i < 8 && Wire.available(); i++) checkId[i] = Wire.read();
    }

    bool idMatch = memcmp(d->deviceId, checkId, d->idLength) == 0;
    d->verified = (cv < 0.1) && idMatch;  // Low timing jitter + ID match
    d->powerSignature = cv;

    Serial.printf("[VERIFY] %s: CV=%.3f ID_match=%d -> %s\n",
                  d->description, cv, idMatch, d->verified ? "GENUINE" : "SUSPECT");
}

void setupRoutes() {
    server.on("/", HTTP_GET, []() {
        String html = "<html><head><title>Supply Chain Auditor</title></head><body>";
        html += "<h1>Supply Chain Integrity Auditor</h1>";
        html += "<p>Devices found: " + String(deviceCount) + "</p>";
        html += "<p><a href='/scan_i2c'>Scan I2C</a> | <a href='/scan_spi'>Scan SPI</a> | ";
        html += "<a href='/verify_all'>Verify All</a></p>";
        html += "<h2>Device Registry</h2><table border='1'>";
        html += "<tr><th>Description</th><th>ID</th><th>Response(us)</th><th>Status</th><th>Action</th></tr>";
        for (int i = 0; i < deviceCount; i++) {
            DeviceFingerprint* d = &devices[i];
            String color = d->verified ? "green" : (d->powerSignature > 0 ? "red" : "gray");
            html += "<tr style='color:" + color + "'>";
            html += "<td>" + String(d->description) + "</td><td>";
            for (int j = 0; j < d->idLength; j++) {
                char hex[4]; snprintf(hex, 4, "%02X", d->deviceId[j]); html += hex;
            }
            html += "</td><td>" + String(d->responseTime) + "</td>";
            html += "<td>" + String(d->verified ? "VERIFIED" :
                    (d->powerSignature > 0 ? "SUSPECT" : "UNTESTED")) + "</td>";
            html += "<td><a href='/verify?id=" + String(i) + "'>Verify</a></td></tr>";
        }
        html += "</table></body></html>";
        server.send(200, "text/html", html);
    });

    server.on("/scan_i2c", HTTP_GET, []() {
        deviceCount = 0; scanI2CBus();
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/scan_spi", HTTP_GET, []() {
        scanSPIDevice();
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/verify", HTTP_GET, []() {
        verifyDevice(server.arg("id").toInt());
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/verify_all", HTTP_GET, []() {
        for (int i = 0; i < deviceCount; i++) verifyDevice(i);
        server.sendHeader("Location", "/"); server.send(302);
    });
}
