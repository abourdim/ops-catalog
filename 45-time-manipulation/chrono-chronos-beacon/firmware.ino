/*
 * Chrono Chronos Beacon - ESP32 Firmware
 * Precision time beacon broadcasting GPS-disciplined timestamps
 * Master clock for mesh network time synchronization via ESP-NOW
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>

#define LED_PIN 2
#define BEACON_INTERVAL_MS 100
#define MAX_CLIENTS 10
#define STRATUM 1

typedef struct {
  uint8_t type;        // 0=beacon, 1=sync_req, 2=sync_resp, 3=status
  uint8_t stratum;
  uint8_t beacon_id;
  uint32_t seq;
  int64_t utc_us;
  int64_t local_us;
  float accuracy_ns;
  uint8_t gps_lock;
  uint8_t leap_indicator;
} beacon_packet_t;

typedef struct {
  uint8_t mac[6];
  uint8_t id;
  int64_t last_request_us;
  int64_t offset_us;
  uint32_t sync_count;
  bool active;
} client_t;

client_t clients[MAX_CLIENTS];
uint8_t my_id;
uint32_t seq = 0;
int64_t utc_offset_us = 0;
bool gps_locked = false;
float clock_accuracy_ns = 1000000.0;  // Start at 1ms
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(beacon_packet_t)) return;
  beacon_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));
  int64_t now = esp_timer_get_time();

  if (pkt.type == 1) {
    // Sync request - respond with precise timestamp
    int idx = -1;
    for (int i = 0; i < MAX_CLIENTS; i++) {
      if (clients[i].active && memcmp(clients[i].mac, mac, 6) == 0) { idx = i; break; }
    }
    if (idx < 0) {
      for (int i = 0; i < MAX_CLIENTS; i++) {
        if (!clients[i].active) {
          memcpy(clients[i].mac, mac, 6);
          clients[i].id = pkt.beacon_id;
          clients[i].active = true;
          clients[i].sync_count = 0;
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

    clients[idx].last_request_us = now;
    clients[idx].sync_count++;

    beacon_packet_t resp;
    resp.type = 2;
    resp.stratum = STRATUM;
    resp.beacon_id = my_id;
    resp.seq = seq++;
    resp.utc_us = now + utc_offset_us;
    resp.local_us = now;
    resp.accuracy_ns = clock_accuracy_ns;
    resp.gps_lock = gps_locked ? 1 : 0;
    resp.leap_indicator = 0;
    esp_now_send(mac, (uint8_t *)&resp, sizeof(resp));
  }
  else if (pkt.type == 0 && pkt.stratum < STRATUM) {
    // Accept time from higher-stratum beacon
    int64_t rtt_est = 500;  // Estimate 500us one-way delay
    utc_offset_us = pkt.utc_us - now + rtt_est;
    clock_accuracy_ns = pkt.accuracy_ns + 1000;
    gps_locked = pkt.gps_lock;
  }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void broadcastBeacon() {
  int64_t now = esp_timer_get_time();
  beacon_packet_t pkt;
  pkt.type = 0;
  pkt.stratum = STRATUM;
  pkt.beacon_id = my_id;
  pkt.seq = seq++;
  pkt.utc_us = now + utc_offset_us;
  pkt.local_us = now;
  pkt.accuracy_ns = clock_accuracy_ns;
  pkt.gps_lock = gps_locked ? 1 : 0;
  pkt.leap_indicator = 0;
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  memset(clients, 0, sizeof(clients));

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

  Serial.printf("[BEACON] Chronos Beacon %02X ready (stratum %d)\n", my_id, STRATUM);
}

void loop() {
  // Accept UTC offset from Pi via serial
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd.startsWith("UTC:")) {
      utc_offset_us = cmd.substring(4).toInt();
      gps_locked = true;
      clock_accuracy_ns = 100.0;
    } else if (cmd.startsWith("ACC:")) {
      clock_accuracy_ns = cmd.substring(4).toFloat();
    }
  }

  static uint32_t last_beacon = 0;
  if (millis() - last_beacon >= BEACON_INTERVAL_MS) {
    last_beacon = millis();
    broadcastBeacon();
    digitalWrite(LED_PIN, gps_locked);
  }

  static uint32_t last_status = 0;
  if (millis() - last_status >= 1000) {
    last_status = millis();
    int active_clients = 0;
    for (int i = 0; i < MAX_CLIENTS; i++)
      if (clients[i].active) active_clients++;

    Serial.printf("{\"beacon\":\"%02X\",\"stratum\":%d,\"gps\":%s,\"acc_ns\":%.1f,\"clients\":%d,\"seq\":%u,\"t\":%lld}\n",
      my_id, STRATUM, gps_locked ? "true" : "false",
      clock_accuracy_ns, active_clients, seq, esp_timer_get_time());
  }
}
