/*
 * Bio Walking Gait ID - ESP32 Firmware
 * Accelerometer (MPU6050) captures walking gait for biometric ID
 * BLE transmits gait signature and identification confidence
 */

#include <Wire.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLE2902.h>
#include <math.h>

#define SDA_PIN 21
#define SCL_PIN 22
#define MPU_ADDR 0x68
#define LED_PIN 2
#define GAIT_SAMPLES 128
#define STRIDE_FEATURES 8
#define SERVICE_UUID "aa556677-8899-aabb-ccdd-eeff00112233"
#define CHAR_UUID    "aa556677-8899-aabb-ccdd-eeff00112234"

BLECharacteristic* pChar = NULL;
bool bleConn = false;

float accelX[GAIT_SAMPLES], accelY[GAIT_SAMPLES], accelZ[GAIT_SAMPLES];
int sampleIdx = 0;
bool recording = false;
float gaitFeatures[STRIDE_FEATURES];
float enrolledGait[STRIDE_FEATURES];
bool enrolled = false;
float stepFreq = 0;
int stepCount = 0;
float gaitConfidence = 0;

class BLECB : public BLEServerCallbacks {
  void onConnect(BLEServer* s) { bleConn = true; }
  void onDisconnect(BLEServer* s) { bleConn = false; }
};

void initMPU() {
  Wire.begin(SDA_PIN, SCL_PIN);
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x6B); Wire.write(0);
  Wire.endTransmission();
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x1C); Wire.write(0x08);
  Wire.endTransmission();
}

void readAccel(float &ax, float &ay, float &az) {
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x3B);
  Wire.endTransmission(false);
  Wire.requestFrom((uint8_t)MPU_ADDR, (uint8_t)6);
  int16_t rx = Wire.read() << 8 | Wire.read();
  int16_t ry = Wire.read() << 8 | Wire.read();
  int16_t rz = Wire.read() << 8 | Wire.read();
  ax = rx / 4096.0; ay = ry / 4096.0; az = rz / 4096.0;
}

void extractGaitFeatures() {
  float meanX = 0, meanY = 0, meanZ = 0;
  for (int i = 0; i < GAIT_SAMPLES; i++) {
    meanX += accelX[i]; meanY += accelY[i]; meanZ += accelZ[i];
  }
  meanX /= GAIT_SAMPLES; meanY /= GAIT_SAMPLES; meanZ /= GAIT_SAMPLES;

  float varX = 0, varY = 0, varZ = 0;
  float peakSum = 0;
  int peaks = 0;
  for (int i = 1; i < GAIT_SAMPLES - 1; i++) {
    varX += (accelX[i] - meanX) * (accelX[i] - meanX);
    varY += (accelY[i] - meanY) * (accelY[i] - meanY);
    varZ += (accelZ[i] - meanZ) * (accelZ[i] - meanZ);
    if (accelZ[i] > accelZ[i-1] && accelZ[i] > accelZ[i+1] && accelZ[i] > meanZ + 0.3) {
      peaks++;
      peakSum += accelZ[i];
    }
  }
  varX /= GAIT_SAMPLES; varY /= GAIT_SAMPLES; varZ /= GAIT_SAMPLES;

  gaitFeatures[0] = sqrt(varX);
  gaitFeatures[1] = sqrt(varY);
  gaitFeatures[2] = sqrt(varZ);
  gaitFeatures[3] = (peaks > 0) ? peakSum / peaks : 0;
  gaitFeatures[4] = peaks;
  stepFreq = peaks * (50.0 / GAIT_SAMPLES) * 60;
  gaitFeatures[5] = stepFreq;

  float asymmetry = 0;
  for (int i = 0; i < GAIT_SAMPLES / 2; i++) {
    asymmetry += abs(accelX[i] - accelX[i + GAIT_SAMPLES / 2]);
  }
  gaitFeatures[6] = asymmetry / (GAIT_SAMPLES / 2);
  gaitFeatures[7] = sqrt(varX + varY + varZ);
}

float matchGait() {
  if (!enrolled) return 0;
  float dist = 0;
  for (int i = 0; i < STRIDE_FEATURES; i++) {
    float d = gaitFeatures[i] - enrolledGait[i];
    dist += d * d;
  }
  dist = sqrt(dist);
  return max(0.0f, 1.0f - dist / 5.0f);
}

void setup() {
  Serial.begin(115200);
  Serial.println("Walking Gait ID starting...");
  initMPU();
  pinMode(LED_PIN, OUTPUT);

  BLEDevice::init("GaitID");
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
  float ax, ay, az;
  readAccel(ax, ay, az);

  if (recording) {
    accelX[sampleIdx] = ax; accelY[sampleIdx] = ay; accelZ[sampleIdx] = az;
    sampleIdx++;
    if (sampleIdx >= GAIT_SAMPLES) {
      recording = false;
      sampleIdx = 0;
      extractGaitFeatures();
      gaitConfidence = matchGait();
      bool identified = gaitConfidence > 0.7;
      Serial.printf("Steps/min: %.0f | Confidence: %.1f%% | ID: %s\n",
        stepFreq, gaitConfidence * 100, identified ? "MATCH" : "UNKNOWN");
      if (bleConn) {
        char buf[128];
        snprintf(buf, sizeof(buf), "{\"steps\":%.0f,\"conf\":%.1f,\"id\":%s}",
          stepFreq, gaitConfidence * 100, identified ? "true" : "false");
        pChar->setValue(buf); pChar->notify();
      }
      digitalWrite(LED_PIN, identified);
      delay(200);
      digitalWrite(LED_PIN, LOW);
    }
  }

  if (Serial.available()) {
    char c = Serial.read();
    if (c == 'r') { recording = true; sampleIdx = 0; Serial.println("Recording gait..."); }
    if (c == 'e') { extractGaitFeatures(); memcpy(enrolledGait, gaitFeatures, sizeof(gaitFeatures)); enrolled = true; Serial.println("Gait enrolled"); }
  }
  delay(20);
}
