/*
 * ESP Solar Monitor - firmware.ino
 * Monitors solar panel output for ham radio field operations.
 * Reads voltage, current, and power via INA219 sensor.
 * Displays real-time data and logs to SD card.
 *
 * Hardware: ESP32 DevKit + INA219 + SSD1306 OLED + SD card
 * Wiring:  INA219/OLED SDA->GPIO21 SCL->GPIO22, SD CS->GPIO5
 */

#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include <Adafruit_INA219.h>
#include <Adafruit_SSD1306.h>
#include <SD.h>
#include <SPI.h>

#define SCREEN_W 128
#define SCREEN_H  64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);
Adafruit_INA219 ina219;

static const char *WIFI_SSID = "YourNetwork";
static const char *WIFI_PASS = "YourPassword";

#define SD_CS      5
#define LED_PIN    2
#define RELAY_PIN 25   // Load disconnect relay
#define BTN_PIN    4

WebServer webServer(80);

// ---------- Data ----------
static float voltage = 0;
static float current_mA = 0;
static float power_mW = 0;
static float energyWh = 0;       // Accumulated energy
static float peakPower = 0;
static float minVoltage = 99;
static float maxVoltage = 0;
static bool loadEnabled = true;
static bool sdReady = false;

// History for graphing (1-minute averages, 1 hour)
#define HISTORY_SIZE 60
static float voltHistory[HISTORY_SIZE];
static float powerHistory[HISTORY_SIZE];
static int histIdx = 0;
static unsigned long lastHistSave = 0;

// ---------- Low voltage protection ----------
#define LOW_VOLTAGE_CUTOFF  10.5  // 12V battery low
#define VOLTAGE_RECOVER     11.5

// ---------- Read sensors ----------
void readSensors() {
  voltage = ina219.getBusVoltage_V();
  current_mA = ina219.getCurrent_mA();
  power_mW = ina219.getPower_mW();

  if (voltage > maxVoltage) maxVoltage = voltage;
  if (voltage < minVoltage && voltage > 0.1) minVoltage = voltage;
  if (power_mW > peakPower) peakPower = power_mW;

  // Accumulate energy (Wh)
  static unsigned long lastEnergy = 0;
  if (lastEnergy > 0) {
    float hours = (millis() - lastEnergy) / 3600000.0;
    energyWh += (power_mW / 1000.0) * hours;
  }
  lastEnergy = millis();

  // Low voltage protection
  if (voltage < LOW_VOLTAGE_CUTOFF && loadEnabled) {
    loadEnabled = false;
    digitalWrite(RELAY_PIN, LOW);
    Serial.println("[SOLAR] Low voltage! Load disconnected.");
  } else if (voltage > VOLTAGE_RECOVER && !loadEnabled) {
    loadEnabled = true;
    digitalWrite(RELAY_PIN, HIGH);
    Serial.println("[SOLAR] Voltage recovered. Load connected.");
  }
}

// ---------- Log to SD ----------
void logToSD() {
  if (!sdReady) return;
  File f = SD.open("/solar.csv", FILE_APPEND);
  if (f) {
    f.printf("%lu,%.2f,%.1f,%.1f,%.3f\n",
             millis(), voltage, current_mA, power_mW, energyWh);
    f.close();
  }
}

// ---------- Display ----------
void updateDisplay() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);

  oled.setCursor(0, 0);
  oled.printf("Solar Monitor %s", loadEnabled ? "ON" : "OFF");

  oled.setTextSize(2);
  oled.setCursor(0, 12);
  oled.printf("%.1fV", voltage);

  oled.setTextSize(1);
  oled.setCursor(70, 12);
  oled.printf("%.0fmA", current_mA);
  oled.setCursor(70, 22);
  oled.printf("%.0fmW", power_mW);

  oled.setCursor(0, 32);
  oled.printf("Energy: %.2f Wh", energyWh);
  oled.setCursor(0, 42);
  oled.printf("Peak: %.0fmW  V:%.1f-%.1f",
              peakPower, minVoltage, maxVoltage);

  // Mini voltage graph
  int graphY = 52;
  int graphH = 12;
  int points = min(histIdx, HISTORY_SIZE);
  if (points > 1) {
    for (int i = 1; i < points; i++) {
      int x0 = (i - 1) * SCREEN_W / HISTORY_SIZE;
      int x1 = i * SCREEN_W / HISTORY_SIZE;
      int y0 = graphY + graphH - (int)(voltHistory[(histIdx - points + i - 1) % HISTORY_SIZE] / 15.0 * graphH);
      int y1 = graphY + graphH - (int)(voltHistory[(histIdx - points + i) % HISTORY_SIZE] / 15.0 * graphH);
      oled.drawLine(x0, y0, x1, y1, SSD1306_WHITE);
    }
  }

  oled.display();
}

// ---------- Web dashboard ----------
void handleRoot() {
  String html = "<html><head><title>Solar Monitor</title>";
  html += "<meta http-equiv='refresh' content='5'></head><body>";
  html += "<h1>Solar Panel Monitor</h1>";
  html += "<p>Voltage: " + String(voltage, 2) + " V</p>";
  html += "<p>Current: " + String(current_mA, 1) + " mA</p>";
  html += "<p>Power: " + String(power_mW, 1) + " mW</p>";
  html += "<p>Energy: " + String(energyWh, 3) + " Wh</p>";
  html += "<p>Peak Power: " + String(peakPower, 1) + " mW</p>";
  html += "<p>Voltage Range: " + String(minVoltage, 2) + " - " + String(maxVoltage, 2) + " V</p>";
  html += "<p>Load: " + String(loadEnabled ? "CONNECTED" : "DISCONNECTED") + "</p>";
  html += "<p><a href='/toggle'>Toggle Load</a></p>";
  html += "</body></html>";
  webServer.send(200, "text/html", html);
}

void handleToggle() {
  loadEnabled = !loadEnabled;
  digitalWrite(RELAY_PIN, loadEnabled ? HIGH : LOW);
  webServer.sendHeader("Location", "/");
  webServer.send(302);
}

void handleAPI() {
  String json = "{\"voltage\":" + String(voltage, 2);
  json += ",\"current_mA\":" + String(current_mA, 1);
  json += ",\"power_mW\":" + String(power_mW, 1);
  json += ",\"energy_Wh\":" + String(energyWh, 3);
  json += ",\"load\":" + String(loadEnabled ? "true" : "false") + "}";
  webServer.send(200, "application/json", json);
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[SolarMon] Starting...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(BTN_PIN, INPUT_PULLUP);
  digitalWrite(RELAY_PIN, HIGH);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  if (!ina219.begin()) {
    Serial.println("[INA219] Init failed!");
  }

  if (SD.begin(SD_CS)) {
    sdReady = true;
    File f = SD.open("/solar.csv", FILE_APPEND);
    if (f) { f.println("time_ms,voltage,current_mA,power_mW,energy_Wh"); f.close(); }
  }

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) { delay(500); }
  Serial.printf("[WiFi] IP: %s\n", WiFi.localIP().toString().c_str());

  webServer.on("/", handleRoot);
  webServer.on("/toggle", handleToggle);
  webServer.on("/api", handleAPI);
  webServer.begin();

  Serial.println("[SolarMon] Ready.");
}

// ---------- Main loop ----------
void loop() {
  webServer.handleClient();

  static unsigned long lastRead = 0;
  if (millis() - lastRead > 1000) {
    lastRead = millis();
    readSensors();
    updateDisplay();
    logToSD();

    Serial.printf("[SOLAR] V=%.2f I=%.1fmA P=%.1fmW E=%.3fWh\n",
                  voltage, current_mA, power_mW, energyWh);
  }

  // Store history every minute
  if (millis() - lastHistSave > 60000) {
    lastHistSave = millis();
    voltHistory[histIdx % HISTORY_SIZE] = voltage;
    powerHistory[histIdx % HISTORY_SIZE] = power_mW;
    histIdx++;
  }

  // Toggle button
  if (digitalRead(BTN_PIN) == LOW) {
    delay(200);
    loadEnabled = !loadEnabled;
    digitalWrite(RELAY_PIN, loadEnabled ? HIGH : LOW);
  }

  digitalWrite(LED_PIN, loadEnabled && (millis() / 1000) % 2);
  delay(50);
}
