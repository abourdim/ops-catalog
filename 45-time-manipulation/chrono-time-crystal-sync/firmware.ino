/*
 * Chrono Time Crystal Sync - ESP32 Firmware
 * Crystal oscillator synchronization network via ESP-NOW
 * Measures and compensates crystal drift between nodes
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>

#define LED_PIN 2
#define MAX_NODES 8
#define SYNC_INTERVAL_MS 500
#define CRYSTAL_FREQ_HZ 40000000

typedef struct {
  uint8_t type;        // 0=sync_req, 1=sync_resp, 2=drift_report
  uint8_t node_id;
  uint32_t seq;
  int64_t local_time_us;
  int64_t ref_time_us;
  float drift_ppm;
  float temperature;
} sync_packet_t;

typedef struct {
  uint8_t mac[6];
  uint8_t node_id;
  int64_t offset_us;
  float drift_ppm;
  float drift_rate;
  int64_t last_sync_us;
  uint32_t sync_count;
  bool active;
} crystal_node_t;

crystal_node_t nodes[MAX_NODES];
uint8_t my_node_id;
uint32_t seq = 0;
int64_t master_offset_us = 0;
float my_drift_ppm = 0.0;
float drift_history[64];
int drift_idx = 0;

float readTemperature() {
  extern float temperatureRead();
  return temperatureRead();
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(sync_packet_t)) return;
  sync_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));
  int64_t rx_time = esp_timer_get_time();

  int idx = -1;
  for (int i = 0; i < MAX_NODES; i++) {
    if (nodes[i].active && memcmp(nodes[i].mac, mac, 6) == 0) { idx = i; break; }
  }
  if (idx < 0) {
    for (int i = 0; i < MAX_NODES; i++) {
      if (!nodes[i].active) {
        memcpy(nodes[i].mac, mac, 6);
        nodes[i].node_id = pkt.node_id;
        nodes[i].active = true;
        nodes[i].sync_count = 0;
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

  if (pkt.type == 0) {
    sync_packet_t resp;
    resp.type = 1;
    resp.node_id = my_node_id;
    resp.seq = pkt.seq;
    resp.local_time_us = rx_time;
    resp.ref_time_us = pkt.local_time_us;
    resp.drift_ppm = my_drift_ppm;
    resp.temperature = readTemperature();
    esp_now_send(mac, (uint8_t *)&resp, sizeof(resp));
  } else if (pkt.type == 1) {
    int64_t rtt = rx_time - pkt.ref_time_us;
    int64_t remote_time = pkt.local_time_us + rtt / 2;
    int64_t new_offset = remote_time - rx_time;

    if (nodes[idx].sync_count > 0) {
      int64_t dt = rx_time - nodes[idx].last_sync_us;
      if (dt > 0) {
        float offset_change = (float)(new_offset - nodes[idx].offset_us);
        nodes[idx].drift_ppm = (offset_change / (float)dt) * 1e6;
        nodes[idx].drift_rate = nodes[idx].drift_ppm / (dt / 1e6);
      }
    }
    nodes[idx].offset_us = new_offset;
    nodes[idx].last_sync_us = rx_time;
    nodes[idx].sync_count++;
  }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t status) {}

void sendSyncRequest() {
  sync_packet_t pkt;
  pkt.type = 0;
  pkt.node_id = my_node_id;
  pkt.seq = seq++;
  pkt.local_time_us = esp_timer_get_time();
  pkt.drift_ppm = my_drift_ppm;
  pkt.temperature = readTemperature();

  for (int i = 0; i < MAX_NODES; i++) {
    if (nodes[i].active) {
      pkt.ref_time_us = 0;
      esp_now_send(nodes[i].mac, (uint8_t *)&pkt, sizeof(pkt));
    }
  }
}

void computeMyDrift() {
  float sum = 0;
  int count = 0;
  for (int i = 0; i < MAX_NODES; i++) {
    if (nodes[i].active && nodes[i].sync_count > 2) {
      sum += nodes[i].drift_ppm;
      count++;
    }
  }
  if (count > 0) {
    my_drift_ppm = sum / count;
    drift_history[drift_idx++ & 63] = my_drift_ppm;
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  memset(nodes, 0, sizeof(nodes));

  uint8_t mac[6];
  WiFi.mode(WIFI_STA);
  esp_wifi_get_mac(WIFI_IF_STA, mac);
  my_node_id = mac[5];
  esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE);

  esp_now_init();
  esp_now_register_recv_cb(onDataRecv);
  esp_now_register_send_cb(onDataSent);

  Serial.printf("[CRYSTAL] Node %02X initialized at %u Hz\n", my_node_id, CRYSTAL_FREQ_HZ);
}

void loop() {
  static uint32_t last_sync = 0;
  uint32_t now = millis();

  if (now - last_sync >= SYNC_INTERVAL_MS) {
    last_sync = now;
    sendSyncRequest();
    computeMyDrift();

    Serial.printf("{\"node\":\"%02X\",\"t_us\":%lld,\"drift_ppm\":%.4f,\"temp\":%.1f,\"peers\":[",
      my_node_id, esp_timer_get_time(), my_drift_ppm, readTemperature());
    bool first = true;
    for (int i = 0; i < MAX_NODES; i++) {
      if (!nodes[i].active) continue;
      if (!first) Serial.print(",");
      Serial.printf("{\"id\":\"%02X\",\"off_us\":%lld,\"drift\":%.4f,\"syncs\":%u}",
        nodes[i].node_id, nodes[i].offset_us, nodes[i].drift_ppm, nodes[i].sync_count);
      first = false;
    }
    Serial.println("]}");
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
  }
}
