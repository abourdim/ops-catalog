/*
 * Bio Heartbeat Mesh - ESP32 Firmware
 * Pulse sensor reads heartbeat, ESP-NOW mesh shares heartbeats
 * Creates synchronized heartbeat network for group biometrics
 */

#include <WiFi.h>
#include <esp_now.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLE2902.h>

#define PULSE_PIN 36
#define LED_PIN 2
#define MAX_PEERS 6
#define BEAT_THRESHOLD 2200
#define SERVICE_UUID "cd887766-5544-3322-1100-ffeeddccbbaa"
#define CHAR_UUID    "cd887766-5544-3322-1100-ffeeddccbba1"

BLECharacteristic* pChar = NULL;
bool bleConn = false;

struct HeartbeatData {
  uint8_t nodeId;
  uint16_t bpm;
  uint16_t interval;
  uint8_t sync;
};

struct PeerNode {
  uint8_t mac[6];
  uint16_t bpm;
  unsigned long lastSeen;
  bool active;
};

PeerNode peers[MAX_PEERS];
int peerCount = 0;
uint8_t myNodeId;
int myBPM = 0;
int lastInterval = 0;
unsigned long lastBeat = 0;
bool beatState = false;
int intervals[8];
int intIdx = 0;
float meshSyncScore = 0;

class BLECB : public BLEServerCallbacks {
  void onConnect(BLEServer* s) { bleConn = true; }
  void onDisconnect(BLEServer* s) { bleConn = false; }
};

void onDataRecv(const uint8_t* mac, const uint8_t* data, int len) {
  if (len != sizeof(HeartbeatData)) return;
  HeartbeatData* hb = (HeartbeatData*)data;

  int idx = -1;
  for (int i = 0; i < peerCount; i++) {
    if (peers[i].active && memcmp(peers[i].mac, mac, 6) == 0) { idx = i; break; }
  }
  if (idx < 0 && peerCount < MAX_PEERS) {
    idx = peerCount++;
    memcpy(peers[idx].mac, mac, 6);
    peers[idx].active = true;
  }
  if (idx >= 0) {
    peers[idx].bpm = hb->bpm;
    peers[idx].lastSeen = millis();
  }
}

void broadcastHeartbeat() {
  HeartbeatData hb;
  hb.nodeId = myNodeId;
  hb.bpm = myBPM;
  hb.interval = lastInterval;
  hb.sync = (uint8_t)(meshSyncScore * 100);

  uint8_t broadcast[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
  esp_now_send(broadcast, (uint8_t*)&hb, sizeof(hb));
}

bool detectBeat(int value) {
  static int prev = 0;
  static bool rising = false;
  bool beat = false;

  if (value > prev && !rising) rising = true;
  else if (value < prev && rising && prev > BEAT_THRESHOLD) {
    unsigned long now = millis();
    if (now - lastBeat > 300) {
      lastInterval = now - lastBeat;
      lastBeat = now;
      intervals[intIdx] = lastInterval;
      intIdx = (intIdx + 1) % 8;
      beat = true;
    }
    rising = false;
  }
  prev = value;
  return beat;
}

void calculateBPM() {
  long sum = 0; int cnt = 0;
  for (int i = 0; i < 8; i++) {
    if (intervals[i] > 0) { sum += intervals[i]; cnt++; }
  }
  if (cnt > 0) myBPM = 60000 / (sum / cnt);
}

void calculateMeshSync() {
  if (peerCount == 0) { meshSyncScore = 0; return; }
  float totalDiff = 0;
  int activePeers = 0;
  for (int i = 0; i < peerCount; i++) {
    if (peers[i].active && millis() - peers[i].lastSeen < 5000) {
      totalDiff += abs(myBPM - peers[i].bpm);
      activePeers++;
    }
  }
  if (activePeers > 0) {
    float avgDiff = totalDiff / activePeers;
    meshSyncScore = max(0.0f, 1.0f - avgDiff / 30.0f);
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("Heartbeat Mesh starting...");
  pinMode(PULSE_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  analogReadResolution(12);

  WiFi.mode(WIFI_STA);
  myNodeId = WiFi.macAddress()[5];
  esp_now_init();
  esp_now_register_recv_cb(onDataRecv);

  esp_now_peer_info_t peer;
  memset(&peer, 0, sizeof(peer));
  memset(peer.peer_addr, 0xFF, 6);
  peer.channel = 0;
  peer.encrypt = false;
  esp_now_add_peer(&peer);

  BLEDevice::init("HeartMesh");
  BLEServer* srv = BLEDevice::createServer();
  srv->setCallbacks(new BLECB());
  BLEService* svc = srv->createService(SERVICE_UUID);
  pChar = svc->createCharacteristic(CHAR_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
  pChar->addDescriptor(new BLE2902());
  svc->start();
  BLEDevice::getAdvertising()->start();
}

void loop() {
  int pulse = analogRead(PULSE_PIN);

  if (detectBeat(pulse)) {
    calculateBPM();
    calculateMeshSync();
    broadcastHeartbeat();

    analogWrite(LED_PIN, 255);
    Serial.printf("Beat! BPM: %d | Peers: %d | Sync: %.0f%%\n",
      myBPM, peerCount, meshSyncScore * 100);

    if (bleConn) {
      char buf[128];
      snprintf(buf, sizeof(buf), "{\"bpm\":%d,\"peers\":%d,\"sync\":%.0f}",
        myBPM, peerCount, meshSyncScore * 100);
      pChar->setValue(buf);
      pChar->notify();
    }
    delay(30);
    analogWrite(LED_PIN, 0);
  }
  delay(2);
}
