/*
 * Chrono Temporal Triangulation - ESP32 Firmware
 * Position estimation using time-difference-of-arrival (TDoA)
 * ESP-NOW multi-node triangulation system
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>
#include <math.h>

#define LED_PIN 2
#define MAX_ANCHORS 6
#define SPEED_OF_LIGHT 299792458.0

typedef struct {
  uint8_t type;       // 0=beacon, 1=tdoa_report, 2=position
  uint8_t node_id;
  uint32_t seq;
  int64_t tx_time_us;
  float pos_x, pos_y, pos_z;
  uint8_t is_anchor;
} triangulation_packet_t;

typedef struct {
  uint8_t mac[6];
  uint8_t id;
  float x, y, z;
  int64_t last_beacon_rx_us;
  int64_t last_beacon_tx_us;
  float tdoa_us;
  bool active;
  bool is_anchor;
} anchor_t;

anchor_t anchors[MAX_ANCHORS];
uint8_t my_id;
uint32_t seq = 0;
bool i_am_anchor = false;
float my_x = 0, my_y = 0, my_z = 0;
float est_x = 0, est_y = 0, est_z = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(triangulation_packet_t)) return;
  triangulation_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));
  int64_t rx_time = esp_timer_get_time();

  int idx = -1;
  for (int i = 0; i < MAX_ANCHORS; i++) {
    if (anchors[i].active && anchors[i].id == pkt.node_id) { idx = i; break; }
  }
  if (idx < 0) {
    for (int i = 0; i < MAX_ANCHORS; i++) {
      if (!anchors[i].active) {
        memcpy(anchors[i].mac, mac, 6);
        anchors[i].id = pkt.node_id;
        anchors[i].active = true;
        anchors[i].is_anchor = pkt.is_anchor;
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

  anchors[idx].x = pkt.pos_x;
  anchors[idx].y = pkt.pos_y;
  anchors[idx].z = pkt.pos_z;
  anchors[idx].last_beacon_rx_us = rx_time;
  anchors[idx].last_beacon_tx_us = pkt.tx_time_us;
  anchors[idx].is_anchor = pkt.is_anchor;

  if (pkt.type == 0 && pkt.is_anchor) {
    // Calculate TDoA relative to first anchor
    if (anchors[0].active && idx > 0) {
      anchors[idx].tdoa_us = (float)(anchors[idx].last_beacon_rx_us - anchors[0].last_beacon_rx_us);
    }
  }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void sendBeacon() {
  triangulation_packet_t pkt;
  pkt.type = 0;
  pkt.node_id = my_id;
  pkt.seq = seq++;
  pkt.tx_time_us = esp_timer_get_time();
  pkt.pos_x = my_x;
  pkt.pos_y = my_y;
  pkt.pos_z = my_z;
  pkt.is_anchor = i_am_anchor ? 1 : 0;
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));
}

void estimatePosition() {
  // Simple TDoA-based position estimation using least squares
  int n_anchors = 0;
  float ax[MAX_ANCHORS], ay[MAX_ANCHORS], az[MAX_ANCHORS], td[MAX_ANCHORS];

  for (int i = 0; i < MAX_ANCHORS; i++) {
    if (anchors[i].active && anchors[i].is_anchor) {
      ax[n_anchors] = anchors[i].x;
      ay[n_anchors] = anchors[i].y;
      az[n_anchors] = anchors[i].z;
      td[n_anchors] = anchors[i].tdoa_us;
      n_anchors++;
    }
  }

  if (n_anchors < 3) return;

  // Iterative gradient descent for position
  float px = est_x, py = est_y, pz = est_z;
  float lr = 0.01;

  for (int iter = 0; iter < 50; iter++) {
    float gx = 0, gy = 0, gz = 0;
    for (int i = 1; i < n_anchors; i++) {
      float d0 = sqrt((px-ax[0])*(px-ax[0]) + (py-ay[0])*(py-ay[0]) + (pz-az[0])*(pz-az[0]));
      float di = sqrt((px-ax[i])*(px-ax[i]) + (py-ay[i])*(py-ay[i]) + (pz-az[i])*(pz-az[i]));
      float expected_tdoa = (di - d0) / (SPEED_OF_LIGHT / 1e6);
      float err = td[i] - expected_tdoa;
      float dd0x = (px-ax[0]) / (d0 + 0.001);
      float ddix = (px-ax[i]) / (di + 0.001);
      gx += err * (ddix - dd0x);
      gy += err * ((py-ay[i])/(di+0.001) - (py-ay[0])/(d0+0.001));
      gz += err * ((pz-az[i])/(di+0.001) - (pz-az[0])/(d0+0.001));
    }
    px += lr * gx;
    py += lr * gy;
    pz += lr * gz;
  }
  est_x = px;
  est_y = py;
  est_z = pz;
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  memset(anchors, 0, sizeof(anchors));

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

  Serial.printf("[TRIANG] Node %02X ready. SET_POS x y z / ANCHOR\n", my_id);
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd.startsWith("SET_POS")) {
      sscanf(cmd.c_str() + 8, "%f %f %f", &my_x, &my_y, &my_z);
      Serial.printf("[TRIANG] Position: (%.2f, %.2f, %.2f)\n", my_x, my_y, my_z);
    } else if (cmd == "ANCHOR") {
      i_am_anchor = !i_am_anchor;
      Serial.printf("[TRIANG] Anchor mode: %s\n", i_am_anchor ? "ON" : "OFF");
    }
  }

  static uint32_t last = 0;
  if (millis() - last < 250) return;
  last = millis();

  sendBeacon();
  if (!i_am_anchor) estimatePosition();

  Serial.printf("{\"node\":\"%02X\",\"anchor\":%s,\"pos\":[%.2f,%.2f,%.2f],\"est\":[%.2f,%.2f,%.2f],\"anchors\":[",
    my_id, i_am_anchor ? "true" : "false", my_x, my_y, my_z, est_x, est_y, est_z);
  bool first = true;
  for (int i = 0; i < MAX_ANCHORS; i++) {
    if (!anchors[i].active) continue;
    if (!first) Serial.print(",");
    Serial.printf("{\"id\":\"%02X\",\"pos\":[%.1f,%.1f,%.1f],\"tdoa\":%.2f}",
      anchors[i].id, anchors[i].x, anchors[i].y, anchors[i].z, anchors[i].tdoa_us);
    first = false;
  }
  Serial.println("]}");
  digitalWrite(LED_PIN, !digitalRead(LED_PIN));
}
