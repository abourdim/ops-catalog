/*
 * ESP Consensus Lab - firmware.ino
 * Demonstrates distributed consensus algorithms (Raft-like)
 * across a mesh of ESP32 nodes. Nodes elect a leader and
 * replicate a shared state variable.
 *
 * Hardware: ESP32 DevKit + OLED SSD1306 + RGB LED
 * Wiring:  SDA -> GPIO21, SCL -> GPIO22, Red -> GPIO4, Green -> GPIO16
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_wifi.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

// ---------- OLED ----------
#define SCREEN_W 128
#define SCREEN_H 64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);

#define LED_RED    4
#define LED_GREEN 16
#define BTN_PIN    0  // Boot button

// ---------- Raft-like state ----------
enum NodeState { FOLLOWER, CANDIDATE, LEADER };
static NodeState state = FOLLOWER;
static uint32_t currentTerm = 0;
static uint32_t votedFor = 0;
static uint32_t myNodeId = 0;
static uint32_t leaderId = 0;
static int voteCount = 0;

// Shared replicated value
static int sharedValue = 0;

// Timing
static unsigned long electionTimeout = 0;
static unsigned long heartbeatInterval = 500;  // ms
static unsigned long lastHeartbeat = 0;
static unsigned long lastActivity = 0;

#define BROADCAST_ADDR {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF}
static uint8_t broadcastMAC[] = BROADCAST_ADDR;

// ---------- Message types ----------
typedef struct __attribute__((packed)) {
  uint8_t  msgType;     // 0=heartbeat, 1=requestVote, 2=voteReply, 3=replicate
  uint32_t term;
  uint32_t senderId;
  int32_t  payload;     // value or voteGranted
} ConsensusMsg;

// ---------- Reset election timer ----------
void resetElectionTimer() {
  electionTimeout = millis() + random(1500, 3000);
}

// ---------- ESP-NOW callbacks ----------
void onRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(ConsensusMsg)) return;
  ConsensusMsg msg;
  memcpy(&msg, data, len);

  // Update term if we see a higher one
  if (msg.term > currentTerm) {
    currentTerm = msg.term;
    state = FOLLOWER;
    votedFor = 0;
  }

  switch (msg.msgType) {
    case 0: // Heartbeat from leader
      if (msg.term >= currentTerm) {
        leaderId = msg.senderId;
        state = FOLLOWER;
        sharedValue = msg.payload;
        resetElectionTimer();
        lastActivity = millis();
      }
      break;

    case 1: // Vote request
      if (msg.term >= currentTerm && (votedFor == 0 || votedFor == msg.senderId)) {
        votedFor = msg.senderId;
        ConsensusMsg reply = {2, currentTerm, myNodeId, 1};
        esp_now_send(broadcastMAC, (uint8_t *)&reply, sizeof(reply));
        resetElectionTimer();
      }
      break;

    case 2: // Vote reply
      if (state == CANDIDATE && msg.payload == 1) {
        voteCount++;
      }
      break;

    case 3: // Replication
      sharedValue = msg.payload;
      break;
  }
}

void onSent(const uint8_t *mac, esp_now_send_status_t s) {}

// ---------- Start election ----------
void startElection() {
  currentTerm++;
  state = CANDIDATE;
  votedFor = myNodeId;
  voteCount = 1;  // Vote for self
  Serial.printf("[RAFT] Starting election for term %u\n", currentTerm);

  ConsensusMsg req = {1, currentTerm, myNodeId, 0};
  esp_now_send(broadcastMAC, (uint8_t *)&req, sizeof(req));
  resetElectionTimer();
}

// ---------- Leader heartbeat ----------
void sendHeartbeat() {
  ConsensusMsg hb = {0, currentTerm, myNodeId, sharedValue};
  esp_now_send(broadcastMAC, (uint8_t *)&hb, sizeof(hb));
}

// ---------- Display ----------
void updateDisplay() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(0, 0);
  oled.printf("Consensus Lab  T:%u", currentTerm);
  oled.setCursor(0, 12);
  const char *stateStr[] = {"FOLLOWER", "CANDIDATE", "LEADER"};
  oled.printf("State: %s", stateStr[state]);
  oled.setCursor(0, 24);
  oled.printf("Node: %08X", myNodeId);
  oled.setCursor(0, 36);
  oled.printf("Leader: %08X", leaderId);
  oled.setCursor(0, 48);
  oled.printf("Shared Value: %d", sharedValue);
  oled.display();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(BTN_PIN, INPUT_PULLUP);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  esp_wifi_set_channel(6, WIFI_SECOND_CHAN_NONE);

  myNodeId = ESP.getEfuseMac() & 0xFFFFFFFF;
  Serial.printf("[Consensus] Node %08X starting...\n", myNodeId);

  esp_now_init();
  esp_now_register_recv_cb(onRecv);
  esp_now_register_send_cb(onSent);

  esp_now_peer_info_t peer = {};
  memcpy(peer.peer_addr, broadcastMAC, 6);
  peer.channel = 6;
  esp_now_add_peer(&peer);

  randomSeed(esp_random());
  resetElectionTimer();
  updateDisplay();
}

// ---------- Main loop ----------
void loop() {
  unsigned long now = millis();

  // State machine
  switch (state) {
    case FOLLOWER:
      digitalWrite(LED_RED, LOW);
      digitalWrite(LED_GREEN, HIGH);
      if (now > electionTimeout) {
        startElection();
      }
      break;

    case CANDIDATE:
      digitalWrite(LED_RED, HIGH);
      digitalWrite(LED_GREEN, HIGH);
      if (voteCount >= 2) {  // Won election (self + 1 other)
        state = LEADER;
        leaderId = myNodeId;
        Serial.printf("[RAFT] Became leader for term %u\n", currentTerm);
      }
      if (now > electionTimeout) {
        startElection();  // Retry
      }
      break;

    case LEADER:
      digitalWrite(LED_RED, LOW);
      digitalWrite(LED_GREEN, LOW);
      if (now - lastHeartbeat > heartbeatInterval) {
        lastHeartbeat = now;
        sendHeartbeat();
      }
      break;
  }

  // Button increments shared value (leader only)
  if (state == LEADER && digitalRead(BTN_PIN) == LOW) {
    delay(200);
    sharedValue++;
    Serial.printf("[RAFT] Value -> %d\n", sharedValue);
    ConsensusMsg rep = {3, currentTerm, myNodeId, sharedValue};
    esp_now_send(broadcastMAC, (uint8_t *)&rep, sizeof(rep));
  }

  static unsigned long lastDisp = 0;
  if (now - lastDisp > 500) { lastDisp = now; updateDisplay(); }

  delay(10);
}
