/*
 * Swarm Stigmergy Network - ESP32 Firmware
 * Indirect communication through environmental markers (digital pheromones)
 * ESP-NOW nodes leave and detect virtual markers in the network
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>

#define LED_PIN 2
#define MAX_MARKERS 64
#define MAX_PEERS 8
#define MARKER_DECAY_RATE 0.98
#define MARKER_THRESHOLD 0.05

typedef struct {
  uint8_t type;       // 0=deposit, 1=query, 2=marker_list
  uint8_t node_id;
  uint32_t seq;
  uint16_t marker_id;
  float intensity;
  uint8_t marker_type;  // 0=path, 1=danger, 2=resource, 3=task
  int8_t rssi;
} stigmergy_packet_t;

typedef struct {
  uint16_t id;
  float intensity;
  uint8_t mtype;
  uint8_t depositor;
  int64_t deposit_time;
  bool active;
} marker_t;

marker_t markers[MAX_MARKERS];
int marker_count = 0;
uint8_t my_id;
uint32_t seq = 0;
uint16_t next_marker_id = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

int findMarker(uint16_t id) {
  for (int i = 0; i < marker_count; i++)
    if (markers[i].active && markers[i].id == id) return i;
  return -1;
}

uint16_t depositMarker(uint8_t mtype, float intensity) {
  int slot = -1;
  for (int i = 0; i < MAX_MARKERS; i++) {
    if (!markers[i].active) { slot = i; break; }
  }
  if (slot < 0) {
    // Evict weakest
    float weakest = 999;
    for (int i = 0; i < MAX_MARKERS; i++) {
      if (markers[i].intensity < weakest) { weakest = markers[i].intensity; slot = i; }
    }
  }
  if (slot < 0) return 0;

  uint16_t mid = (my_id << 8) | (next_marker_id++ & 0xFF);
  markers[slot].id = mid;
  markers[slot].intensity = intensity;
  markers[slot].mtype = mtype;
  markers[slot].depositor = my_id;
  markers[slot].deposit_time = esp_timer_get_time();
  markers[slot].active = true;
  if (slot >= marker_count) marker_count = slot + 1;

  // Broadcast
  stigmergy_packet_t pkt;
  pkt.type = 0;
  pkt.node_id = my_id;
  pkt.seq = seq++;
  pkt.marker_id = mid;
  pkt.intensity = intensity;
  pkt.marker_type = mtype;
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));

  return mid;
}

void decayMarkers() {
  for (int i = 0; i < marker_count; i++) {
    if (!markers[i].active) continue;
    markers[i].intensity *= MARKER_DECAY_RATE;
    if (markers[i].intensity < MARKER_THRESHOLD) {
      markers[i].active = false;
    }
  }
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(stigmergy_packet_t)) return;
  stigmergy_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));

  if (pkt.type == 0) {
    int idx = findMarker(pkt.marker_id);
    if (idx >= 0) {
      markers[idx].intensity = fmax(markers[idx].intensity, pkt.intensity);
    } else {
      int slot = -1;
      for (int i = 0; i < MAX_MARKERS; i++) {
        if (!markers[i].active) { slot = i; break; }
      }
      if (slot >= 0) {
        markers[slot].id = pkt.marker_id;
        markers[slot].intensity = pkt.intensity * 0.8;  // Attenuation
        markers[slot].mtype = pkt.marker_type;
        markers[slot].depositor = pkt.node_id;
        markers[slot].deposit_time = esp_timer_get_time();
        markers[slot].active = true;
        if (slot >= marker_count) marker_count = slot + 1;
      }
    }
  } else if (pkt.type == 1) {
    // Reply with strongest marker of requested type
    float best_intensity = 0;
    int best_idx = -1;
    for (int i = 0; i < marker_count; i++) {
      if (markers[i].active && markers[i].mtype == pkt.marker_type &&
          markers[i].intensity > best_intensity) {
        best_intensity = markers[i].intensity;
        best_idx = i;
      }
    }
    if (best_idx >= 0) {
      stigmergy_packet_t resp;
      resp.type = 2;
      resp.node_id = my_id;
      resp.seq = seq++;
      resp.marker_id = markers[best_idx].id;
      resp.intensity = markers[best_idx].intensity;
      resp.marker_type = markers[best_idx].mtype;
      esp_now_send(mac, (uint8_t *)&resp, sizeof(resp));
    }
  }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  memset(markers, 0, sizeof(markers));

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

  Serial.printf("[STIGMERGY] Node %02X ready. DROP <type> <intensity>\n", my_id);
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd.startsWith("DROP")) {
      int t = 0; float inten = 1.0;
      sscanf(cmd.c_str() + 5, "%d %f", &t, &inten);
      uint16_t mid = depositMarker(t, inten);
      Serial.printf("[STIGMERGY] Marker %04X deposited (type=%d, i=%.2f)\n", mid, t, inten);
    }
  }

  static uint32_t last = 0;
  if (millis() - last >= 500) {
    last = millis();
    decayMarkers();
    int active = 0;
    float total_intensity = 0;
    for (int i = 0; i < marker_count; i++) {
      if (markers[i].active) { active++; total_intensity += markers[i].intensity; }
    }
    Serial.printf("{\"node\":\"%02X\",\"markers\":%d,\"total_i\":%.2f,\"t\":%lld}\n",
      my_id, active, total_intensity, esp_timer_get_time());
    digitalWrite(LED_PIN, active > 0);
  }
}
