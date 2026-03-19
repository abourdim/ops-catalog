/*
 * ESP Digi-Repeater - firmware.ino
 * Digital voice / data repeater using LoRa. Receives packets
 * on one frequency, optionally filters/modifies them, and
 * retransmits. Implements basic digipeater functionality.
 *
 * Hardware: ESP32 + SX1276 LoRa module + OLED SSD1306
 * Wiring:  LoRa NSS->GPIO18, RST->GPIO14, DIO0->GPIO26
 */

#include <SPI.h>
#include <LoRa.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_W 128
#define SCREEN_H  64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);

#define LORA_NSS  18
#define LORA_RST  14
#define LORA_DIO0 26
#define LED_RX     2
#define LED_TX    16
#define BTN_MODE   4

// ---------- Config ----------
static const long RX_FREQ = 433775000;  // Receive frequency
static const long TX_FREQ = 433775000;  // Transmit frequency (same for simplex)
static const char *DIGI_CALL = "N0CALL-1";
static int maxHops = 3;
static bool repeaterActive = true;

// ---------- Packet structure ----------
typedef struct __attribute__((packed)) {
  char source[10];
  char dest[10];
  uint8_t hopCount;
  char path[40];     // Digipeater path
  uint8_t payloadLen;
  char payload[180];
} DigiPacket;

// ---------- Stats ----------
static uint32_t rxCount = 0;
static uint32_t txCount = 0;
static uint32_t droppedCount = 0;
static uint32_t duplicateCount = 0;

// Duplicate detection (last N packet hashes)
#define DUP_TABLE_SIZE 32
static uint32_t dupTable[DUP_TABLE_SIZE];
static int dupIdx = 0;

uint32_t hashPacket(const DigiPacket &pkt) {
  uint32_t h = 5381;
  for (int i = 0; i < 10; i++) h = h * 33 + pkt.source[i];
  for (int i = 0; i < (int)pkt.payloadLen; i++) h = h * 33 + pkt.payload[i];
  return h;
}

bool isDuplicate(uint32_t h) {
  for (int i = 0; i < DUP_TABLE_SIZE; i++) {
    if (dupTable[i] == h) return true;
  }
  dupTable[dupIdx % DUP_TABLE_SIZE] = h;
  dupIdx++;
  return false;
}

// ---------- Process and repeat ----------
void processPacket(DigiPacket &pkt, int rssi, float snr) {
  rxCount++;
  uint32_t h = hashPacket(pkt);

  Serial.printf("[RX] From=%s To=%s Hops=%d RSSI=%d SNR=%.1f\n",
                pkt.source, pkt.dest, pkt.hopCount, rssi, snr);
  Serial.printf("[RX] Path: %s\n", pkt.path);
  Serial.printf("[RX] Payload: %.*s\n", pkt.payloadLen, pkt.payload);

  // Check for duplicates
  if (isDuplicate(h)) {
    duplicateCount++;
    Serial.println("[DIGI] Duplicate, dropping.");
    return;
  }

  // Check hop limit
  if (pkt.hopCount >= maxHops) {
    droppedCount++;
    Serial.println("[DIGI] Max hops reached, dropping.");
    return;
  }

  if (!repeaterActive) return;

  // Add our callsign to the path
  pkt.hopCount++;
  char newPath[40];
  snprintf(newPath, 40, "%s,%s*", pkt.path, DIGI_CALL);
  strncpy(pkt.path, newPath, 39);

  // Retransmit
  delay(random(100, 500));  // Random delay to avoid collisions

  LoRa.setFrequency(TX_FREQ);
  LoRa.beginPacket();
  LoRa.write((uint8_t *)&pkt, sizeof(pkt));
  LoRa.endPacket();
  LoRa.setFrequency(RX_FREQ);

  txCount++;
  Serial.printf("[TX] Repeated: %s -> %s (hop %d)\n",
                pkt.source, pkt.dest, pkt.hopCount);

  digitalWrite(LED_TX, HIGH);
  delay(100);
  digitalWrite(LED_TX, LOW);
}

// ---------- Display ----------
void updateDisplay() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);

  oled.setCursor(0, 0);
  oled.printf("Digi %s %s", DIGI_CALL, repeaterActive ? "ON" : "OFF");
  oled.setCursor(0, 12);
  oled.printf("RX:%.3fM TX:%.3fM", RX_FREQ / 1e6, TX_FREQ / 1e6);
  oled.setCursor(0, 24);
  oled.printf("Heard:%u Rpt:%u", rxCount, txCount);
  oled.setCursor(0, 36);
  oled.printf("Drop:%u Dup:%u", droppedCount, duplicateCount);
  oled.setCursor(0, 48);
  oled.printf("MaxHops:%d", maxHops);

  oled.display();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[DigiRpt] Starting...");

  pinMode(LED_RX, OUTPUT);
  pinMode(LED_TX, OUTPUT);
  pinMode(BTN_MODE, INPUT_PULLUP);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  SPI.begin(5, 19, 27, LORA_NSS);
  LoRa.setPins(LORA_NSS, LORA_RST, LORA_DIO0);

  if (!LoRa.begin(RX_FREQ)) {
    Serial.println("[LoRa] Init failed!");
    oled.clearDisplay();
    oled.setCursor(10, 28);
    oled.print("LoRa FAILED!");
    oled.display();
    while (true) delay(1000);
  }

  LoRa.setSpreadingFactor(12);
  LoRa.setSignalBandwidth(125000);
  LoRa.setTxPower(17);

  memset(dupTable, 0, sizeof(dupTable));
  Serial.printf("[DigiRpt] %s Ready. RX=%.3fMHz\n", DIGI_CALL, RX_FREQ / 1e6);
  updateDisplay();
}

// ---------- Main loop ----------
void loop() {
  // Check for incoming LoRa packets
  int pktSize = LoRa.parsePacket();
  if (pktSize == sizeof(DigiPacket)) {
    DigiPacket pkt;
    uint8_t *buf = (uint8_t *)&pkt;
    for (int i = 0; i < pktSize; i++) buf[i] = LoRa.read();

    int rssi = LoRa.packetRssi();
    float snr = LoRa.packetSnr();

    digitalWrite(LED_RX, HIGH);
    processPacket(pkt, rssi, snr);
    delay(50);
    digitalWrite(LED_RX, LOW);
  }

  // Toggle button
  if (digitalRead(BTN_MODE) == LOW) {
    delay(200);
    repeaterActive = !repeaterActive;
    Serial.printf("[DIGI] Repeater %s\n", repeaterActive ? "ON" : "OFF");
  }

  static unsigned long lastDisp = 0;
  if (millis() - lastDisp > 1000) { lastDisp = millis(); updateDisplay(); }

  delay(10);
}
