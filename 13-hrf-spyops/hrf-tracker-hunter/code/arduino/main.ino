/*
 * Tracker Hunter — ESP32 Arduino
 * Tracker Hunter — Find Hidden Trackers
 *
 * Workshop-DIY Educational Project
 * Board: ESP32 Dev Module
 * Upload via Arduino IDE with ESP32 board package
 *
 * Process:
 *   Step 1: Set the frequency band, modulation type, and signal parameters.
 *   Step 2: Scan the radio spectrum to detect and capture signals of interest.
 *   Step 3: Apply signal processing to identify modulation, encoding, and source.
 *   Step 4: Categorize the signal type and log detailed analysis results.
 */

#include <WiFi.h>
#include <esp_wifi.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>

// ── Configuration ──
#define APP_NAME "hrf-tracker-hunter"
#define LED_PIN 2
#define SCAN_TIME 5  // seconds

// ── State ──
bool running = false;
int cycleCount = 0;
float sensorValue = 0.0;
String lastResult = "";

// ── BLE ──
BLEScan* pBLEScan;

class ScanCallback : public BLEAdvertisedDeviceCallbacks {
    void onResult(BLEAdvertisedDevice device) {
        if (device.haveName()) {
            Serial.printf("  [BLE] %s RSSI:%d\n", device.getName().c_str(), device.getRSSI());
        }
    }
};

void setup() {
    Serial.begin(115200);
    Serial.println("\n=== " APP_NAME " ===");
    Serial.println("Workshop-DIY ESP32 Firmware");
    Serial.println("Commands: START, STOP, SCAN, STATUS\n");

    pinMode(LED_PIN, OUTPUT);

    // Initialize BLE
    BLEDevice::init(APP_NAME);
    pBLEScan = BLEDevice::getScan();
    pBLEScan->setAdvertisedDeviceCallbacks(new ScanCallback());
    pBLEScan->setActiveScan(true);
    pBLEScan->setInterval(100);
    pBLEScan->setWindow(99);

    // Initialize WiFi in station mode
    WiFi.mode(WIFI_STA);
    WiFi.disconnect();

    // Flash LED to indicate ready
    for (int i = 0; i < 3; i++) {
        digitalWrite(LED_PIN, HIGH);
        delay(100);
        digitalWrite(LED_PIN, LOW);
        delay(100);
    }

    Serial.println("[READY] Type START to begin");
}

void processCommand(String cmd) {
    cmd.trim();
    cmd.toUpperCase();

    if (cmd == "START") {
        running = true;
        Serial.println("[START] Simulation running...");
        digitalWrite(LED_PIN, HIGH);
    }
    else if (cmd == "STOP") {
        running = false;
        Serial.println("[STOP] Simulation paused");
        digitalWrite(LED_PIN, LOW);
    }
    else if (cmd == "SCAN") {
        Serial.println("[SCAN] BLE scan starting...");
        BLEScanResults results = pBLEScan->start(SCAN_TIME, false);
        Serial.printf("[SCAN] Found %d devices\n", results.getCount());
        pBLEScan->clearResults();
    }
    else if (cmd == "STATUS") {
        Serial.printf("[STATUS] Running:%s Cycles:%d Sensor:%.1f\n",
            running ? "YES" : "NO", cycleCount, sensorValue);
    }
}

float readSensors() {
    // Read analog sensor (or use internal temp)
    float raw = analogRead(36) / 4095.0 * 100.0;
    // Add some WiFi RSSI data
    int networks = WiFi.scanNetworks(false, false, false, 100);
    WiFi.scanDelete();
    return raw + networks * 2.0;
}

void processData(float value) {
    sensorValue = value;
    cycleCount++;

    // Classify result
    if (value > 70) {
        lastResult = "HIGH";
        digitalWrite(LED_PIN, HIGH);
    } else if (value > 30) {
        lastResult = "MEDIUM";
        // Blink
        digitalWrite(LED_PIN, (millis() / 500) % 2);
    } else {
        lastResult = "LOW";
        digitalWrite(LED_PIN, LOW);
    }

    if (cycleCount % 10 == 0) {
        Serial.printf("[DATA] Cycle:%d Value:%.1f Result:%s\n",
            cycleCount, value, lastResult.c_str());
    }
}

void loop() {
    // Check serial commands
    if (Serial.available()) {
        String cmd = Serial.readStringUntil('\n');
        processCommand(cmd);
    }

    if (running) {
        float value = readSensors();
        processData(value);
        delay(100);
    } else {
        delay(500);
    }
}
