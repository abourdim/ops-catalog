/*
 * Bio Voice RF Fingerprint - ESP32 Firmware
 * I2S microphone captures voice, extracts spectral fingerprint
 * BLE transmits voice identity signature for authentication
 */

#include <driver/i2s.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLE2902.h>
#include <math.h>

#define I2S_WS 15
#define I2S_SD 13
#define I2S_SCK 2
#define I2S_PORT I2S_NUM_0
#define SAMPLE_RATE 16000
#define BUFFER_SIZE 512
#define FINGERPRINT_SIZE 16
#define LED_PIN 4
#define SERVICE_UUID "ef001122-3344-5566-7788-99aabbccdd00"
#define CHAR_UUID    "ef001122-3344-5566-7788-99aabbccdd01"

BLECharacteristic* pChar = NULL;
bool bleConn = false;

int16_t audioBuffer[BUFFER_SIZE];
float spectrum[BUFFER_SIZE / 2];
float voiceFingerprint[FINGERPRINT_SIZE];
float enrolledFingerprint[FINGERPRINT_SIZE];
bool enrolled = false;
float matchScore = 0;
float voiceEnergy = 0;

class BLECB : public BLEServerCallbacks {
  void onConnect(BLEServer* s) { bleConn = true; }
  void onDisconnect(BLEServer* s) { bleConn = false; }
};

void initI2S() {
  i2s_config_t config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate = SAMPLE_RATE,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = I2S_COMM_FORMAT_STAND_I2S,
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count = 4,
    .dma_buf_len = BUFFER_SIZE
  };
  i2s_pin_config_t pins = {
    .bck_io_num = I2S_SCK, .ws_io_num = I2S_WS,
    .data_out_num = -1, .data_in_num = I2S_SD
  };
  i2s_driver_install(I2S_PORT, &config, 0, NULL);
  i2s_set_pin(I2S_PORT, &pins);
}

void captureAudio() {
  size_t bytesRead;
  i2s_read(I2S_PORT, audioBuffer, sizeof(audioBuffer), &bytesRead, portMAX_DELAY);
}

void computeSpectrum() {
  for (int k = 0; k < BUFFER_SIZE / 2; k++) {
    float re = 0, im = 0;
    for (int n = 0; n < BUFFER_SIZE; n++) {
      float angle = -2.0 * M_PI * k * n / BUFFER_SIZE;
      float sample = audioBuffer[n] / 32768.0;
      re += sample * cos(angle);
      im += sample * sin(angle);
    }
    spectrum[k] = sqrt(re * re + im * im);
  }
}

void extractFingerprint() {
  int binsPerBand = (BUFFER_SIZE / 2) / FINGERPRINT_SIZE;
  voiceEnergy = 0;
  for (int i = 0; i < FINGERPRINT_SIZE; i++) {
    float bandPower = 0;
    for (int j = 0; j < binsPerBand; j++) {
      int idx = i * binsPerBand + j;
      bandPower += spectrum[idx] * spectrum[idx];
    }
    voiceFingerprint[i] = log(bandPower + 1e-10);
    voiceEnergy += bandPower;
  }
  // Normalize
  float norm = 0;
  for (int i = 0; i < FINGERPRINT_SIZE; i++) norm += voiceFingerprint[i] * voiceFingerprint[i];
  norm = sqrt(norm);
  if (norm > 0.001) {
    for (int i = 0; i < FINGERPRINT_SIZE; i++) voiceFingerprint[i] /= norm;
  }
}

float compareFingerprints() {
  float dot = 0;
  for (int i = 0; i < FINGERPRINT_SIZE; i++) {
    dot += voiceFingerprint[i] * enrolledFingerprint[i];
  }
  return max(0.0f, dot);
}

void setup() {
  Serial.begin(115200);
  Serial.println("Voice RF Fingerprint starting...");
  initI2S();
  pinMode(LED_PIN, OUTPUT);

  BLEDevice::init("VoiceRF");
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
  captureAudio();
  computeSpectrum();
  extractFingerprint();

  if (voiceEnergy > 100) {
    analogWrite(LED_PIN, min(255, (int)(voiceEnergy / 10)));
  } else {
    analogWrite(LED_PIN, 0);
  }

  if (Serial.available()) {
    char c = Serial.read();
    if (c == 'e' && voiceEnergy > 100) {
      memcpy(enrolledFingerprint, voiceFingerprint, sizeof(voiceFingerprint));
      enrolled = true;
      Serial.println("Voice enrolled");
    }
    if (c == 'v' && enrolled && voiceEnergy > 100) {
      matchScore = compareFingerprints();
      bool verified = matchScore > 0.85;
      Serial.printf("Voice match: %.1f%% - %s\n", matchScore * 100,
        verified ? "VERIFIED" : "REJECTED");

      if (bleConn) {
        char buf[96];
        snprintf(buf, sizeof(buf), "{\"match\":%.1f,\"verified\":%s,\"energy\":%.0f}",
          matchScore * 100, verified ? "true" : "false", voiceEnergy);
        pChar->setValue(buf);
        pChar->notify();
      }
      digitalWrite(LED_PIN, verified);
      delay(300);
      digitalWrite(LED_PIN, LOW);
    }
  }
  delay(10);
}
