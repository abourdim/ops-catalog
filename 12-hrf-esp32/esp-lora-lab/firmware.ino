/*
 * ESP LoRa Lab - firmware.ino
 * LoRa radio experimentation platform. Transmit and receive
 * LoRa packets, test different spreading factors, bandwidth,
 * and coding rates. Measures RSSI, SNR, and packet loss.
 *
 * Hardware: ESP32 + SX1276 LoRa module (e.g., Heltec WiFi LoRa 32)
 * Wiring:  NSS->GPIO18, RST->GPIO14, DIO0->GPIO26, SCK->GPIO5,
 *          MISO->GPIO19, MOSI->GPIO27
 */

#include <SPI.h>
#include <LoRa.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

// ---------- LoRa pins ----------
#define LORA_NSS   18
#define LORA_RST   14
#define LORA_DIO0  26
#define LORA_SCK    5
#define LORA_MISO  19
#define LORA_MOSI  27

// ---------- OLED ----------
#define SCREEN_W 128
#define SCREEN_H  64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);

#define LED_PIN    2
#define BTN_TX     0   // Transmit button
#define BTN_MODE  15   // Cycle parameters

// ---------- LoRa parameters ----------
static long frequency = 915000000;  // 915 MHz (US ISM band)
static int spreadingFactor = 7;     // 7-12
static long bandwidth = 125000;     // 125kHz
static int codingRate = 5;          // 5-8 (4/5 to 4/8)
static int txPower = 17;            // dBm

// ---------- Stats ----------
static uint32_t txCount = 0;
static uint32_t rxCount = 0;
static uint32_t rxErrors = 0;
static int lastRSSI = 0;
static float lastSNR = 0.0;
static int paramSelect = 0;  // Which param to adjust

// Test packet structure
typedef struct __attribute__((packed)) {
  uint32_t seqNum;
  uint32_t senderId;
  int32_t  payload;
  uint16_t crc;
} LoRaPacket;

// ---------- Apply LoRa settings ----------
void applySettings() {
  LoRa.setSpreadingFactor(spreadingFactor);
  LoRa.setSignalBandwidth(bandwidth);
  LoRa.setCodingRate4(codingRate);
  LoRa.setTxPower(txPower);
  Serial.printf("[LORA] SF=%d BW=%ld CR=4/%d Pwr=%d\n",
                spreadingFactor, bandwidth / 1000, codingRate, txPower);
}

// ---------- Calculate simple CRC ----------
uint16_t calcCRC(const uint8_t *data, int len) {
  uint16_t crc = 0xFFFF;
  for (int i = 0; i < len; i++) {
    crc ^= data[i];
    for (int j = 0; j < 8; j++) {
      crc = (crc & 1) ? (crc >> 1) ^ 0xA001 : crc >> 1;
    }
  }
  return crc;
}

// ---------- Transmit packet ----------
void transmitPacket() {
  LoRaPacket pkt;
  pkt.seqNum = txCount;
  pkt.senderId = ESP.getEfuseMac() & 0xFFFFFFFF;
  pkt.payload = millis();
  pkt.crc = calcCRC((uint8_t *)&pkt, sizeof(pkt) - 2);

  LoRa.beginPacket();
  LoRa.write((uint8_t *)&pkt, sizeof(pkt));
  LoRa.endPacket();
  txCount++;

  Serial.printf("[TX] Seq=%u Size=%d\n", pkt.seqNum, sizeof(pkt));
  digitalWrite(LED_PIN, HIGH);
  delay(50);
  digitalWrite(LED_PIN, LOW);
}

// ---------- Receive check ----------
void checkReceive() {
  int packetSize = LoRa.parsePacket();
  if (packetSize == 0) return;

  if (packetSize != sizeof(LoRaPacket)) {
    rxErrors++;
    Serial.printf("[RX] Bad size: %d\n", packetSize);
    return;
  }

  LoRaPacket pkt;
  uint8_t *buf = (uint8_t *)&pkt;
  for (int i = 0; i < packetSize; i++) {
    buf[i] = LoRa.read();
  }

  lastRSSI = LoRa.packetRssi();
  lastSNR = LoRa.packetSnr();

  uint16_t checkCRC = calcCRC(buf, sizeof(pkt) - 2);
  if (checkCRC != pkt.crc) {
    rxErrors++;
    Serial.printf("[RX] CRC error! Got %04X expected %04X\n", checkCRC, pkt.crc);
    return;
  }

  rxCount++;
  Serial.printf("[RX] Seq=%u From=%08X RSSI=%d SNR=%.1f\n",
                pkt.seqNum, pkt.senderId, lastRSSI, lastSNR);
}

// ---------- Display ----------
void updateDisplay() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);

  oled.setCursor(0, 0);
  oled.printf("LoRa Lab  %.1fMHz", frequency / 1e6);
  oled.setCursor(0, 10);
  oled.printf("SF:%d BW:%ldK CR:4/%d", spreadingFactor, bandwidth / 1000, codingRate);
  oled.setCursor(0, 20);
  oled.printf("Power: %d dBm", txPower);
  oled.setCursor(0, 32);
  oled.printf("TX:%u  RX:%u  Err:%u", txCount, rxCount, rxErrors);
  oled.setCursor(0, 42);
  oled.printf("RSSI:%d  SNR:%.1f", lastRSSI, lastSNR);

  // Param selector indicator
  oled.setCursor(0, 54);
  const char *params[] = {"SF", "BW", "CR", "PWR"};
  for (int i = 0; i < 4; i++) {
    if (i == paramSelect) oled.print("[");
    oled.print(params[i]);
    if (i == paramSelect) oled.print("]");
    oled.print(" ");
  }

  oled.display();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[LoRaLab] Starting...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_TX, INPUT_PULLUP);
  pinMode(BTN_MODE, INPUT_PULLUP);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  SPI.begin(LORA_SCK, LORA_MISO, LORA_MOSI, LORA_NSS);
  LoRa.setPins(LORA_NSS, LORA_RST, LORA_DIO0);

  if (!LoRa.begin(frequency)) {
    Serial.println("[LORA] Init failed!");
    oled.clearDisplay();
    oled.setCursor(10, 28);
    oled.print("LoRa FAILED!");
    oled.display();
    while (true) delay(1000);
  }

  applySettings();
  Serial.println("[LoRaLab] Ready.");
  updateDisplay();
}

// ---------- Main loop ----------
void loop() {
  // TX button
  if (digitalRead(BTN_TX) == LOW) {
    delay(200);
    transmitPacket();
    updateDisplay();
  }

  // Mode button: cycle parameter
  if (digitalRead(BTN_MODE) == LOW) {
    delay(200);
    paramSelect = (paramSelect + 1) % 4;
    // Long press adjusts value
    if (digitalRead(BTN_MODE) == LOW) {
      delay(500);
      switch (paramSelect) {
        case 0: spreadingFactor = (spreadingFactor - 6) % 6 + 7; break;
        case 1: bandwidth = bandwidth == 125000 ? 250000 : 125000; break;
        case 2: codingRate = (codingRate - 4) % 4 + 5; break;
        case 3: txPower = txPower >= 20 ? 2 : txPower + 2; break;
      }
      applySettings();
    }
    updateDisplay();
  }

  // Check for incoming packets
  checkReceive();

  // Periodic display update
  static unsigned long lastDisp = 0;
  if (millis() - lastDisp > 1000) {
    lastDisp = millis();
    updateDisplay();
  }

  delay(10);
}
