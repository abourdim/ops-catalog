/*
 * ESP Roaming Visualizer - firmware.ino
 * Visualizes Wi-Fi client roaming behavior between APs.
 * Monitors which AP a client is associated with and detects
 * roaming events (reassociation to different BSSID).
 *
 * Hardware: ESP32 DevKit + OLED SSD1306
 * Wiring:  SDA -> GPIO21, SCL -> GPIO22
 */

#include <WiFi.h>
#include <esp_wifi.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_W 128
#define SCREEN_H  64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);

#define LED_PIN   2
#define BTN_PIN   4

// ---------- Client tracking ----------
#define MAX_CLIENTS 16
#define MAX_APS     8

typedef struct {
  uint8_t mac[6];
  uint8_t currentBSSID[6];
  uint8_t prevBSSID[6];
  int8_t rssi;
  uint32_t roamCount;
  unsigned long lastSeen;
  unsigned long lastRoam;
} TrackedClient;

typedef struct {
  uint8_t bssid[6];
  char ssid[33];
  int8_t rssi;
  uint8_t channel;
  uint32_t clientCount;
} TrackedAP;

static TrackedClient clients[MAX_CLIENTS];
static int clientCount = 0;
static TrackedAP aps[MAX_APS];
static int apCount = 0;
static uint32_t totalRoams = 0;
static uint32_t totalFrames = 0;

// ---------- Find or add client ----------
int findClient(const uint8_t *mac) {
  for (int i = 0; i < clientCount; i++) {
    if (memcmp(clients[i].mac, mac, 6) == 0) return i;
  }
  if (clientCount < MAX_CLIENTS) {
    memcpy(clients[clientCount].mac, mac, 6);
    memset(clients[clientCount].currentBSSID, 0, 6);
    memset(clients[clientCount].prevBSSID, 0, 6);
    clients[clientCount].roamCount = 0;
    return clientCount++;
  }
  return -1;
}

// ---------- Find or add AP ----------
int findAP(const uint8_t *bssid) {
  for (int i = 0; i < apCount; i++) {
    if (memcmp(aps[i].bssid, bssid, 6) == 0) return i;
  }
  if (apCount < MAX_APS) {
    memcpy(aps[apCount].bssid, bssid, 6);
    aps[apCount].ssid[0] = '\0';
    aps[apCount].clientCount = 0;
    return apCount++;
  }
  return -1;
}

// ---------- Detect roaming ----------
void checkRoam(int clientIdx, const uint8_t *newBSSID, int8_t rssi) {
  TrackedClient &c = clients[clientIdx];
  c.rssi = rssi;
  c.lastSeen = millis();

  if (memcmp(c.currentBSSID, newBSSID, 6) != 0) {
    // Check if this is a real roam (not first association)
    bool wasAssociated = false;
    for (int i = 0; i < 6; i++) {
      if (c.currentBSSID[i] != 0) { wasAssociated = true; break; }
    }

    if (wasAssociated) {
      memcpy(c.prevBSSID, c.currentBSSID, 6);
      c.roamCount++;
      c.lastRoam = millis();
      totalRoams++;

      Serial.printf("[ROAM] Client %02X:%02X:%02X:%02X:%02X:%02X roamed "
                    "from %02X:%02X to %02X:%02X (count=%u)\n",
                    c.mac[0], c.mac[1], c.mac[2], c.mac[3], c.mac[4], c.mac[5],
                    c.prevBSSID[4], c.prevBSSID[5],
                    newBSSID[4], newBSSID[5], c.roamCount);
    }
    memcpy(c.currentBSSID, newBSSID, 6);
  }
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

  // Data frames: track client-to-AP association
  if (frameType == 2) {
    bool toDS = (frame[1] >> 0) & 1;
    bool fromDS = (frame[1] >> 1) & 1;

    if (toDS && !fromDS) {
      // Client -> AP: frame[4]=BSSID, frame[10]=src(client)
      int cidx = findClient(&frame[10]);
      if (cidx >= 0) {
        checkRoam(cidx, &frame[4], pkt->rx_ctrl.rssi);
      }
      findAP(&frame[4]);
    }
  }

  // Reassociation request (clear roam signal)
  if (frameType == 0 && (subType == 0 || subType == 2)) {
    int cidx = findClient(&frame[10]);
    if (cidx >= 0) {
      checkRoam(cidx, &frame[4], pkt->rx_ctrl.rssi);
    }
  }

  // Beacons: track AP info
  if (frameType == 0 && subType == 8 && len > 38) {
    int aidx = findAP(&frame[10]);
    if (aidx >= 0) {
      uint8_t ssidLen = frame[37];
      if (ssidLen > 0 && ssidLen < 33) {
        memcpy(aps[aidx].ssid, &frame[38], ssidLen);
        aps[aidx].ssid[ssidLen] = '\0';
      }
      aps[aidx].rssi = pkt->rx_ctrl.rssi;
      aps[aidx].channel = pkt->rx_ctrl.channel;
    }
  }
}

// ---------- Display ----------
void updateDisplay() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);

  oled.setCursor(0, 0);
  oled.printf("Roaming Viz  R:%u", totalRoams);

  // Show clients with roam info
  for (int i = 0; i < min(clientCount, 5); i++) {
    int y = 10 + i * 10;
    oled.setCursor(0, y);
    oled.printf("%02X%02X %ddB R:%u",
                clients[i].mac[4], clients[i].mac[5],
                clients[i].rssi, clients[i].roamCount);
    if (clients[i].roamCount > 0 &&
        millis() - clients[i].lastRoam < 5000) {
      oled.print(" *ROAM*");
    }
  }

  oled.setCursor(0, SCREEN_H - 8);
  oled.printf("APs:%d Clients:%d", apCount, clientCount);
  oled.display();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[RoamViz] Starting...");
  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_PIN, INPUT_PULLUP);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  esp_wifi_set_promiscuous(true);
  esp_wifi_set_promiscuous_rx_cb(snifferCB);

  Serial.println("[RoamViz] Monitoring roaming events...");
}

// ---------- Main loop ----------
void loop() {
  // Channel hop
  static unsigned long lastHop = 0;
  static uint8_t ch = 1;
  if (millis() - lastHop > 1000) {
    lastHop = millis();
    ch = (ch % 13) + 1;
    esp_wifi_set_channel(ch, WIFI_SECOND_CHAN_NONE);
  }

  static unsigned long lastDisp = 0;
  if (millis() - lastDisp > 500) {
    lastDisp = millis();
    updateDisplay();
  }

  digitalWrite(LED_PIN, totalRoams > 0 && (millis() / 300) % 2);
  delay(10);
}
