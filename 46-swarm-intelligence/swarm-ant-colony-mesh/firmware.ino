/*
 * Swarm Ant Colony Mesh - ESP32 Firmware
 * Ant colony optimization over ESP-NOW mesh network
 * Pheromone-based routing for distributed path finding
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>

#define LED_PIN 2
#define MAX_NODES 12
#define MAX_PATHS 32
#define PHEROMONE_DECAY 0.95
#define PHEROMONE_DEPOSIT 1.0

typedef struct {
  uint8_t type;       // 0=ant, 1=pheromone, 2=food, 3=status
  uint8_t node_id;
  uint8_t ant_id;
  uint32_t seq;
  uint8_t path[8];
  uint8_t path_len;
  float pheromone;
  int8_t rssi;
} ant_packet_t;

typedef struct {
  uint8_t mac[6];
  uint8_t id;
  float pheromone_level;
  int8_t rssi;
  uint32_t ants_passed;
  int64_t last_seen;
  bool active;
} neighbor_t;

neighbor_t neighbors[MAX_NODES];
float pheromone_table[MAX_NODES][MAX_NODES];
uint8_t my_id;
uint32_t seq = 0;
uint32_t ant_counter = 0;
bool is_food = false;
bool is_nest = false;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

int findNeighbor(uint8_t id) {
  for (int i = 0; i < MAX_NODES; i++)
    if (neighbors[i].active && neighbors[i].id == id) return i;
  return -1;
}

int addNeighbor(const uint8_t *mac, uint8_t id) {
  for (int i = 0; i < MAX_NODES; i++) {
    if (!neighbors[i].active) {
      memcpy(neighbors[i].mac, mac, 6);
      neighbors[i].id = id;
      neighbors[i].active = true;
      neighbors[i].pheromone_level = 0.1;
      neighbors[i].ants_passed = 0;
      esp_now_peer_info_t pi = {};
      memcpy(pi.peer_addr, mac, 6);
      pi.channel = 1;
      esp_now_add_peer(&pi);
      return i;
    }
  }
  return -1;
}

uint8_t selectNextHop(const uint8_t *visited, int visited_len) {
  float total = 0;
  float probs[MAX_NODES];
  int count = 0;

  for (int i = 0; i < MAX_NODES; i++) {
    if (!neighbors[i].active) { probs[i] = 0; continue; }
    bool skip = false;
    for (int j = 0; j < visited_len; j++)
      if (visited[j] == neighbors[i].id) { skip = true; break; }
    if (skip) { probs[i] = 0; continue; }
    probs[i] = neighbors[i].pheromone_level * (100.0 / (abs(neighbors[i].rssi) + 1));
    total += probs[i];
    count++;
  }

  if (count == 0 || total <= 0) return 0xFF;

  float r = (float)(esp_random() % 10000) / 10000.0 * total;
  float cumulative = 0;
  for (int i = 0; i < MAX_NODES; i++) {
    cumulative += probs[i];
    if (cumulative >= r && probs[i] > 0) return neighbors[i].id;
  }
  return 0xFF;
}

void depositPheromone(const uint8_t *path, int len, float amount) {
  for (int i = 0; i < len - 1; i++) {
    int from = findNeighbor(path[i]);
    int to = findNeighbor(path[i+1]);
    if (from >= 0 && to >= 0) {
      pheromone_table[from][to] += amount;
      neighbors[to].pheromone_level += amount;
    }
  }
}

void decayPheromones() {
  for (int i = 0; i < MAX_NODES; i++) {
    if (neighbors[i].active)
      neighbors[i].pheromone_level *= PHEROMONE_DECAY;
    for (int j = 0; j < MAX_NODES; j++)
      pheromone_table[i][j] *= PHEROMONE_DECAY;
  }
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(ant_packet_t)) return;
  ant_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));

  int idx = findNeighbor(pkt.node_id);
  if (idx < 0) idx = addNeighbor(mac, pkt.node_id);
  if (idx >= 0) {
    neighbors[idx].last_seen = esp_timer_get_time();
    neighbors[idx].ants_passed++;
  }

  if (pkt.type == 0 && pkt.path_len < 8) {
    // Forward ant
    if (is_food) {
      depositPheromone(pkt.path, pkt.path_len, PHEROMONE_DEPOSIT / pkt.path_len);
      return;
    }
    pkt.path[pkt.path_len++] = my_id;
    uint8_t next = selectNextHop(pkt.path, pkt.path_len);
    if (next != 0xFF) {
      int ni = findNeighbor(next);
      if (ni >= 0) esp_now_send(neighbors[ni].mac, (uint8_t *)&pkt, sizeof(pkt));
    }
  } else if (pkt.type == 1) {
    depositPheromone(pkt.path, pkt.path_len, pkt.pheromone);
  }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void launchAnt() {
  ant_packet_t pkt;
  pkt.type = 0;
  pkt.node_id = my_id;
  pkt.ant_id = ant_counter++;
  pkt.seq = seq++;
  pkt.path[0] = my_id;
  pkt.path_len = 1;
  pkt.pheromone = PHEROMONE_DEPOSIT;
  pkt.rssi = 0;
  uint8_t next = selectNextHop(pkt.path, 1);
  if (next != 0xFF) {
    int ni = findNeighbor(next);
    if (ni >= 0) esp_now_send(neighbors[ni].mac, (uint8_t *)&pkt, sizeof(pkt));
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  memset(neighbors, 0, sizeof(neighbors));
  memset(pheromone_table, 0, sizeof(pheromone_table));

  WiFi.mode(WIFI_STA);
  uint8_t mac[6];
  esp_wifi_get_mac(WIFI_IF_STA, mac);
  my_id = mac[5];
  esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE);

  esp_now_init();
  esp_now_register_recv_cb(onDataRecv);
  esp_now_register_send_cb(onDataSent);
  esp_now_peer_info_t pi = {};
  memcpy(pi.peer_addr, bcast, 6);
  pi.channel = 1;
  esp_now_add_peer(&pi);

  Serial.printf("[ANT] Colony node %02X ready. NEST/FOOD to set role\n", my_id);
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd == "NEST") { is_nest = true; is_food = false; }
    else if (cmd == "FOOD") { is_food = true; is_nest = false; }
  }

  static uint32_t last = 0;
  if (millis() - last >= 500) {
    last = millis();
    decayPheromones();
    if (is_nest) launchAnt();

    int n = 0;
    for (int i = 0; i < MAX_NODES; i++) if (neighbors[i].active) n++;
    Serial.printf("{\"id\":\"%02X\",\"role\":\"%s\",\"neighbors\":%d,\"ants\":%u,\"t\":%lld}\n",
      my_id, is_nest ? "nest" : (is_food ? "food" : "relay"), n, ant_counter, esp_timer_get_time());
    digitalWrite(LED_PIN, is_food || is_nest);
  }
}
