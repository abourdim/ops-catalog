/*
 * Bio Skin Galvanic Key - ESP32 Firmware
 * Reads Galvanic Skin Response (GSR) for biometric authentication
 * Generates unique keys from skin conductance patterns via BLE
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLE2902.h>

#define GSR_PIN 36
#define GSR_REF_PIN 39
#define LED_PIN 2
#define NUM_SAMPLES 64
#define AUTH_THRESHOLD 0.85
#define SERVICE_UUID "cc112233-4455-6677-8899-aabbccddeeff"
#define CHAR_UUID    "cc112233-4455-6677-8899-aabbccddef00"

BLECharacteristic* pChar = NULL;
bool bleConn = false;

float gsrProfile[NUM_SAMPLES];
float enrolledProfile[NUM_SAMPLES];
bool enrolled = false;
float conductance = 0;
float skinKey[8];
int sampleIdx = 0;
float matchScore = 0;

class BLECB : public BLEServerCallbacks {
  void onConnect(BLEServer* s) { bleConn = true; }
  void onDisconnect(BLEServer* s) { bleConn = false; }
};

float readGSR() {
  int raw = analogRead(GSR_PIN);
  int ref = analogRead(GSR_REF_PIN);
  float voltage = (raw - ref) * 3.3 / 4095.0;
  return (voltage > 0.01) ? 1.0 / (voltage * 10000) : 0;
}

void captureProfile() {
  for (int i = 0; i < NUM_SAMPLES; i++) {
    gsrProfile[i] = readGSR();
    delay(50);
  }
  float mean = 0;
  for (int i = 0; i < NUM_SAMPLES; i++) mean += gsrProfile[i];
  mean /= NUM_SAMPLES;
  for (int i = 0; i < NUM_SAMPLES; i++) gsrProfile[i] -= mean;
}

void enrollUser() {
  Serial.println("Enrolling... hold electrodes steady");
  digitalWrite(LED_PIN, HIGH);
  captureProfile();
  for (int i = 0; i < NUM_SAMPLES; i++) {
    enrolledProfile[i] = gsrProfile[i];
  }
  enrolled = true;
  digitalWrite(LED_PIN, LOW);
  Serial.println("Enrollment complete");
}

float compareProfiles() {
  float dot = 0, normA = 0, normB = 0;
  for (int i = 0; i < NUM_SAMPLES; i++) {
    dot += gsrProfile[i] * enrolledProfile[i];
    normA += gsrProfile[i] * gsrProfile[i];
    normB += enrolledProfile[i] * enrolledProfile[i];
  }
  float denom = sqrt(normA) * sqrt(normB);
  return (denom > 0.0001) ? dot / denom : 0;
}

void generateSkinKey() {
  for (int i = 0; i < 8; i++) {
    float segment = 0;
    for (int j = 0; j < 8; j++) {
      segment += gsrProfile[i * 8 + j];
    }
    uint32_t hash = *(uint32_t*)&segment;
    hash ^= (hash << 13); hash ^= (hash >> 17); hash ^= (hash << 5);
    skinKey[i] = (hash & 0xFF) / 255.0;
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("Skin Galvanic Key starting...");
  pinMode(GSR_PIN, INPUT);
  pinMode(GSR_REF_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  analogReadResolution(12);

  BLEDevice::init("SkinKey");
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
  conductance = readGSR();

  if (Serial.available()) {
    char cmd = Serial.read();
    if (cmd == 'e') enrollUser();
    if (cmd == 'a') {
      if (!enrolled) { Serial.println("Not enrolled"); return; }
      captureProfile();
      matchScore = compareProfiles();
      generateSkinKey();
      bool auth = matchScore >= AUTH_THRESHOLD;
      Serial.printf("Match: %.2f%% | Auth: %s\n", matchScore * 100, auth ? "GRANTED" : "DENIED");

      if (bleConn) {
        char buf[96];
        snprintf(buf, sizeof(buf), "{\"auth\":%s,\"match\":%.2f,\"cond\":%.4f}",
          auth ? "true" : "false", matchScore, conductance);
        pChar->setValue(buf);
        pChar->notify();
      }
      digitalWrite(LED_PIN, auth ? HIGH : LOW);
      delay(500);
      digitalWrite(LED_PIN, LOW);
    }
  }

  delay(100);
}
