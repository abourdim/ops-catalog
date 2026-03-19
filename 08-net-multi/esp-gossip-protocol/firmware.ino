/*
 * ESP Gossip Protocol - firmware.ino
 * Implements epidemic/gossip-style data dissemination across
 * ESP-NOW mesh. Each node randomly selects peers and exchanges
 * state, achieving eventual consistency without a central server.
 *
 * Hardware: ESP32 DevKit + OLED SSD1306
 * Wiring:  SDA -> GPIO21, SCL -> GPIO22
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_wifi.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_W 128
#define SCREEN_H 64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);

#define LED_PIN   2
#define BTN_PIN   4

// ---------- Gossip state ----------
#define MAX_PEERS  16
#define MAX_KEYS    8
#define GOSSIP_INTERVAL 2000  // ms

// Key-value store replicated via gossip
typedef struct {
  char key[12];
  int32_t value;
  uint32_t version;  // Lamport timestamp
} GossipEntry;

static GossipEntry store[MAX_KEYS];
static int storeCount = 0;
static uint32_t myVersion = 0;
static uint32_t myNodeId = 0;

// Known peers
static uint8_t peerMACs[MAX_PEERS][6];
static int peerCount = 0;

// Stats
static uint32_t gossipSent = 0;
static uint32_t gossipRecv = 0;
static uint32_t mergeConflicts = 0;

static uint8_t broadcastMAC[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};

// ---------- Gossip message ----------
typedef struct __attribute__((packed)) {
  uint32_t senderId;
  uint8_t  entryCount;
  GossipEntry entries[MAX_KEYS];
} GossipMsg;

// ---------- Find or create key ----------
int findKey(const char *key) {
  for (int i = 0; i < storeCount; i++) {
    if (strcmp(store[i].key, key) == 0) return i;
  }
  if (storeCount < MAX_KEYS) {
    strncpy(store[storeCount].key, key, 11);
    store[storeCount].value = 0;
    store[storeCount].version = 0;
    return storeCount++;
  }
  return -1;
}

// ---------- Merge received state ----------
void mergeState(const GossipEntry *entries, int count) {
  for (int i = 0; i < count; i++) {
    int idx = findKey(entries[i].key);
    if (idx >= 0) {
      if (entries[i].version > store[idx].version) {
        store[idx].value = entries[i].value;
        store[idx].version = entries[i].version;
        Serial.printf("[GOSSIP] Merged %s=%d (v%u)\n",
                      store[idx].key, store[idx].value, store[idx].version);
      } else if (entries[i].version == store[idx].version &&
                 entries[i].value != store[idx].value) {
        mergeConflicts++;
        // Resolve conflict: highest value wins
        if (entries[i].value > store[idx].value) {
          store[idx].value = entries[i].value;
        }
      }
    }
  }
}

// ---------- ESP-NOW callbacks ----------
void onRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len < sizeof(uint32_t) + 1) return;
  GossipMsg msg;
  memcpy(&msg, data, min((int)len, (int)sizeof(msg)));

  gossipRecv++;
  mergeState(msg.entries, msg.entryCount);

  // Track peer
  bool known = false;
  for (int i = 0; i < peerCount; i++) {
    if (memcmp(peerMACs[i], mac, 6) == 0) { known = true; break; }
  }
  if (!known && peerCount < MAX_PEERS) {
    memcpy(peerMACs[peerCount], mac, 6);
    peerCount++;
    // Register peer for sending
    esp_now_peer_info_t peer = {};
    memcpy(peer.peer_addr, mac, 6);
    peer.channel = 6;
    esp_now_add_peer(&peer);
  }
}

void onSent(const uint8_t *mac, esp_now_send_status_t s) {}

// ---------- Send gossip ----------
void sendGossip() {
  GossipMsg msg;
  msg.senderId = myNodeId;
  msg.entryCount = storeCount;
  memcpy(msg.entries, store, sizeof(GossipEntry) * storeCount);

  // Send to random peer or broadcast
  if (peerCount > 0) {
    int target = random(peerCount);
    esp_now_send(peerMACs[target], (uint8_t *)&msg, sizeof(msg));
  } else {
    esp_now_send(broadcastMAC, (uint8_t *)&msg, sizeof(msg));
  }
  gossipSent++;
}

// ---------- Display ----------
void updateDisplay() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(0, 0);
  oled.printf("Gossip  P:%d", peerCount);
  oled.setCursor(0, 10);
  oled.printf("TX:%u RX:%u C:%u", gossipSent, gossipRecv, mergeConflicts);

  for (int i = 0; i < min(storeCount, 5); i++) {
    oled.setCursor(0, 22 + i * 9);
    oled.printf("%-10s=%d v%u", store[i].key, store[i].value, store[i].version);
  }
  oled.display();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_PIN, INPUT_PULLUP);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  esp_wifi_set_channel(6, WIFI_SECOND_CHAN_NONE);

  myNodeId = ESP.getEfuseMac() & 0xFFFFFFFF;

  esp_now_init();
  esp_now_register_recv_cb(onRecv);
  esp_now_register_send_cb(onSent);

  esp_now_peer_info_t bcast = {};
  memcpy(bcast.peer_addr, broadcastMAC, 6);
  bcast.channel = 6;
  esp_now_add_peer(&bcast);

  // Initialize local data
  char nodeKey[12];
  snprintf(nodeKey, 12, "n%04X", myNodeId & 0xFFFF);
  int idx = findKey(nodeKey);
  if (idx >= 0) { store[idx].value = 1; store[idx].version = 1; }

  randomSeed(esp_random());
  Serial.printf("[Gossip] Node %08X ready. Peers: %d\n", myNodeId, peerCount);
  updateDisplay();
}

// ---------- Main loop ----------
void loop() {
  // Periodic gossip
  static unsigned long lastGossip = 0;
  if (millis() - lastGossip > GOSSIP_INTERVAL) {
    lastGossip = millis();
    sendGossip();
    updateDisplay();
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
  }

  // Button increments our local counter
  if (digitalRead(BTN_PIN) == LOW) {
    delay(200);
    char nodeKey[12];
    snprintf(nodeKey, 12, "n%04X", myNodeId & 0xFFFF);
    int idx = findKey(nodeKey);
    if (idx >= 0) {
      store[idx].value++;
      store[idx].version = ++myVersion;
      Serial.printf("[LOCAL] %s=%d\n", store[idx].key, store[idx].value);
    }
  }

  delay(10);
}
