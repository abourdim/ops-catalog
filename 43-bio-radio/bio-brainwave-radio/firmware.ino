/*
 * Bio Brainwave Radio - ESP32 Firmware
 * Reads EEG-like signals from dry electrodes via ADC
 * Classifies brain states and transmits via BLE/WiFi
 */

#include <WiFi.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLE2902.h>
#include <math.h>

#define EEG_PIN 36
#define REF_PIN 39
#define LED_PIN 2
#define SAMPLE_RATE 256
#define FFT_SIZE 256
#define SERVICE_UUID "bb001122-3344-5566-7788-99aabbccddee"
#define CHAR_UUID    "bb001122-3344-5566-7788-99aabbccddef"

BLECharacteristic* pChar = NULL;
bool bleConnected = false;

float samples[FFT_SIZE];
float spectrum[FFT_SIZE / 2];
int sampleIndex = 0;
unsigned long lastSampleTime = 0;

float deltaPower = 0, thetaPower = 0, alphaPower = 0;
float betaPower = 0, gammaPower = 0;
String brainState = "idle";
int attentionLevel = 0;

class BLECallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* s) { bleConnected = true; }
  void onDisconnect(BLEServer* s) { bleConnected = false; }
};

void computeFFT() {
  for (int k = 0; k < FFT_SIZE / 2; k++) {
    float re = 0, im = 0;
    for (int n = 0; n < FFT_SIZE; n++) {
      float angle = -2.0 * M_PI * k * n / FFT_SIZE;
      re += samples[n] * cos(angle);
      im += samples[n] * sin(angle);
    }
    spectrum[k] = sqrt(re * re + im * im) / FFT_SIZE;
  }
}

float bandPower(float freqLow, float freqHigh) {
  float power = 0;
  int binLow = (int)(freqLow * FFT_SIZE / SAMPLE_RATE);
  int binHigh = (int)(freqHigh * FFT_SIZE / SAMPLE_RATE);
  binLow = constrain(binLow, 0, FFT_SIZE / 2 - 1);
  binHigh = constrain(binHigh, 0, FFT_SIZE / 2 - 1);
  for (int i = binLow; i <= binHigh; i++) {
    power += spectrum[i] * spectrum[i];
  }
  return power;
}

void classifyBrainState() {
  deltaPower = bandPower(0.5, 4);
  thetaPower = bandPower(4, 8);
  alphaPower = bandPower(8, 13);
  betaPower = bandPower(13, 30);
  gammaPower = bandPower(30, 100);

  float totalPower = deltaPower + thetaPower + alphaPower + betaPower + gammaPower;
  if (totalPower < 0.001) { brainState = "noSignal"; return; }

  float alphaRatio = alphaPower / totalPower;
  float betaRatio = betaPower / totalPower;
  float thetaRatio = thetaPower / totalPower;

  if (alphaRatio > 0.4) brainState = "relaxed";
  else if (betaRatio > 0.4) brainState = "focused";
  else if (thetaRatio > 0.4) brainState = "drowsy";
  else if (deltaPower > alphaPower * 3) brainState = "sleep";
  else brainState = "neutral";

  attentionLevel = (int)(betaRatio / (alphaRatio + 0.01) * 50);
  attentionLevel = constrain(attentionLevel, 0, 100);
}

void setup() {
  Serial.begin(115200);
  Serial.println("Brainwave Radio starting...");
  pinMode(EEG_PIN, INPUT);
  pinMode(REF_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);

  BLEDevice::init("BrainwaveRadio");
  BLEServer* pServer = BLEDevice::createServer();
  pServer->setCallbacks(new BLECallbacks());
  BLEService* svc = pServer->createService(SERVICE_UUID);
  pChar = svc->createCharacteristic(CHAR_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
  pChar->addDescriptor(new BLE2902());
  svc->start();
  BLEDevice::getAdvertising()->start();
}

void loop() {
  unsigned long now = micros();
  if (now - lastSampleTime >= (1000000 / SAMPLE_RATE)) {
    lastSampleTime = now;
    int raw = analogRead(EEG_PIN) - analogRead(REF_PIN);
    samples[sampleIndex] = (float)raw / 4095.0;
    sampleIndex++;

    if (sampleIndex >= FFT_SIZE) {
      sampleIndex = 0;
      computeFFT();
      classifyBrainState();

      int led = map(attentionLevel, 0, 100, 0, 255);
      analogWrite(LED_PIN, led);

      if (bleConnected) {
        char buf[128];
        snprintf(buf, sizeof(buf),
          "{\"state\":\"%s\",\"attn\":%d,\"a\":%.3f,\"b\":%.3f,\"t\":%.3f}",
          brainState.c_str(), attentionLevel, alphaPower, betaPower, thetaPower);
        pChar->setValue(buf);
        pChar->notify();
      }
      Serial.printf("State: %s | Attention: %d | Alpha: %.3f Beta: %.3f\n",
        brainState.c_str(), attentionLevel, alphaPower, betaPower);
    }
  }
}
