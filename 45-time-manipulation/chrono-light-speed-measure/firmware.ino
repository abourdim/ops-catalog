/*
 * Chrono Light Speed Measure - ESP32 Firmware
 * Measures signal propagation speed using WiFi RTT between ESP-NOW nodes
 * Educational speed-of-light estimation tool
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>
#include <math.h>

#define LED_PIN 2
#define MAX_REFLECTORS 6
#define NUM_SAMPLES 200
#define C_ACTUAL 299792458.0

typedef struct {
  uint8_t type;       // 0=ping, 1=pong, 2=result
  uint8_t node_id;
  uint32_t seq;
  int64_t tx_time_us;
  float distance_m;
  float measured_c;
} lightspeed_packet_t;

typedef struct {
  uint8_t mac[6];
  uint8_t id;
  float known_distance_m;
  int64_t rtt_samples[NUM_SAMPLES];
  int sample_count;
  float avg_rtt_us;
  float min_rtt_us;
  float measured_c_ms;
  float error_pct;
  bool active;
} reflector_t;

reflector_t reflectors[MAX_REFLECTORS];
uint8_t my_id;
uint32_t seq = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};
bool measuring = false;
int measure_target = -1;

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(lightspeed_packet_t)) return;
  lightspeed_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));
  int64_t now = esp_timer_get_time();

  int idx = -1;
  for (int i = 0; i < MAX_REFLECTORS; i++) {
    if (reflectors[i].active && reflectors[i].id == pkt.node_id) { idx = i; break; }
  }
  if (idx < 0) {
    for (int i = 0; i < MAX_REFLECTORS; i++) {
      if (!reflectors[i].active) {
        memcpy(reflectors[i].mac, mac, 6);
        reflectors[i].id = pkt.node_id;
        reflectors[i].active = true;
        reflectors[i].sample_count = 0;
        reflectors[i].known_distance_m = 1.0;
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
    // Respond immediately as reflector
    lightspeed_packet_t pong;
    pong.type = 1;
    pong.node_id = my_id;
    pong.seq = pkt.seq;
    pong.tx_time_us = now;
    pong.distance_m = 0;
    pong.measured_c = 0;
    esp_now_send(mac, (uint8_t *)&pong, sizeof(pong));
  } else if (pkt.type == 1) {
    int64_t rtt = now - pkt.seq;  // seq holds the original tx timestamp hack
    if (idx == measure_target && reflectors[idx].sample_count < NUM_SAMPLES) {
      reflectors[idx].rtt_samples[reflectors[idx].sample_count++] = rtt;
    }
  }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void sendPing(int idx) {
  lightspeed_packet_t pkt;
  pkt.type = 0;
  pkt.node_id = my_id;
  pkt.seq = (uint32_t)esp_timer_get_time();  // Store tx time in seq
  pkt.tx_time_us = esp_timer_get_time();
  pkt.distance_m = 0;
  pkt.measured_c = 0;
  esp_now_send(reflectors[idx].mac, (uint8_t *)&pkt, sizeof(pkt));
}

void computeSpeed(int idx) {
  reflector_t *r = &reflectors[idx];
  if (r->sample_count < 10) return;

  // Find minimum RTT (closest to true propagation time)
  int64_t min_rtt = r->rtt_samples[0];
  int64_t sum = 0;
  for (int i = 0; i < r->sample_count; i++) {
    sum += r->rtt_samples[i];
    if (r->rtt_samples[i] < min_rtt) min_rtt = r->rtt_samples[i];
  }
  r->avg_rtt_us = (float)sum / r->sample_count;
  r->min_rtt_us = (float)min_rtt;

  // c = 2 * distance / min_rtt
  if (r->min_rtt_us > 0 && r->known_distance_m > 0) {
    r->measured_c_ms = (2.0 * r->known_distance_m) / (r->min_rtt_us / 1e6);
    r->error_pct = ((r->measured_c_ms - C_ACTUAL) / C_ACTUAL) * 100.0;
  }

  Serial.printf("[LIGHT] Node %02X: dist=%.1fm RTT_min=%.1fus RTT_avg=%.1fus c=%.0f m/s (err=%.2f%%)\n",
    r->id, r->known_distance_m, r->min_rtt_us, r->avg_rtt_us, r->measured_c_ms, r->error_pct);
}

void startMeasurement(int idx) {
  if (idx < 0 || idx >= MAX_REFLECTORS || !reflectors[idx].active) return;
  reflectors[idx].sample_count = 0;
  measure_target = idx;
  measuring = true;
  Serial.printf("[LIGHT] Measuring against node %02X (%.1fm)...\n",
    reflectors[idx].id, reflectors[idx].known_distance_m);
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  memset(reflectors, 0, sizeof(reflectors));

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

  Serial.printf("[LIGHT] Light Speed Measure %02X ready\n", my_id);
  Serial.println("[LIGHT] Commands: DIST <idx> <meters>, MEASURE <idx>, LIST");
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd.startsWith("DIST")) {
      int idx; float dist;
      sscanf(cmd.c_str() + 5, "%d %f", &idx, &dist);
      if (idx >= 0 && idx < MAX_REFLECTORS && reflectors[idx].active)
        reflectors[idx].known_distance_m = dist;
    } else if (cmd.startsWith("MEASURE")) {
      startMeasurement(cmd.substring(8).toInt());
    } else if (cmd == "LIST") {
      for (int i = 0; i < MAX_REFLECTORS; i++)
        if (reflectors[i].active)
          Serial.printf("  [%d] %02X dist=%.1fm\n", i, reflectors[i].id, reflectors[i].known_distance_m);
    }
  }

  if (measuring && measure_target >= 0) {
    sendPing(measure_target);
    if (reflectors[measure_target].sample_count >= NUM_SAMPLES) {
      measuring = false;
      computeSpeed(measure_target);
    }
  }

  static uint32_t last = 0;
  if (millis() - last >= 1000) {
    last = millis();
    Serial.printf("{\"node\":\"%02X\",\"measuring\":%s,\"samples\":%d}\n",
      my_id, measuring ? "true" : "false",
      measure_target >= 0 ? reflectors[measure_target].sample_count : 0);
    digitalWrite(LED_PIN, measuring);
  }
}
