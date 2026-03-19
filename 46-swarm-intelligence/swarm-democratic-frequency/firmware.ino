/*
 * Swarm Democratic Frequency - ESP32 Firmware
 * Democratic voting to select optimal operating frequency
 * Each node proposes and votes on channel selection via ESP-NOW
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>

#define LED_PIN 2
#define MAX_VOTERS 10
#define NUM_CHANNELS 13
#define VOTE_ROUND_MS 3000

typedef struct {
  uint8_t type;       // 0=proposal, 1=vote, 2=result, 3=heartbeat
  uint8_t node_id;
  uint32_t seq;
  uint8_t proposed_ch;
  uint8_t vote_ch;
  uint8_t round;
  int8_t channel_score;
} vote_packet_t;

typedef struct {
  uint8_t id;
  uint8_t mac[6];
  uint8_t vote;
  int8_t score;
  bool voted;
  bool active;
} voter_t;

voter_t voters[MAX_VOTERS];
int vote_tally[NUM_CHANNELS + 1];
uint8_t current_round = 0;
uint8_t elected_channel = 1;
uint8_t my_proposal = 1;
uint8_t my_id;
uint32_t seq = 0;
int64_t round_start = 0;
bool voting_active = false;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

int8_t scoreChannel(uint8_t ch) {
  // Quick scan for channel quality
  esp_wifi_set_channel(ch, WIFI_SECOND_CHAN_NONE);
  delayMicroseconds(500);
  int n = WiFi.scanNetworks(false, true, false, 50, ch);
  WiFi.scanDelete();
  esp_wifi_set_channel(elected_channel, WIFI_SECOND_CHAN_NONE);
  return (int8_t)(100 - n * 10);  // Fewer APs = better score
}

void startVoteRound() {
  current_round++;
  memset(vote_tally, 0, sizeof(vote_tally));
  for (int i = 0; i < MAX_VOTERS; i++) voters[i].voted = false;
  voting_active = true;
  round_start = esp_timer_get_time();

  // Score a few channels and propose best
  int8_t best_score = -128;
  for (uint8_t ch = 1; ch <= NUM_CHANNELS; ch += 4) {
    int8_t s = scoreChannel(ch);
    if (s > best_score) { best_score = s; my_proposal = ch; }
  }

  vote_packet_t pkt;
  pkt.type = 0;
  pkt.node_id = my_id;
  pkt.seq = seq++;
  pkt.proposed_ch = my_proposal;
  pkt.round = current_round;
  pkt.channel_score = best_score;
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));

  // Vote for own proposal
  vote_tally[my_proposal]++;
  Serial.printf("[VOTE] Round %d: proposing channel %d (score=%d)\n",
    current_round, my_proposal, best_score);
}

void tallyVotes() {
  uint8_t best_ch = 1;
  int best_votes = 0;
  for (int ch = 1; ch <= NUM_CHANNELS; ch++) {
    if (vote_tally[ch] > best_votes) {
      best_votes = vote_tally[ch];
      best_ch = ch;
    }
  }
  elected_channel = best_ch;
  voting_active = false;

  Serial.printf("[VOTE] Round %d result: channel %d wins (%d votes)\n",
    current_round, elected_channel, best_votes);

  // Broadcast result
  vote_packet_t pkt;
  pkt.type = 2;
  pkt.node_id = my_id;
  pkt.seq = seq++;
  pkt.vote_ch = elected_channel;
  pkt.round = current_round;
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(vote_packet_t)) return;
  vote_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));

  // Track voter
  int idx = -1;
  for (int i = 0; i < MAX_VOTERS; i++)
    if (voters[i].active && voters[i].id == pkt.node_id) { idx = i; break; }
  if (idx < 0) {
    for (int i = 0; i < MAX_VOTERS; i++) {
      if (!voters[i].active) {
        voters[i].id = pkt.node_id; memcpy(voters[i].mac, mac, 6);
        voters[i].active = true;
        esp_now_peer_info_t pi = {};
        memcpy(pi.peer_addr, mac, 6); pi.channel = 1;
        esp_now_add_peer(&pi);
        idx = i; break;
      }
    }
  }

  if (pkt.type == 0 && pkt.round == current_round) {
    // Received proposal, cast vote for best seen
    uint8_t my_vote = pkt.channel_score > 50 ? pkt.proposed_ch : my_proposal;
    vote_tally[my_vote]++;
    vote_packet_t v;
    v.type = 1; v.node_id = my_id; v.seq = seq++;
    v.vote_ch = my_vote; v.round = current_round;
    esp_now_send(mac, (uint8_t *)&v, sizeof(v));
  } else if (pkt.type == 1 && pkt.round == current_round) {
    vote_tally[pkt.vote_ch]++;
  } else if (pkt.type == 2) {
    elected_channel = pkt.vote_ch;
    voting_active = false;
  }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  memset(voters, 0, sizeof(voters));

  WiFi.mode(WIFI_STA);
  uint8_t mac[6]; esp_wifi_get_mac(WIFI_IF_STA, mac); my_id = mac[5];
  esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE);
  esp_now_init();
  esp_now_register_recv_cb(onDataRecv); esp_now_register_send_cb(onDataSent);
  esp_now_peer_info_t pi = {}; memcpy(pi.peer_addr, bcast, 6); pi.channel = 1;
  esp_now_add_peer(&pi);

  Serial.printf("[VOTE] Democratic Frequency %02X ready. ELECT to start vote\n", my_id);
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd == "ELECT") startVoteRound();
  }

  if (voting_active && (esp_timer_get_time() - round_start) / 1000 > VOTE_ROUND_MS) {
    tallyVotes();
  }

  static uint32_t last = 0;
  if (millis() - last >= 1000) {
    last = millis();
    int nv = 0;
    for (int i = 0; i < MAX_VOTERS; i++) if (voters[i].active) nv++;
    Serial.printf("{\"node\":\"%02X\",\"elected_ch\":%d,\"round\":%d,\"voters\":%d,\"voting\":%s}\n",
      my_id, elected_channel, current_round, nv, voting_active ? "true" : "false");
    digitalWrite(LED_PIN, voting_active);
  }
}
