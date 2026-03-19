/*
 * Bio Gesture Radio - ESP32 Firmware
 * MPU6050 accelerometer/gyro captures hand gestures
 * Classifies gestures and transmits commands via BLE/WiFi
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
#define GESTURE_LEN 50
#define NUM_GESTURES 6
#define SERVICE_UUID "ab112233-4455-6677-8899-aabbccddeef0"
#define CHAR_UUID    "ab112233-4455-6677-8899-aabbccddeef1"

BLECharacteristic* pChar = NULL;
bool bleConn = false;

float gestureData[GESTURE_LEN][6]; // ax,ay,az,gx,gy,gz
int gestIdx = 0;
bool capturing = false;
String lastGesture = "none";
int gestureCount = 0;
float motionThreshold = 1.5;

const char* gestureNames[] = {"swipe_left","swipe_right","swipe_up","swipe_down","circle","shake"};
float gestureTemplates[NUM_GESTURES][4]; // meanAx, meanAy, varAx, varAy

class BLECB : public BLEServerCallbacks {
  void onConnect(BLEServer* s) { bleConn = true; }
  void onDisconnect(BLEServer* s) { bleConn = false; }
};

void initMPU() {
  Wire.begin(SDA_PIN, SCL_PIN);
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x6B); Wire.write(0);
  Wire.endTransmission();
}

void readIMU(float* data) {
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x3B);
  Wire.endTransmission(false);
  Wire.requestFrom((uint8_t)MPU_ADDR, (uint8_t)14);
  for (int i = 0; i < 3; i++) {
    int16_t v = Wire.read() << 8 | Wire.read();
    data[i] = v / 4096.0;
  }
  Wire.read(); Wire.read(); // temp
  for (int i = 3; i < 6; i++) {
    int16_t v = Wire.read() << 8 | Wire.read();
    data[i] = v / 131.0;
  }
}

bool detectMotionStart(float* data) {
  float mag = sqrt(data[0]*data[0] + data[1]*data[1] + data[2]*data[2]);
  return mag > motionThreshold;
}

String classifyGesture() {
  float meanAx = 0, meanAy = 0, meanAz = 0;
  float varAx = 0, varAy = 0;
  float maxGx = 0, maxGy = 0, maxGz = 0;

  for (int i = 0; i < GESTURE_LEN; i++) {
    meanAx += gestureData[i][0];
    meanAy += gestureData[i][1];
    meanAz += gestureData[i][2];
    if (abs(gestureData[i][3]) > maxGx) maxGx = abs(gestureData[i][3]);
    if (abs(gestureData[i][4]) > maxGy) maxGy = abs(gestureData[i][4]);
    if (abs(gestureData[i][5]) > maxGz) maxGz = abs(gestureData[i][5]);
  }
  meanAx /= GESTURE_LEN; meanAy /= GESTURE_LEN; meanAz /= GESTURE_LEN;

  for (int i = 0; i < GESTURE_LEN; i++) {
    varAx += (gestureData[i][0] - meanAx) * (gestureData[i][0] - meanAx);
    varAy += (gestureData[i][1] - meanAy) * (gestureData[i][1] - meanAy);
  }
  varAx /= GESTURE_LEN; varAy /= GESTURE_LEN;

  if (abs(meanAx) > abs(meanAy) && meanAx < -0.5) return "swipe_left";
  if (abs(meanAx) > abs(meanAy) && meanAx > 0.5) return "swipe_right";
  if (abs(meanAy) > abs(meanAx) && meanAy > 0.5) return "swipe_up";
  if (abs(meanAy) > abs(meanAx) && meanAy < -0.5) return "swipe_down";
  if (maxGz > 150 && varAx > 0.5 && varAy > 0.5) return "circle";
  if (varAx > 2 && varAy > 2) return "shake";
  return "unknown";
}

void setup() {
  Serial.begin(115200);
  Serial.println("Gesture Radio starting...");
  initMPU();
  pinMode(LED_PIN, OUTPUT);

  BLEDevice::init("GestureRadio");
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
  float imuData[6];
  readIMU(imuData);

  if (!capturing && detectMotionStart(imuData)) {
    capturing = true;
    gestIdx = 0;
    digitalWrite(LED_PIN, HIGH);
  }

  if (capturing) {
    memcpy(gestureData[gestIdx], imuData, sizeof(float) * 6);
    gestIdx++;

    if (gestIdx >= GESTURE_LEN) {
      capturing = false;
      digitalWrite(LED_PIN, LOW);
      lastGesture = classifyGesture();
      gestureCount++;

      Serial.printf("Gesture: %s (#%d)\n", lastGesture.c_str(), gestureCount);

      if (bleConn) {
        char buf[96];
        snprintf(buf, sizeof(buf), "{\"gesture\":\"%s\",\"count\":%d}",
          lastGesture.c_str(), gestureCount);
        pChar->setValue(buf);
        pChar->notify();
      }
    }
  }
  delay(10);
}
