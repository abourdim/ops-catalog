/*
 * Chrono Jitter Fingerprint - ESP32 Firmware
 * Fingerprints devices by their unique clock jitter patterns
 * Uses microsecond timing analysis via ESP-NOW
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>

#define LED_PIN 2
#define MAX_DEVICES 10
#define JITTER_SAMPLES 128
#define FINGERPRINT_SIZE 16

typedef struct {
  uint8_t type;       // 0=probe, 1=response, 2=fingerprint
  uint8_t device_id;
  uint32_t seq;
  int64_t timestamp_us;
  uint8_t fingerprint[FINGERPRINT_SIZE];
} jitter_packet_t;

typedef struct {
  uint8_t mac[6];
  int64_t inter_arrival[JITTER_SAMPLES];
  int sample_count;
  uint8_t fingerprint[FINGERPRINT_SIZE];
  float mean_jitter_us;
  float std_jitter_us;
  float skewness;
  int64_t last_arrival;
  bool active;
  bool fp_ready;
} device_profile_t;

device_profile_t devices[MAX_DEVICES];
uint8_t my_id;
uint32_t seq = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

int findDevice(const uint8_t *mac) {
  for (int i = 0; i < MAX_DEVICES; i++)
    if (devices[i].active && memcmp(devices[i].mac, mac, 6) == 0) return i;
  return -1;
}

int addDevice(const uint8_t *mac) {
  for (int i = 0; i < MAX_DEVICES; i++) {
    if (!devices[i].active) {
      memcpy(devices[i].mac, mac, 6);
      devices[i].active = true;
      devices[i].sample_count = 0;
      devices[i].fp_ready = false;
      devices[i].last_arrival = 0;
      esp_now_peer_info_t pi = {};
      memcpy(pi.peer_addr, mac, 6);
      pi.channel = 1;
      esp_now_add_peer(&pi);
      return i;
    }
  }
  return -1;
}

void computeFingerprint(int idx) {
  device_profile_t *d = &devices[idx];
  if (d->sample_count < 32) return;

  int n = min(d->sample_count, JITTER_SAMPLES);
  double sum = 0, sum2 = 0, sum3 = 0;
  for (int i = 0; i < n; i++) {
    double v = (double)d->inter_arrival[i];
    sum += v;
    sum2 += v * v;
    sum3 += v * v * v;
  }
  d->mean_jitter_us = sum / n;
  double variance = (sum2 / n) - (d->mean_jitter_us * d->mean_jitter_us);
  d->std_jitter_us = sqrt(variance > 0 ? variance : 0);
  if (d->std_jitter_us > 0) {
    d->skewness = ((sum3 / n) - 3 * d->mean_jitter_us * variance -
                   d->mean_jitter_us * d->mean_jitter_us * d->mean_jitter_us) /
                  (d->std_jitter_us * d->std_jitter_us * d->std_jitter_us);
  }

  // Generate 16-byte fingerprint from statistical moments
  uint8_t *fp = d->fingerprint;
  uint32_t mean_i = *(uint32_t *)&d->mean_jitter_us;
  uint32_t std_i = *(uint32_t *)&d->std_jitter_us;
  uint32_t skew_i = *(uint32_t *)&d->skewness;
  memcpy(fp, &mean_i, 4);
  memcpy(fp + 4, &std_i, 4);
  memcpy(fp + 8, &skew_i, 4);
  // Histogram bin signature
  int bins[4] = {0};
  for (int i = 0; i < n; i++) {
    int b = constrain((int)((d->inter_arrival[i] - d->mean_jitter_us + 2*d->std_jitter_us) /
            (d->std_jitter_us + 0.001)), 0, 3);
    bins[b]++;
  }
  for (int i = 0; i < 4; i++) fp[12 + i] = (uint8_t)(bins[i] * 255 / n);
  d->fp_ready = true;
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(jitter_packet_t)) return;
  jitter_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));
  int64_t now = esp_timer_get_time();

  int idx = findDevice(mac);
  if (idx < 0) idx = addDevice(mac);
  if (idx < 0) return;

  device_profile_t *d = &devices[idx];
  if (d->last_arrival > 0) {
    int si = d->sample_count % JITTER_SAMPLES;
    d->inter_arrival[si] = now - d->last_arrival;
    d->sample_count++;
    if (d->sample_count % 32 == 0) computeFingerprint(idx);
  }
  d->last_arrival = now;
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void sendProbe() {
  jitter_packet_t pkt;
  pkt.type = 0;
  pkt.device_id = my_id;
  pkt.seq = seq++;
  pkt.timestamp_us = esp_timer_get_time();
  memset(pkt.fingerprint, 0, FINGERPRINT_SIZE);
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  memset(devices, 0, sizeof(devices));

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

  Serial.printf("[JITTER-FP] Node %02X ready\n", my_id);
}

void loop() {
  static uint32_t last = 0;
  if (millis() - last < 200) return;
  last = millis();

  sendProbe();

  Serial.printf("{\"node\":\"%02X\",\"t\":%lld,\"devices\":[", my_id, esp_timer_get_time());
  bool first = true;
  for (int i = 0; i < MAX_DEVICES; i++) {
    if (!devices[i].active) continue;
    if (!first) Serial.print(",");
    Serial.printf("{\"mac\":\"%02X%02X\",\"samples\":%d,\"mean\":%.2f,\"std\":%.2f,\"skew\":%.3f,\"fp\":\"",
      devices[i].mac[4], devices[i].mac[5], devices[i].sample_count,
      devices[i].mean_jitter_us, devices[i].std_jitter_us, devices[i].skewness);
    if (devices[i].fp_ready) {
      for (int j = 0; j < FINGERPRINT_SIZE; j++) Serial.printf("%02x", devices[i].fingerprint[j]);
    }
    Serial.print("\"}");
    first = false;
  }
  Serial.println("]}");
  digitalWrite(LED_PIN, !digitalRead(LED_PIN));
}
