/*
 * Swarm Spectrum Scan - ESP32 Firmware
 * Distributed WiFi spectrum scanning via ESP-NOW mesh
 * Each node scans different channels and shares results
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>

#define LED_PIN 2
#define MAX_PEERS 8
#define NUM_CHANNELS 13
#define MAX_APS 20

typedef struct {
  uint8_t type;        // 0=scan_result, 1=task_assign, 2=status
  uint8_t node_id;
  uint32_t seq;
  uint8_t channel;
  uint8_t ap_count;
  int8_t max_rssi;
  int8_t min_rssi;
  int8_t avg_rssi;
} spectrum_packet_t;

typedef struct {
  uint8_t ap_count;
  int8_t max_rssi;
  int8_t min_rssi;
  int8_t avg_rssi;
  int64_t last_scan;
  uint8_t scanned_by;
} channel_data_t;

channel_data_t spectrum[NUM_CHANNELS + 1];
uint8_t my_id;
uint32_t seq = 0;
uint8_t my_assigned_channel = 0;
uint8_t peer_ids[MAX_PEERS];
int peer_count = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

void scanChannel(uint8_t ch) {
  if (ch < 1 || ch > NUM_CHANNELS) return;
  esp_wifi_set_channel(ch, WIFI_SECOND_CHAN_NONE);
  delay(20);

  WiFi.mode(WIFI_STA);
  int n = WiFi.scanNetworks(false, true, false, 100, ch);

  int8_t maxR = -100, minR = 0;
  int32_t sumR = 0;
  for (int i = 0; i < n; i++) {
    int8_t r = WiFi.RSSI(i);
    if (r > maxR) maxR = r;
    if (r < minR) minR = r;
    sumR += r;
  }

  spectrum[ch].ap_count = n;
  spectrum[ch].max_rssi = maxR;
  spectrum[ch].min_rssi = n > 0 ? minR : -100;
  spectrum[ch].avg_rssi = n > 0 ? (int8_t)(sumR / n) : -100;
  spectrum[ch].last_scan = esp_timer_get_time();
  spectrum[ch].scanned_by = my_id;
  WiFi.scanDelete();

  // Share result
  spectrum_packet_t pkt;
  pkt.type = 0;
  pkt.node_id = my_id;
  pkt.seq = seq++;
  pkt.channel = ch;
  pkt.ap_count = n;
  pkt.max_rssi = maxR;
  pkt.min_rssi = spectrum[ch].min_rssi;
  pkt.avg_rssi = spectrum[ch].avg_rssi;

  esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE);
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(spectrum_packet_t)) return;
  spectrum_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));

  // Track peer
  bool known = false;
  for (int i = 0; i < peer_count; i++)
    if (peer_ids[i] == pkt.node_id) { known = true; break; }
  if (!known && peer_count < MAX_PEERS) {
    peer_ids[peer_count++] = pkt.node_id;
    esp_now_peer_info_t pi = {};
    memcpy(pi.peer_addr, mac, 6);
    pi.channel = 1;
    esp_now_add_peer(&pi);
  }

  if (pkt.type == 0 && pkt.channel >= 1 && pkt.channel <= NUM_CHANNELS) {
    spectrum[pkt.channel].ap_count = pkt.ap_count;
    spectrum[pkt.channel].max_rssi = pkt.max_rssi;
    spectrum[pkt.channel].min_rssi = pkt.min_rssi;
    spectrum[pkt.channel].avg_rssi = pkt.avg_rssi;
    spectrum[pkt.channel].last_scan = esp_timer_get_time();
    spectrum[pkt.channel].scanned_by = pkt.node_id;
  }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

uint8_t assignMyChannel() {
  // Distribute channels among peers
  int total = peer_count + 1;
  int my_rank = 0;
  for (int i = 0; i < peer_count; i++)
    if (peer_ids[i] < my_id) my_rank++;
  int channels_per = NUM_CHANNELS / total;
  return (my_rank * channels_per) + 1;
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  memset(spectrum, 0, sizeof(spectrum));

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

  Serial.printf("[SPECTRUM] Scanner %02X ready\n", my_id);
}

void loop() {
  static uint32_t last = 0;
  static uint8_t scan_ch = 1;

  if (millis() - last >= 2000) {
    last = millis();
    scanChannel(scan_ch);
    scan_ch = (scan_ch % NUM_CHANNELS) + 1;

    Serial.print("{\"scanner\":\""); Serial.printf("%02X", my_id);
    Serial.printf("\",\"peers\":%d,\"spectrum\":[", peer_count);
    for (int i = 1; i <= NUM_CHANNELS; i++) {
      if (i > 1) Serial.print(",");
      Serial.printf("{\"ch\":%d,\"aps\":%d,\"max\":%d,\"avg\":%d}",
        i, spectrum[i].ap_count, spectrum[i].max_rssi, spectrum[i].avg_rssi);
    }
    Serial.println("]}");
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
  }
}
