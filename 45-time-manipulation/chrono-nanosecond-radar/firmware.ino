/*
 * Chrono Nanosecond Radar - ESP32 Firmware
 * Microsecond-precision radar using WiFi RTT for distance measurement
 * Uses ESP-NOW for multi-node synchronization
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>

#define LED_PIN 2
#define TRIGGER_PIN 4
#define ECHO_PIN 5
#define MAX_PEERS 6
#define SPEED_OF_LIGHT 299792458.0
#define NS_PER_METER 3.336

typedef struct {
  uint8_t type;       // 0=ping, 1=pong, 2=radar_data
  uint32_t seq;
  int64_t timestamp_us;
  float distance_m;
  int8_t rssi;
} radar_packet_t;

typedef struct {
  uint8_t mac[6];
  int64_t last_ping_us;
  int64_t rtt_us;
  float distance_m;
  int8_t rssi;
  bool active;
} peer_info_t;

peer_info_t peers[MAX_PEERS];
uint32_t seq_counter = 0;
int64_t boot_time_us;
volatile int64_t last_echo_us = 0;
hw_timer_t *precision_timer = NULL;

void IRAM_ATTR onEcho() {
  last_echo_us = esp_timer_get_time();
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(radar_packet_t)) return;
  radar_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));
  int64_t now = esp_timer_get_time();

  int idx = findPeer(mac);
  if (idx < 0) idx = addPeer(mac);
  if (idx < 0) return;

  if (pkt.type == 0) {
    radar_packet_t pong;
    pong.type = 1;
    pong.seq = pkt.seq;
    pong.timestamp_us = now;
    pong.distance_m = 0;
    pong.rssi = 0;
    esp_now_send(mac, (uint8_t *)&pong, sizeof(pong));
  } else if (pkt.type == 1) {
    peers[idx].rtt_us = now - peers[idx].last_ping_us;
    peers[idx].distance_m = (peers[idx].rtt_us * SPEED_OF_LIGHT) / (2.0 * 1e6);
    peers[idx].active = true;
  }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t status) {
  if (status != ESP_NOW_SEND_SUCCESS) {
    Serial.printf("[RADAR] Send failed to %02X:%02X\n", mac[4], mac[5]);
  }
}

int findPeer(const uint8_t *mac) {
  for (int i = 0; i < MAX_PEERS; i++) {
    if (peers[i].active && memcmp(peers[i].mac, mac, 6) == 0) return i;
  }
  return -1;
}

int addPeer(const uint8_t *mac) {
  for (int i = 0; i < MAX_PEERS; i++) {
    if (!peers[i].active) {
      memcpy(peers[i].mac, mac, 6);
      peers[i].active = true;
      esp_now_peer_info_t pi = {};
      memcpy(pi.peer_addr, mac, 6);
      pi.channel = 1;
      pi.encrypt = false;
      esp_now_add_peer(&pi);
      return i;
    }
  }
  return -1;
}

void sendPing(int idx) {
  radar_packet_t pkt;
  pkt.type = 0;
  pkt.seq = seq_counter++;
  pkt.timestamp_us = esp_timer_get_time();
  pkt.distance_m = 0;
  pkt.rssi = 0;
  peers[idx].last_ping_us = pkt.timestamp_us;
  esp_now_send(peers[idx].mac, (uint8_t *)&pkt, sizeof(pkt));
}

float measureUltrasonic() {
  digitalWrite(TRIGGER_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIGGER_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIGGER_PIN, LOW);
  int64_t start = esp_timer_get_time();
  last_echo_us = 0;
  while (last_echo_us == 0 && (esp_timer_get_time() - start) < 30000);
  if (last_echo_us == 0) return -1.0;
  return (last_echo_us - start) * 0.0343 / 2.0;
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  pinMode(TRIGGER_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  attachInterrupt(digitalPinToInterrupt(ECHO_PIN), onEcho, RISING);

  boot_time_us = esp_timer_get_time();
  memset(peers, 0, sizeof(peers));

  WiFi.mode(WIFI_STA);
  esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE);

  if (esp_now_init() != ESP_OK) {
    Serial.println("[RADAR] ESP-NOW init failed");
    return;
  }
  esp_now_register_recv_cb(onDataRecv);
  esp_now_register_send_cb(onDataSent);

  Serial.println("[RADAR] Nanosecond Radar initialized");
  Serial.printf("[RADAR] Timer resolution: %d us\n", 1);
}

void loop() {
  static uint32_t last_scan = 0;
  uint32_t now = millis();

  if (now - last_scan > 100) {
    last_scan = now;
    float us_dist = measureUltrasonic();
    int64_t ts = esp_timer_get_time() - boot_time_us;

    Serial.printf("{\"t\":%lld,\"us_cm\":%.2f,\"peers\":[", ts, us_dist);
    bool first = true;
    for (int i = 0; i < MAX_PEERS; i++) {
      if (!peers[i].active) continue;
      sendPing(i);
      if (!first) Serial.print(",");
      Serial.printf("{\"mac\":\"%02X%02X\",\"rtt_us\":%lld,\"dist_m\":%.4f}",
        peers[i].mac[4], peers[i].mac[5], peers[i].rtt_us, peers[i].distance_m);
      first = false;
    }
    Serial.println("]}");
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
  }
}
