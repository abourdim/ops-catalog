/*
 * Bluetooth Impersonator - ESP32 Firmware
 * BLE device cloning and impersonation detector for security audits.
 * Scans for BLE devices, captures advertisement data, and tests
 * whether target systems properly validate device identity.
 * FOR AUTHORIZED SECURITY TESTING ONLY.
 */

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <BLEServer.h>
#include <WiFi.h>
#include <WebServer.h>

#define STATUS_LED 2
#define MAX_DEVICES 32
#define SCAN_TIME 5

struct BLETarget {
    char name[32];
    char address[18];
    int rssi;
    uint8_t advData[31];
    int advDataLen;
    uint16_t appearance;
    bool cloned;
};

BLETarget targets[MAX_DEVICES];
int targetCount = 0;
int activeClone = -1;
BLEScan* pScan = nullptr;
BLEServer* pServer = nullptr;
WebServer webServer(80);

const char* AP_SSID = "BLE-Audit-Lab";
const char* AP_PASS = "research2024";

class ScanCallback : public BLEAdvertisedDeviceCallbacks {
    void onResult(BLEAdvertisedDevice device) {
        if (targetCount >= MAX_DEVICES) return;
        // Check for duplicates
        for (int i = 0; i < targetCount; i++) {
            if (strcmp(targets[i].address, device.getAddress().toString().c_str()) == 0) {
                targets[i].rssi = device.getRSSI();
                return;
            }
        }
        BLETarget* t = &targets[targetCount];
        strncpy(t->name, device.haveName() ? device.getName().c_str() : "<unknown>", 31);
        t->name[31] = '\0';
        strncpy(t->address, device.getAddress().toString().c_str(), 17);
        t->address[17] = '\0';
        t->rssi = device.getRSSI();
        t->appearance = device.haveAppearance() ? device.getAppearance() : 0;
        // Capture raw advertisement
        uint8_t* payload = device.getPayload();
        t->advDataLen = min((int)device.getPayloadLength(), 31);
        memcpy(t->advData, payload, t->advDataLen);
        t->cloned = false;
        targetCount++;
        Serial.printf("[SCAN] Found: '%s' %s RSSI:%d\n", t->name, t->address, t->rssi);
    }
};

void setup() {
    Serial.begin(115200);
    Serial.println("[BLE-IMPERSONATE] Bluetooth Audit Tool Starting");
    pinMode(STATUS_LED, OUTPUT);

    WiFi.softAP(AP_SSID, AP_PASS);
    Serial.printf("[NET] Control: %s\n", WiFi.softAPIP().toString().c_str());

    BLEDevice::init("BLE-Auditor");
    pScan = BLEDevice::getScan();
    pScan->setAdvertisedDeviceCallbacks(new ScanCallback());
    pScan->setActiveScan(true);
    pScan->setInterval(100);
    pScan->setWindow(99);

    setupRoutes();
    webServer.begin();
    blinkLED(3, 150);

    // Initial scan
    startScan();
}

void loop() {
    webServer.handleClient();
}

void blinkLED(int n, int ms) {
    for (int i = 0; i < n; i++) {
        digitalWrite(STATUS_LED, HIGH); delay(ms);
        digitalWrite(STATUS_LED, LOW); delay(ms);
    }
}

void startScan() {
    Serial.println("[SCAN] Starting BLE scan...");
    targetCount = 0;
    pScan->start(SCAN_TIME, false);
    Serial.printf("[SCAN] Complete: %d devices found\n", targetCount);
}

void startClone(int index) {
    if (index < 0 || index >= targetCount) return;
    BLETarget* t = &targets[index];

    // Stop any existing advertisement
    if (pServer != nullptr) {
        BLEDevice::deinit(false);
        BLEDevice::init(t->name);
    }

    pServer = BLEDevice::createServer();
    BLEAdvertising* pAdv = BLEDevice::getAdvertising();

    // Clone advertisement data
    BLEAdvertisementData advData;
    if (t->appearance > 0) {
        advData.setAppearance(t->appearance);
    }
    advData.setName(t->name);
    pAdv->setAdvertisementData(advData);
    pAdv->start();

    t->cloned = true;
    activeClone = index;
    Serial.printf("[CLONE] Impersonating: '%s' %s\n", t->name, t->address);
    blinkLED(2, 100);
}

void stopClone() {
    if (activeClone >= 0) {
        BLEDevice::getAdvertising()->stop();
        targets[activeClone].cloned = false;
        Serial.printf("[CLONE] Stopped impersonating: '%s'\n", targets[activeClone].name);
        activeClone = -1;
    }
}

void setupRoutes() {
    webServer.on("/", HTTP_GET, []() {
        String html = "<html><head><title>BLE Audit Lab</title></head><body>";
        html += "<h1>BLE Impersonation Tester</h1>";
        html += "<p><a href='/scan'>Rescan</a></p>";
        if (activeClone >= 0) {
            html += "<p style='color:red'>ACTIVE CLONE: " +
                    String(targets[activeClone].name) + " <a href='/stop'>Stop</a></p>";
        }
        html += "<h2>Discovered Devices (" + String(targetCount) + ")</h2><table border='1'>";
        html += "<tr><th>#</th><th>Name</th><th>Address</th><th>RSSI</th><th>Adv Len</th><th>Action</th></tr>";
        for (int i = 0; i < targetCount; i++) {
            html += "<tr><td>" + String(i) + "</td>";
            html += "<td>" + String(targets[i].name) + "</td>";
            html += "<td>" + String(targets[i].address) + "</td>";
            html += "<td>" + String(targets[i].rssi) + "</td>";
            html += "<td>" + String(targets[i].advDataLen) + "</td>";
            html += "<td><a href='/clone?id=" + String(i) + "'>Clone</a> | ";
            html += "<a href='/detail?id=" + String(i) + "'>Detail</a></td></tr>";
        }
        html += "</table></body></html>";
        webServer.send(200, "text/html", html);
    });

    webServer.on("/scan", HTTP_GET, []() {
        stopClone();
        startScan();
        webServer.sendHeader("Location", "/"); webServer.send(302);
    });

    webServer.on("/clone", HTTP_GET, []() {
        int id = webServer.arg("id").toInt();
        startClone(id);
        webServer.sendHeader("Location", "/"); webServer.send(302);
    });

    webServer.on("/stop", HTTP_GET, []() {
        stopClone();
        webServer.sendHeader("Location", "/"); webServer.send(302);
    });

    webServer.on("/detail", HTTP_GET, []() {
        int id = webServer.arg("id").toInt();
        if (id < 0 || id >= targetCount) { webServer.send(404); return; }
        BLETarget* t = &targets[id];
        String txt = "Name: " + String(t->name) + "\nAddr: " + String(t->address) +
                     "\nRSSI: " + String(t->rssi) + "\nAppearance: 0x" +
                     String(t->appearance, HEX) + "\nAdv Data (" + String(t->advDataLen) + "): ";
        for (int i = 0; i < t->advDataLen; i++) {
            char hex[4]; snprintf(hex, 4, "%02X ", t->advData[i]); txt += hex;
        }
        webServer.send(200, "text/plain", txt);
    });
}
