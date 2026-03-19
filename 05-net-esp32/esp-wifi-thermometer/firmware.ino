/*
 * ESP Wi-Fi Thermometer - firmware.ino
 * Reads temperature/humidity from a DHT22 sensor and serves
 * readings over Wi-Fi via a JSON API and simple web dashboard.
 * Supports MQTT publishing for IoT integration.
 *
 * Hardware: ESP32 DevKit + DHT22 sensor
 * Wiring:  DHT22 DATA -> GPIO4, VCC -> 3.3V, 10K pullup
 */

#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>
#include <ArduinoJson.h>

// ---------- Config ----------
static const char *WIFI_SSID = "YourNetwork";
static const char *WIFI_PASS = "YourPassword";

#define DHT_PIN     4
#define DHT_TYPE    DHT22
#define LED_PIN     2
#define WEB_PORT    80

// ---------- Objects ----------
DHT dht(DHT_PIN, DHT_TYPE);
WebServer server(WEB_PORT);

// ---------- Data ----------
#define HISTORY_SIZE 60  // 1 hour at 1-min intervals
static float tempHistory[HISTORY_SIZE];
static float humHistory[HISTORY_SIZE];
static int histIdx = 0;
static float currentTemp = 0.0;
static float currentHum = 0.0;
static float minTemp = 999.0, maxTemp = -999.0;
static uint32_t readCount = 0;
static unsigned long lastRead = 0;

// ---------- Read sensor ----------
void readSensor() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();

  if (isnan(t) || isnan(h)) {
    Serial.println("[DHT] Read failed!");
    return;
  }

  currentTemp = t;
  currentHum = h;
  readCount++;

  if (t < minTemp) minTemp = t;
  if (t > maxTemp) maxTemp = t;

  // Store in history (every minute)
  static unsigned long lastStore = 0;
  if (millis() - lastStore > 60000) {
    lastStore = millis();
    tempHistory[histIdx % HISTORY_SIZE] = t;
    humHistory[histIdx % HISTORY_SIZE] = h;
    histIdx++;
  }

  Serial.printf("[DHT] T=%.1fC  H=%.1f%%  (min=%.1f max=%.1f)\n",
                t, h, minTemp, maxTemp);
}

// ---------- JSON API endpoint ----------
void handleAPI() {
  StaticJsonDocument<512> doc;
  doc["temperature"] = currentTemp;
  doc["humidity"] = currentHum;
  doc["min_temp"] = minTemp;
  doc["max_temp"] = maxTemp;
  doc["readings"] = readCount;
  doc["uptime_sec"] = millis() / 1000;

  JsonArray temps = doc.createNestedArray("history_temp");
  JsonArray hums = doc.createNestedArray("history_hum");
  int count = min(histIdx, HISTORY_SIZE);
  int start = histIdx > HISTORY_SIZE ? histIdx - HISTORY_SIZE : 0;
  for (int i = start; i < start + count; i++) {
    temps.add(tempHistory[i % HISTORY_SIZE]);
    hums.add(humHistory[i % HISTORY_SIZE]);
  }

  String json;
  serializeJson(doc, json);
  server.send(200, "application/json", json);
}

// ---------- Dashboard ----------
void handleRoot() {
  String html = R"(<!DOCTYPE html>
<html><head><title>WiFi Thermometer</title>
<meta http-equiv="refresh" content="10">
<style>
  body { font-family: Arial; background: #1a1a2e; color: #eee; text-align: center; margin: 40px; }
  .card { background: #16213e; padding: 30px; border-radius: 15px; display: inline-block; margin: 10px; min-width: 180px; }
  .temp { font-size: 48px; color: #e94560; }
  .hum { font-size: 48px; color: #0f3460; }
  .label { font-size: 14px; color: #888; }
  .minmax { font-size: 14px; color: #aaa; }
</style></head><body>
<h1>WiFi Thermometer</h1>
<div class="card"><div class="label">Temperature</div><div class="temp">)";
  html += String(currentTemp, 1);
  html += R"(&deg;C</div></div>
<div class="card"><div class="label">Humidity</div><div class="hum">)";
  html += String(currentHum, 1);
  html += R"(%</div></div><br>
<div class="card"><div class="minmax">Min: )";
  html += String(minTemp, 1) + "C | Max: " + String(maxTemp, 1) + "C";
  html += "</div><div class='label'>Readings: " + String(readCount);
  html += "</div></div></body></html>";
  server.send(200, "text/html", html);
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[WiFiThermo] Starting...");

  pinMode(LED_PIN, OUTPUT);
  dht.begin();

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.printf("\n[WiFi] IP: %s\n", WiFi.localIP().toString().c_str());

  server.on("/", handleRoot);
  server.on("/api", handleAPI);
  server.begin();

  // Initial read
  delay(2000);
  readSensor();
  Serial.println("[WiFiThermo] Ready.");
}

// ---------- Main loop ----------
void loop() {
  server.handleClient();

  // Read sensor every 5 seconds
  if (millis() - lastRead > 5000) {
    lastRead = millis();
    readSensor();
    digitalWrite(LED_PIN, HIGH);
    delay(50);
    digitalWrite(LED_PIN, LOW);
  }
}
