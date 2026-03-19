/*
 * Bio Breath Modulator - ESP32 Firmware
 * Reads breath sensor (thermistor/pressure) to modulate RF signals
 * Encodes breathing patterns as data via BLE
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLE2902.h>
#include <math.h>

#define BREATH_PIN 36
#define PRESSURE_PIN 39
#define LED_PIN 2
#define SAMPLE_RATE 50
#define BUFFER_SIZE 128
#define SERVICE_UUID "dd223344-5566-7788-99aa-bbccddeeff00"
#define CHAR_UUID    "dd223344-5566-7788-99aa-bbccddeeff01"

BLECharacteristic* pChar = NULL;
bool bleConn = false;

float breathBuffer[BUFFER_SIZE];
int bufIdx = 0;
float breathRate = 0;
float breathDepth = 0;
float breathPhase = 0;
bool inhaling = true;
unsigned long lastInhaleStart = 0;
unsigned long lastExhaleStart = 0;
float modulatedSignal = 0;
int breathCount = 0;

class BLECB : public BLEServerCallbacks {
  void onConnect(BLEServer* s) { bleConn = true; }
  void onDisconnect(BLEServer* s) { bleConn = false; }
};

float readBreathSensor() {
  int raw = analogRead(BREATH_PIN);
  int pressure = analogRead(PRESSURE_PIN);
  return (raw + pressure) / 2.0 / 4095.0;
}

void analyzeBreath() {
  float minVal = 1.0, maxVal = 0.0;
  float sum = 0;
  for (int i = 0; i < BUFFER_SIZE; i++) {
    if (breathBuffer[i] < minVal) minVal = breathBuffer[i];
    if (breathBuffer[i] > maxVal) maxVal = breathBuffer[i];
    sum += breathBuffer[i];
  }
  breathDepth = maxVal - minVal;
  float mean = sum / BUFFER_SIZE;

  int zeroCrossings = 0;
  for (int i = 1; i < BUFFER_SIZE; i++) {
    if ((breathBuffer[i] - mean) * (breathBuffer[i - 1] - mean) < 0) {
      zeroCrossings++;
    }
  }
  breathRate = (zeroCrossings / 2.0) * (SAMPLE_RATE * 60.0 / BUFFER_SIZE);
}

void detectPhase(float current) {
  static float prev = 0.5;
  if (current > prev + 0.002 && !inhaling) {
    inhaling = true;
    lastInhaleStart = millis();
    breathCount++;
  } else if (current < prev - 0.002 && inhaling) {
    inhaling = false;
    lastExhaleStart = millis();
  }
  breathPhase = inhaling ? 0.0 : 1.0;
  prev = current;
}

float modulateBreath(float breath) {
  float carrierFreq = 1.0 + breath * 10.0;
  float t = millis() / 1000.0;
  return sin(2.0 * M_PI * carrierFreq * t) * breathDepth;
}

uint8_t encodeBreathByte() {
  uint8_t encoded = 0;
  encoded |= (inhaling ? 0x80 : 0x00);
  encoded |= ((int)(breathRate) & 0x3F);
  encoded |= ((int)(breathDepth * 4) & 0x01) << 6;
  return encoded;
}

void setup() {
  Serial.begin(115200);
  Serial.println("Breath Modulator starting...");
  pinMode(BREATH_PIN, INPUT);
  pinMode(PRESSURE_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  analogReadResolution(12);

  BLEDevice::init("BreathMod");
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
  static unsigned long lastSample = 0;
  unsigned long now = millis();

  if (now - lastSample >= (1000 / SAMPLE_RATE)) {
    lastSample = now;
    float breath = readBreathSensor();
    breathBuffer[bufIdx] = breath;
    bufIdx = (bufIdx + 1) % BUFFER_SIZE;
    detectPhase(breath);
    modulatedSignal = modulateBreath(breath);

    int brightness = (int)(breath * 255);
    analogWrite(LED_PIN, brightness);

    if (bufIdx == 0) {
      analyzeBreath();
      uint8_t encoded = encodeBreathByte();

      Serial.printf("Rate: %.1f bpm | Depth: %.3f | Phase: %s | Count: %d\n",
        breathRate, breathDepth, inhaling ? "inhale" : "exhale", breathCount);

      if (bleConn) {
        char buf[96];
        snprintf(buf, sizeof(buf),
          "{\"rate\":%.1f,\"depth\":%.3f,\"phase\":\"%s\",\"mod\":%.3f}",
          breathRate, breathDepth, inhaling ? "in" : "out", modulatedSignal);
        pChar->setValue(buf);
        pChar->notify();
      }
    }
  }
}
