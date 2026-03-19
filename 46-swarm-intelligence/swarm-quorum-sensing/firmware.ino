/*
 * Swarm Quorum Sensing - ESP32 Firmware
 * Bacterial quorum sensing: nodes change behavior when density threshold met
 * ESP-NOW broadcasts "autoinducer" signals to measure local density
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>

#define LED_PIN 2
#define MAX_NEIGHBORS 12
#define QUORUM_THRESHOLD 4
#define SIGNAL_DECAY_MS 5000

typedef struct {
  uint8_t type;       // 0=autoinducer, 1=quorum_state, 2=action
  uint8_t node_id;
  uint32_t seq;
  float signal_strength;
  uint8_t density;
  bool quorum_reached;
  uint8_t action_code;
} quorum_packet_t;

typedef struct {
  uint8_t mac[6];
  uint8_t id;
  float signal;
  int64_t last_heard;
  int8_t rssi;
  bool active;
} neighbor_info_t;

neighbor_info_t neighbors[MAX_NEIGHBORS];
uint8_t my_id;
uint32_t seq = 0;
bool quorum_active = false;
int local_density = 0;
float total_signal = 0;
uint8_t current_action = 0;  // 0=idle, 1=bioluminescence, 2=biofilm, 3=virulence
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

void updateDensity() {
  int64_t now = esp_timer_get_time();
  local_density = 0;
  total_signal = 0;
  for (int i = 0; i < MAX_NEIGHBORS; i++) {
    if (!neighbors[i].active) continue;
    if ((now - neighbors[i].last_heard) / 1000 > SIGNAL_DECAY_MS) {
      neighbors[i].active = false;
      continue;
    }
    float decay = 1.0 - (float)((now - neighbors[i].last_heard) / 1000) / SIGNAL_DECAY_MS;
    total_signal += neighbors[i].signal * decay;
    local_density++;
  }

  bool prev = quorum_active;
  quorum_active = local_density >= QUORUM_THRESHOLD;

  if (quorum_active && !prev) {
    current_action = 1;
    Serial.printf("[QUORUM] Quorum reached! Density=%d, activating behavior\n", local_density);
  } else if (!quorum_active && prev) {
    current_action = 0;
    Serial.println("[QUORUM] Below quorum, reverting to individual behavior");
  }
}

void emitAutoinducer() {
  quorum_packet_t pkt;
  pkt.type = 0;
  pkt.node_id = my_id;
  pkt.seq = seq++;
  pkt.signal_strength = quorum_active ? 2.0 : 1.0;  // Positive feedback
  pkt.density = local_density;
  pkt.quorum_reached = quorum_active;
  pkt.action_code = current_action;
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(quorum_packet_t)) return;
  quorum_packet_t pkt;
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
  if (idx < 0) return;

  neighbors[idx].signal = pkt.signal_strength;
  neighbors[idx].last_heard = esp_timer_get_time();
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  memset(neighbors, 0, sizeof(neighbors));

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

  Serial.printf("[QUORUM] Sensing node %02X ready (threshold=%d)\n", my_id, QUORUM_THRESHOLD);
}

void loop() {
  static uint32_t last = 0;
  if (millis() - last < 500) return;
  last = millis();

  emitAutoinducer();
  updateDensity();

  const char *actions[] = {"idle", "bioluminescence", "biofilm", "virulence"};
  Serial.printf("{\"node\":\"%02X\",\"density\":%d,\"quorum\":%s,\"signal\":%.2f,\"action\":\"%s\"}\n",
    my_id, local_density, quorum_active ? "true" : "false",
    total_signal, actions[current_action % 4]);
  digitalWrite(LED_PIN, quorum_active);
}
