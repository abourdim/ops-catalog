/*
 * Bio Sweat Sensor Crypto - ESP32 Firmware
 * GSR sensor measures sweat/stress levels for crypto key generation
 * Unique electrodermal activity creates entropy for encryption
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLE2902.h>
#include <math.h>

#define GSR_PIN 36
#define GSR_PIN2 39
#define LED_PIN 2
#define ENTROPY_POOL_SIZE 32
#define KEY_SIZE 16
#define SERVICE_UUID "de998877-6655-4433-2211-ffeeddccbb00"
#define CHAR_UUID    "de998877-6655-4433-2211-ffeeddccbb01"

BLECharacteristic* pChar = NULL;
bool bleConn = false;

float gsrHistory[256];
int histIdx = 0;
uint8_t entropyPool[ENTROPY_POOL_SIZE];
uint8_t cryptoKey[KEY_SIZE];
float stressLevel = 0;
float conductance = 0;
float sweatRate = 0;
int entropyBits = 0;
unsigned long lastKeyGen = 0;

class BLECB : public BLEServerCallbacks {
  void onConnect(BLEServer* s) { bleConn = true; }
  void onDisconnect(BLEServer* s) { bleConn = false; }
};

float readGSR() {
  int r1 = analogRead(GSR_PIN);
  int r2 = analogRead(GSR_PIN2);
  float voltage = abs(r1 - r2) * 3.3 / 4095.0;
  conductance = (voltage > 0.01) ? 1.0 / (voltage * 10000) * 1000000 : 0;
  return conductance;
}

void harvestEntropy(float gsrValue) {
  uint32_t raw = *(uint32_t*)&gsrValue;
  uint8_t lsb = raw & 0xFF;
  uint8_t noise = (raw >> 8) ^ (raw >> 16) ^ (raw >> 24);

  int poolIdx = entropyBits % ENTROPY_POOL_SIZE;
  entropyPool[poolIdx] ^= lsb;
  entropyPool[(poolIdx + 1) % ENTROPY_POOL_SIZE] ^= noise;
  entropyPool[(poolIdx + 2) % ENTROPY_POOL_SIZE] ^= (uint8_t)(millis() & 0xFF);
  entropyBits++;
}

void mixEntropyPool() {
  for (int round = 0; round < 4; round++) {
    for (int i = 0; i < ENTROPY_POOL_SIZE; i++) {
      uint8_t mixed = entropyPool[i];
      mixed ^= entropyPool[(i + 7) % ENTROPY_POOL_SIZE];
      mixed = (mixed << 3) | (mixed >> 5);
      mixed += entropyPool[(i + 13) % ENTROPY_POOL_SIZE];
      entropyPool[i] = mixed;
    }
  }
}

void generateCryptoKey() {
  mixEntropyPool();
  for (int i = 0; i < KEY_SIZE; i++) {
    cryptoKey[i] = entropyPool[i] ^ entropyPool[i + KEY_SIZE];
  }
  lastKeyGen = millis();
}

void calculateStress() {
  if (histIdx < 10) return;
  float recentAvg = 0, olderAvg = 0;
  int recentCount = min(histIdx, 20);
  int start = max(0, histIdx - recentCount);
  for (int i = start; i < histIdx; i++) {
    recentAvg += gsrHistory[i % 256];
  }
  recentAvg /= recentCount;

  int olderStart = max(0, start - 20);
  int olderCount = start - olderStart;
  if (olderCount > 0) {
    for (int i = olderStart; i < start; i++) {
      olderAvg += gsrHistory[i % 256];
    }
    olderAvg /= olderCount;
    sweatRate = recentAvg - olderAvg;
  }
  stressLevel = constrain(sweatRate * 100, 0, 100);
}

float estimateEntropy() {
  int counts[256] = {0};
  for (int i = 0; i < ENTROPY_POOL_SIZE; i++) {
    counts[entropyPool[i]]++;
  }
  float entropy = 0;
  for (int i = 0; i < 256; i++) {
    if (counts[i] > 0) {
      float p = (float)counts[i] / ENTROPY_POOL_SIZE;
      entropy -= p * log2(p);
    }
  }
  return entropy;
}

void setup() {
  Serial.begin(115200);
  Serial.println("Sweat Sensor Crypto starting...");
  pinMode(GSR_PIN, INPUT);
  pinMode(GSR_PIN2, INPUT);
  pinMode(LED_PIN, OUTPUT);
  analogReadResolution(12);
  memset(entropyPool, 0, ENTROPY_POOL_SIZE);

  BLEDevice::init("SweatCrypto");
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
  float gsr = readGSR();
  gsrHistory[histIdx % 256] = gsr;
  histIdx++;
  harvestEntropy(gsr);
  calculateStress();

  int brightness = (int)(stressLevel * 2.55);
  analogWrite(LED_PIN, brightness);

  if (entropyBits > 0 && entropyBits % 64 == 0) {
    generateCryptoKey();
    float ent = estimateEntropy();
    char keyHex[33];
    for (int i = 0; i < KEY_SIZE; i++) sprintf(keyHex + i * 2, "%02x", cryptoKey[i]);

    Serial.printf("Key: %s | Entropy: %.2f bits | Stress: %.0f%%\n",
      keyHex, ent, stressLevel);

    if (bleConn) {
      char buf[128];
      snprintf(buf, sizeof(buf), "{\"key\":\"%.16s\",\"entropy\":%.1f,\"stress\":%.0f}",
        keyHex, ent, stressLevel);
      pChar->setValue(buf);
      pChar->notify();
    }
  }
  delay(50);
}
