/*
 * Evil Firmware Flasher - ESP32 Firmware
 * Security research tool for firmware analysis and integrity verification.
 * Connects to target devices via SPI/JTAG to dump and validate firmware.
 * FOR AUTHORIZED SECURITY TESTING ONLY.
 */

#include <WiFi.h>
#include <SPI.h>
#include <WebServer.h>
#include <SPIFFS.h>

// Pin Configuration
#define SPI_CS    5
#define SPI_CLK   18
#define SPI_MOSI  23
#define SPI_MISO  19
#define JTAG_TDI  25
#define JTAG_TDO  26
#define JTAG_TCK  27
#define JTAG_TMS  14
#define STATUS_LED 2

// Flash chip commands (common SPI flash)
#define CMD_READ_ID     0x9F
#define CMD_READ_DATA   0x03
#define CMD_WRITE_EN    0x06
#define CMD_PAGE_PROG   0x02
#define CMD_SECTOR_ERASE 0x20
#define CMD_READ_STATUS  0x05

const char* AP_SSID = "FW-Audit-Lab";
const char* AP_PASS = "research2024";

WebServer server(80);
bool targetConnected = false;
uint32_t flashSize = 0;
uint8_t manufacturerId = 0;
uint8_t deviceId = 0;

void setup() {
    Serial.begin(115200);
    Serial.println("[FW-FLASH] Firmware Analysis Tool Starting");

    pinMode(STATUS_LED, OUTPUT);
    pinMode(SPI_CS, OUTPUT);
    digitalWrite(SPI_CS, HIGH);

    SPI.begin(SPI_CLK, SPI_MISO, SPI_MOSI, SPI_CS);
    SPI.setFrequency(1000000);

    SPIFFS.begin(true);

    WiFi.softAP(AP_SSID, AP_PASS);
    Serial.printf("[NET] AP: %s @ %s\n", AP_SSID, WiFi.softAPIP().toString().c_str());

    setupRoutes();
    server.begin();

    blinkLED(3, 200);
    probeTarget();
}

void loop() {
    server.handleClient();
    static unsigned long lastProbe = 0;
    if (millis() - lastProbe > 5000) {
        lastProbe = millis();
        if (!targetConnected) probeTarget();
    }
}

void blinkLED(int count, int delayMs) {
    for (int i = 0; i < count; i++) {
        digitalWrite(STATUS_LED, HIGH);
        delay(delayMs);
        digitalWrite(STATUS_LED, LOW);
        delay(delayMs);
    }
}

void probeTarget() {
    Serial.println("[PROBE] Checking for SPI flash target...");
    digitalWrite(SPI_CS, LOW);
    SPI.transfer(CMD_READ_ID);
    manufacturerId = SPI.transfer(0x00);
    uint8_t memType = SPI.transfer(0x00);
    deviceId = SPI.transfer(0x00);
    digitalWrite(SPI_CS, HIGH);

    if (manufacturerId != 0xFF && manufacturerId != 0x00) {
        targetConnected = true;
        flashSize = 1 << deviceId;
        Serial.printf("[PROBE] Found: MFR=0x%02X Type=0x%02X Dev=0x%02X Size=%u bytes\n",
                      manufacturerId, memType, deviceId, flashSize);
    } else {
        targetConnected = false;
        Serial.println("[PROBE] No target detected");
    }
}

uint8_t readFlashStatus() {
    digitalWrite(SPI_CS, LOW);
    SPI.transfer(CMD_READ_STATUS);
    uint8_t status = SPI.transfer(0x00);
    digitalWrite(SPI_CS, HIGH);
    return status;
}

void waitFlashReady() {
    while (readFlashStatus() & 0x01) {
        delay(1);
    }
}

void readFlashBlock(uint32_t addr, uint8_t* buf, size_t len) {
    digitalWrite(SPI_CS, LOW);
    SPI.transfer(CMD_READ_DATA);
    SPI.transfer((addr >> 16) & 0xFF);
    SPI.transfer((addr >> 8) & 0xFF);
    SPI.transfer(addr & 0xFF);
    for (size_t i = 0; i < len; i++) {
        buf[i] = SPI.transfer(0x00);
    }
    digitalWrite(SPI_CS, HIGH);
}

uint32_t computeCRC32(uint32_t startAddr, uint32_t length) {
    uint32_t crc = 0xFFFFFFFF;
    uint8_t buf[256];
    for (uint32_t addr = startAddr; addr < startAddr + length; addr += sizeof(buf)) {
        size_t chunk = min((size_t)(startAddr + length - addr), sizeof(buf));
        readFlashBlock(addr, buf, chunk);
        for (size_t i = 0; i < chunk; i++) {
            crc ^= buf[i];
            for (int j = 0; j < 8; j++) {
                crc = (crc >> 1) ^ (0xEDB88320 & -(crc & 1));
            }
        }
    }
    return ~crc;
}

void setupRoutes() {
    server.on("/", HTTP_GET, []() {
        String html = "<html><head><title>FW Audit Lab</title></head><body>";
        html += "<h1>Firmware Analysis Tool</h1>";
        html += "<p>Status: " + String(targetConnected ? "TARGET CONNECTED" : "No Target") + "</p>";
        if (targetConnected) {
            html += "<p>Manufacturer: 0x" + String(manufacturerId, HEX) + "</p>";
            html += "<p>Flash Size: " + String(flashSize) + " bytes</p>";
            html += "<p><a href='/dump?start=0&len=4096'>Dump First 4KB</a></p>";
            html += "<p><a href='/verify'>Verify Integrity</a></p>";
            html += "<p><a href='/entropy'>Entropy Analysis</a></p>";
        }
        html += "<p><a href='/scan'>Rescan Target</a></p>";
        html += "</body></html>";
        server.send(200, "text/html", html);
    });

    server.on("/dump", HTTP_GET, []() {
        if (!targetConnected) { server.send(503, "text/plain", "No target"); return; }
        uint32_t start = server.hasArg("start") ? server.arg("start").toInt() : 0;
        uint32_t len = server.hasArg("len") ? server.arg("len").toInt() : 256;
        len = min(len, (uint32_t)4096);
        String hex = "";
        uint8_t buf[16];
        for (uint32_t a = start; a < start + len; a += 16) {
            readFlashBlock(a, buf, 16);
            char line[80];
            snprintf(line, sizeof(line), "%08X: ", a);
            hex += line;
            for (int i = 0; i < 16; i++) {
                snprintf(line, sizeof(line), "%02X ", buf[i]);
                hex += line;
            }
            hex += "\n";
        }
        server.send(200, "text/plain", hex);
    });

    server.on("/verify", HTTP_GET, []() {
        if (!targetConnected) { server.send(503, "text/plain", "No target"); return; }
        uint32_t crc = computeCRC32(0, min(flashSize, (uint32_t)65536));
        String result = "CRC32: 0x" + String(crc, HEX) + "\nSize: " + String(flashSize);
        server.send(200, "text/plain", result);
    });

    server.on("/entropy", HTTP_GET, []() {
        if (!targetConnected) { server.send(503, "text/plain", "No target"); return; }
        uint8_t buf[1024];
        readFlashBlock(0, buf, 1024);
        uint32_t histogram[256] = {0};
        for (int i = 0; i < 1024; i++) histogram[buf[i]]++;
        float entropy = 0;
        for (int i = 0; i < 256; i++) {
            if (histogram[i] > 0) {
                float p = (float)histogram[i] / 1024.0;
                entropy -= p * log2(p);
            }
        }
        String result = "Entropy: " + String(entropy, 4) + " bits/byte\n";
        result += entropy > 7.5 ? "Status: Likely encrypted/compressed" : "Status: Unencrypted firmware";
        server.send(200, "text/plain", result);
    });

    server.on("/scan", HTTP_GET, []() {
        probeTarget();
        server.sendHeader("Location", "/");
        server.send(302);
    });
}
