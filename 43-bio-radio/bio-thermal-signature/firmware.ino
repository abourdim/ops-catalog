/*
 * Bio Thermal Signature - ESP32 Firmware
 * MLX90614 IR temp sensor reads body thermal signature
 * Creates thermal fingerprint for identification via BLE
 */

#include <Wire.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLE2902.h>

#define SDA_PIN 21
#define SCL_PIN 22
#define LED_PIN 2
#define MLX_ADDR 0x5A
#define PROFILE_SIZE 16
#define SERVICE_UUID "ff445566-7788-99aa-bbcc-ddeeff001122"
#define CHAR_UUID    "ff445566-7788-99aa-bbcc-ddeeff001123"

BLECharacteristic* pChar = NULL;
bool bleConn = false;

float ambientTemp = 0;
float objectTemp = 0;
float thermalProfile[PROFILE_SIZE];
float enrolledProfile[PROFILE_SIZE];
bool enrolled = false;
int profileIdx = 0;
float matchConfidence = 0;

class BLECB : public BLEServerCallbacks {
  void onConnect(BLEServer* s) { bleConn = true; }
  void onDisconnect(BLEServer* s) { bleConn = false; }
};

float readMLXTemp(uint8_t reg) {
  Wire.beginTransmission(MLX_ADDR);
  Wire.write(reg);
  Wire.endTransmission(false);
  Wire.requestFrom((uint8_t)MLX_ADDR, (uint8_t)3);
  uint16_t data = Wire.read();
  data |= Wire.read() << 8;
  Wire.read(); // PEC
  return data * 0.02 - 273.15;
}

void readTemperatures() {
  ambientTemp = readMLXTemp(0x06);
  objectTemp = readMLXTemp(0x07);
}

void captureThermalProfile() {
  Serial.println("Capturing thermal profile...");
  for (int i = 0; i < PROFILE_SIZE; i++) {
    readTemperatures();
    thermalProfile[i] = objectTemp - ambientTemp;
    delay(200);
    Serial.printf("  Sample %d: %.2f C (delta)\n", i, thermalProfile[i]);
  }
}

void enrollThermal() {
  captureThermalProfile();
  for (int i = 0; i < PROFILE_SIZE; i++) {
    enrolledProfile[i] = thermalProfile[i];
  }
  enrolled = true;
  Serial.println("Thermal signature enrolled");
  digitalWrite(LED_PIN, HIGH);
  delay(500);
  digitalWrite(LED_PIN, LOW);
}

float matchThermalSignature() {
  if (!enrolled) return 0;
  float sumDiffSq = 0;
  float sumEnrolled = 0;
  for (int i = 0; i < PROFILE_SIZE; i++) {
    float diff = thermalProfile[i] - enrolledProfile[i];
    sumDiffSq += diff * diff;
    sumEnrolled += enrolledProfile[i] * enrolledProfile[i];
  }
  if (sumEnrolled < 0.001) return 0;
  float rmse = sqrt(sumDiffSq / PROFILE_SIZE);
  float confidence = max(0.0f, 1.0f - rmse / 2.0f);
  return confidence;
}

float computeThermalEntropy() {
  float sum = 0;
  for (int i = 0; i < PROFILE_SIZE; i++) {
    sum += abs(thermalProfile[i]);
  }
  if (sum < 0.001) return 0;
  float entropy = 0;
  for (int i = 0; i < PROFILE_SIZE; i++) {
    float p = abs(thermalProfile[i]) / sum;
    if (p > 0.001) entropy -= p * log(p);
  }
  return entropy;
}

void setup() {
  Serial.begin(115200);
  Serial.println("Thermal Signature starting...");
  Wire.begin(SDA_PIN, SCL_PIN);
  pinMode(LED_PIN, OUTPUT);

  BLEDevice::init("ThermalSig");
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
  readTemperatures();

  if (Serial.available()) {
    char cmd = Serial.read();
    if (cmd == 'e') enrollThermal();
    if (cmd == 'm') {
      captureThermalProfile();
      matchConfidence = matchThermalSignature();
      float entropy = computeThermalEntropy();
      bool matched = matchConfidence > 0.75;

      Serial.printf("Match: %.1f%% | Entropy: %.3f | Result: %s\n",
        matchConfidence * 100, entropy, matched ? "IDENTIFIED" : "UNKNOWN");

      if (bleConn) {
        char buf[128];
        snprintf(buf, sizeof(buf),
          "{\"obj\":%.1f,\"amb\":%.1f,\"match\":%.1f,\"entropy\":%.3f,\"id\":%s}",
          objectTemp, ambientTemp, matchConfidence * 100, entropy,
          matched ? "true" : "false");
        pChar->setValue(buf);
        pChar->notify();
      }
      digitalWrite(LED_PIN, matched);
    }
  }

  Serial.printf("Obj: %.1f C | Amb: %.1f C\n", objectTemp, ambientTemp);
  delay(500);
}
