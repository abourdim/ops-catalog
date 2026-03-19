/*
 * ESP Tor Relay - firmware.ino
 * Demonstrates onion-style multi-hop encrypted message relay
 * using ESP-NOW. Each ESP32 node peels one encryption layer
 * and forwards to the next hop.
 *
 * Hardware: ESP32 DevKit + OLED SSD1306 for status display
 * Wiring:  SDA -> GPIO21, SCL -> GPIO22
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_wifi.h>
#include <mbedtls/aes.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

// ---------- OLED ----------
#define SCREEN_W 128
#define SCREEN_H 64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);

// ---------- Pins ----------
#define LED_PIN   2
#define BTN_SEND  4  // Trigger test message

// ---------- Node config ----------
// Each relay has a unique ID (0=entry, 1=middle, 2=exit)
#define NODE_ID   0
#define NUM_NODES 3

// Per-node AES keys (each node has its own layer key)
static const uint8_t nodeKeys[NUM_NODES][16] = {
  {0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0A,0x0B,0x0C,0x0D,0x0E,0x0F,0x10},
  {0x11,0x12,0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x1A,0x1B,0x1C,0x1D,0x1E,0x1F,0x20},
  {0x21,0x22,0x23,0x24,0x25,0x26,0x27,0x28,0x29,0x2A,0x2B,0x2C,0x2D,0x2E,0x2F,0x30},
};

// Next-hop MAC addresses (configure for your hardware)
static uint8_t nextHopMAC[NUM_NODES][6] = {
  {0xFF,0xFF,0xFF,0xFF,0xFF,0x01},  // node 0 -> node 1
  {0xFF,0xFF,0xFF,0xFF,0xFF,0x02},  // node 1 -> node 2
  {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF},  // node 2 (exit) -> broadcast
};

// ---------- Relay packet structure ----------
typedef struct __attribute__((packed)) {
  uint8_t hopCount;
  uint8_t payload[224];  // Layered encrypted data
} RelayPacket;

static mbedtls_aes_context aesCtx;
static volatile bool gotPacket = false;
static RelayPacket rxPacket;

// ---------- ESP-NOW callbacks ----------
void onRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len == sizeof(RelayPacket)) {
    memcpy(&rxPacket, data, len);
    gotPacket = true;
  }
}

void onSent(const uint8_t *mac, esp_now_send_status_t status) {
  Serial.printf("[RELAY] Send %s\n", status == ESP_NOW_SEND_SUCCESS ? "OK" : "FAIL");
}

// ---------- Peel one encryption layer ----------
void peelLayer(RelayPacket *pkt) {
  uint8_t iv[16] = {0};
  mbedtls_aes_setkey_dec(&aesCtx, nodeKeys[NODE_ID], 128);
  mbedtls_aes_crypt_cbc(&aesCtx, MBEDTLS_AES_DECRYPT,
                         sizeof(pkt->payload), iv,
                         pkt->payload, pkt->payload);
  pkt->hopCount++;
}

// ---------- Build onion-wrapped test message ----------
void buildOnionMessage(RelayPacket *pkt, const char *msg) {
  memset(pkt, 0, sizeof(RelayPacket));
  pkt->hopCount = 0;
  strncpy((char *)pkt->payload, msg, sizeof(pkt->payload) - 1);

  // Wrap layers: exit key first, then middle, then entry
  for (int i = NUM_NODES - 1; i >= 0; i--) {
    uint8_t iv[16] = {0};
    mbedtls_aes_setkey_enc(&aesCtx, nodeKeys[i], 128);
    mbedtls_aes_crypt_cbc(&aesCtx, MBEDTLS_AES_ENCRYPT,
                           sizeof(pkt->payload), iv,
                           pkt->payload, pkt->payload);
  }
}

// ---------- Display status ----------
void updateDisplay(const char *status) {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(0, 0);
  oled.printf("Tor Relay Node #%d", NODE_ID);
  oled.setCursor(0, 16);
  oled.print(status);
  oled.setCursor(0, 40);
  oled.printf("Hops processed: %lu", (unsigned long)rxPacket.hopCount);
  oled.display();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.printf("[TorRelay] Node %d starting...\n", NODE_ID);

  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_SEND, INPUT_PULLUP);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  updateDisplay("Initializing...");

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  esp_wifi_set_channel(6, WIFI_SECOND_CHAN_NONE);

  mbedtls_aes_init(&aesCtx);

  esp_now_init();
  esp_now_register_recv_cb(onRecv);
  esp_now_register_send_cb(onSent);

  // Register next hop peer
  esp_now_peer_info_t peer = {};
  memcpy(peer.peer_addr, nextHopMAC[NODE_ID], 6);
  peer.channel = 6;
  esp_now_add_peer(&peer);

  updateDisplay("Ready");
  Serial.println("[TorRelay] Ready.");
}

// ---------- Main loop ----------
void loop() {
  // Send test onion message from entry node
  if (NODE_ID == 0 && digitalRead(BTN_SEND) == LOW) {
    delay(200);
    RelayPacket pkt;
    buildOnionMessage(&pkt, "Hello from the dark side!");
    peelLayer(&pkt);  // Peel our own layer
    esp_now_send(nextHopMAC[NODE_ID], (uint8_t *)&pkt, sizeof(pkt));
    updateDisplay("Sent onion msg");
    Serial.println("[RELAY] Onion message sent!");
  }

  // Process received relay packet
  if (gotPacket) {
    gotPacket = false;
    digitalWrite(LED_PIN, HIGH);
    peelLayer(&rxPacket);

    if (NODE_ID == NUM_NODES - 1) {
      // Exit node: print decrypted message
      Serial.printf("[EXIT] Decrypted: %s\n", (char *)rxPacket.payload);
      updateDisplay("EXIT: msg decrypted");
    } else {
      // Forward to next hop
      esp_now_send(nextHopMAC[NODE_ID], (uint8_t *)&rxPacket, sizeof(rxPacket));
      updateDisplay("Forwarded packet");
    }
    delay(100);
    digitalWrite(LED_PIN, LOW);
  }

  delay(10);
}
