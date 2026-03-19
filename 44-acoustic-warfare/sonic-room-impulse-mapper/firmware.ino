/*
 * Sonic Room Impulse Mapper - ESP32 Firmware
 * Measures room impulse response using chirp excitation
 * I2S speaker/mic captures RT60, reflections, room geometry
 */

#include <driver/i2s.h>
#include <math.h>

#define I2S_WS 15
#define I2S_SCK 14
#define I2S_SD_OUT 22
#define I2S_SD_IN 13
#define I2S_PORT I2S_NUM_0
#define SAMPLE_RATE 44100
#define BUFFER_SIZE 2048
#define IR_LENGTH 4096
#define LED_PIN 2

int16_t chirpBuffer[BUFFER_SIZE];
int16_t captureBuffer[IR_LENGTH];
float impulseResponse[IR_LENGTH];
float energyDecay[64];
float rt60 = 0;
float earlyReflections[8];
int numReflections = 0;
float roomVolume = 0;
bool measured = false;

void initI2S() {
  i2s_config_t config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX | I2S_MODE_RX),
    .sample_rate = SAMPLE_RATE,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = I2S_COMM_FORMAT_STAND_I2S,
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count = 8,
    .dma_buf_len = 1024
  };
  i2s_pin_config_t pins = {
    .bck_io_num = I2S_SCK, .ws_io_num = I2S_WS,
    .data_out_num = I2S_SD_OUT, .data_in_num = I2S_SD_IN
  };
  i2s_driver_install(I2S_PORT, &config, 0, NULL);
  i2s_set_pin(I2S_PORT, &pins);
}

void generateChirp(float fStart, float fEnd, int len) {
  for (int i = 0; i < len; i++) {
    float t = (float)i / SAMPLE_RATE;
    float T = (float)len / SAMPLE_RATE;
    float freq = fStart + (fEnd - fStart) * t / T;
    float window = 0.5 * (1 - cos(2 * M_PI * i / len));
    chirpBuffer[i] = (int16_t)(window * 32000 * sin(2 * M_PI * freq * t * t / (2 * T)));
  }
}

void captureIR() {
  // Send chirp
  size_t written;
  i2s_write(I2S_PORT, chirpBuffer, BUFFER_SIZE * 2, &written, portMAX_DELAY);

  // Capture response
  size_t bytesRead;
  i2s_read(I2S_PORT, captureBuffer, IR_LENGTH * 2, &bytesRead, portMAX_DELAY);

  // Cross-correlate to get impulse response
  for (int lag = 0; lag < IR_LENGTH; lag++) {
    float sum = 0;
    for (int i = 0; i < BUFFER_SIZE && (i + lag) < IR_LENGTH; i++) {
      sum += (float)chirpBuffer[i] * captureBuffer[i + lag];
    }
    impulseResponse[lag] = sum / (BUFFER_SIZE * 32768.0 * 32768.0);
  }

  // Normalize
  float maxVal = 0;
  for (int i = 0; i < IR_LENGTH; i++) {
    if (abs(impulseResponse[i]) > maxVal) maxVal = abs(impulseResponse[i]);
  }
  if (maxVal > 0) {
    for (int i = 0; i < IR_LENGTH; i++) impulseResponse[i] /= maxVal;
  }
  measured = true;
}

void computeEnergyDecay() {
  int binSize = IR_LENGTH / 64;
  for (int b = 0; b < 64; b++) {
    float energy = 0;
    for (int i = b * binSize; i < (b + 1) * binSize; i++) {
      energy += impulseResponse[i] * impulseResponse[i];
    }
    energyDecay[b] = 10 * log10(energy / binSize + 1e-10);
  }
}

void calculateRT60() {
  computeEnergyDecay();
  float peakEnergy = energyDecay[0];
  float target = peakEnergy - 60.0;
  rt60 = 0;

  for (int b = 1; b < 64; b++) {
    if (energyDecay[b] <= target) {
      float time = (float)b * IR_LENGTH / 64.0 / SAMPLE_RATE;
      rt60 = time;
      break;
    }
  }
  if (rt60 == 0) {
    // Extrapolate from -20dB point
    float t20target = peakEnergy - 20.0;
    for (int b = 1; b < 64; b++) {
      if (energyDecay[b] <= t20target) {
        rt60 = 3.0 * (float)b * IR_LENGTH / 64.0 / SAMPLE_RATE;
        break;
      }
    }
  }
}

void findEarlyReflections() {
  numReflections = 0;
  float threshold = 0.1;
  bool inPeak = false;

  for (int i = 10; i < IR_LENGTH / 4 && numReflections < 8; i++) {
    if (abs(impulseResponse[i]) > threshold && !inPeak) {
      inPeak = true;
      float timeMs = (float)i / SAMPLE_RATE * 1000;
      float distance = timeMs * 0.343; // meters
      earlyReflections[numReflections++] = timeMs;
      Serial.printf("  Reflection %d: %.1f ms (%.1f m)\n", numReflections, timeMs, distance);
    } else if (abs(impulseResponse[i]) < threshold * 0.5) {
      inPeak = false;
    }
  }
}

void estimateRoomSize() {
  if (numReflections < 2) { roomVolume = 0; return; }
  float avgDelay = 0;
  for (int i = 0; i < numReflections; i++) avgDelay += earlyReflections[i];
  avgDelay /= numReflections;
  float avgDist = avgDelay * 0.343 / 2.0;
  roomVolume = avgDist * avgDist * avgDist * 0.5;
}

void setup() {
  Serial.begin(115200);
  Serial.println("Room Impulse Mapper starting...");
  pinMode(LED_PIN, OUTPUT);
  initI2S();
  generateChirp(100, 10000, BUFFER_SIZE);
  Serial.println("Commands: m=measure, r=RT60, e=reflections, p=plot IR");
}

void loop() {
  if (Serial.available()) {
    char c = Serial.read();
    if (c == 'm') {
      Serial.println("Measuring room impulse response...");
      digitalWrite(LED_PIN, HIGH);
      captureIR();
      calculateRT60();
      findEarlyReflections();
      estimateRoomSize();
      Serial.printf("RT60: %.2f s | Reflections: %d | Est. volume: %.0f m3\n",
        rt60, numReflections, roomVolume);
      digitalWrite(LED_PIN, LOW);
    }
    if (c == 'p' && measured) {
      Serial.println("=== Impulse Response ===");
      for (int i = 0; i < 100; i++) {
        Serial.printf("%d: %.4f\n", i, impulseResponse[i]);
      }
    }
    if (c == 'r' && measured) {
      Serial.println("=== Energy Decay ===");
      for (int b = 0; b < 64; b++) {
        float time = (float)b * IR_LENGTH / 64.0 / SAMPLE_RATE * 1000;
        Serial.printf("%.0f ms: %.1f dB\n", time, energyDecay[b]);
      }
    }
  }
  delay(10);
}
