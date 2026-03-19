/*
 * ESP Dead Zone - firmware.ino
 * Maps Wi-Fi coverage dead zones by scanning RSSI values
 * and logging them with GPS coordinates to SD card.
 *
 * Hardware: ESP32 DevKit + NEO-6M GPS + SD card module
 * Wiring:  GPS TX->GPIO16 RX->GPIO17, SD CS->GPIO5
 */

#include <WiFi.h>
#include <SD.h>
#include <SPI.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>

// ---------- Pin definitions ----------
#define GPS_TX_PIN   16
#define GPS_RX_PIN   17
#define SD_CS_PIN    5
#define LED_PIN      2
#define BTN_SCAN     4   // Manual scan trigger

// ---------- Objects ----------
HardwareSerial gpsSerial(1);
TinyGPSPlus gps;
File logFile;

// ---------- Config ----------
static const char *TARGET_SSID = "MyNetwork";  // SSID to track
static unsigned long lastScan = 0;
static const unsigned long SCAN_INTERVAL = 3000; // ms
static uint32_t sampleCount = 0;

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[DeadZone] Initializing...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_SCAN, INPUT_PULLUP);

  // GPS serial
  gpsSerial.begin(9600, SERIAL_8N1, GPS_TX_PIN, GPS_RX_PIN);

  // SD card
  if (!SD.begin(SD_CS_PIN)) {
    Serial.println("[SD] Card mount failed!");
  } else {
    Serial.println("[SD] Card ready.");
    logFile = SD.open("/deadzone.csv", FILE_APPEND);
    if (logFile) {
      logFile.println("timestamp,lat,lon,ssid,rssi,channel");
      logFile.close();
    }
  }

  // Wi-Fi scan mode
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  Serial.println("[DeadZone] Ready. Scanning...");
}

// ---------- Log one scan result ----------
void logScanResult(double lat, double lon, const char *ssid, int rssi, int ch) {
  logFile = SD.open("/deadzone.csv", FILE_APPEND);
  if (logFile) {
    logFile.printf("%lu,%.6f,%.6f,%s,%d,%d\n",
                   millis(), lat, lon, ssid, rssi, ch);
    logFile.close();
    sampleCount++;
  }
  Serial.printf("[LOG] #%u  RSSI=%d  (%.4f,%.4f)\n",
                sampleCount, rssi, lat, lon);
}

// ---------- Perform Wi-Fi scan ----------
void performScan() {
  double lat = gps.location.isValid() ? gps.location.lat() : 0.0;
  double lon = gps.location.isValid() ? gps.location.lng() : 0.0;

  int n = WiFi.scanNetworks(false, true);
  bool targetFound = false;

  for (int i = 0; i < n; i++) {
    if (String(WiFi.SSID(i)) == TARGET_SSID) {
      logScanResult(lat, lon, WiFi.SSID(i).c_str(),
                    WiFi.RSSI(i), WiFi.channel(i));
      targetFound = true;
    }
  }

  if (!targetFound) {
    // Log dead zone: target SSID not heard at all
    logScanResult(lat, lon, TARGET_SSID, -999, 0);
    Serial.println("[DeadZone] ** DEAD ZONE detected **");
    // Blink LED fast to indicate dead zone
    for (int k = 0; k < 6; k++) {
      digitalWrite(LED_PIN, !digitalRead(LED_PIN));
      delay(100);
    }
  } else {
    digitalWrite(LED_PIN, HIGH);
    delay(50);
    digitalWrite(LED_PIN, LOW);
  }

  WiFi.scanDelete();
}

// ---------- Main loop ----------
void loop() {
  // Feed GPS parser
  while (gpsSerial.available()) {
    gps.encode(gpsSerial.read());
  }

  // Timed scan or button press
  bool btnPressed = (digitalRead(BTN_SCAN) == LOW);
  if (btnPressed || (millis() - lastScan >= SCAN_INTERVAL)) {
    lastScan = millis();
    performScan();
  }

  // Print GPS status every 10 seconds
  static unsigned long lastGpsStatus = 0;
  if (millis() - lastGpsStatus > 10000) {
    lastGpsStatus = millis();
    Serial.printf("[GPS] Sats=%d  Fix=%s\n",
                  gps.satellites.value(),
                  gps.location.isValid() ? "YES" : "NO");
  }
}
