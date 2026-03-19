/*
 * ESP Wi-Fi Canary - firmware.ino
 * Passive Wi-Fi monitoring sentinel that watches for anomalies:
 * new unknown devices, deauth storms, channel changes, signal
 * strength anomalies. Alerts via LED, buzzer, and web dashboard.
 *
 * Hardware: ESP32 DevKit + NeoPixel ring (8 LEDs) + buzzer
 * Wiring:  NeoPixel -> GPIO13, Buzzer -> GPIO15
 */

#include <WiFi.h>
#include <esp_wifi.h>
#include <WebServer.h>
#include <Adafruit_NeoPixel.h>

#define NEOPIXEL_PIN 13
#define NUM_LEDS      8
#define BUZZER_PIN   15
#define LED_PIN       2
#define BTN_ACK       4  // Acknowledge alert

Adafruit_NeoPixel ring(NUM_LEDS, NEOPIXEL_PIN, NEO_GRB + NEO_KHZ800);

static const char *WIFI_SSID = "YourNetwork";
static const char *WIFI_PASS = "YourPassword";

WebServer webServer(80);

// ---------- Monitoring state ----------
#define MAX_KNOWN 48
typedef struct {
  uint8_t mac[6];
  int8_t baselineRSSI;
  unsigned long firstSeen;
  bool known;
} KnownDevice;

static KnownDevice knownDevices[MAX_KNOWN];
static int knownCount = 0;
static bool learningMode = true;
static unsigned long learningEnd = 0;

// Alert system
#define MAX_ALERTS 32
typedef struct {
  uint32_t timestamp;
  char message[48];
  uint8_t level;  // 0=info, 1=warn, 2=critical
  bool acknowledged;
} Alert;

static Alert alerts[MAX_ALERTS];
static int alertCount = 0;
static uint32_t deauthCounter = 0;
static bool alarmActive = false;

// ---------- Add alert ----------
void addAlert(const char *msg, uint8_t level) {
  if (alertCount < MAX_ALERTS) {
    alerts[alertCount].timestamp = millis();
    strncpy(alerts[alertCount].message, msg, 47);
    alerts[alertCount].level = level;
    alerts[alertCount].acknowledged = false;
    alertCount++;
  }
  Serial.printf("[ALERT:%d] %s\n", level, msg);
  if (level >= 2) alarmActive = true;
}

// ---------- Check if MAC is known ----------
bool isKnown(const uint8_t *mac) {
  for (int i = 0; i < knownCount; i++) {
    if (memcmp(knownDevices[i].mac, mac, 6) == 0) return true;
  }
  return false;
}

void addKnown(const uint8_t *mac, int8_t rssi) {
  if (knownCount < MAX_KNOWN) {
    memcpy(knownDevices[knownCount].mac, mac, 6);
    knownDevices[knownCount].baselineRSSI = rssi;
    knownDevices[knownCount].firstSeen = millis();
    knownDevices[knownCount].known = true;
    knownCount++;
  }
}

// ---------- Promiscuous callback ----------
void IRAM_ATTR snifferCB(void *buf, wifi_promiscuous_pkt_type_t type) {
  if (type != WIFI_PKT_MGMT) return;
  wifi_promiscuous_pkt_t *pkt = (wifi_promiscuous_pkt_t *)buf;
  const uint8_t *frame = pkt->payload;
  int len = pkt->rx_ctrl.sig_len;
  if (len < 24) return;

  uint8_t frameType = (frame[0] >> 2) & 0x03;
  uint8_t subType = (frame[0] >> 4) & 0x0F;
  const uint8_t *srcMAC = &frame[10];
  int8_t rssi = pkt->rx_ctrl.rssi;

  // Count deauth frames
  if (frameType == 0 && (subType == 12 || subType == 10)) {
    deauthCounter++;
  }

  // Track devices
  if (learningMode) {
    if (!isKnown(srcMAC)) addKnown(srcMAC, rssi);
  } else {
    if (!isKnown(srcMAC)) {
      char msg[48];
      snprintf(msg, 48, "New device: %02X:%02X:%02X:%02X:%02X:%02X",
               srcMAC[0], srcMAC[1], srcMAC[2],
               srcMAC[3], srcMAC[4], srcMAC[5]);
      addAlert(msg, 1);
      addKnown(srcMAC, rssi);
    }
  }
}

// ---------- Periodic checks ----------
void runChecks() {
  // Deauth flood detection
  static uint32_t lastDeauthCount = 0;
  uint32_t deauthDelta = deauthCounter - lastDeauthCount;
  lastDeauthCount = deauthCounter;
  if (deauthDelta > 10) {
    char msg[48];
    snprintf(msg, 48, "Deauth flood: %u in 5s!", deauthDelta);
    addAlert(msg, 2);
  }

  // AP count change
  int n = WiFi.scanNetworks(false, true, false, 100);
  static int lastAPCount = -1;
  if (lastAPCount >= 0 && abs(n - lastAPCount) > 3) {
    char msg[48];
    snprintf(msg, 48, "AP count changed: %d -> %d", lastAPCount, n);
    addAlert(msg, 1);
  }
  lastAPCount = n;
  WiFi.scanDelete();
}

// ---------- LED visualization ----------
void updateLEDs() {
  if (alarmActive) {
    // Red flashing
    bool on = (millis() / 200) % 2;
    for (int i = 0; i < NUM_LEDS; i++) {
      ring.setPixelColor(i, on ? ring.Color(255, 0, 0) : 0);
    }
  } else if (learningMode) {
    // Blue breathing
    int b = (millis() / 20) % 100;
    for (int i = 0; i < NUM_LEDS; i++) {
      ring.setPixelColor(i, ring.Color(0, 0, b));
    }
  } else {
    // Green = all clear
    for (int i = 0; i < NUM_LEDS; i++) {
      ring.setPixelColor(i, ring.Color(0, 30, 0));
    }
  }
  ring.show();
}

// ---------- Web dashboard ----------
void handleDashboard() {
  String html = "<html><head><title>WiFi Canary</title>";
  html += "<meta http-equiv='refresh' content='5'></head><body>";
  html += "<h1>Wi-Fi Canary Dashboard</h1>";
  html += "<p>Mode: " + String(learningMode ? "LEARNING" : "MONITORING") + "</p>";
  html += "<p>Known devices: " + String(knownCount) + " | Alerts: " + String(alertCount) + "</p>";
  html += "<h2>Alerts</h2><table border='1'><tr><th>Time</th><th>Level</th><th>Message</th></tr>";
  for (int i = alertCount - 1; i >= max(0, alertCount - 20); i--) {
    const char *lvl[] = {"INFO", "WARN", "CRIT"};
    html += "<tr><td>" + String(alerts[i].timestamp / 1000) + "s</td>";
    html += "<td>" + String(lvl[alerts[i].level]) + "</td>";
    html += "<td>" + String(alerts[i].message) + "</td></tr>";
  }
  html += "</table></body></html>";
  webServer.send(200, "text/html", html);
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[Canary] Starting...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(BTN_ACK, INPUT_PULLUP);

  ring.begin();
  ring.setBrightness(40);

  // Connect to Wi-Fi for web dashboard
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) { delay(500); }
  Serial.printf("[WiFi] IP: %s\n", WiFi.localIP().toString().c_str());

  webServer.on("/", handleDashboard);
  webServer.begin();

  // Enable promiscuous mode alongside STA
  esp_wifi_set_promiscuous(true);
  wifi_promiscuous_filter_t filt = {};
  filt.filter_mask = WIFI_PROMIS_FILTER_MASK_MGMT;
  esp_wifi_set_promiscuous_filter(&filt);
  esp_wifi_set_promiscuous_rx_cb(snifferCB);

  // Learning phase: 30 seconds
  learningMode = true;
  learningEnd = millis() + 30000;
  Serial.println("[Canary] Learning phase (30s)...");
}

// ---------- Main loop ----------
void loop() {
  webServer.handleClient();
  updateLEDs();

  // End learning phase
  if (learningMode && millis() > learningEnd) {
    learningMode = false;
    Serial.printf("[Canary] Monitoring started. %d known devices.\n", knownCount);
  }

  // Periodic checks
  static unsigned long lastCheck = 0;
  if (!learningMode && millis() - lastCheck > 5000) {
    lastCheck = millis();
    runChecks();
  }

  // Acknowledge button
  if (digitalRead(BTN_ACK) == LOW) {
    delay(200);
    alarmActive = false;
    noTone(BUZZER_PIN);
  }

  // Buzzer for active alarm
  if (alarmActive) {
    tone(BUZZER_PIN, (millis() / 300) % 2 ? 2000 : 3000);
  }

  delay(10);
}
