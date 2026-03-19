/*
 * Swarm Cellular Automata Mesh - ESP32 Firmware
 * Each ESP32 is a cell in a distributed cellular automaton
 * State transitions based on neighbor states via ESP-NOW
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>

#define LED_PIN 2
#define MAX_NEIGHBORS 8
#define NUM_STATES 4
#define RULE_TABLE_SIZE 16

typedef struct {
  uint8_t type;       // 0=state, 1=rule_update
  uint8_t node_id;
  uint32_t seq;
  uint8_t state;
  uint8_t prev_state;
  uint32_t generation;
  uint8_t neighbor_count;
} ca_packet_t;

typedef struct {
  uint8_t mac[6];
  uint8_t id;
  uint8_t state;
  int8_t rssi;
  int64_t last_seen;
  bool active;
} ca_neighbor_t;

ca_neighbor_t neighbors[MAX_NEIGHBORS];
uint8_t my_state = 0;
uint8_t prev_state = 0;
uint32_t generation = 0;
uint8_t rule_table[RULE_TABLE_SIZE];
uint8_t my_id;
uint32_t seq = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

void initRules() {
  // Default: Game of Life-like rules based on neighbor density
  for (int i = 0; i < RULE_TABLE_SIZE; i++) {
    int alive_neighbors = i % NUM_STATES;
    int current = (i / NUM_STATES) % NUM_STATES;
    // Born with 2-3 neighbors, survive with 2-3, die otherwise
    if (current == 0 && (alive_neighbors == 2 || alive_neighbors == 3))
      rule_table[i] = 1;
    else if (current > 0 && (alive_neighbors >= 2 && alive_neighbors <= 3))
      rule_table[i] = min(current + 1, NUM_STATES - 1);
    else
      rule_table[i] = max(current - 1, 0);
  }
}

uint8_t computeNextState() {
  int state_counts[NUM_STATES] = {0};
  int n_active = 0;
  for (int i = 0; i < MAX_NEIGHBORS; i++) {
    if (!neighbors[i].active) continue;
    state_counts[neighbors[i].state % NUM_STATES]++;
    n_active++;
  }

  // Use dominant neighbor state + my state as rule index
  int dominant = 0;
  for (int s = 1; s < NUM_STATES; s++)
    if (state_counts[s] > state_counts[dominant]) dominant = s;

  int rule_idx = (my_state * NUM_STATES + dominant) % RULE_TABLE_SIZE;
  return rule_table[rule_idx];
}

void broadcastState() {
  ca_packet_t pkt;
  pkt.type = 0;
  pkt.node_id = my_id;
  pkt.seq = seq++;
  pkt.state = my_state;
  pkt.prev_state = prev_state;
  pkt.generation = generation;
  int nc = 0;
  for (int i = 0; i < MAX_NEIGHBORS; i++) if (neighbors[i].active) nc++;
  pkt.neighbor_count = nc;
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(ca_packet_t)) return;
  ca_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));

  int idx = -1;
  for (int i = 0; i < MAX_NEIGHBORS; i++)
    if (neighbors[i].active && neighbors[i].id == pkt.node_id) { idx = i; break; }
  if (idx < 0) {
    for (int i = 0; i < MAX_NEIGHBORS; i++) {
      if (!neighbors[i].active) {
        memcpy(neighbors[i].mac, mac, 6);
        neighbors[i].id = pkt.node_id;
        neighbors[i].active = true;
        esp_now_peer_info_t pi = {};
        memcpy(pi.peer_addr, mac, 6);
        pi.channel = 1;
        esp_now_add_peer(&pi);
        idx = i;
        break;
      }
    }
  }
  if (idx >= 0) {
    neighbors[idx].state = pkt.state;
    neighbors[idx].last_seen = esp_timer_get_time();
  }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  memset(neighbors, 0, sizeof(neighbors));
  initRules();
  my_state = esp_random() % NUM_STATES;

  WiFi.mode(WIFI_STA);
  uint8_t mac[6]; esp_wifi_get_mac(WIFI_IF_STA, mac); my_id = mac[5];
  esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE);
  esp_now_init();
  esp_now_register_recv_cb(onDataRecv); esp_now_register_send_cb(onDataSent);
  esp_now_peer_info_t pi = {}; memcpy(pi.peer_addr, bcast, 6); pi.channel = 1;
  esp_now_add_peer(&pi);

  Serial.printf("[CA] Cell %02X ready, state=%d\n", my_id, my_state);
}

void loop() {
  static uint32_t last = 0;
  if (millis() - last < 500) return;
  last = millis();

  prev_state = my_state;
  my_state = computeNextState();
  generation++;
  broadcastState();

  int nc = 0;
  for (int i = 0; i < MAX_NEIGHBORS; i++) if (neighbors[i].active) nc++;
  Serial.printf("{\"cell\":\"%02X\",\"state\":%d,\"prev\":%d,\"gen\":%u,\"neighbors\":%d}\n",
    my_id, my_state, prev_state, generation, nc);
  digitalWrite(LED_PIN, my_state > 0);
}
