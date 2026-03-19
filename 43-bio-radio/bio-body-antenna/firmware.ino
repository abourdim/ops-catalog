/*
 * Bio Body Antenna - ESP32 Firmware
 * Uses the human body as an antenna to detect ambient RF energy
 * ADC reads body capacitance changes, BLE broadcasts signal strength
 */

#include <WiFi.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define BODY_ANTENNA_PIN 36
#define GROUND_REF_PIN 39
#define LED_INDICATOR 2
#define SAMPLE_RATE 1000
#define BUFFER_SIZE 256
#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHAR_UUID    "beb5483e-36e1-4688-b7f5-ea07361b26a8"

BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
bool deviceConnected = false;

int signalBuffer[BUFFER_SIZE];
int bufferIndex = 0;
float baselineCapacitance = 0;
float rfEnergy = 0;
unsigned long lastSample = 0;

class ServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) { deviceConnected = true; }
  void onDisconnect(BLEServer* pServer) { deviceConnected = false; }
};

void calibrateBaseline() {
  long sum = 0;
  for (int i = 0; i < 100; i++) {
    sum += analogRead(BODY_ANTENNA_PIN);
    delay(5);
  }
  baselineCapacitance = sum / 100.0;
  Serial.printf("Baseline capacitance: %.2f\n", baselineCapacitance);
}

float calculateRFEnergy() {
  float sum = 0;
  for (int i = 0; i < BUFFER_SIZE; i++) {
    float diff = signalBuffer[i] - baselineCapacitance;
    sum += diff * diff;
  }
  return sqrt(sum / BUFFER_SIZE);
}

float detectFrequencyPeak() {
  float maxCorr = 0;
  int peakLag = 0;
  for (int lag = 1; lag < BUFFER_SIZE / 2; lag++) {
    float corr = 0;
    for (int i = 0; i < BUFFER_SIZE - lag; i++) {
      corr += (signalBuffer[i] - baselineCapacitance) *
              (signalBuffer[i + lag] - baselineCapacitance);
    }
    if (corr > maxCorr) {
      maxCorr = corr;
      peakLag = lag;
    }
  }
  return (peakLag > 0) ? (float)SAMPLE_RATE / peakLag : 0;
}

void setup() {
  Serial.begin(115200);
  Serial.println("Bio Body Antenna Initializing...");

  pinMode(BODY_ANTENNA_PIN, INPUT);
  pinMode(GROUND_REF_PIN, INPUT);
  pinMode(LED_INDICATOR, OUTPUT);
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);

  calibrateBaseline();

  BLEDevice::init("BioBodyAntenna");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());
  BLEService* pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
    CHAR_UUID, BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY
  );
  pCharacteristic->addDescriptor(new BLE2902());
  pService->start();
  BLEAdvertising* pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->start();
  Serial.println("BLE advertising started");
}

void loop() {
  unsigned long now = micros();
  if (now - lastSample >= (1000000 / SAMPLE_RATE)) {
    lastSample = now;
    int raw = analogRead(BODY_ANTENNA_PIN);
    int ref = analogRead(GROUND_REF_PIN);
    signalBuffer[bufferIndex] = raw - ref;
    bufferIndex = (bufferIndex + 1) % BUFFER_SIZE;

    if (bufferIndex == 0) {
      rfEnergy = calculateRFEnergy();
      float peakFreq = detectFrequencyPeak();
      int brightness = constrain(map((int)rfEnergy, 0, 500, 0, 255), 0, 255);
      analogWrite(LED_INDICATOR, brightness);

      if (deviceConnected) {
        char payload[64];
        snprintf(payload, sizeof(payload), "{\"rf\":%.1f,\"freq\":%.0f,\"raw\":%d}",
                 rfEnergy, peakFreq, signalBuffer[0]);
        pCharacteristic->setValue(payload);
        pCharacteristic->notify();
      }
      Serial.printf("RF Energy: %.1f | Peak Freq: %.0f Hz\n", rfEnergy, peakFreq);
    }
  }
}
