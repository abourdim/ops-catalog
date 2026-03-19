/*
 * Chrono Frequency Hopping Chess - ESP32 Firmware
 * Time-synchronized frequency hopping using ESP-NOW
 * Chess-like strategy where moves trigger channel hops
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_timer.h>
#include <esp_wifi.h>

#define LED_PIN 2
#define MAX_PLAYERS 4
#define HOP_CHANNELS 13
#define HOP_INTERVAL_MS 200
#define BOARD_SIZE 8

typedef struct {
  uint8_t type;       // 0=move, 1=hop_sync, 2=state
  uint8_t player_id;
  uint32_t seq;
  uint8_t from_x, from_y;
  uint8_t to_x, to_y;
  uint8_t channel;
  int64_t hop_time_us;
} chess_packet_t;

uint8_t hop_sequence[64];
int hop_seq_len = 0;
int hop_idx = 0;
uint8_t current_channel = 1;
uint8_t my_id;
uint32_t seq = 0;
uint8_t bcast[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};
int64_t last_hop_us = 0;
int64_t hop_interval_us = HOP_INTERVAL_MS * 1000;

// Simple board: 0=empty, 1-6=player1 pieces, 7-12=player2 pieces
uint8_t board[BOARD_SIZE][BOARD_SIZE];

void generateHopSequence(uint32_t seed) {
  hop_seq_len = 32;
  uint32_t s = seed;
  for (int i = 0; i < hop_seq_len; i++) {
    s = s * 1103515245 + 12345;
    hop_sequence[i] = (s >> 16) % HOP_CHANNELS + 1;
  }
}

void hopToNext() {
  hop_idx = (hop_idx + 1) % hop_seq_len;
  current_channel = hop_sequence[hop_idx];
  esp_wifi_set_channel(current_channel, WIFI_SECOND_CHAN_NONE);
  last_hop_us = esp_timer_get_time();
}

void initBoard() {
  memset(board, 0, sizeof(board));
  for (int x = 0; x < BOARD_SIZE; x++) {
    board[x][0] = 1;  // Player 1 back row
    board[x][1] = 2;  // Player 1 pawns
    board[x][6] = 8;  // Player 2 pawns
    board[x][7] = 7;  // Player 2 back row
  }
}

bool makeMove(uint8_t fx, uint8_t fy, uint8_t tx, uint8_t ty) {
  if (fx >= BOARD_SIZE || fy >= BOARD_SIZE || tx >= BOARD_SIZE || ty >= BOARD_SIZE)
    return false;
  if (board[fx][fy] == 0) return false;
  board[tx][ty] = board[fx][fy];
  board[fx][fy] = 0;
  // Each move modifies the hop sequence
  generateHopSequence(seq ^ (tx << 8 | ty << 16 | fx | fy << 24));
  return true;
}

void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(chess_packet_t)) return;
  chess_packet_t pkt;
  memcpy(&pkt, data, sizeof(pkt));

  if (pkt.type == 0) {
    if (makeMove(pkt.from_x, pkt.from_y, pkt.to_x, pkt.to_y)) {
      Serial.printf("[CHESS] Player %02X moved (%d,%d)->(%d,%d)\n",
        pkt.player_id, pkt.from_x, pkt.from_y, pkt.to_x, pkt.to_y);
    }
  } else if (pkt.type == 1) {
    current_channel = pkt.channel;
    esp_wifi_set_channel(current_channel, WIFI_SECOND_CHAN_NONE);
    last_hop_us = esp_timer_get_time();
  }
}

void onDataSent(const uint8_t *mac, esp_now_send_status_t s) {}

void broadcastMove(uint8_t fx, uint8_t fy, uint8_t tx, uint8_t ty) {
  chess_packet_t pkt;
  pkt.type = 0;
  pkt.player_id = my_id;
  pkt.seq = seq++;
  pkt.from_x = fx;
  pkt.from_y = fy;
  pkt.to_x = tx;
  pkt.to_y = ty;
  pkt.channel = current_channel;
  pkt.hop_time_us = esp_timer_get_time();
  esp_now_send(bcast, (uint8_t *)&pkt, sizeof(pkt));
}

void printBoard() {
  Serial.print("{\"board\":[");
  for (int y = 0; y < BOARD_SIZE; y++) {
    if (y) Serial.print(",");
    Serial.print("[");
    for (int x = 0; x < BOARD_SIZE; x++) {
      if (x) Serial.print(",");
      Serial.print(board[x][y]);
    }
    Serial.print("]");
  }
  Serial.printf("],\"ch\":%d,\"hop_idx\":%d,\"t\":%lld}\n",
    current_channel, hop_idx, esp_timer_get_time());
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  initBoard();
  generateHopSequence(esp_timer_get_time());

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
  pi.channel = 0;
  esp_now_add_peer(&pi);

  Serial.printf("[CHESS] Freq Hopping Chess %02X ready\n", my_id);
  Serial.println("[CHESS] Commands: MOVE fx fy tx ty, BOARD, HOP");
}

void loop() {
  int64_t now_us = esp_timer_get_time();
  if (now_us - last_hop_us >= hop_interval_us) {
    hopToNext();
    digitalWrite(LED_PIN, hop_idx & 1);
  }

  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd.startsWith("MOVE")) {
      int vals[4];
      sscanf(cmd.c_str() + 5, "%d %d %d %d", &vals[0], &vals[1], &vals[2], &vals[3]);
      if (makeMove(vals[0], vals[1], vals[2], vals[3])) {
        broadcastMove(vals[0], vals[1], vals[2], vals[3]);
        Serial.println("[CHESS] Move accepted");
      }
    } else if (cmd == "BOARD") {
      printBoard();
    }
  }

  static uint32_t last = 0;
  if (millis() - last >= 1000) {
    last = millis();
    Serial.printf("{\"player\":\"%02X\",\"ch\":%d,\"hop\":%d,\"t\":%lld}\n",
      my_id, current_channel, hop_idx, esp_timer_get_time());
  }
}
