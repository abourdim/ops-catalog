/*
 * Chrono Timing Attack Lab - ESP32 Firmware
 * Educational timing side-channel analysis platform
 * Measures microsecond variations in cryptographic operations
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>
#include <mbedtls/aes.h>

#define LED_PIN 2
#define NUM_TRIALS 100
#define SECRET_LEN 16

typedef struct {
  uint8_t type;       // 0=challenge, 1=timing_result, 2=analysis
  uint32_t seq;
  int64_t elapsed_us;
  uint8_t guess[SECRET_LEN];
  uint8_t correct_bytes;
} timing_packet_t;

uint8_t secret_key[SECRET_LEN];
uint8_t target_password[SECRET_LEN] = "CHRONOATTACK!!!!";
int64_t timing_samples[256];
uint32_t seq = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

// Deliberately vulnerable comparison (for educational timing attack)
bool IRAM_ATTR vulnerable_compare(const uint8_t *a, const uint8_t *b, int len) {
  for (int i = 0; i < len; i++) {
    if (a[i] != b[i]) return false;
    // Artificial delay to make timing measurable on ESP32
    ets_delay_us(10);
  }
  return true;
}

// Constant-time comparison (secure reference)
bool IRAM_ATTR secure_compare(const uint8_t *a, const uint8_t *b, int len) {
  volatile uint8_t result = 0;
  for (int i = 0; i < len; i++) {
    result |= a[i] ^ b[i];
  }
  return result == 0;
}

int64_t measureComparison(const uint8_t *guess, bool use_vulnerable) {
  int64_t start = esp_timer_get_time();
  if (use_vulnerable) {
    vulnerable_compare(target_password, guess, SECRET_LEN);
  } else {
    secure_compare(target_password, guess, SECRET_LEN);
  }
  return esp_timer_get_time() - start;
}

void runTimingAttack(int byte_pos) {
  Serial.printf("[ATTACK] Attacking byte %d...\n", byte_pos);
  uint8_t guess[SECRET_LEN];
  memset(guess, 0, SECRET_LEN);
  // Copy already-known bytes
  for (int i = 0; i < byte_pos; i++) {
    guess[i] = target_password[i];
  }

  int64_t max_time = 0;
  uint8_t best_byte = 0;

  for (int c = 0; c < 256; c++) {
    guess[byte_pos] = (uint8_t)c;
    int64_t total = 0;
    for (int t = 0; t < NUM_TRIALS; t++) {
      total += measureComparison(guess, true);
    }
    timing_samples[c] = total / NUM_TRIALS;

    if (timing_samples[c] > max_time) {
      max_time = timing_samples[c];
      best_byte = (uint8_t)c;
    }
  }

  Serial.printf("[ATTACK] Byte %d: best=0x%02X ('%c') time=%lld us\n",
    byte_pos, best_byte, (best_byte >= 32 && best_byte < 127) ? best_byte : '.', max_time);

  // Broadcast result
  timing_packet_t pkt;
  pkt.type = 1;
  pkt.seq = seq++;
  pkt.elapsed_us = max_time;
  memcpy(pkt.guess, guess, SECRET_LEN);
  pkt.guess[byte_pos] = best_byte;
  pkt.correct_bytes = byte_pos + 1;
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));
}

void benchmarkComparisons() {
  uint8_t test[SECRET_LEN] = {0};
  int64_t vuln_times[SECRET_LEN], sec_times[SECRET_LEN];

  for (int i = 0; i < SECRET_LEN; i++) {
    if (i > 0) test[i-1] = target_password[i-1];
    int64_t vt = 0, st = 0;
    for (int t = 0; t < NUM_TRIALS; t++) {
      vt += measureComparison(test, true);
      st += measureComparison(test, false);
    }
    vuln_times[i] = vt / NUM_TRIALS;
    sec_times[i] = st / NUM_TRIALS;
  }

  Serial.print("{\"benchmark\":{\"vulnerable\":[");
  for (int i = 0; i < SECRET_LEN; i++) {
    if (i) Serial.print(",");
    Serial.printf("%lld", vuln_times[i]);
  }
  Serial.print("],\"secure\":[");
  for (int i = 0; i < SECRET_LEN; i++) {
    if (i) Serial.print(",");
    Serial.printf("%lld", sec_times[i]);
  }
  Serial.println("]}}");
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {}
void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);

  WiFi.mode(WIFI_STA);
  esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE);
  esp_now_init();
  esp_now_register_recv_cb(onDataRecv);
  esp_now_register_send_cb(onDataSent);
  esp_now_peer_info_t pi = {};
  memcpy(pi.peer_addr, bcast, 6);
  pi.channel = 1;
  esp_now_add_peer(&pi);

  Serial.println("[TIMING-LAB] Timing Attack Lab ready");
  Serial.println("[TIMING-LAB] Commands: BENCH, ATTACK <byte>, FULLATTACK");
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd == "BENCH") {
      benchmarkComparisons();
    } else if (cmd.startsWith("ATTACK")) {
      int pos = cmd.substring(7).toInt();
      if (pos >= 0 && pos < SECRET_LEN) runTimingAttack(pos);
    } else if (cmd == "FULLATTACK") {
      for (int i = 0; i < SECRET_LEN; i++) {
        runTimingAttack(i);
        digitalWrite(LED_PIN, i & 1);
      }
      Serial.println("[TIMING-LAB] Full attack complete");
    }
  }

  static uint32_t last = 0;
  if (millis() - last >= 2000) {
    last = millis();
    Serial.printf("{\"lab\":\"timing-attack\",\"t\":%lld,\"seq\":%u}\n",
      esp_timer_get_time(), seq);
  }
}
