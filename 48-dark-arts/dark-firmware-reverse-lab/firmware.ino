/*
 * Firmware Reverse Lab - ESP32 Firmware
 * Firmware extraction and analysis tool using UART, SPI, and I2C
 * interfaces to dump and examine embedded device firmware.
 * FOR AUTHORIZED SECURITY TESTING ONLY.
 */

#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include <SPI.h>

#define STATUS_LED  2
#define UART_RX2    16
#define UART_TX2    17
#define SPI_CS      5
#define I2C_SDA     21
#define I2C_SCL     22

#define MAX_DUMP_SIZE 4096
#define MAX_STRINGS   64

struct FirmwareInfo {
    uint32_t size;
    uint32_t crc32;
    uint8_t header[64];
    float entropy;
    int stringCount;
    char strings[MAX_STRINGS][48];
};

uint8_t dumpBuffer[MAX_DUMP_SIZE];
FirmwareInfo fwInfo;
bool targetFound = false;
String interfaceType = "none";

WebServer server(80);

const char* AP_SSID = "FW-Reverse-Lab";
const char* AP_PASS = "research2024";

void setup() {
    Serial.begin(115200);
    Serial2.begin(115200, SERIAL_8N1, UART_RX2, UART_TX2);
    Serial.println("[FW-REV] Firmware Reverse Engineering Lab");
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

    // Monitor UART for firmware data
    static uint8_t uartBuf[256];
    static int uartIdx = 0;
    while (Serial2.available()) {
        uartBuf[uartIdx++] = Serial2.read();
        if (uartIdx >= 256) {
            Serial.printf("[UART] Received %d bytes\n", uartIdx);
            uartIdx = 0;
        }
    }
}

void blinkLED(int n, int ms) {
    for (int i = 0; i < n; i++) {
        digitalWrite(STATUS_LED, HIGH); delay(ms);
        digitalWrite(STATUS_LED, LOW); delay(ms);
    }
}

bool scanI2C() {
    Serial.println("[I2C] Scanning bus...");
    for (uint8_t addr = 1; addr < 127; addr++) {
        Wire.beginTransmission(addr);
        if (Wire.endTransmission() == 0) {
            Serial.printf("[I2C] Device at 0x%02X\n", addr);
            return true;
        }
    }
    return false;
}

int dumpI2CEEPROM(uint8_t addr, uint32_t size) {
    size = min(size, (uint32_t)MAX_DUMP_SIZE);
    int bytesRead = 0;
    for (uint32_t offset = 0; offset < size; offset += 32) {
        Wire.beginTransmission(addr);
        Wire.write((offset >> 8) & 0xFF);
        Wire.write(offset & 0xFF);
        Wire.endTransmission();
        int chunk = min((uint32_t)32, size - offset);
        Wire.requestFrom(addr, (uint8_t)chunk);
        while (Wire.available() && bytesRead < (int)size) {
            dumpBuffer[bytesRead++] = Wire.read();
        }
    }
    return bytesRead;
}

int dumpSPIFlash(uint32_t size) {
    size = min(size, (uint32_t)MAX_DUMP_SIZE);
    digitalWrite(SPI_CS, LOW);
    SPI.transfer(0x03);  // READ command
    SPI.transfer(0x00);
    SPI.transfer(0x00);
    SPI.transfer(0x00);
    for (uint32_t i = 0; i < size; i++) {
        dumpBuffer[i] = SPI.transfer(0x00);
    }
    digitalWrite(SPI_CS, HIGH);
    return size;
}

uint32_t computeCRC32(uint8_t* data, int len) {
    uint32_t crc = 0xFFFFFFFF;
    for (int i = 0; i < len; i++) {
        crc ^= data[i];
        for (int j = 0; j < 8; j++) {
            crc = (crc >> 1) ^ (0xEDB88320 & -(crc & 1));
        }
    }
    return ~crc;
}

float computeEntropy(uint8_t* data, int len) {
    int freq[256] = {0};
    for (int i = 0; i < len; i++) freq[data[i]]++;
    float entropy = 0;
    for (int i = 0; i < 256; i++) {
        if (freq[i] > 0) {
            float p = (float)freq[i] / len;
            entropy -= p * log2(p);
        }
    }
    return entropy;
}

int extractStrings(uint8_t* data, int len) {
    fwInfo.stringCount = 0;
    int strStart = -1;
    for (int i = 0; i < len && fwInfo.stringCount < MAX_STRINGS; i++) {
        if (data[i] >= 0x20 && data[i] < 0x7F) {
            if (strStart < 0) strStart = i;
        } else {
            if (strStart >= 0 && (i - strStart) >= 4) {
                int slen = min(i - strStart, 47);
                memcpy(fwInfo.strings[fwInfo.stringCount], &data[strStart], slen);
                fwInfo.strings[fwInfo.stringCount][slen] = '\0';
                fwInfo.stringCount++;
            }
            strStart = -1;
        }
    }
    return fwInfo.stringCount;
}

void analyzeFirmware(int size) {
    fwInfo.size = size;
    fwInfo.crc32 = computeCRC32(dumpBuffer, size);
    memcpy(fwInfo.header, dumpBuffer, min(size, 64));
    fwInfo.entropy = computeEntropy(dumpBuffer, size);
    extractStrings(dumpBuffer, size);
    Serial.printf("[ANALYZE] Size=%u CRC=0x%08X Entropy=%.2f Strings=%d\n",
                  fwInfo.size, fwInfo.crc32, fwInfo.entropy, fwInfo.stringCount);
}

void setupRoutes() {
    server.on("/", HTTP_GET, []() {
        String html = "<html><head><title>FW Reverse Lab</title></head><body>";
        html += "<h1>Firmware Reverse Engineering Lab</h1>";
        html += "<p>Interface: " + interfaceType + " | Dump size: " +
                String(fwInfo.size) + " bytes</p>";
        html += "<h2>Actions</h2>";
        html += "<p><a href='/scan'>Scan I2C</a> | ";
        html += "<a href='/dump_i2c?addr=80&size=4096'>Dump I2C EEPROM</a> | ";
        html += "<a href='/dump_spi?size=4096'>Dump SPI Flash</a></p>";
        if (fwInfo.size > 0) {
            html += "<h2>Analysis</h2>";
            html += "<p>CRC32: 0x" + String(fwInfo.crc32, HEX) + "</p>";
            html += "<p>Entropy: " + String(fwInfo.entropy, 2) + " bits/byte</p>";
            html += "<p>Status: " + String(fwInfo.entropy > 7.5 ?
                    "Encrypted/Compressed" : "Unencrypted") + "</p>";
            html += "<h3>Header (hex)</h3><pre>";
            for (int i = 0; i < min((int)fwInfo.size, 64); i++) {
                char hex[4]; snprintf(hex, 4, "%02X ", fwInfo.header[i]); html += hex;
                if ((i + 1) % 16 == 0) html += "\n";
            }
            html += "</pre><h3>Strings (" + String(fwInfo.stringCount) + ")</h3><pre>";
            for (int i = 0; i < fwInfo.stringCount; i++) {
                html += String(fwInfo.strings[i]) + "\n";
            }
            html += "</pre>";
            html += "<p><a href='/hexdump'>Full Hex Dump</a></p>";
        }
        html += "</body></html>";
        server.send(200, "text/html", html);
    });

    server.on("/scan", HTTP_GET, []() {
        targetFound = scanI2C();
        interfaceType = targetFound ? "I2C" : "none";
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/dump_i2c", HTTP_GET, []() {
        int addr = server.arg("addr").toInt();
        int size = server.arg("size").toInt();
        int read = dumpI2CEEPROM(addr, size);
        interfaceType = "I2C";
        analyzeFirmware(read);
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/dump_spi", HTTP_GET, []() {
        int size = server.arg("size").toInt();
        int read = dumpSPIFlash(size);
        interfaceType = "SPI";
        analyzeFirmware(read);
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/hexdump", HTTP_GET, []() {
        String hex = "";
        for (uint32_t i = 0; i < fwInfo.size; i += 16) {
            char line[80]; snprintf(line, sizeof(line), "%08X: ", i); hex += line;
            for (int j = 0; j < 16 && i + j < fwInfo.size; j++) {
                snprintf(line, sizeof(line), "%02X ", dumpBuffer[i + j]); hex += line;
            }
            hex += "\n";
        }
        server.send(200, "text/plain", hex);
    });
}
