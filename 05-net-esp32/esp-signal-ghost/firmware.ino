/*
 * ESP Signal Ghost - firmware.ino
 * Detects and visualizes hidden/cloaked Wi-Fi networks
 * by analyzing probe responses and data frames from SSIDs
 * that don't broadcast beacons.
 *
 * Hardware: ESP32 DevKit + OLED SSD1306
 * Wiring:  SDA -> GPIO21, SCL -> GPIO22
 */

#include <WiFi.h>
#include <esp_wifi.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

// ---------- OLED ----------
#define SCREEN_W 128
#define SCREEN_H 64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);

#define LED_PIN 2

// ---------- Hidden network tracker ----------
#define MAX_HIDDEN 24
typedef struct {
  uint8_t bssid[6];
  char ssid[33];       // Discovered SSID (may be empty)
  int8_t rssi;
  uint8_t channel;
  uint32_t dataFrames;
  uint32_t probeResps;
  bool ssidRevealed;
  unsigned long firstSeen;
} HiddenNet;

static HiddenNet hidden[MAX_HIDDEN];
static int hiddenCount = 0;
static uint32_t totalFrames = 0;
static uint32_t hiddenRevealed = 0;

// ---------- Find or add hidden network ----------
int findOrAddHidden(const uint8_t *bssid) {
  for (int i = 0; i < hiddenCount; i++) {
    if (memcmp(hidden[i].bssid, bssid, 6) == 0) return i;
  }
  if (hiddenCount < MAX_HIDDEN) {
    memcpy(hidden[hiddenCount].bssid, bssid, 6);
    hidden[hiddenCount].ssid[0] = '\0';
    hidden[hiddenCount].rssi = -100;
    hidden[hiddenCount].dataFrames = 0;
    hidden[hiddenCount].probeResps = 0;
    hidden[hiddenCount].ssidRevealed = false;
    hidden[hiddenCount].firstSeen = millis();
    return hiddenCount++;
  }
  return -1;
}

// ---------- Promiscuous callback ----------
void IRAM_ATTR snifferCB(void *buf, wifi_promiscuous_pkt_type_t type) {
  wifi_promiscuous_pkt_t *pkt = (wifi_promiscuous_pkt_t *)buf;
  const uint8_t *frame = pkt->payload;
  int len = pkt->rx_ctrl.sig_len;
  if (len < 24) return;

  totalFrames++;
  uint8_t frameType = (frame[0] >> 2) & 0x03;
  uint8_t subType = (frame[0] >> 4) & 0x0F;

  // Beacon with hidden SSID (length 0 or null bytes)
  if (frameType == 0 && subType == 8) {
    // Check SSID element at offset 36
    if (len > 38) {
      uint8_t ssidLen = frame[37];
      bool isHidden = (ssidLen == 0);
      if (!isHidden) {
        // Check for null-filled SSID
        isHidden = true;
        for (int i = 0; i < ssidLen && i < 32; i++) {
          if (frame[38 + i] != 0) { isHidden = false; break; }
        }
      }
      if (isHidden) {
        int idx = findOrAddHidden(&frame[10]);
        if (idx >= 0) {
          hidden[idx].rssi = pkt->rx_ctrl.rssi;
          hidden[idx].channel = pkt->rx_ctrl.channel;
        }
      }
    }
  }

  // Probe Response - may reveal hidden SSID
  if (frameType == 0 && subType == 5) {
    const uint8_t *bssid = &frame[10];
    for (int i = 0; i < hiddenCount; i++) {
      if (memcmp(hidden[i].bssid, bssid, 6) == 0) {
        hidden[i].probeResps++;
        if (!hidden[i].ssidRevealed && len > 38) {
          uint8_t ssidLen = frame[37];
          if (ssidLen > 0 && ssidLen < 33) {
            memcpy(hidden[i].ssid, &frame[38], ssidLen);
            hidden[i].ssid[ssidLen] = '\0';
            hidden[i].ssidRevealed = true;
            hiddenRevealed++;
            Serial.printf("[REVEALED] %s BSSID=%02X:%02X:%02X:%02X:%02X:%02X\n",
                          hidden[i].ssid,
                          bssid[0], bssid[1], bssid[2],
                          bssid[3], bssid[4], bssid[5]);
          }
        }
        break;
      }
    }
  }

  // Data frames from known hidden BSSIDs
  if (frameType == 2) {
    const uint8_t *bssid = &frame[10];
    for (int i = 0; i < hiddenCount; i++) {
      if (memcmp(hidden[i].bssid, bssid, 6) == 0) {
        hidden[i].dataFrames++;
        break;
      }
    }
  }
}

// ---------- Display ----------
void updateDisplay() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(0, 0);
  oled.printf("Signal Ghost  H:%d R:%u", hiddenCount, hiddenRevealed);

  for (int i = 0; i < min(hiddenCount, 5); i++) {
    oled.setCursor(0, 12 + i * 10);
    char bssid[8];
    snprintf(bssid, 8, "%02X%02X%02X", hidden[i].bssid[3],
             hidden[i].bssid[4], hidden[i].bssid[5]);
    if (hidden[i].ssidRevealed) {
      oled.printf("%.10s %ddBm D:%u", hidden[i].ssid,
                  hidden[i].rssi, hidden[i].dataFrames);
    } else {
      oled.printf("[%s] %ddBm D:%u", bssid,
                  hidden[i].rssi, hidden[i].dataFrames);
    }
  }
  oled.display();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[SignalGhost] Starting...");
  pinMode(LED_PIN, OUTPUT);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(10, 28);
  oled.print("Signal Ghost");
  oled.display();

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  esp_wifi_set_promiscuous(true);
  esp_wifi_set_promiscuous_rx_cb(snifferCB);

  Serial.println("[SignalGhost] Hunting hidden networks...");
}

// ---------- Main loop ----------
void loop() {
  // Channel hop
  static unsigned long lastHop = 0;
  static uint8_t ch = 1;
  if (millis() - lastHop > 1500) {
    lastHop = millis();
    ch = (ch % 13) + 1;
    esp_wifi_set_channel(ch, WIFI_SECOND_CHAN_NONE);
  }

  // Update display
  static unsigned long lastDisp = 0;
  if (millis() - lastDisp > 1000) {
    lastDisp = millis();
    updateDisplay();
    Serial.printf("[STATS] Frames=%u Hidden=%d Revealed=%u\n",
                  totalFrames, hiddenCount, hiddenRevealed);
  }

  digitalWrite(LED_PIN, hiddenCount > 0 ? ((millis() / 200) % 2) : LOW);
  delay(10);
}
