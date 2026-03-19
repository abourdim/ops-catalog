/*
 * Swarm Hive Mind Sensor - ESP32 Firmware
 * Distributed sensor fusion with swarm consensus on readings
 * ESP-NOW mesh aggregates and validates sensor data collectively
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>
#include <math.h>

#define LED_PIN 2
#define SENSOR_PIN 34
#define MAX_NODES 10
#define HISTORY_SIZE 32

typedef struct {
  uint8_t type;       // 0=reading, 1=consensus, 2=anomaly
  uint8_t node_id;
  uint32_t seq;
  float value;
  float confidence;
  float consensus_val;
  uint8_t sensor_type;
} sensor_packet_t;

typedef struct {
  uint8_t mac[6];
  uint8_t id;
  float readings[HISTORY_SIZE];
  int read_idx;
  int read_count;
  float mean;
  float stddev;
  float confidence;
  bool active;
  bool anomalous;
} hive_node_t;

hive_node_t nodes[MAX_NODES];
float my_readings[HISTORY_SIZE];
int my_read_idx = 0;
int my_read_count = 0;
float consensus_value = 0;
float consensus_confidence = 0;
uint8_t my_id;
uint32_t seq = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

float calcMean(float *arr, int count) {
  if (count == 0) return 0;
  float s = 0;
  for (int i = 0; i < count; i++) s += arr[i];
  return s / count;
}

float calcStdDev(float *arr, int count, float mean) {
  if (count < 2) return 0;
  float s = 0;
  for (int i = 0; i < count; i++) s += (arr[i] - mean) * (arr[i] - mean);
  return sqrt(s / (count - 1));
}

void computeConsensus() {
  float weighted_sum = 0, weight_total = 0;
  int active = 0;

  // Include own readings
  float my_mean = calcMean(my_readings, min(my_read_count, HISTORY_SIZE));
  float my_std = calcStdDev(my_readings, min(my_read_count, HISTORY_SIZE), my_mean);
  float my_conf = 1.0 / (my_std + 0.001);
  weighted_sum += my_mean * my_conf;
  weight_total += my_conf;

  for (int i = 0; i < MAX_NODES; i++) {
    if (!nodes[i].active) continue;
    int n = min(nodes[i].read_count, HISTORY_SIZE);
    if (n < 3) continue;
    nodes[i].mean = calcMean(nodes[i].readings, n);
    nodes[i].stddev = calcStdDev(nodes[i].readings, n, nodes[i].mean);
    nodes[i].confidence = 1.0 / (nodes[i].stddev + 0.001);
    nodes[i].anomalous = fabs(nodes[i].mean - consensus_value) > 3 * (my_std + 0.001);

    if (!nodes[i].anomalous) {
      weighted_sum += nodes[i].mean * nodes[i].confidence;
      weight_total += nodes[i].confidence;
    }
    active++;
  }

  if (weight_total > 0) {
    consensus_value = weighted_sum / weight_total;
    consensus_confidence = weight_total / (active + 1);
  }
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(sensor_packet_t)) return;
  sensor_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));

  int idx = -1;
  for (int i = 0; i < MAX_NODES; i++)
    if (nodes[i].active && nodes[i].id == pkt.node_id) { idx = i; break; }
  if (idx < 0) {
    for (int i = 0; i < MAX_NODES; i++) {
      if (!nodes[i].active) {
        memcpy(nodes[i].mac, mac, 6);
        nodes[i].id = pkt.node_id;
        nodes[i].active = true;
        nodes[i].read_idx = 0; nodes[i].read_count = 0;
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

  nodes[idx].readings[nodes[idx].read_idx % HISTORY_SIZE] = pkt.value;
  nodes[idx].read_idx++;
  nodes[idx].read_count++;
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

float readSensor() {
  return analogRead(SENSOR_PIN) * 3.3 / 4095.0;
}

void broadcastReading(float val) {
  sensor_packet_t pkt;
  pkt.type = 0;
  pkt.node_id = my_id;
  pkt.seq = seq++;
  pkt.value = val;
  pkt.confidence = consensus_confidence;
  pkt.consensus_val = consensus_value;
  pkt.sensor_type = 0;
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  pinMode(SENSOR_PIN, INPUT);
  memset(nodes, 0, sizeof(nodes));

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

  Serial.printf("[HIVE] Sensor node %02X ready\n", my_id);
}

void loop() {
  static uint32_t last = 0;
  if (millis() - last < 200) return;
  last = millis();

  float val = readSensor();
  my_readings[my_read_idx % HISTORY_SIZE] = val;
  my_read_idx++;
  my_read_count++;
  broadcastReading(val);
  computeConsensus();

  static int report = 0;
  if (++report >= 5) {
    report = 0;
    int n = 0, anomalies = 0;
    for (int i = 0; i < MAX_NODES; i++) {
      if (nodes[i].active) { n++; if (nodes[i].anomalous) anomalies++; }
    }
    Serial.printf("{\"hive\":\"%02X\",\"val\":%.3f,\"consensus\":%.3f,\"conf\":%.2f,\"nodes\":%d,\"anom\":%d}\n",
      my_id, val, consensus_value, consensus_confidence, n, anomalies);
    digitalWrite(LED_PIN, anomalies > 0);
  }
}
