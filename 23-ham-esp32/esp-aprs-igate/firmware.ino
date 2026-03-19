/*
 * ESP APRS iGate - firmware.ino
 * APRS (Automatic Packet Reporting System) Internet Gateway.
 * Receives APRS packets via LoRa radio on 144.390 MHz and
 * forwards them to the APRS-IS network over Wi-Fi.
 *
 * Hardware: ESP32 + SX1276 LoRa + SSD1306 OLED
 * Wiring:  LoRa NSS->GPIO18, RST->GPIO14, DIO0->GPIO26
 */

#include <WiFi.h>
#include <SPI.h>
#include <LoRa.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_W 128
#define SCREEN_H  64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);

// LoRa pins
#define LORA_NSS  18
#define LORA_RST  14
#define LORA_DIO0 26
#define LED_PIN    2

// ---------- Config ----------
static const char *WIFI_SSID = "YourNetwork";
static const char *WIFI_PASS = "YourPassword";
static const char *APRS_SERVER = "rotate.aprs2.net";
static const int   APRS_PORT = 14580;
static const char *CALLSIGN = "N0CALL-10";
static const char *PASSCODE = "-1";       // Get from aprs.fi
static const long  LORA_FREQ = 433775000; // LoRa APRS frequency

WiFiClient aprsClient;

// ---------- Stats ----------
static uint32_t packetsRX = 0;
static uint32_t packetsGated = 0;
static uint32_t connectAttempts = 0;
static bool aprsConnected = false;

// ---------- APRS-IS login ----------
bool connectAPRS() {
  connectAttempts++;
  Serial.printf("[APRS-IS] Connecting to %s:%d...\n", APRS_SERVER, APRS_PORT);

  if (!aprsClient.connect(APRS_SERVER, APRS_PORT)) {
    Serial.println("[APRS-IS] Connection failed!");
    return false;
  }

  // Wait for server greeting
  unsigned long timeout = millis() + 5000;
  while (!aprsClient.available() && millis() < timeout) delay(100);
  if (aprsClient.available()) {
    String greeting = aprsClient.readStringUntil('\n');
    Serial.printf("[APRS-IS] %s\n", greeting.c_str());
  }

  // Send login
  String login = String("user ") + CALLSIGN + " pass " + PASSCODE +
                 " vers ESP32-iGate 1.0 filter r/0/0/1000";
  aprsClient.println(login);
  Serial.printf("[APRS-IS] Login: %s\n", login.c_str());

  // Check response
  timeout = millis() + 5000;
  while (!aprsClient.available() && millis() < timeout) delay(100);
  if (aprsClient.available()) {
    String resp = aprsClient.readStringUntil('\n');
    Serial.printf("[APRS-IS] %s\n", resp.c_str());
    if (resp.indexOf("verified") >= 0 || resp.indexOf("unverified") >= 0) {
      aprsConnected = true;
      return true;
    }
  }
  return false;
}

// ---------- Gate packet to APRS-IS ----------
void gatePacket(const String &packet) {
  if (!aprsConnected || !aprsClient.connected()) {
    aprsConnected = false;
    if (!connectAPRS()) return;
  }

  // Format: CALLSIGN>APRS,qAR,IGATE:payload
  String gated = packet;
  // Add igate path if not present
  if (gated.indexOf("qAR") < 0) {
    int arrowPos = gated.indexOf('>');
    int colonPos = gated.indexOf(':');
    if (arrowPos > 0 && colonPos > arrowPos) {
      String path = gated.substring(0, colonPos);
      String payload = gated.substring(colonPos);
      gated = path + ",qAR," + String(CALLSIGN) + payload;
    }
  }

  aprsClient.println(gated);
  packetsGated++;
  Serial.printf("[GATE] %s\n", gated.c_str());
}

// ---------- Parse APRS packet ----------
void parseAPRS(const String &raw) {
  // Extract callsign
  int arrowPos = raw.indexOf('>');
  if (arrowPos < 0) return;
  String from = raw.substring(0, arrowPos);

  // Extract position if present
  int colonPos = raw.indexOf(':');
  if (colonPos < 0) return;
  char dataType = raw.charAt(colonPos + 1);

  Serial.printf("[APRS] From=%s Type=%c Len=%d\n",
                from.c_str(), dataType, raw.length());
}

// ---------- Display ----------
void updateDisplay() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);

  oled.setCursor(0, 0);
  oled.printf("APRS iGate %s", CALLSIGN);
  oled.setCursor(0, 10);
  oled.printf("APRS-IS: %s", aprsConnected ? "CONNECTED" : "OFFLINE");
  oled.setCursor(0, 22);
  oled.printf("RX: %u  Gated: %u", packetsRX, packetsGated);
  oled.setCursor(0, 34);
  oled.printf("LoRa: %.3f MHz", LORA_FREQ / 1e6);
  oled.setCursor(0, 46);
  oled.printf("WiFi: %s", WiFi.localIP().toString().c_str());
  oled.setCursor(0, 56);
  oled.printf("Heap: %u", ESP.getFreeHeap());

  oled.display();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[iGate] Starting...");

  pinMode(LED_PIN, OUTPUT);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(15, 28);
  oled.print("APRS iGate");
  oled.display();

  // Wi-Fi
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) { delay(500); }
  Serial.printf("[WiFi] IP: %s\n", WiFi.localIP().toString().c_str());

  // LoRa
  SPI.begin(5, 19, 27, LORA_NSS);
  LoRa.setPins(LORA_NSS, LORA_RST, LORA_DIO0);
  if (!LoRa.begin(LORA_FREQ)) {
    Serial.println("[LoRa] Init failed!");
  } else {
    LoRa.setSpreadingFactor(12);
    LoRa.setSignalBandwidth(125000);
    LoRa.setCodingRate4(5);
    Serial.printf("[LoRa] Ready @ %.3f MHz\n", LORA_FREQ / 1e6);
  }

  // APRS-IS
  connectAPRS();
  updateDisplay();
}

// ---------- Main loop ----------
void loop() {
  // Check for LoRa packets
  int pktSize = LoRa.parsePacket();
  if (pktSize > 0) {
    String packet = "";
    while (LoRa.available()) {
      packet += (char)LoRa.read();
    }
    packetsRX++;
    int rssi = LoRa.packetRssi();
    float snr = LoRa.packetSnr();

    Serial.printf("[RX] RSSI=%d SNR=%.1f: %s\n", rssi, snr, packet.c_str());
    parseAPRS(packet);
    gatePacket(packet);

    digitalWrite(LED_PIN, HIGH);
    delay(100);
    digitalWrite(LED_PIN, LOW);
  }

  // Read APRS-IS server data (keepalive etc.)
  if (aprsClient.available()) {
    String line = aprsClient.readStringUntil('\n');
    if (line.startsWith("#")) {
      // Server comment/keepalive
    } else {
      Serial.printf("[IS-RX] %s\n", line.c_str());
    }
  }

  // Reconnect if needed
  static unsigned long lastReconnect = 0;
  if (!aprsConnected && millis() - lastReconnect > 30000) {
    lastReconnect = millis();
    connectAPRS();
  }

  // Display update
  static unsigned long lastDisp = 0;
  if (millis() - lastDisp > 2000) { lastDisp = millis(); updateDisplay(); }

  delay(10);
}
