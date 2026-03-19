/*
 * Bio Nerve Impulse Detector - ESP32 Firmware
 * High-gain ADC reads nerve impulse signals (EMG/ENG)
 * Detects voluntary and involuntary nerve firing patterns via BLE
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLE2902.h>
#include <math.h>

#define NERVE_PIN 36
#define NERVE_REF 39
#define LED_PIN 2
#define SAMPLE_RATE 1000
#define BUFFER_SIZE 512
#define IMPULSE_THRESHOLD 0.08
#define SERVICE_UUID "ab990011-2233-4455-6677-8899aabbcc00"
#define CHAR_UUID    "ab990011-2233-4455-6677-8899aabbcc01"

BLECharacteristic* pChar = NULL;
bool bleConn = false;

float signalBuffer[BUFFER_SIZE];
int bufIdx = 0;
float baseline = 0;
float noiseFloor = 0;
int impulseCount = 0;
float firingRate = 0;
float signalRMS = 0;
float peakAmplitude = 0;
unsigned long lastImpulse = 0;
int impulseIntervals[32];
int intIdx = 0;

class BLECB : public BLEServerCallbacks {
  void onConnect(BLEServer* s) { bleConn = true; }
  void onDisconnect(BLEServer* s) { bleConn = false; }
};

void calibrateNerve() {
  Serial.println("Calibrating nerve sensor... stay relaxed");
  long sum = 0;
  long sumSq = 0;
  for (int i = 0; i < 500; i++) {
    int raw = analogRead(NERVE_PIN) - analogRead(NERVE_REF);
    sum += raw;
    sumSq += (long)raw * raw;
    delayMicroseconds(1000);
  }
  baseline = sum / 500.0;
  float variance = sumSq / 500.0 - baseline * baseline;
  noiseFloor = sqrt(abs(variance)) / 4095.0;
  Serial.printf("Baseline: %.1f | Noise floor: %.5f\n", baseline, noiseFloor);
}

float readNerveSignal() {
  int raw = analogRead(NERVE_PIN) - analogRead(NERVE_REF);
  float normalized = (raw - baseline) / 4095.0;
  return normalized;
}

bool detectImpulse(float signal) {
  static float envelope = 0;
  static bool inImpulse = false;

  float rectified = abs(signal);
  envelope = envelope * 0.95 + rectified * 0.05;

  if (envelope > IMPULSE_THRESHOLD && !inImpulse) {
    inImpulse = true;
    unsigned long now = millis();
    if (lastImpulse > 0) {
      impulseIntervals[intIdx] = now - lastImpulse;
      intIdx = (intIdx + 1) % 32;
    }
    lastImpulse = now;
    impulseCount++;
    return true;
  } else if (envelope < IMPULSE_THRESHOLD * 0.5) {
    inImpulse = false;
  }
  return false;
}

void calculateFiringRate() {
  int validCount = 0;
  long sum = 0;
  for (int i = 0; i < 32; i++) {
    if (impulseIntervals[i] > 0 && impulseIntervals[i] < 2000) {
      sum += impulseIntervals[i];
      validCount++;
    }
  }
  if (validCount > 0) {
    firingRate = 1000.0 / (sum / validCount);
  }
}

void calculateRMS() {
  float sum = 0;
  peakAmplitude = 0;
  for (int i = 0; i < BUFFER_SIZE; i++) {
    sum += signalBuffer[i] * signalBuffer[i];
    if (abs(signalBuffer[i]) > peakAmplitude) {
      peakAmplitude = abs(signalBuffer[i]);
    }
  }
  signalRMS = sqrt(sum / BUFFER_SIZE);
}

String classifyNerveActivity() {
  if (signalRMS < noiseFloor * 2) return "resting";
  if (firingRate > 30) return "strong_contraction";
  if (firingRate > 15) return "moderate_contraction";
  if (firingRate > 5) return "light_activation";
  if (peakAmplitude > 0.3) return "reflex";
  return "minimal";
}

void setup() {
  Serial.begin(115200);
  Serial.println("Nerve Impulse Detector starting...");
  pinMode(NERVE_PIN, INPUT);
  pinMode(NERVE_REF, INPUT);
  pinMode(LED_PIN, OUTPUT);
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);
  calibrateNerve();

  BLEDevice::init("NerveDetect");
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
  unsigned long now = micros();

  if (now - lastSample >= 1000) {
    lastSample = now;
    float signal = readNerveSignal();
    signalBuffer[bufIdx] = signal;
    bufIdx = (bufIdx + 1) % BUFFER_SIZE;

    if (detectImpulse(signal)) {
      digitalWrite(LED_PIN, HIGH);
      calculateFiringRate();
      delay(5);
      digitalWrite(LED_PIN, LOW);
    }

    if (bufIdx == 0) {
      calculateRMS();
      String activity = classifyNerveActivity();
      Serial.printf("Activity: %s | Rate: %.1f Hz | RMS: %.4f | Impulses: %d\n",
        activity.c_str(), firingRate, signalRMS, impulseCount);

      if (bleConn) {
        char buf[128];
        snprintf(buf, sizeof(buf),
          "{\"activity\":\"%s\",\"rate\":%.1f,\"rms\":%.4f,\"count\":%d}",
          activity.c_str(), firingRate, signalRMS, impulseCount);
        pChar->setValue(buf);
        pChar->notify();
      }
    }
  }
}
