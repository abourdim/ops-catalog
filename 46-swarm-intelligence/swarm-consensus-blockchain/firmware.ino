/*
 * Swarm Consensus Blockchain - ESP32 Firmware
 * Lightweight blockchain consensus over ESP-NOW mesh
 * Proof-of-presence mining with peer discovery
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>
#include <mbedtls/sha256.h>

#define LED_PIN 2
#define MAX_PEERS 10
#define MAX_BLOCKS 32
#define BLOCK_DATA_LEN 16

typedef struct {
  uint32_t index;
  uint32_t timestamp;
  uint8_t prev_hash[8];
  uint8_t data[BLOCK_DATA_LEN];
  uint8_t hash[8];
  uint8_t miner_id;
  uint32_t nonce;
} block_t;

typedef struct {
  uint8_t type;       // 0=block, 1=chain_req, 2=vote, 3=peer_disc
  uint8_t node_id;
  uint32_t seq;
  block_t block;
  uint8_t vote;       // 1=accept, 0=reject
} chain_packet_t;

block_t chain[MAX_BLOCKS];
int chain_len = 0;
uint8_t my_id;
uint32_t seq = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};
int peer_count = 0;
uint8_t peer_ids[MAX_PEERS];
uint8_t peer_macs[MAX_PEERS][6];
int votes_for = 0, votes_against = 0;
bool pending_block = false;

void computeHash(block_t *b) {
  uint8_t full_hash[32];
  uint8_t input[64];
  memcpy(input, &b->index, 4);
  memcpy(input + 4, &b->timestamp, 4);
  memcpy(input + 8, b->prev_hash, 8);
  memcpy(input + 16, b->data, BLOCK_DATA_LEN);
  memcpy(input + 32, &b->nonce, 4);
  mbedtls_sha256(input, 36, full_hash, 0);
  memcpy(b->hash, full_hash, 8);
}

bool validateBlock(block_t *b) {
  if (chain_len == 0) return true;
  if (b->index != chain[chain_len - 1].index + 1) return false;
  if (memcmp(b->prev_hash, chain[chain_len - 1].hash, 8) != 0) return false;
  block_t test = *b;
  computeHash(&test);
  return memcmp(test.hash, b->hash, 8) == 0;
}

void mineBlock(const uint8_t *data, int len) {
  block_t b;
  b.index = chain_len;
  b.timestamp = (uint32_t)(esp_timer_get_time() / 1000000);
  if (chain_len > 0) memcpy(b.prev_hash, chain[chain_len - 1].hash, 8);
  else memset(b.prev_hash, 0, 8);
  memset(b.data, 0, BLOCK_DATA_LEN);
  memcpy(b.data, data, min(len, BLOCK_DATA_LEN));
  b.miner_id = my_id;
  b.nonce = 0;

  // Simple proof-of-work: find hash with leading zero nibble
  for (uint32_t n = 0; n < 100000; n++) {
    b.nonce = n;
    computeHash(&b);
    if ((b.hash[0] & 0xF0) == 0) break;
  }

  // Broadcast for consensus
  chain_packet_t pkt;
  pkt.type = 0;
  pkt.node_id = my_id;
  pkt.seq = seq++;
  pkt.block = b;
  pkt.vote = 0;
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));

  votes_for = 1;
  votes_against = 0;
  pending_block = true;
  Serial.printf("[CHAIN] Mined block %u, broadcasting for consensus\n", b.index);
}

void addBlock(block_t *b) {
  if (chain_len >= MAX_BLOCKS) return;
  chain[chain_len++] = *b;
  Serial.printf("[CHAIN] Block %u added (miner %02X)\n", b->index, b->miner_id);
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(chain_packet_t)) return;
  chain_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));

  // Track peer
  bool known = false;
  for (int i = 0; i < peer_count; i++)
    if (peer_ids[i] == pkt.node_id) { known = true; break; }
  if (!known && peer_count < MAX_PEERS) {
    peer_ids[peer_count] = pkt.node_id;
    memcpy(peer_macs[peer_count], mac, 6);
    peer_count++;
    esp_now_peer_info_t pi = {};
    memcpy(pi.peer_addr, mac, 6);
    pi.channel = 1;
    esp_now_add_peer(&pi);
  }

  if (pkt.type == 0) {
    bool valid = validateBlock(&pkt.block);
    chain_packet_t vote;
    vote.type = 2;
    vote.node_id = my_id;
    vote.seq = seq++;
    vote.block = pkt.block;
    vote.vote = valid ? 1 : 0;
    esp_now_send(mac, (uint8_t *)&vote, sizeof(vote));
    if (valid) addBlock(&pkt.block);
  } else if (pkt.type == 2) {
    if (pkt.vote) votes_for++; else votes_against++;
    if (pending_block && votes_for > peer_count / 2) {
      pending_block = false;
      Serial.printf("[CHAIN] Consensus reached: %d/%d\n", votes_for, peer_count);
    }
  } else if (pkt.type == 3) {
    // Peer discovery ping
    chain_packet_t resp;
    resp.type = 3;
    resp.node_id = my_id;
    resp.seq = seq++;
    esp_now_send(mac, (uint8_t *)&resp, sizeof(resp));
  }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

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

  // Genesis block
  uint8_t genesis[] = "GENESIS";
  block_t gb;
  gb.index = 0; gb.timestamp = 0; gb.miner_id = my_id; gb.nonce = 0;
  memset(gb.prev_hash, 0, 8);
  memset(gb.data, 0, BLOCK_DATA_LEN);
  memcpy(gb.data, genesis, 7);
  computeHash(&gb);
  addBlock(&gb);

  Serial.printf("[CHAIN] Blockchain node %02X ready\n", my_id);
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd.startsWith("MINE")) {
      String data = cmd.substring(5);
      mineBlock((uint8_t *)data.c_str(), data.length());
    }
  }

  static uint32_t last = 0;
  if (millis() - last >= 2000) {
    last = millis();
    Serial.printf("{\"node\":\"%02X\",\"chain_len\":%d,\"peers\":%d,\"seq\":%u}\n",
      my_id, chain_len, peer_count, seq);
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
  }
}
