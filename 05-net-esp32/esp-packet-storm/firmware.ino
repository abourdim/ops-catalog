/*
 * ESP Packet Storm - firmware.ino
 * Network traffic generator for stress-testing and benchmarking
 * local network infrastructure. Generates configurable UDP/TCP
 * flood patterns with rate limiting. Educational use only.
 *
 * Hardware: ESP32 DevKit + OLED SSD1306
 * Wiring:  SDA -> GPIO21, SCL -> GPIO22
 */

#include <WiFi.h>
#include <WiFiUdp.h>
#include <WebServer.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

// ---------- Config ----------
static const char *WIFI_SSID = "YourNetwork";
static const char *WIFI_PASS = "YourPassword";

#define SCREEN_W 128
#define SCREEN_H 64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);

#define LED_PIN    2
#define BTN_START  4
#define BTN_MODE  15

// ---------- Storm parameters ----------
static IPAddress targetIP(192, 168, 1, 1);
static uint16_t targetPort = 5001;
static uint16_t packetSize = 512;
static uint32_t rateLimit = 100;  // packets per second
static bool stormActive = false;

// 0=UDP flood, 1=TCP connect, 2=Ping sweep
static int stormMode = 0;
static const char *modeNames[] = {"UDP Flood", "TCP Connect", "Ping Sweep"};

// ---------- Stats ----------
static uint32_t pktSent = 0;
static uint32_t pktFail = 0;
static uint32_t bytesTotal = 0;
static unsigned long stormStart = 0;

WiFiUDP udp;
WebServer webServer(80);

// ---------- Generate payload ----------
void fillPayload(uint8_t *buf, int len) {
  for (int i = 0; i < len; i++) {
    buf[i] = (uint8_t)(i ^ (millis() & 0xFF));
  }
}

// ---------- UDP flood ----------
void doUDPFlood() {
  uint8_t payload[512];
  int sz = min((int)packetSize, 512);
  fillPayload(payload, sz);

  udp.beginPacket(targetIP, targetPort);
  udp.write(payload, sz);
  if (udp.endPacket()) {
    pktSent++;
    bytesTotal += sz;
  } else {
    pktFail++;
  }
}

// ---------- TCP connect storm ----------
void doTCPConnect() {
  WiFiClient client;
  client.setTimeout(100);
  if (client.connect(targetIP, targetPort)) {
    client.write("STORM\r\n");
    pktSent++;
    bytesTotal += 7;
    client.stop();
  } else {
    pktFail++;
  }
}

// ---------- Ping sweep ----------
static uint8_t sweepIdx = 1;
void doPingSweep() {
  IPAddress target = targetIP;
  target[3] = sweepIdx;
  sweepIdx = (sweepIdx % 254) + 1;

  WiFiClient client;
  client.setTimeout(50);
  if (client.connect(target, 80)) {
    pktSent++;
    client.stop();
  } else {
    pktFail++;
  }
}

// ---------- Display ----------
void updateDisplay() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);

  oled.setCursor(0, 0);
  oled.printf("Packet Storm [%s]", stormActive ? "ON" : "OFF");
  oled.setCursor(0, 10);
  oled.printf("Mode: %s", modeNames[stormMode]);
  oled.setCursor(0, 20);
  oled.printf("Target: %s:%d", targetIP.toString().c_str(), targetPort);
  oled.setCursor(0, 30);
  oled.printf("Rate: %u pps  Sz: %u", rateLimit, packetSize);
  oled.setCursor(0, 42);
  oled.printf("Sent: %u  Fail: %u", pktSent, pktFail);

  if (stormActive && stormStart > 0) {
    float elapsed = (millis() - stormStart) / 1000.0;
    float kbps = (bytesTotal / 1024.0) / max(elapsed, 0.1f);
    oled.setCursor(0, 54);
    oled.printf("%.1f KB/s  %.0fs", kbps, elapsed);
  }

  oled.display();
}

// ---------- Web control ----------
void handleWebRoot() {
  String html = "<html><head><title>Packet Storm</title></head><body>";
  html += "<h1>Packet Storm Control</h1>";
  html += "<p>Status: " + String(stormActive ? "ACTIVE" : "IDLE") + "</p>";
  html += "<p>Packets: " + String(pktSent) + " sent, " + String(pktFail) + " failed</p>";
  html += "<form action='/config' method='POST'>";
  html += "Target IP: <input name='ip' value='" + targetIP.toString() + "'><br>";
  html += "Port: <input name='port' value='" + String(targetPort) + "'><br>";
  html += "Rate (pps): <input name='rate' value='" + String(rateLimit) + "'><br>";
  html += "<input type='submit' value='Update'></form>";
  html += "<a href='/start'>Start</a> | <a href='/stop'>Stop</a>";
  html += "</body></html>";
  webServer.send(200, "text/html", html);
}

void handleConfig() {
  if (webServer.hasArg("ip")) targetIP.fromString(webServer.arg("ip"));
  if (webServer.hasArg("port")) targetPort = webServer.arg("port").toInt();
  if (webServer.hasArg("rate")) rateLimit = webServer.arg("rate").toInt();
  webServer.sendHeader("Location", "/");
  webServer.send(302);
}

void handleStart() { stormActive = true; stormStart = millis(); pktSent = 0; pktFail = 0; bytesTotal = 0; webServer.sendHeader("Location", "/"); webServer.send(302); }
void handleStop()  { stormActive = false; webServer.sendHeader("Location", "/"); webServer.send(302); }

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[PacketStorm] Starting...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_START, INPUT_PULLUP);
  pinMode(BTN_MODE, INPUT_PULLUP);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) { delay(500); }
  Serial.printf("[WiFi] IP: %s\n", WiFi.localIP().toString().c_str());

  webServer.on("/", handleWebRoot);
  webServer.on("/config", HTTP_POST, handleConfig);
  webServer.on("/start", handleStart);
  webServer.on("/stop", handleStop);
  webServer.begin();

  updateDisplay();
}

// ---------- Main loop ----------
void loop() {
  webServer.handleClient();

  if (digitalRead(BTN_START) == LOW) { delay(200); stormActive = !stormActive; if (stormActive) { stormStart = millis(); pktSent = 0; pktFail = 0; bytesTotal = 0; } }
  if (digitalRead(BTN_MODE) == LOW)  { delay(200); stormMode = (stormMode + 1) % 3; }

  if (stormActive) {
    static unsigned long lastPkt = 0;
    unsigned long interval = 1000000UL / max(rateLimit, (uint32_t)1);
    if (micros() - lastPkt >= interval) {
      lastPkt = micros();
      switch (stormMode) {
        case 0: doUDPFlood(); break;
        case 1: doTCPConnect(); break;
        case 2: doPingSweep(); break;
      }
      digitalWrite(LED_PIN, pktSent % 10 == 0);
    }
  }

  static unsigned long lastDisp = 0;
  if (millis() - lastDisp > 500) { lastDisp = millis(); updateDisplay(); }
}
