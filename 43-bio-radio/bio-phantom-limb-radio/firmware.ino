/*
 * Bio Phantom Limb Radio - ESP32 Firmware
 * EMG sensors detect residual nerve signals from phantom limb sensations
 * Maps phantom movements to radio commands via BLE
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLE2902.h>
#include <math.h>

#define EMG_CH1 36
#define EMG_CH2 39
#define EMG_CH3 34
#define EMG_CH4 35
#define LED_PIN 2
#define NUM_CHANNELS 4
#define SAMPLE_RATE 500
#define WINDOW_SIZE 64
#define SERVICE_UUID "fa112233-4455-6677-8899-00aabbccddee"
#define CHAR_UUID    "fa112233-4455-6677-8899-00aabbccddef"

BLECharacteristic* pChar = NULL;
bool bleConn = false;

const int emgPins[NUM_CHANNELS] = {EMG_CH1, EMG_CH2, EMG_CH3, EMG_CH4};
float channels[NUM_CHANNELS][WINDOW_SIZE];
int winIdx = 0;
float channelRMS[NUM_CHANNELS];
float channelBaseline[NUM_CHANNELS];
String phantomGesture = "none";
int gestureConfidence = 0;
bool calibrated = false;

struct PhantomPattern {
  const char* name;
  float thresholds[NUM_CHANNELS];
  float ratios[NUM_CHANNELS];
};

PhantomPattern patterns[] = {
  {"grip",    {0.1, 0.08, 0.05, 0.05}, {1.0, 0.8, 0.4, 0.3}},
  {"extend",  {0.05, 0.1, 0.08, 0.05}, {0.4, 1.0, 0.8, 0.3}},
  {"flex",    {0.08, 0.05, 0.1, 0.08}, {0.6, 0.3, 1.0, 0.7}},
  {"rotate",  {0.05, 0.05, 0.05, 0.1}, {0.3, 0.3, 0.5, 1.0}},
  {"spread",  {0.08, 0.08, 0.08, 0.08},{0.8, 0.8, 0.8, 0.8}},
};
const int NUM_PATTERNS = 5;

class BLECB : public BLEServerCallbacks {
  void onConnect(BLEServer* s) { bleConn = true; }
  void onDisconnect(BLEServer* s) { bleConn = false; }
};

void calibrate() {
  Serial.println("Calibrating... relax all muscles");
  for (int ch = 0; ch < NUM_CHANNELS; ch++) {
    long sum = 0;
    for (int i = 0; i < 200; i++) {
      sum += analogRead(emgPins[ch]);
      delay(2);
    }
    channelBaseline[ch] = sum / 200.0 / 4095.0;
  }
  calibrated = true;
  Serial.println("Calibration complete");
}

void readChannels() {
  for (int ch = 0; ch < NUM_CHANNELS; ch++) {
    float raw = analogRead(emgPins[ch]) / 4095.0;
    channels[ch][winIdx] = raw - channelBaseline[ch];
  }
  winIdx = (winIdx + 1) % WINDOW_SIZE;
}

void computeRMS() {
  for (int ch = 0; ch < NUM_CHANNELS; ch++) {
    float sum = 0;
    for (int i = 0; i < WINDOW_SIZE; i++) {
      sum += channels[ch][i] * channels[ch][i];
    }
    channelRMS[ch] = sqrt(sum / WINDOW_SIZE);
  }
}

void classifyPhantomGesture() {
  float bestScore = 0;
  int bestPattern = -1;

  for (int p = 0; p < NUM_PATTERNS; p++) {
    float score = 0;
    bool active = true;
    for (int ch = 0; ch < NUM_CHANNELS; ch++) {
      if (channelRMS[ch] < patterns[p].thresholds[ch]) {
        active = false;
        break;
      }
      float expected = patterns[p].ratios[ch];
      float actual = channelRMS[ch] / (channelRMS[0] + 0.001);
      score += 1.0 - abs(expected - actual);
    }
    if (active && score > bestScore) {
      bestScore = score;
      bestPattern = p;
    }
  }

  if (bestPattern >= 0 && bestScore > 2.0) {
    phantomGesture = patterns[bestPattern].name;
    gestureConfidence = (int)(bestScore / NUM_CHANNELS * 100);
  } else {
    phantomGesture = "none";
    gestureConfidence = 0;
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("Phantom Limb Radio starting...");
  for (int i = 0; i < NUM_CHANNELS; i++) pinMode(emgPins[i], INPUT);
  pinMode(LED_PIN, OUTPUT);
  analogReadResolution(12);
  calibrate();

  BLEDevice::init("PhantomLimb");
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
  readChannels();

  if (winIdx == 0) {
    computeRMS();
    classifyPhantomGesture();

    if (phantomGesture != "none") {
      analogWrite(LED_PIN, map(gestureConfidence, 0, 100, 50, 255));
    } else {
      analogWrite(LED_PIN, 0);
    }

    Serial.printf("Gesture: %s (%d%%) | CH: %.3f %.3f %.3f %.3f\n",
      phantomGesture.c_str(), gestureConfidence,
      channelRMS[0], channelRMS[1], channelRMS[2], channelRMS[3]);

    if (bleConn && phantomGesture != "none") {
      char buf[128];
      snprintf(buf, sizeof(buf),
        "{\"gesture\":\"%s\",\"conf\":%d,\"ch\":[%.3f,%.3f,%.3f,%.3f]}",
        phantomGesture.c_str(), gestureConfidence,
        channelRMS[0], channelRMS[1], channelRMS[2], channelRMS[3]);
      pChar->setValue(buf);
      pChar->notify();
    }
  }
  delay(2);
}
