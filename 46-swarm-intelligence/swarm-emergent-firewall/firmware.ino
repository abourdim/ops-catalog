/*
 * Swarm Emergent Firewall - ESP32 Firmware
 * Distributed firewall using swarm intelligence for threat detection
 * ESP-NOW mesh shares threat signatures and collectively blocks
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>

#define LED_PIN 2
#define MAX_PEERS 10
#define MAX_THREATS 32
#define THREAT_THRESHOLD 3

typedef struct {
  uint8_t type;       // 0=threat_alert, 1=block_vote, 2=status, 3=heartbeat
  uint8_t node_id;
  uint32_t seq;
  uint8_t threat_mac[6];
  uint8_t threat_score;
  uint8_t voters;
} firewall_packet_t;

typedef struct {
  uint8_t mac[6];
  uint8_t score;
  uint8_t reporters;
  uint8_t reporter_ids[MAX_PEERS];
  bool blocked;
  int64_t first_seen;
} threat_entry_t;

typedef struct {
  uint8_t mac[6];
  uint8_t id;
  int64_t last_seen;
  uint32_t threats_reported;
  bool active;
} peer_node_t;

threat_entry_t threats[MAX_THREATS];
peer_node_t peers[MAX_PEERS];
int threat_count = 0;
uint8_t my_id;
uint32_t seq = 0;
uint32_t blocked_count = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

int findThreat(const uint8_t *mac) {
  for (int i = 0; i < threat_count; i++)
    if (memcmp(threats[i].mac, mac, 6) == 0) return i;
  return -1;
}

int addThreat(const uint8_t *mac, uint8_t score) {
  if (threat_count >= MAX_THREATS) return -1;
  memcpy(threats[threat_count].mac, mac, 6);
  threats[threat_count].score = score;
  threats[threat_count].reporters = 1;
  threats[threat_count].reporter_ids[0] = my_id;
  threats[threat_count].blocked = false;
  threats[threat_count].first_seen = esp_timer_get_time();
  return threat_count++;
}

void reportThreat(const uint8_t *mac, uint8_t score) {
  int idx = findThreat(mac);
  if (idx < 0) idx = addThreat(mac, score);
  if (idx < 0) return;

  firewall_packet_t pkt;
  pkt.type = 0;
  pkt.node_id = my_id;
  pkt.seq = seq++;
  memcpy(pkt.threat_mac, mac, 6);
  pkt.threat_score = score;
  pkt.voters = threats[idx].reporters;
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));
}

void checkConsensusBlock(int idx) {
  if (threats[idx].reporters >= THREAT_THRESHOLD && !threats[idx].blocked) {
    threats[idx].blocked = true;
    blocked_count++;
    Serial.printf("[FW] BLOCKED %02X:%02X:%02X:%02X:%02X:%02X (score=%d, reporters=%d)\n",
      threats[idx].mac[0], threats[idx].mac[1], threats[idx].mac[2],
      threats[idx].mac[3], threats[idx].mac[4], threats[idx].mac[5],
      threats[idx].score, threats[idx].reporters);
  }
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(firewall_packet_t)) return;
  firewall_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));

  // Track peer
  int pidx = -1;
  for (int i = 0; i < MAX_PEERS; i++)
    if (peers[i].active && peers[i].id == pkt.node_id) { pidx = i; break; }
  if (pidx < 0) {
    for (int i = 0; i < MAX_PEERS; i++) {
      if (!peers[i].active) {
        memcpy(peers[i].mac, mac, 6);
        peers[i].id = pkt.node_id;
        peers[i].active = true;
        esp_now_peer_info_t pi = {};
        memcpy(pi.peer_addr, mac, 6);
        pi.channel = 1;
        esp_now_add_peer(&pi);
        pidx = i;
        break;
      }
    }
  }
  if (pidx >= 0) peers[pidx].last_seen = esp_timer_get_time();

  if (pkt.type == 0) {
    int idx = findThreat(pkt.threat_mac);
    if (idx < 0) idx = addThreat(pkt.threat_mac, pkt.threat_score);
    if (idx >= 0) {
      bool already = false;
      for (int i = 0; i < threats[idx].reporters; i++)
        if (threats[idx].reporter_ids[i] == pkt.node_id) { already = true; break; }
      if (!already && threats[idx].reporters < MAX_PEERS) {
        threats[idx].reporter_ids[threats[idx].reporters++] = pkt.node_id;
        if (pkt.threat_score > threats[idx].score) threats[idx].score = pkt.threat_score;
      }
      checkConsensusBlock(idx);
    }
  }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  memset(threats, 0, sizeof(threats));
  memset(peers, 0, sizeof(peers));

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

  Serial.printf("[FW] Emergent Firewall %02X ready. REPORT <mac> <score>\n", my_id);
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd.startsWith("REPORT")) {
      uint8_t tmac[6] = {0xDE, 0xAD, 0xBE, 0xEF, 0x00, (uint8_t)random(256)};
      reportThreat(tmac, 80);
    }
  }

  static uint32_t last = 0;
  if (millis() - last >= 1000) {
    last = millis();
    int active_peers = 0, active_threats = 0, active_blocked = 0;
    for (int i = 0; i < MAX_PEERS; i++) if (peers[i].active) active_peers++;
    for (int i = 0; i < threat_count; i++) {
      active_threats++;
      if (threats[i].blocked) active_blocked++;
    }
    Serial.printf("{\"fw\":\"%02X\",\"peers\":%d,\"threats\":%d,\"blocked\":%d}\n",
      my_id, active_peers, active_threats, active_blocked);
    digitalWrite(LED_PIN, active_blocked > 0);
  }
}
