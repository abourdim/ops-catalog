/*
 * Chrono Time Reversal Mirror - ESP32 Firmware
 * Records and replays WiFi timing patterns in reverse
 * Uses ESP-NOW for capture and playback of temporal sequences
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>

#define LED_PIN 2
#define MAX_EVENTS 512
#define MAX_PEERS 6

typedef struct {
  int64_t timestamp_us;
  uint8_t src_mac[6];
  int8_t rssi;
  uint8_t data[16];
  uint8_t data_len;
} time_event_t;

typedef struct {
  uint8_t type;       // 0=record, 1=replay, 2=status
  uint8_t node_id;
  uint32_t seq;
  int64_t orig_time_us;
  uint8_t payload[16];
} mirror_packet_t;

time_event_t recording[MAX_EVENTS];
int rec_count = 0;
int rec_head = 0;
bool is_recording = false;
bool is_replaying = false;
int replay_idx = 0;
int64_t replay_start_us = 0;
int64_t rec_start_us = 0;
uint8_t my_id;
uint32_t seq = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(mirror_packet_t)) return;
  mirror_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));
  int64_t now = esp_timer_get_time();

  if (is_recording && rec_count < MAX_EVENTS) {
    time_event_t *ev = &recording[rec_count++];
    ev->timestamp_us = now - rec_start_us;
    memcpy(ev->src_mac, mac, 6);
    ev->rssi = 0;
    int cplen = min(len, 16);
    memcpy(ev->data, data, cplen);
    ev->data_len = cplen;
  }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void reverseRecording() {
  for (int i = 0; i < rec_count / 2; i++) {
    time_event_t tmp = recording[i];
    recording[i] = recording[rec_count - 1 - i];
    recording[rec_count - 1 - i] = tmp;
  }
  // Recalculate timestamps for reversed playback
  int64_t total_duration = recording[rec_count - 1].timestamp_us;
  for (int i = 0; i < rec_count; i++) {
    recording[i].timestamp_us = total_duration - recording[i].timestamp_us;
  }
  // Sort by new timestamp
  for (int i = 0; i < rec_count - 1; i++) {
    for (int j = i + 1; j < rec_count; j++) {
      if (recording[j].timestamp_us < recording[i].timestamp_us) {
        time_event_t tmp = recording[i];
        recording[i] = recording[j];
        recording[j] = tmp;
      }
    }
  }
}

void startRecording() {
  rec_count = 0;
  rec_start_us = esp_timer_get_time();
  is_recording = true;
  is_replaying = false;
  Serial.println("[MIRROR] Recording started");
}

void stopRecording() {
  is_recording = false;
  Serial.printf("[MIRROR] Recorded %d events over %lld us\n",
    rec_count, rec_count > 0 ? recording[rec_count-1].timestamp_us : 0);
}

void startReplay(bool reversed) {
  if (rec_count == 0) { Serial.println("[MIRROR] Nothing to replay"); return; }
  if (reversed) reverseRecording();
  replay_idx = 0;
  replay_start_us = esp_timer_get_time();
  is_replaying = true;
  is_recording = false;
  Serial.printf("[MIRROR] Replaying %d events %s\n", rec_count, reversed ? "(REVERSED)" : "(forward)");
}

void replayTick() {
  if (!is_replaying || replay_idx >= rec_count) {
    if (is_replaying) {
      is_replaying = false;
      Serial.println("[MIRROR] Replay complete");
    }
    return;
  }
  int64_t elapsed = esp_timer_get_time() - replay_start_us;
  while (replay_idx < rec_count && recording[replay_idx].timestamp_us <= elapsed) {
    mirror_packet_t pkt;
    pkt.type = 1;
    pkt.node_id = my_id;
    pkt.seq = seq++;
    pkt.orig_time_us = recording[replay_idx].timestamp_us;
    memcpy(pkt.payload, recording[replay_idx].data, 16);
    esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));
    replay_idx++;
    digitalWrite(LED_PIN, replay_idx & 1);
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

  Serial.printf("[MIRROR] Time Reversal Mirror %02X ready\n", my_id);
  Serial.println("[MIRROR] Commands: REC, STOP, PLAY, REVERSE");
}

void loop() {
  replayTick();

  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    cmd.toUpperCase();
    if (cmd == "REC") startRecording();
    else if (cmd == "STOP") stopRecording();
    else if (cmd == "PLAY") startReplay(false);
    else if (cmd == "REVERSE") startReplay(true);
  }

  static uint32_t last = 0;
  if (millis() - last >= 1000) {
    last = millis();
    Serial.printf("{\"node\":\"%02X\",\"t\":%lld,\"rec\":%s,\"play\":%s,\"events\":%d,\"seq\":%u}\n",
      my_id, esp_timer_get_time(), is_recording ? "true" : "false",
      is_replaying ? "true" : "false", rec_count, seq);
  }
}
