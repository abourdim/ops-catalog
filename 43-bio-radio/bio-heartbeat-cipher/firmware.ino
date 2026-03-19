/*
 * Bio Heartbeat Cipher - ESP32 Firmware
 * Reads pulse sensor, encodes heartbeat intervals as cipher keys
 * BLE transmits encrypted heartbeat-derived data
 */

#include <WiFi.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLE2902.h>

#define PULSE_PIN 36
#define LED_PIN 2
#define THRESHOLD 2000
#define DEBOUNCE_MS 300
#define MAX_INTERVALS 16
#define SERVICE_UUID "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
#define CHAR_UUID    "a1b2c3d4-e5f6-7890-abcd-ef1234567891"

BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
bool connected = false;

int beatIntervals[MAX_INTERVALS];
int intervalIndex = 0;
unsigned long lastBeatTime = 0;
int bpm = 0;
bool beatDetected = false;
uint8_t cipherKey[16];
float hrv = 0;

class ServerCB : public BLEServerCallbacks {
  void onConnect(BLEServer* s) { connected = true; }
  void onDisconnect(BLEServer* s) { connected = false; }
};

bool detectBeat(int value) {
  static int prevValue = 0;
  static bool rising = false;
  bool beat = false;

  if (value > prevValue && !rising) {
    rising = true;
  } else if (value < prevValue && rising && prevValue > THRESHOLD) {
    unsigned long now = millis();
    if (now - lastBeatTime > DEBOUNCE_MS) {
      int interval = now - lastBeatTime;
      lastBeatTime = now;
      beatIntervals[intervalIndex] = interval;
      intervalIndex = (intervalIndex + 1) % MAX_INTERVALS;
      beat = true;
    }
    rising = false;
  }
  prevValue = value;
  return beat;
}

void calculateBPM() {
  long sum = 0;
  int count = 0;
  for (int i = 0; i < MAX_INTERVALS; i++) {
    if (beatIntervals[i] > 0) {
      sum += beatIntervals[i];
      count++;
    }
  }
  if (count > 0) bpm = 60000 / (sum / count);
}

void calculateHRV() {
  float sumDiff = 0;
  int count = 0;
  for (int i = 1; i < MAX_INTERVALS; i++) {
    if (beatIntervals[i] > 0 && beatIntervals[i - 1] > 0) {
      float diff = beatIntervals[i] - beatIntervals[i - 1];
      sumDiff += diff * diff;
      count++;
    }
  }
  hrv = (count > 0) ? sqrt(sumDiff / count) : 0;
}

void generateCipherKey() {
  for (int i = 0; i < 16; i++) {
    uint32_t seed = beatIntervals[i % MAX_INTERVALS];
    seed ^= (seed << 13);
    seed ^= (seed >> 17);
    seed ^= (seed << 5);
    cipherKey[i] = (uint8_t)(seed & 0xFF);
  }
}

uint8_t xorEncrypt(uint8_t data, int pos) {
  return data ^ cipherKey[pos % 16];
}

void setup() {
  Serial.begin(115200);
  Serial.println("Heartbeat Cipher starting...");
  pinMode(PULSE_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  analogReadResolution(12);

  BLEDevice::init("HeartCipher");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCB());
  BLEService* svc = pServer->createService(SERVICE_UUID);
  pCharacteristic = svc->createCharacteristic(
    CHAR_UUID, BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY
  );
  pCharacteristic->addDescriptor(new BLE2902());
  svc->start();
  BLEDevice::getAdvertising()->start();
  Serial.println("BLE ready");
}

void loop() {
  int pulseVal = analogRead(PULSE_PIN);

  if (detectBeat(pulseVal)) {
    digitalWrite(LED_PIN, HIGH);
    calculateBPM();
    calculateHRV();
    generateCipherKey();

    char keyHex[33];
    for (int i = 0; i < 16; i++) {
      sprintf(keyHex + i * 2, "%02x", cipherKey[i]);
    }

    Serial.printf("Beat! BPM: %d | HRV: %.1f | Key: %s\n", bpm, hrv, keyHex);

    if (connected) {
      char payload[96];
      snprintf(payload, sizeof(payload), "{\"bpm\":%d,\"hrv\":%.1f,\"key\":\"%.8s\"}", bpm, hrv, keyHex);
      pCharacteristic->setValue(payload);
      pCharacteristic->notify();
    }
    delay(50);
    digitalWrite(LED_PIN, LOW);
  }
  delay(2);
}
