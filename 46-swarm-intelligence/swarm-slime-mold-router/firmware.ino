/*
 * Swarm Slime Mold Router - ESP32 Firmware
 * Physarum polycephalum-inspired network routing
 * Links strengthen with traffic, weaken without - self-optimizing mesh
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>
#include <math.h>

#define LED_PIN 2
#define MAX_LINKS 10
#define CONDUCTIVITY_DECAY 0.95
#define MIN_CONDUCTIVITY 0.01
#define FLOW_BOOST 0.5

typedef struct {
  uint8_t type;       // 0=flow, 1=probe, 2=link_state
  uint8_t src_id;
  uint8_t dst_id;
  uint32_t seq;
  float flow_amount;
  uint8_t ttl;
  uint8_t path[6];
  uint8_t path_len;
} slime_packet_t;

typedef struct {
  uint8_t mac[6];
  uint8_t id;
  float conductivity;
  float flow_rate;
  int8_t rssi;
  int64_t last_flow;
  uint32_t packets_routed;
  bool active;
} link_t;

link_t links[MAX_LINKS];
uint8_t my_id;
uint32_t seq = 0;
float total_flow = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

int findLink(uint8_t id) {
  for (int i = 0; i < MAX_LINKS; i++)
    if (links[i].active && links[i].id == id) return i;
  return -1;
}

int addLink(const uint8_t *mac, uint8_t id) {
  for (int i = 0; i < MAX_LINKS; i++) {
    if (!links[i].active) {
      memcpy(links[i].mac, mac, 6);
      links[i].id = id;
      links[i].active = true;
      links[i].conductivity = 0.5;
      links[i].flow_rate = 0;
      links[i].packets_routed = 0;
      esp_now_peer_info_t pi = {};
      memcpy(pi.peer_addr, mac, 6);
      pi.channel = 1;
      esp_now_add_peer(&pi);
      return i;
    }
  }
  return -1;
}

uint8_t selectRoute(uint8_t dst, const uint8_t *exclude, int excl_len) {
  float total_cond = 0;
  float weights[MAX_LINKS];

  for (int i = 0; i < MAX_LINKS; i++) {
    weights[i] = 0;
    if (!links[i].active) continue;
    bool skip = false;
    for (int j = 0; j < excl_len; j++)
      if (exclude[j] == links[i].id) { skip = true; break; }
    if (skip) continue;
    weights[i] = links[i].conductivity;
    total_cond += weights[i];
  }

  if (total_cond <= 0) return 0xFF;

  float r = (float)(esp_random() % 10000) / 10000.0 * total_cond;
  float cum = 0;
  for (int i = 0; i < MAX_LINKS; i++) {
    cum += weights[i];
    if (cum >= r && weights[i] > 0) return links[i].id;
  }
  return 0xFF;
}

void reinforceLink(uint8_t id, float amount) {
  int idx = findLink(id);
  if (idx >= 0) {
    links[idx].conductivity += amount;
    links[idx].flow_rate += amount;
    links[idx].last_flow = esp_timer_get_time();
    links[idx].packets_routed++;
  }
}

void decayLinks() {
  for (int i = 0; i < MAX_LINKS; i++) {
    if (!links[i].active) continue;
    links[i].conductivity *= CONDUCTIVITY_DECAY;
    links[i].flow_rate *= 0.9;
    if (links[i].conductivity < MIN_CONDUCTIVITY) {
      links[i].active = false;
    }
  }
}

void sendFlow(uint8_t dst, float amount) {
  slime_packet_t pkt;
  pkt.type = 0;
  pkt.src_id = my_id;
  pkt.dst_id = dst;
  pkt.seq = seq++;
  pkt.flow_amount = amount;
  pkt.ttl = 5;
  pkt.path[0] = my_id;
  pkt.path_len = 1;

  uint8_t next = selectRoute(dst, pkt.path, 1);
  if (next != 0xFF) {
    int idx = findLink(next);
    if (idx >= 0) {
      reinforceLink(next, FLOW_BOOST);
      esp_now_send(links[idx].mac, (uint8_t *)&pkt, sizeof(pkt));
      total_flow += amount;
    }
  }
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(slime_packet_t)) return;
  slime_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));

  int idx = findLink(pkt.src_id);
  if (idx < 0) idx = addLink(mac, pkt.src_id);

  if (pkt.type == 0) {
    reinforceLink(pkt.src_id, FLOW_BOOST * 0.5);

    if (pkt.dst_id == my_id) {
      // Reached destination - reinforce entire path
      for (int i = 0; i < pkt.path_len; i++) {
        reinforceLink(pkt.path[i], FLOW_BOOST);
      }
      return;
    }

    if (pkt.ttl <= 1 || pkt.path_len >= 6) return;
    pkt.ttl--;
    pkt.path[pkt.path_len++] = my_id;

    uint8_t next = selectRoute(pkt.dst_id, pkt.path, pkt.path_len);
    if (next != 0xFF) {
      int ni = findLink(next);
      if (ni >= 0) {
        reinforceLink(next, FLOW_BOOST * 0.3);
        esp_now_send(links[ni].mac, (uint8_t *)&pkt, sizeof(pkt));
      }
    }
  } else if (pkt.type == 1) {
    // Probe: respond with link state
    slime_packet_t resp;
    resp.type = 2;
    resp.src_id = my_id;
    resp.seq = seq++;
    esp_now_send(mac, (uint8_t *)&resp, sizeof(resp));
  }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  memset(links, 0, sizeof(links));

  WiFi.mode(WIFI_STA);
  uint8_t mac[6]; esp_wifi_get_mac(WIFI_IF_STA, mac); my_id = mac[5];
  esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE);
  esp_now_init();
  esp_now_register_recv_cb(onDataRecv); esp_now_register_send_cb(onDataSent);
  esp_now_peer_info_t pi = {}; memcpy(pi.peer_addr, bcast, 6); pi.channel = 1;
  esp_now_add_peer(&pi);

  Serial.printf("[SLIME] Mold Router %02X ready. FLOW <dst> to send\n", my_id);
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd.startsWith("FLOW")) {
      uint8_t dst = (uint8_t)strtol(cmd.c_str() + 5, NULL, 16);
      sendFlow(dst, 1.0);
    }
  }

  static uint32_t last = 0;
  if (millis() - last < 500) return;
  last = millis();
  decayLinks();

  int active = 0;
  Serial.printf("{\"mold\":\"%02X\",\"flow\":%.1f,\"links\":[", my_id, total_flow);
  bool first = true;
  for (int i = 0; i < MAX_LINKS; i++) {
    if (!links[i].active) continue;
    active++;
    if (!first) Serial.print(",");
    Serial.printf("{\"id\":\"%02X\",\"cond\":%.3f,\"pkts\":%u}",
      links[i].id, links[i].conductivity, links[i].packets_routed);
    first = false;
  }
  Serial.printf("],\"active_links\":%d}\n", active);
  digitalWrite(LED_PIN, active > 0);
}
