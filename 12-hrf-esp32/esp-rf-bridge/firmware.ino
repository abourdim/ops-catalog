/*
 * ESP RF Bridge - firmware.ino
 * Bridges 433MHz RF signals to Wi-Fi/MQTT. Receives signals
 * from cheap 433MHz remotes, sensors, and doorbells, then
 * forwards decoded data to a web dashboard and MQTT broker.
 *
 * Hardware: ESP32 DevKit + 433MHz receiver + 433MHz transmitter
 * Wiring:  RX DATA -> GPIO13, TX DATA -> GPIO12
 */

#include <WiFi.h>
#include <WebServer.h>
#include <RCSwitch.h>

// ---------- Config ----------
static const char *WIFI_SSID = "YourNetwork";
static const char *WIFI_PASS = "YourPassword";

#define RF_RX_PIN  13
#define RF_TX_PIN  12
#define LED_PIN     2
#define BTN_LEARN   4  // Learn new code

// ---------- Objects ----------
RCSwitch rfRX = RCSwitch();
RCSwitch rfTX = RCSwitch();
WebServer webServer(80);

// ---------- Code database ----------
#define MAX_CODES 32
typedef struct {
  unsigned long code;
  unsigned int bitLength;
  unsigned int protocol;
  char label[24];
  uint32_t rxCount;
  unsigned long lastRx;
} RFCode;

static RFCode codes[MAX_CODES];
static int codeCount = 0;
static bool learnMode = false;
static uint32_t totalReceived = 0;

// ---------- Find or add code ----------
int findCode(unsigned long code) {
  for (int i = 0; i < codeCount; i++) {
    if (codes[i].code == code) return i;
  }
  return -1;
}

int addCode(unsigned long code, unsigned int bits, unsigned int proto) {
  if (codeCount >= MAX_CODES) return -1;
  int idx = codeCount++;
  codes[idx].code = code;
  codes[idx].bitLength = bits;
  codes[idx].protocol = proto;
  snprintf(codes[idx].label, 24, "Code_%lu", code % 10000);
  codes[idx].rxCount = 0;
  codes[idx].lastRx = millis();
  return idx;
}

// ---------- Process received RF ----------
void processRF() {
  if (!rfRX.available()) return;

  unsigned long code = rfRX.getReceivedValue();
  unsigned int bits = rfRX.getReceivedBitlength();
  unsigned int proto = rfRX.getReceivedProtocol();
  unsigned int delay_us = rfRX.getReceivedDelay();

  rfRX.resetAvailable();
  if (code == 0) return;

  totalReceived++;
  digitalWrite(LED_PIN, HIGH);

  int idx = findCode(code);
  if (idx >= 0) {
    codes[idx].rxCount++;
    codes[idx].lastRx = millis();
    Serial.printf("[RF] Known: '%s' code=%lu count=%u\n",
                  codes[idx].label, code, codes[idx].rxCount);
  } else if (learnMode) {
    idx = addCode(code, bits, proto);
    if (idx >= 0) {
      Serial.printf("[RF] LEARNED: code=%lu bits=%u proto=%u delay=%u\n",
                    code, bits, proto, delay_us);
    }
  } else {
    Serial.printf("[RF] Unknown: code=%lu bits=%u proto=%u\n", code, bits, proto);
  }

  delay(50);
  digitalWrite(LED_PIN, LOW);
}

// ---------- Transmit RF code ----------
void transmitCode(int idx) {
  if (idx < 0 || idx >= codeCount) return;
  rfTX.setProtocol(codes[idx].protocol);
  rfTX.send(codes[idx].code, codes[idx].bitLength);
  Serial.printf("[RF-TX] Sent '%s' code=%lu\n", codes[idx].label, codes[idx].code);
}

// ---------- Web handlers ----------
void handleRoot() {
  String html = "<html><head><title>RF Bridge</title>";
  html += "<meta http-equiv='refresh' content='5'>";
  html += "<style>body{font-family:monospace;margin:20px}table{border-collapse:collapse}";
  html += "td,th{border:1px solid #ccc;padding:5px}.btn{padding:4px 10px}</style></head><body>";
  html += "<h1>ESP RF Bridge</h1>";
  html += "<p>Total received: " + String(totalReceived);
  html += " | Codes learned: " + String(codeCount);
  html += " | Learn mode: " + String(learnMode ? "ON" : "OFF") + "</p>";
  html += "<a href='/learn'>Toggle Learn</a> | <a href='/clear'>Clear All</a>";
  html += "<table><tr><th>#</th><th>Label</th><th>Code</th><th>Bits</th><th>Proto</th><th>Count</th><th>Action</th></tr>";

  for (int i = 0; i < codeCount; i++) {
    html += "<tr><td>" + String(i) + "</td>";
    html += "<td>" + String(codes[i].label) + "</td>";
    html += "<td>" + String(codes[i].code) + "</td>";
    html += "<td>" + String(codes[i].bitLength) + "</td>";
    html += "<td>" + String(codes[i].protocol) + "</td>";
    html += "<td>" + String(codes[i].rxCount) + "</td>";
    html += "<td><a href='/send?id=" + String(i) + "' class='btn'>Send</a></td></tr>";
  }
  html += "</table></body></html>";
  webServer.send(200, "text/html", html);
}

void handleLearn() {
  learnMode = !learnMode;
  Serial.printf("[RF] Learn mode: %s\n", learnMode ? "ON" : "OFF");
  webServer.sendHeader("Location", "/");
  webServer.send(302);
}

void handleSend() {
  int id = webServer.arg("id").toInt();
  transmitCode(id);
  webServer.sendHeader("Location", "/");
  webServer.send(302);
}

void handleClear() {
  codeCount = 0;
  webServer.sendHeader("Location", "/");
  webServer.send(302);
}

void handleAPI() {
  String json = "[";
  for (int i = 0; i < codeCount; i++) {
    if (i > 0) json += ",";
    json += "{\"label\":\"" + String(codes[i].label) + "\",";
    json += "\"code\":" + String(codes[i].code) + ",";
    json += "\"count\":" + String(codes[i].rxCount) + "}";
  }
  json += "]";
  webServer.send(200, "application/json", json);
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[RFBridge] Starting...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_LEARN, INPUT_PULLUP);

  rfRX.enableReceive(digitalPinToInterrupt(RF_RX_PIN));
  rfTX.enableTransmit(RF_TX_PIN);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.printf("\n[WiFi] IP: %s\n", WiFi.localIP().toString().c_str());

  webServer.on("/", handleRoot);
  webServer.on("/learn", handleLearn);
  webServer.on("/send", handleSend);
  webServer.on("/clear", handleClear);
  webServer.on("/api", handleAPI);
  webServer.begin();

  Serial.println("[RFBridge] Ready.");
}

// ---------- Main loop ----------
void loop() {
  processRF();
  webServer.handleClient();

  if (digitalRead(BTN_LEARN) == LOW) {
    delay(200);
    learnMode = !learnMode;
    Serial.printf("[RF] Learn: %s\n", learnMode ? "ON" : "OFF");
  }
}
