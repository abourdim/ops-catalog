/*
 * Chrono Temporal Steganography - ESP32 Firmware
 * Hides data in microsecond-precision timing gaps between packets
 * Uses ESP-NOW with carefully timed inter-packet delays to encode bits
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>

#define LED_PIN 2
#define BIT_0_DELAY_US 1000
#define BIT_1_DELAY_US 2000
#define TIMING_TOLERANCE_US 300
#define MAX_MSG_BITS 256
#define SYNC_PULSE_US 5000

typedef struct {
  uint8_t type;     // 0=cover, 1=sync, 2=data
  uint32_t seq;
  int64_t timestamp_us;
  uint8_t cover_data[16];
} stego_packet_t;

// Encoder state
uint8_t secret_bits[MAX_MSG_BITS];
int secret_len = 0;
int send_bit_idx = 0;
bool encoding = false;
int64_t last_send_time = 0;

// Decoder state
uint8_t recv_bits[MAX_MSG_BITS];
int recv_bit_count = 0;
int64_t last_recv_time = 0;
bool decoding = false;
uint8_t sender_mac[6];

uint32_t seq_counter = 0;
uint8_t broadcast_mac[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};

void textToBits(const char *text, uint8_t *bits, int *bit_count) {
  *bit_count = 0;
  while (*text && *bit_count < MAX_MSG_BITS - 8) {
    uint8_t c = *text++;
    for (int i = 7; i >= 0; i--) {
      bits[(*bit_count)++] = (c >> i) & 1;
    }
  }
}

void bitsToText(uint8_t *bits, int count, char *out, int max_out) {
  int ci = 0;
  for (int i = 0; i + 7 < count && ci < max_out - 1; i += 8) {
    uint8_t c = 0;
    for (int j = 0; j < 8; j++) c = (c << 1) | bits[i + j];
    if (c >= 32 && c < 127) out[ci++] = c;
  }
  out[ci] = '\0';
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(stego_packet_t)) return;
  stego_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));
  int64_t now = esp_timer_get_time();

  if (pkt.type == 1) {
    memcpy(sender_mac, mac, 6);
    recv_bit_count = 0;
    decoding = true;
    last_recv_time = now;
    Serial.println("[STEGO] Sync received, decoding started");
    return;
  }

  if (decoding && pkt.type == 0) {
    int64_t gap = now - last_recv_time;
    last_recv_time = now;

    if (gap > SYNC_PULSE_US) {
      // End of message
      decoding = false;
      char msg[64];
      bitsToText(recv_bits, recv_bit_count, msg, sizeof(msg));
      Serial.printf("[STEGO] Decoded (%d bits): %s\n", recv_bit_count, msg);
      return;
    }

    if (abs(gap - BIT_0_DELAY_US) < TIMING_TOLERANCE_US) {
      recv_bits[recv_bit_count++] = 0;
    } else if (abs(gap - BIT_1_DELAY_US) < TIMING_TOLERANCE_US) {
      recv_bits[recv_bit_count++] = 1;
    }

    if (recv_bit_count >= MAX_MSG_BITS) decoding = false;
  }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t st) {}

void sendCoverPacket() {
  stego_packet_t pkt;
  pkt.type = 0;
  pkt.seq = seq_counter++;
  pkt.timestamp_us = esp_timer_get_time();
  for (int i = 0; i < 16; i++) pkt.cover_data[i] = random(256);
  esp_now_send(broadcast_mac, (uint8_t *)&pkt, sizeof(pkt));
}

void sendSyncPulse() {
  stego_packet_t pkt;
  pkt.type = 1;
  pkt.seq = seq_counter++;
  pkt.timestamp_us = esp_timer_get_time();
  memset(pkt.cover_data, 0, 16);
  esp_now_send(broadcast_mac, (uint8_t *)&pkt, sizeof(pkt));
}

void startEncoding(const char *message) {
  textToBits(message, secret_bits, &secret_len);
  send_bit_idx = 0;
  encoding = true;
  sendSyncPulse();
  last_send_time = esp_timer_get_time();
  Serial.printf("[STEGO] Encoding %d bits: %s\n", secret_len, message);
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);

  WiFi.mode(WIFI_STA);
  esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE);
  esp_now_init();
  esp_now_register_recv_cb(onDataRecv);
  esp_now_register_send_cb(onDataSent);

  esp_now_peer_info_t pi = {};
  memcpy(pi.peer_addr, broadcast_mac, 6);
  pi.channel = 1;
  esp_now_add_peer(&pi);

  Serial.println("[STEGO] Temporal Steganography ready. Send text via Serial.");
}

void loop() {
  if (Serial.available()) {
    String msg = Serial.readStringUntil('\n');
    msg.trim();
    if (msg.length() > 0) startEncoding(msg.c_str());
  }

  if (encoding) {
    int64_t now = esp_timer_get_time();
    int delay_us = secret_bits[send_bit_idx] ? BIT_1_DELAY_US : BIT_0_DELAY_US;

    if (now - last_send_time >= delay_us) {
      sendCoverPacket();
      last_send_time = now;
      send_bit_idx++;
      digitalWrite(LED_PIN, send_bit_idx & 1);

      if (send_bit_idx >= secret_len) {
        encoding = false;
        delayMicroseconds(SYNC_PULSE_US);
        sendCoverPacket();
        Serial.println("[STEGO] Encoding complete");
      }
    }
  }

  static uint32_t last_status = 0;
  if (millis() - last_status > 2000 && !encoding) {
    last_status = millis();
    Serial.printf("{\"mode\":\"%s\",\"t_us\":%lld,\"sent\":%u,\"recv_bits\":%d}\n",
      decoding ? "decoding" : "idle", esp_timer_get_time(), seq_counter, recv_bit_count);
  }
}
