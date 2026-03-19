/*
 * Chrono Packet Time Machine - ESP32 Firmware
 * Captures, timestamps, and replays network packets with precise timing
 * Circular buffer with microsecond-accurate packet replay
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>

#define LED_PIN 2
#define MAX_PACKETS 256
#define PKT_DATA_LEN 24

typedef struct {
  int64_t capture_us;
  uint8_t src[6];
  uint8_t data[PKT_DATA_LEN];
  uint8_t len;
  int8_t rssi;
} captured_packet_t;

typedef struct {
  uint8_t type;       // 0=data, 1=replay, 2=control
  uint8_t node_id;
  uint32_t seq;
  int64_t orig_time_us;
  uint8_t payload[PKT_DATA_LEN];
} tm_packet_t;

captured_packet_t buffer[MAX_PACKETS];
int buf_head = 0;
int buf_count = 0;
bool capturing = true;
bool replaying = false;
int replay_pos = 0;
int64_t replay_origin = 0;
int64_t capture_origin = 0;
float replay_speed = 1.0;
uint8_t my_id;
uint32_t seq = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

void capturePacket(const uint8_t *mac, const uint8_t *data, int len) {
  if (!capturing || buf_count >= MAX_PACKETS) return;
  captured_packet_t *p = &buffer[buf_head];
  p->capture_us = esp_timer_get_time() - capture_origin;
  memcpy(p->src, mac, 6);
  int cplen = min(len, PKT_DATA_LEN);
  memcpy(p->data, data, cplen);
  p->len = cplen;
  p->rssi = 0;
  buf_head = (buf_head + 1) % MAX_PACKETS;
  if (buf_count < MAX_PACKETS) buf_count++;
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len == sizeof(tm_packet_t)) {
    tm_packet_t pkt;
    memcpy(&pkt, data, sizeof(pkt));
    if (pkt.type == 2) return;  // Control packets not captured
  }
  capturePacket(mac, data, len);
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void startCapture() {
  buf_head = 0;
  buf_count = 0;
  capture_origin = esp_timer_get_time();
  capturing = true;
  replaying = false;
  Serial.println("[TM] Capture started");
}

void stopCapture() {
  capturing = false;
  Serial.printf("[TM] Captured %d packets over %lld us\n",
    buf_count, buf_count > 0 ? buffer[(buf_head - 1 + MAX_PACKETS) % MAX_PACKETS].capture_us : 0);
}

void startReplay(float speed) {
  if (buf_count == 0) { Serial.println("[TM] Buffer empty"); return; }
  replay_speed = speed;
  replay_pos = 0;
  replay_origin = esp_timer_get_time();
  replaying = true;
  capturing = false;
  Serial.printf("[TM] Replaying %d packets at %.1fx speed\n", buf_count, speed);
}

void replayTick() {
  if (!replaying || replay_pos >= buf_count) {
    if (replaying) {
      replaying = false;
      Serial.println("[TM] Replay complete");
    }
    return;
  }

  int64_t elapsed = (int64_t)((esp_timer_get_time() - replay_origin) * replay_speed);
  int start = (buf_head - buf_count + MAX_PACKETS) % MAX_PACKETS;

  while (replay_pos < buf_count) {
    int idx = (start + replay_pos) % MAX_PACKETS;
    if (buffer[idx].capture_us > elapsed) break;

    tm_packet_t pkt;
    pkt.type = 1;
    pkt.node_id = my_id;
    pkt.seq = seq++;
    pkt.orig_time_us = buffer[idx].capture_us;
    memcpy(pkt.payload, buffer[idx].data, PKT_DATA_LEN);
    esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));
    replay_pos++;
    digitalWrite(LED_PIN, replay_pos & 1);
  }
}

void jumpToTime(int64_t target_us) {
  int start = (buf_head - buf_count + MAX_PACKETS) % MAX_PACKETS;
  for (int i = 0; i < buf_count; i++) {
    int idx = (start + i) % MAX_PACKETS;
    if (buffer[idx].capture_us >= target_us) {
      replay_pos = i;
      replay_origin = esp_timer_get_time() - (int64_t)(target_us / replay_speed);
      Serial.printf("[TM] Jumped to packet %d at %lld us\n", i, target_us);
      return;
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);

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

  capture_origin = esp_timer_get_time();
  Serial.printf("[TM] Packet Time Machine %02X ready\n", my_id);
  Serial.println("[TM] Commands: CAP, STOP, PLAY [speed], JUMP <us>, STATUS");
}

void loop() {
  replayTick();

  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    cmd.toUpperCase();
    if (cmd == "CAP") startCapture();
    else if (cmd == "STOP") stopCapture();
    else if (cmd.startsWith("PLAY")) {
      float speed = cmd.length() > 5 ? cmd.substring(5).toFloat() : 1.0;
      if (speed <= 0) speed = 1.0;
      startReplay(speed);
    }
    else if (cmd.startsWith("JUMP")) jumpToTime(cmd.substring(5).toInt());
  }

  static uint32_t last = 0;
  if (millis() - last >= 1000) {
    last = millis();
    Serial.printf("{\"tm\":\"%02X\",\"cap\":%s,\"play\":%s,\"pkts\":%d,\"pos\":%d,\"speed\":%.1f}\n",
      my_id, capturing ? "true" : "false", replaying ? "true" : "false",
      buf_count, replay_pos, replay_speed);
  }
}
