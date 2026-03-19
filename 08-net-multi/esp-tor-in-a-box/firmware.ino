/*
 * ESP Tor In A Box - firmware.ino
 * Self-contained onion routing demonstration using 3+ ESP32
 * nodes forming entry, relay, and exit roles. Each node
 * manages circuit building and layered encryption.
 *
 * Hardware: ESP32 DevKit + OLED SSD1306 + 3 LEDs
 * Wiring:  SDA->GPIO21, SCL->GPIO22, LEDs: GPIO4,GPIO16,GPIO17
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_wifi.h>
#include <mbedtls/aes.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_W 128
#define SCREEN_H  64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);

// Role LEDs
#define LED_ENTRY  4
#define LED_RELAY 16
#define LED_EXIT  17
#define BTN_PIN    0

// ---------- Node roles ----------
// Set per device: 0=entry, 1=relay, 2=exit
#define MY_ROLE    0
static const char *roleNames[] = {"ENTRY", "RELAY", "EXIT"};

// ---------- Circuit ----------
#define MAX_CIRCUITS 4
typedef struct {
  uint16_t circuitId;
  uint8_t prevHop[6];
  uint8_t nextHop[6];
  uint8_t layerKey[16];  // Session key for this circuit
  bool active;
} Circuit;

static Circuit circuits[MAX_CIRCUITS];
static int circuitCount = 0;
static uint32_t myNodeId;
static mbedtls_aes_context aes;

// Stats
static uint32_t cellsForwarded = 0;
static uint32_t circuitsBuilt = 0;

static uint8_t broadcastMAC[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};

// ---------- Onion cell ----------
typedef struct __attribute__((packed)) {
  uint8_t  cellType;    // 0=create, 1=relay, 2=destroy
  uint16_t circuitId;
  uint8_t  role;
  uint32_t senderId;
  uint8_t  payload[200];
} OnionCell;

// ---------- Create circuit ----------
void createCircuit(uint16_t cid, const uint8_t *from, const uint8_t *to) {
  if (circuitCount >= MAX_CIRCUITS) return;
  Circuit &c = circuits[circuitCount];
  c.circuitId = cid;
  memcpy(c.prevHop, from, 6);
  memcpy(c.nextHop, to, 6);
  c.active = true;
  // Generate session key
  for (int i = 0; i < 16; i++) c.layerKey[i] = random(256);
  circuitCount++;
  circuitsBuilt++;
}

// ---------- Find circuit ----------
Circuit* findCircuit(uint16_t cid) {
  for (int i = 0; i < circuitCount; i++) {
    if (circuits[i].circuitId == cid && circuits[i].active) return &circuits[i];
  }
  return NULL;
}

// ---------- Process onion cell ----------
void processCell(const uint8_t *mac, const OnionCell &cell) {
  if (cell.cellType == 0) {
    // Create circuit
    createCircuit(cell.circuitId, mac, broadcastMAC);
    Serial.printf("[TOR] Circuit %d created (%s node)\n",
                  cell.circuitId, roleNames[MY_ROLE]);
  }
  else if (cell.cellType == 1) {
    // Relay cell - peel/add encryption layer and forward
    Circuit *c = findCircuit(cell.circuitId);
    if (!c) return;

    OnionCell fwd;
    memcpy(&fwd, &cell, sizeof(OnionCell));
    fwd.senderId = myNodeId;

    // Decrypt one layer (or encrypt if going backward)
    uint8_t iv[16] = {0};
    mbedtls_aes_setkey_dec(&aes, c->layerKey, 128);
    mbedtls_aes_crypt_cbc(&aes, MBEDTLS_AES_DECRYPT,
                           sizeof(fwd.payload), iv,
                           fwd.payload, fwd.payload);

    if (MY_ROLE == 2) {
      // Exit node: deliver payload
      Serial.printf("[EXIT] Delivered: %.32s\n", fwd.payload);
    } else {
      // Forward to next hop
      esp_now_send(c->nextHop, (uint8_t *)&fwd, sizeof(fwd));
    }
    cellsForwarded++;
  }
  else if (cell.cellType == 2) {
    // Destroy circuit
    Circuit *c = findCircuit(cell.circuitId);
    if (c) {
      c->active = false;
      Serial.printf("[TOR] Circuit %d destroyed\n", cell.circuitId);
    }
  }
}

// ---------- ESP-NOW callbacks ----------
void onRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(OnionCell)) return;
  OnionCell cell;
  memcpy(&cell, data, len);
  processCell(mac, cell);
}

void onSent(const uint8_t *mac, esp_now_send_status_t s) {}

// ---------- Display ----------
void updateDisplay() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(0, 0);
  oled.printf("Tor In A Box [%s]", roleNames[MY_ROLE]);
  oled.setCursor(0, 12);
  oled.printf("Node: %08X", myNodeId);
  oled.setCursor(0, 24);
  oled.printf("Circuits: %d/%d", circuitCount, MAX_CIRCUITS);
  oled.setCursor(0, 36);
  oled.printf("Built: %u  Fwd: %u", circuitsBuilt, cellsForwarded);

  // Circuit status
  for (int i = 0; i < min(circuitCount, 3); i++) {
    oled.setCursor(0, 48 + i * 8);
    oled.printf("CID %d: %s", circuits[i].circuitId,
                circuits[i].active ? "ACTIVE" : "dead");
  }
  oled.display();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  myNodeId = ESP.getEfuseMac() & 0xFFFFFFFF;
  Serial.printf("[TorBox] %s node %08X starting...\n", roleNames[MY_ROLE], myNodeId);

  pinMode(LED_ENTRY, OUTPUT);
  pinMode(LED_RELAY, OUTPUT);
  pinMode(LED_EXIT, OUTPUT);
  pinMode(BTN_PIN, INPUT_PULLUP);

  // Light role LED
  digitalWrite(LED_ENTRY, MY_ROLE == 0);
  digitalWrite(LED_RELAY, MY_ROLE == 1);
  digitalWrite(LED_EXIT, MY_ROLE == 2);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  esp_wifi_set_channel(6, WIFI_SECOND_CHAN_NONE);

  mbedtls_aes_init(&aes);

  esp_now_init();
  esp_now_register_recv_cb(onRecv);
  esp_now_register_send_cb(onSent);

  esp_now_peer_info_t peer = {};
  memcpy(peer.peer_addr, broadcastMAC, 6);
  peer.channel = 6;
  esp_now_add_peer(&peer);

  randomSeed(esp_random());
  updateDisplay();
}

// ---------- Main loop ----------
void loop() {
  // Entry node: button sends test message through circuit
  if (MY_ROLE == 0 && digitalRead(BTN_PIN) == LOW) {
    delay(200);
    // Build circuit
    uint16_t cid = random(1000, 9999);
    OnionCell create = {0, cid, 0, myNodeId, {0}};
    esp_now_send(broadcastMAC, (uint8_t *)&create, sizeof(create));

    delay(500);

    // Send relay cell with wrapped payload
    OnionCell relay = {1, cid, 0, myNodeId, {0}};
    strncpy((char *)relay.payload, "Tor test message!", sizeof(relay.payload));

    // Triple encrypt (exit, relay, entry keys)
    uint8_t iv[16] = {0};
    for (int layer = 2; layer >= 0; layer--) {
      uint8_t key[16];
      for (int i = 0; i < 16; i++) key[i] = (layer + 1) * 17 + i;
      mbedtls_aes_setkey_enc(&aes, key, 128);
      memset(iv, 0, 16);
      mbedtls_aes_crypt_cbc(&aes, MBEDTLS_AES_ENCRYPT,
                             sizeof(relay.payload), iv,
                             relay.payload, relay.payload);
    }
    esp_now_send(broadcastMAC, (uint8_t *)&relay, sizeof(relay));
    Serial.println("[ENTRY] Onion message sent!");
  }

  static unsigned long lastDisp = 0;
  if (millis() - lastDisp > 1000) { lastDisp = millis(); updateDisplay(); }

  delay(10);
}
