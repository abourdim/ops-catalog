/*
 * ESP Swarm Net - firmware.ino
 * Swarm intelligence networking: ESP32 nodes self-organize
 * using ant-colony-inspired pheromone routing to find optimal
 * paths through a wireless mesh.
 *
 * Hardware: ESP32 DevKit + NeoPixel ring (8 LEDs, GPIO13)
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_wifi.h>
#include <Adafruit_NeoPixel.h>

#define NEOPIXEL_PIN  13
#define NUM_LEDS       8
#define LED_PIN        2
#define BTN_PIN        4

Adafruit_NeoPixel strip(NUM_LEDS, NEOPIXEL_PIN, NEO_GRB + NEO_KHZ800);

// ---------- Swarm config ----------
#define MAX_NEIGHBORS 10
#define PHEROMONE_DECAY 0.95
#define PHEROMONE_BOOST 10.0

static uint32_t myNodeId;
static uint8_t broadcastMAC[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};

// Neighbor tracking with pheromone levels
typedef struct {
  uint8_t mac[6];
  uint32_t nodeId;
  float pheromone;      // Route quality indicator
  int8_t rssi;
  uint32_t lastSeen;
  uint16_t hopCount;    // Distance to destination
} Neighbor;

static Neighbor neighbors[MAX_NEIGHBORS];
static int neighborCount = 0;

// Swarm message types
typedef struct __attribute__((packed)) {
  uint8_t  type;       // 0=announce, 1=ant(probe), 2=antReply
  uint32_t nodeId;
  uint32_t originId;   // Original sender
  uint16_t hopCount;
  float    pathQuality; // Accumulated path quality
} SwarmMsg;

static uint32_t antsSent = 0;
static uint32_t antsReceived = 0;

// ---------- Find or add neighbor ----------
int findNeighbor(const uint8_t *mac) {
  for (int i = 0; i < neighborCount; i++) {
    if (memcmp(neighbors[i].mac, mac, 6) == 0) return i;
  }
  if (neighborCount < MAX_NEIGHBORS) {
    memcpy(neighbors[neighborCount].mac, mac, 6);
    neighbors[neighborCount].pheromone = 1.0;
    return neighborCount++;
  }
  return -1;
}

// ---------- Select next hop using pheromone probabilities ----------
int selectNextHop() {
  if (neighborCount == 0) return -1;

  float totalPheromone = 0;
  for (int i = 0; i < neighborCount; i++) {
    totalPheromone += neighbors[i].pheromone;
  }

  float r = (float)random(1000) / 1000.0 * totalPheromone;
  float cumulative = 0;
  for (int i = 0; i < neighborCount; i++) {
    cumulative += neighbors[i].pheromone;
    if (r <= cumulative) return i;
  }
  return neighborCount - 1;
}

// ---------- ESP-NOW callbacks ----------
void onRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(SwarmMsg)) return;
  SwarmMsg msg;
  memcpy(&msg, data, len);

  int idx = findNeighbor(mac);
  if (idx < 0) return;

  neighbors[idx].nodeId = msg.nodeId;
  neighbors[idx].lastSeen = millis();

  switch (msg.type) {
    case 0: // Announce
      Serial.printf("[SWARM] Neighbor %08X seen\n", msg.nodeId);
      break;

    case 1: // Ant probe - forward and boost pheromone
      antsReceived++;
      msg.hopCount++;
      msg.pathQuality *= 0.9;  // Decay over distance
      neighbors[idx].pheromone += PHEROMONE_BOOST / msg.hopCount;
      neighbors[idx].hopCount = msg.hopCount;

      // Forward ant to random neighbor (not back to sender)
      if (msg.hopCount < 10) {
        int next = selectNextHop();
        if (next >= 0 && next != idx) {
          msg.nodeId = myNodeId;
          esp_now_send(neighbors[next].mac, (uint8_t *)&msg, sizeof(msg));
        }
      }
      break;

    case 2: // Ant reply - trace back, strengthen path
      neighbors[idx].pheromone += PHEROMONE_BOOST * msg.pathQuality;
      break;
  }
}

void onSent(const uint8_t *mac, esp_now_send_status_t s) {}

// ---------- Send ant probe ----------
void sendAnt() {
  int target = selectNextHop();
  if (target < 0) return;

  SwarmMsg ant = {1, myNodeId, myNodeId, 0, 1.0};
  esp_now_send(neighbors[target].mac, (uint8_t *)&ant, sizeof(ant));
  antsSent++;
}

// ---------- Decay pheromones ----------
void decayPheromones() {
  for (int i = 0; i < neighborCount; i++) {
    neighbors[i].pheromone *= PHEROMONE_DECAY;
    if (neighbors[i].pheromone < 0.1) neighbors[i].pheromone = 0.1;
  }
}

// ---------- LED visualization ----------
void updateLEDs() {
  for (int i = 0; i < NUM_LEDS; i++) {
    if (i < neighborCount) {
      // Color based on pheromone level
      int intensity = constrain((int)(neighbors[i].pheromone * 10), 0, 255);
      strip.setPixelColor(i, strip.Color(0, intensity, 255 - intensity));
    } else {
      strip.setPixelColor(i, 0);
    }
  }
  strip.show();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  myNodeId = ESP.getEfuseMac() & 0xFFFFFFFF;
  Serial.printf("[SwarmNet] Node %08X starting...\n", myNodeId);

  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_PIN, INPUT_PULLUP);

  strip.begin();
  strip.setBrightness(50);
  strip.show();

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  esp_wifi_set_channel(6, WIFI_SECOND_CHAN_NONE);

  esp_now_init();
  esp_now_register_recv_cb(onRecv);
  esp_now_register_send_cb(onSent);

  esp_now_peer_info_t bcast = {};
  memcpy(bcast.peer_addr, broadcastMAC, 6);
  bcast.channel = 6;
  esp_now_add_peer(&bcast);

  randomSeed(esp_random());
  Serial.println("[SwarmNet] Ready.");
}

// ---------- Main loop ----------
void loop() {
  // Periodic announce
  static unsigned long lastAnnounce = 0;
  if (millis() - lastAnnounce > 3000) {
    lastAnnounce = millis();
    SwarmMsg ann = {0, myNodeId, myNodeId, 0, 0};
    esp_now_send(broadcastMAC, (uint8_t *)&ann, sizeof(ann));
  }

  // Send ant probe periodically
  static unsigned long lastAnt = 0;
  if (millis() - lastAnt > 5000) {
    lastAnt = millis();
    sendAnt();
    decayPheromones();
    updateLEDs();

    Serial.printf("[SWARM] Neighbors=%d Sent=%u Recv=%u\n",
                  neighborCount, antsSent, antsReceived);
    for (int i = 0; i < neighborCount; i++) {
      Serial.printf("  N%d: %08X ph=%.1f\n",
                    i, neighbors[i].nodeId, neighbors[i].pheromone);
    }
  }

  // Button: force ant burst
  if (digitalRead(BTN_PIN) == LOW) {
    delay(200);
    for (int i = 0; i < 5; i++) sendAnt();
  }

  delay(10);
}
