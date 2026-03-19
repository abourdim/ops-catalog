/*
 * Chrono Entropy Harvester - ESP32 Firmware
 * Harvests true randomness from timing jitter and RF noise
 * Uses microsecond clock differences as entropy source
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>
#include <esp_random.h>

#define LED_PIN 2
#define POOL_SIZE 256
#define MIN_ENTROPY_BITS 128
#define MAX_PEERS 4

typedef struct {
  uint8_t type;       // 0=entropy_share, 1=request, 2=random_out
  uint8_t node_id;
  uint32_t seq;
  uint8_t entropy[32];
  uint16_t entropy_bits;
  float quality;
} entropy_packet_t;

uint8_t entropy_pool[POOL_SIZE];
int pool_write_idx = 0;
int pool_bits_available = 0;
uint8_t my_id;
uint32_t seq = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

// Entropy estimation
float estimateEntropy(const uint8_t *data, int len) {
  int counts[256] = {0};
  for (int i = 0; i < len; i++) counts[data[i]]++;
  float entropy = 0;
  for (int i = 0; i < 256; i++) {
    if (counts[i] == 0) continue;
    float p = (float)counts[i] / len;
    entropy -= p * log2(p);
  }
  return entropy;
}

void mixIntoPool(uint8_t byte_val) {
  // LFSR-style mixing
  entropy_pool[pool_write_idx] ^= byte_val;
  entropy_pool[(pool_write_idx + 1) % POOL_SIZE] ^= (byte_val << 3) | (byte_val >> 5);
  entropy_pool[(pool_write_idx + POOL_SIZE/2) % POOL_SIZE] ^= byte_val ^ 0xA5;
  pool_write_idx = (pool_write_idx + 1) % POOL_SIZE;
  if (pool_bits_available < POOL_SIZE * 8) pool_bits_available += 2;
}

void harvestTimingJitter() {
  // Collect timing jitter between consecutive reads
  int64_t samples[16];
  for (int i = 0; i < 16; i++) {
    samples[i] = esp_timer_get_time();
    // Deliberate variable-time operation
    volatile int x = 0;
    for (volatile int j = 0; j < (samples[i] & 0xF) + 1; j++) x++;
  }
  for (int i = 1; i < 16; i++) {
    uint8_t jitter = (uint8_t)((samples[i] - samples[i-1]) & 0xFF);
    mixIntoPool(jitter);
  }
}

void harvestRFNoise() {
  // Use WiFi RSSI variations as entropy
  wifi_ap_record_t ap;
  for (int ch = 1; ch <= 3; ch++) {
    esp_wifi_set_channel(ch, WIFI_SECOND_CHAN_NONE);
    delayMicroseconds(100);
    int64_t t = esp_timer_get_time();
    mixIntoPool((uint8_t)(t & 0xFF));
    mixIntoPool((uint8_t)(esp_random() & 0xFF));
  }
  esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE);
}

void harvestHWRandom() {
  for (int i = 0; i < 8; i++) {
    uint32_t r = esp_random();
    mixIntoPool((uint8_t)(r & 0xFF));
    mixIntoPool((uint8_t)((r >> 8) & 0xFF));
    mixIntoPool((uint8_t)((r >> 16) & 0xFF));
    mixIntoPool((uint8_t)((r >> 24) & 0xFF));
  }
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(entropy_packet_t)) return;
  entropy_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));

  // Mix remote entropy into our pool
  if (pkt.type == 0) {
    for (int i = 0; i < 32; i++) {
      mixIntoPool(pkt.entropy[i]);
    }
    // Also mix arrival timing
    mixIntoPool((uint8_t)(esp_timer_get_time() & 0xFF));
  } else if (pkt.type == 1) {
    // Respond with entropy
    entropy_packet_t resp;
    resp.type = 0;
    resp.node_id = my_id;
    resp.seq = seq++;
    resp.entropy_bits = min(256, pool_bits_available);
    for (int i = 0; i < 32; i++) {
      resp.entropy[i] = entropy_pool[(pool_write_idx + i) % POOL_SIZE];
    }
    resp.quality = estimateEntropy(resp.entropy, 32);
    esp_now_send(mac, (uint8_t *)&resp, sizeof(resp));
  }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void shareEntropy() {
  if (pool_bits_available < MIN_ENTROPY_BITS) return;
  entropy_packet_t pkt;
  pkt.type = 0;
  pkt.node_id = my_id;
  pkt.seq = seq++;
  pkt.entropy_bits = min(256, pool_bits_available);
  for (int i = 0; i < 32; i++) {
    pkt.entropy[i] = entropy_pool[(pool_write_idx + i) % POOL_SIZE];
  }
  pkt.quality = estimateEntropy(pkt.entropy, 32);
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);

  // Initialize pool with hardware random
  for (int i = 0; i < POOL_SIZE; i++) {
    entropy_pool[i] = (uint8_t)(esp_random() & 0xFF);
  }

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

  Serial.printf("[ENTROPY] Harvester %02X ready\n", my_id);
}

void loop() {
  harvestTimingJitter();
  harvestHWRandom();

  static uint32_t last_rf = 0;
  if (millis() - last_rf >= 500) {
    last_rf = millis();
    harvestRFNoise();
    shareEntropy();
  }

  static uint32_t last = 0;
  if (millis() - last >= 1000) {
    last = millis();
    float quality = estimateEntropy(entropy_pool, POOL_SIZE);
    Serial.printf("{\"node\":\"%02X\",\"pool_bits\":%d,\"quality\":%.3f,\"t\":%lld}\n",
      my_id, pool_bits_available, quality, esp_timer_get_time());
    digitalWrite(LED_PIN, pool_bits_available >= MIN_ENTROPY_BITS);
  }
}
