/*
 * Sonic Seismic Footprint - ESP32 Firmware
 * Geophone/accelerometer detects ground vibrations from footsteps
 * FFT classifies walker identity and estimates distance/direction
 */

#include <Wire.h>
#include <driver/i2s.h>
#include <math.h>

#define GEOPHONE_PIN 36
#define GEOPHONE_REF 39
#define I2S_WS 15
#define I2S_SCK 14
#define I2S_SD_IN 13
#define I2S_PORT I2S_NUM_0
#define SAMPLE_RATE 1000
#define BUFFER_SIZE 512
#define LED_PIN 2
#define NUM_WALKERS 4
#define FEATURES 8

float seismicBuffer[BUFFER_SIZE];
float spectrum[BUFFER_SIZE / 2];
int bufIdx = 0;
float noiseFloor = 0;
bool footstepDetected = false;
int stepCount = 0;
float stepRate = 0;
unsigned long lastStep = 0;
float stepIntervals[16];
int intIdx = 0;
float walkerFeatures[FEATURES];
float enrolledWalkers[NUM_WALKERS][FEATURES];
bool walkerEnrolled[NUM_WALKERS];
int identifiedWalker = -1;
float estimatedDistance = 0;

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

float readGeophone() {
  int raw = analogRead(GEOPHONE_PIN) - analogRead(GEOPHONE_REF);
  return raw / 4095.0;
}

void calibrateNoise() {
  float sum = 0;
  for (int i = 0; i < 500; i++) {
    float v = readGeophone();
    sum += v * v;
    delay(2);
  }
  noiseFloor = sqrt(sum / 500) * 3;
  Serial.printf("Noise floor: %.5f\n", noiseFloor);
}

bool detectFootstep() {
  float rms = 0;
  for (int i = 0; i < BUFFER_SIZE; i++) {
    rms += seismicBuffer[i] * seismicBuffer[i];
  }
  rms = sqrt(rms / BUFFER_SIZE);

  if (rms > noiseFloor && (millis() - lastStep) > 200) {
    unsigned long now = millis();
    stepIntervals[intIdx] = now - lastStep;
    intIdx = (intIdx + 1) % 16;
    lastStep = now;
    stepCount++;
    return true;
  }
  return false;
}

void computeFFT() {
  for (int k = 0; k < BUFFER_SIZE / 2; k++) {
    float re = 0, im = 0;
    for (int n = 0; n < BUFFER_SIZE; n++) {
      float angle = -2.0 * M_PI * k * n / BUFFER_SIZE;
      re += seismicBuffer[n] * cos(angle);
      im += seismicBuffer[n] * sin(angle);
    }
    spectrum[k] = sqrt(re * re + im * im);
  }
}

void extractStepFeatures() {
  int binsPerFeature = (BUFFER_SIZE / 2) / FEATURES;
  float peak = 0;
  for (int f = 0; f < FEATURES; f++) {
    float power = 0;
    for (int k = f * binsPerFeature; k < (f + 1) * binsPerFeature; k++) {
      power += spectrum[k];
    }
    walkerFeatures[f] = power;
    if (power > peak) peak = power;
  }
  if (peak > 0) {
    for (int f = 0; f < FEATURES; f++) walkerFeatures[f] /= peak;
  }

  long iSum = 0; int iCnt = 0;
  for (int i = 0; i < 16; i++) {
    if (stepIntervals[i] > 200 && stepIntervals[i] < 2000) { iSum += stepIntervals[i]; iCnt++; }
  }
  stepRate = (iCnt > 0) ? 60000.0 / (iSum / iCnt) : 0;
}

int identifyWalker() {
  float bestDist = 1e10;
  int bestId = -1;
  for (int w = 0; w < NUM_WALKERS; w++) {
    if (!walkerEnrolled[w]) continue;
    float dist = 0;
    for (int f = 0; f < FEATURES; f++) {
      float d = walkerFeatures[f] - enrolledWalkers[w][f];
      dist += d * d;
    }
    if (dist < bestDist) { bestDist = dist; bestId = w; }
  }
  return (bestDist < 0.5) ? bestId : -1;
}

void estimateStepDistance() {
  float energy = 0;
  for (int f = 0; f < FEATURES; f++) energy += walkerFeatures[f];
  estimatedDistance = (energy > 0.01) ? 1.0 / (energy * 5) : 99;
  estimatedDistance = constrain(estimatedDistance, 0.5, 50);
}

void setup() {
  Serial.begin(115200);
  Serial.println("Seismic Footprint starting...");
  pinMode(GEOPHONE_PIN, INPUT);
  pinMode(GEOPHONE_REF, INPUT);
  pinMode(LED_PIN, OUTPUT);
  analogReadResolution(12);
  memset(walkerEnrolled, false, sizeof(walkerEnrolled));
  calibrateNoise();
  Serial.println("Commands: e<0-3>=enroll walker, c=calibrate, s=stats");
}

void loop() {
  float sample = readGeophone();
  seismicBuffer[bufIdx] = sample;
  bufIdx = (bufIdx + 1) % BUFFER_SIZE;

  if (bufIdx == 0) {
    if (detectFootstep()) {
      computeFFT();
      extractStepFeatures();
      identifiedWalker = identifyWalker();
      estimateStepDistance();

      Serial.printf("Step #%d | Rate: %.0f/min | Walker: %s | Dist: ~%.1f m\n",
        stepCount, stepRate,
        identifiedWalker >= 0 ? String(identifiedWalker).c_str() : "unknown",
        estimatedDistance);
      digitalWrite(LED_PIN, HIGH);
      delay(30);
      digitalWrite(LED_PIN, LOW);
    }
  }

  if (Serial.available()) {
    char c = Serial.read();
    if (c == 'e') {
      int w = Serial.read() - '0';
      if (w >= 0 && w < NUM_WALKERS) {
        memcpy(enrolledWalkers[w], walkerFeatures, sizeof(walkerFeatures));
        walkerEnrolled[w] = true;
        Serial.printf("Enrolled walker %d\n", w);
      }
    }
    if (c == 'c') calibrateNoise();
    if (c == 's') Serial.printf("Steps: %d | Rate: %.0f | Enrolled: %d\n",
      stepCount, stepRate, (int)walkerEnrolled[0] + walkerEnrolled[1] + walkerEnrolled[2] + walkerEnrolled[3]);
  }
  delay(1);
}
