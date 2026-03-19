/*
 * ESP Rogue AP Detector - firmware.ino
 * Continuously scans for Wi-Fi access points and compares
 * them against a whitelist of known-good APs. Alerts when
 * unknown or suspicious APs appear (evil twin detection).
 *
 * Hardware: ESP32 DevKit + buzzer + RGB LED
 * Wiring:  Buzzer -> GPIO15, Red -> GPIO4, Green -> GPIO16
 */

#include <WiFi.h>
#include <esp_wifi.h>
#include <Preferences.h>

// ---------- Pins ----------
#define BUZZER_PIN  15
#define LED_RED      4
#define LED_GREEN   16
#define LED_PIN      2
#define BTN_ADD     17  // Add current scan to whitelist

// ---------- Whitelist ----------
#define MAX_WHITELIST 32
typedef struct {
  char ssid[33];
  uint8_t bssid[6];
  int8_t expectedRSSI;  // Typical RSSI for this AP
} WhitelistEntry;

static WhitelistEntry whitelist[MAX_WHITELIST];
static int wlCount = 0;

// ---------- Rogue detections ----------
#define MAX_ROGUES 16
typedef struct {
  char ssid[33];
  uint8_t bssid[6];
  int8_t rssi;
  uint8_t channel;
  uint32_t firstSeen;
  uint32_t lastSeen;
  char reason[32];
} RogueAP;

static RogueAP rogues[MAX_ROGUES];
static int rogueCount = 0;
static uint32_t scanCount = 0;
Preferences prefs;

// ---------- Helpers ----------
void bssidToStr(const uint8_t *bssid, char *buf) {
  snprintf(buf, 18, "%02X:%02X:%02X:%02X:%02X:%02X",
           bssid[0], bssid[1], bssid[2],
           bssid[3], bssid[4], bssid[5]);
}

// ---------- Check if AP is whitelisted ----------
bool isWhitelisted(const char *ssid, const uint8_t *bssid) {
  for (int i = 0; i < wlCount; i++) {
    if (strcmp(whitelist[i].ssid, ssid) == 0 &&
        memcmp(whitelist[i].bssid, bssid, 6) == 0) {
      return true;
    }
  }
  return false;
}

// ---------- Check for evil twin (same SSID, different BSSID) ----------
bool isEvilTwin(const char *ssid, const uint8_t *bssid) {
  for (int i = 0; i < wlCount; i++) {
    if (strcmp(whitelist[i].ssid, ssid) == 0 &&
        memcmp(whitelist[i].bssid, bssid, 6) != 0) {
      return true;
    }
  }
  return false;
}

// ---------- Add rogue AP ----------
void addRogue(const char *ssid, const uint8_t *bssid,
              int8_t rssi, uint8_t ch, const char *reason) {
  // Check if already tracked
  for (int i = 0; i < rogueCount; i++) {
    if (memcmp(rogues[i].bssid, bssid, 6) == 0) {
      rogues[i].lastSeen = millis();
      return;
    }
  }
  if (rogueCount < MAX_ROGUES) {
    strncpy(rogues[rogueCount].ssid, ssid, 32);
    memcpy(rogues[rogueCount].bssid, bssid, 6);
    rogues[rogueCount].rssi = rssi;
    rogues[rogueCount].channel = ch;
    rogues[rogueCount].firstSeen = millis();
    rogues[rogueCount].lastSeen = millis();
    strncpy(rogues[rogueCount].reason, reason, 31);
    rogueCount++;

    char bssidStr[18];
    bssidToStr(bssid, bssidStr);
    Serial.printf("!! ROGUE AP: %s [%s] RSSI=%d CH=%d Reason=%s\n",
                  ssid, bssidStr, rssi, ch, reason);
  }
}

// ---------- Perform scan and analysis ----------
void performScan() {
  scanCount++;
  int n = WiFi.scanNetworks(false, true);
  Serial.printf("[SCAN #%u] Found %d APs\n", scanCount, n);

  bool alertTriggered = false;

  for (int i = 0; i < n; i++) {
    String ssid = WiFi.SSID(i);
    uint8_t *bssid = WiFi.BSSID(i);
    int rssi = WiFi.RSSI(i);
    int ch = WiFi.channel(i);

    if (isEvilTwin(ssid.c_str(), bssid)) {
      addRogue(ssid.c_str(), bssid, rssi, ch, "EVIL_TWIN");
      alertTriggered = true;
    } else if (!isWhitelisted(ssid.c_str(), bssid)) {
      // Check for suspicious characteristics
      if (WiFi.encryptionType(i) == WIFI_AUTH_OPEN && ssid.length() > 0) {
        addRogue(ssid.c_str(), bssid, rssi, ch, "OPEN_UNKNOWN");
        alertTriggered = true;
      }
    }
  }

  WiFi.scanDelete();

  if (alertTriggered) {
    digitalWrite(LED_RED, HIGH);
    digitalWrite(LED_GREEN, LOW);
    tone(BUZZER_PIN, 2500, 500);
  } else {
    digitalWrite(LED_RED, LOW);
    digitalWrite(LED_GREEN, HIGH);
  }
}

// ---------- Add all current APs to whitelist ----------
void learnCurrentAPs() {
  int n = WiFi.scanNetworks(false, true);
  for (int i = 0; i < n && wlCount < MAX_WHITELIST; i++) {
    String ssid = WiFi.SSID(i);
    uint8_t *bssid = WiFi.BSSID(i);
    if (!isWhitelisted(ssid.c_str(), bssid)) {
      strncpy(whitelist[wlCount].ssid, ssid.c_str(), 32);
      memcpy(whitelist[wlCount].bssid, bssid, 6);
      whitelist[wlCount].expectedRSSI = WiFi.RSSI(i);
      wlCount++;

      char bs[18];
      bssidToStr(bssid, bs);
      Serial.printf("[WL] Added: %s [%s]\n", ssid.c_str(), bs);
    }
  }
  WiFi.scanDelete();
  Serial.printf("[WL] Total whitelisted: %d\n", wlCount);
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[RogueAPDetect] Starting...");

  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_ADD, INPUT_PULLUP);

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();

  // Initial learning phase
  Serial.println("[RogueAPDetect] Learning known APs...");
  learnCurrentAPs();
  Serial.println("[RogueAPDetect] Monitoring started.");
}

// ---------- Main loop ----------
void loop() {
  // Add button: re-learn APs
  if (digitalRead(BTN_ADD) == LOW) {
    delay(200);
    Serial.println("[WL] Re-learning APs...");
    learnCurrentAPs();
  }

  // Scan every 15 seconds
  static unsigned long lastScan = 0;
  if (millis() - lastScan > 15000) {
    lastScan = millis();
    performScan();
  }

  // Status report every 60 seconds
  static unsigned long lastReport = 0;
  if (millis() - lastReport > 60000) {
    lastReport = millis();
    Serial.printf("[STATUS] Scans=%u  Whitelisted=%d  Rogues=%d\n",
                  scanCount, wlCount, rogueCount);
    for (int i = 0; i < rogueCount; i++) {
      char bs[18];
      bssidToStr(rogues[i].bssid, bs);
      Serial.printf("  Rogue: %s [%s] %s\n",
                    rogues[i].ssid, bs, rogues[i].reason);
    }
  }

  delay(100);
}
