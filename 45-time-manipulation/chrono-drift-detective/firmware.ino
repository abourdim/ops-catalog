/*
 * Chrono Drift Detective - ESP32 Firmware
 * Detects and analyzes clock drift between distributed nodes
 * Uses ESP-NOW for continuous drift measurement
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>

#define LED_PIN 2
#define MAX_SUSPECTS 8
#define DRIFT_HISTORY 64

typedef struct {
  uint8_t type;       // 0=heartbeat, 1=drift_query, 2=drift_report
  uint8_t node_id;
  uint32_t seq;
  int64_t local_us;
  float drift_ppm;
  float temp_c;
} drift_packet_t;

typedef struct {
  uint8_t mac[6];
  uint8_t id;
  int64_t offsets[DRIFT_HISTORY];
  int64_t timestamps[DRIFT_HISTORY];
  int history_idx;
  int history_count;
  float drift_ppm;
  float drift_trend;
  float temp_correlation;
  bool active;
  bool anomaly;
} suspect_t;

suspect_t suspects[MAX_SUSPECTS];
uint8_t my_id;
uint32_t seq = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};
float anomaly_threshold_ppm = 5.0;

float readTemp() {
  extern float temperatureRead();
  return temperatureRead();
}

float linearRegression(int64_t *x, int64_t *y, int n, float *slope) {
  if (n < 2) { *slope = 0; return 0; }
  double sx = 0, sy = 0, sxy = 0, sx2 = 0;
  for (int i = 0; i < n; i++) {
    double xi = (double)(x[i] - x[0]) / 1e6;
    double yi = (double)(y[i]) / 1e6;
    sx += xi; sy += yi; sxy += xi * yi; sx2 += xi * xi;
  }
  double denom = n * sx2 - sx * sx;
  if (denom == 0) { *slope = 0; return 0; }
  *slope = (float)((n * sxy - sx * sy) / denom) * 1e6;  // ppm
  float intercept = (float)((sy - (*slope / 1e6) * sx) / n);
  // R-squared
  double ss_res = 0, ss_tot = 0;
  double y_mean = sy / n;
  for (int i = 0; i < n; i++) {
    double xi = (double)(x[i] - x[0]) / 1e6;
    double yi = (double)(y[i]) / 1e6;
    double pred = intercept + (*slope / 1e6) * xi;
    ss_res += (yi - pred) * (yi - pred);
    ss_tot += (yi - y_mean) * (yi - y_mean);
  }
  return ss_tot > 0 ? (float)(1.0 - ss_res / ss_tot) : 0;
}

void analyzeSuspect(int idx) {
  suspect_t *s = &suspects[idx];
  int n = min(s->history_count, DRIFT_HISTORY);
  if (n < 3) return;

  float r2 = linearRegression(s->timestamps, s->offsets, n, &s->drift_ppm);
  s->anomaly = fabs(s->drift_ppm) > anomaly_threshold_ppm;

  // Compute trend (second derivative)
  if (n >= 6) {
    float slope1, slope2;
    linearRegression(s->timestamps, s->offsets, n/2, &slope1);
    linearRegression(s->timestamps + n/2, s->offsets + n/2, n - n/2, &slope2);
    s->drift_trend = slope2 - slope1;
  }
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(drift_packet_t)) return;
  drift_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));
  int64_t now = esp_timer_get_time();

  int idx = -1;
  for (int i = 0; i < MAX_SUSPECTS; i++) {
    if (suspects[i].active && suspects[i].id == pkt.node_id) { idx = i; break; }
  }
  if (idx < 0) {
    for (int i = 0; i < MAX_SUSPECTS; i++) {
      if (!suspects[i].active) {
        memcpy(suspects[i].mac, mac, 6);
        suspects[i].id = pkt.node_id;
        suspects[i].active = true;
        suspects[i].history_idx = 0;
        suspects[i].history_count = 0;
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

  int hi = suspects[idx].history_idx % DRIFT_HISTORY;
  suspects[idx].offsets[hi] = pkt.local_us - now;
  suspects[idx].timestamps[hi] = now;
  suspects[idx].history_idx++;
  suspects[idx].history_count++;
  analyzeSuspect(idx);
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void sendHeartbeat() {
  drift_packet_t pkt;
  pkt.type = 0;
  pkt.node_id = my_id;
  pkt.seq = seq++;
  pkt.local_us = esp_timer_get_time();
  pkt.drift_ppm = 0;
  pkt.temp_c = readTemp();
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  memset(suspects, 0, sizeof(suspects));

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

  Serial.printf("[DRIFT] Drift Detective %02X ready\n", my_id);
}

void loop() {
  static uint32_t last = 0;
  if (millis() - last < 250) return;
  last = millis();

  sendHeartbeat();

  Serial.printf("{\"detective\":\"%02X\",\"t\":%lld,\"temp\":%.1f,\"suspects\":[",
    my_id, esp_timer_get_time(), readTemp());
  bool first = true;
  for (int i = 0; i < MAX_SUSPECTS; i++) {
    if (!suspects[i].active) continue;
    if (!first) Serial.print(",");
    Serial.printf("{\"id\":\"%02X\",\"drift_ppm\":%.4f,\"trend\":%.4f,\"anomaly\":%s,\"n\":%d}",
      suspects[i].id, suspects[i].drift_ppm, suspects[i].drift_trend,
      suspects[i].anomaly ? "true" : "false",
      min(suspects[i].history_count, DRIFT_HISTORY));
    first = false;
  }
  Serial.println("]}");

  bool any_anomaly = false;
  for (int i = 0; i < MAX_SUSPECTS; i++)
    if (suspects[i].active && suspects[i].anomaly) any_anomaly = true;
  digitalWrite(LED_PIN, any_anomaly);
}
