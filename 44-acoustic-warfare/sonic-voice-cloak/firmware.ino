/*
 * Sonic Voice Cloak - ESP32 Firmware
 * Real-time voice transformation using I2S mic/speaker
 * Pitch shifting, formant modification for voice disguise
 */

#include <driver/i2s.h>
#include <math.h>

#define I2S_WS 15
#define I2S_SCK 14
#define I2S_SD_OUT 22
#define I2S_SD_IN 13
#define I2S_PORT I2S_NUM_0
#define SAMPLE_RATE 16000
#define BUFFER_SIZE 512
#define LED_PIN 2
#define POT_PIN 36

int16_t inputBuffer[BUFFER_SIZE];
int16_t outputBuffer[BUFFER_SIZE];
float processBuffer[BUFFER_SIZE * 2];
float pitchShift = 1.0;
float formantShift = 1.0;
int cloakMode = 0; // 0=off, 1=deep, 2=high, 3=robot, 4=whisper
bool processing = true;
float readPos = 0;

void initI2S() {
  i2s_config_t config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX | I2S_MODE_RX),
    .sample_rate = SAMPLE_RATE,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = I2S_COMM_FORMAT_STAND_I2S,
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count = 8,
    .dma_buf_len = BUFFER_SIZE
  };
  i2s_pin_config_t pins = {
    .bck_io_num = I2S_SCK, .ws_io_num = I2S_WS,
    .data_out_num = I2S_SD_OUT, .data_in_num = I2S_SD_IN
  };
  i2s_driver_install(I2S_PORT, &config, 0, NULL);
  i2s_set_pin(I2S_PORT, &pins);
}

void pitchShiftBuffer(float* buf, int len, float factor) {
  float temp[BUFFER_SIZE];
  for (int i = 0; i < len; i++) {
    float srcPos = i * factor;
    int idx = (int)srcPos;
    float frac = srcPos - idx;
    if (idx + 1 < len) {
      temp[i] = buf[idx] * (1.0 - frac) + buf[idx + 1] * frac;
    } else {
      temp[i] = buf[idx % len];
    }
  }
  memcpy(buf, temp, len * sizeof(float));
}

void applyRobotEffect(float* buf, int len) {
  static float phase = 0;
  float modFreq = 80.0;
  for (int i = 0; i < len; i++) {
    float modulator = sin(2.0 * M_PI * modFreq * phase);
    buf[i] *= modulator;
    phase += 1.0 / SAMPLE_RATE;
    if (phase > 1.0) phase -= 1.0;
  }
}

void applyWhisperEffect(float* buf, int len) {
  for (int i = 0; i < len; i++) {
    float noise = ((float)random(-32768, 32767)) / 32768.0;
    float envelope = abs(buf[i]);
    buf[i] = noise * envelope * 0.5;
  }
  // Low pass
  for (int i = 1; i < len; i++) {
    buf[i] = buf[i] * 0.3 + buf[i-1] * 0.7;
  }
}

void addNoise(float* buf, int len, float amount) {
  for (int i = 0; i < len; i++) {
    float noise = ((float)random(-32768, 32767)) / 32768.0;
    buf[i] += noise * amount;
  }
}

void processCloaking(int16_t* input, int16_t* output, int len) {
  // Convert to float
  for (int i = 0; i < len; i++) {
    processBuffer[i] = input[i] / 32768.0;
  }

  switch (cloakMode) {
    case 0: // passthrough
      break;
    case 1: // deep voice
      pitchShiftBuffer(processBuffer, len, 0.7);
      addNoise(processBuffer, len, 0.005);
      break;
    case 2: // high voice
      pitchShiftBuffer(processBuffer, len, 1.5);
      break;
    case 3: // robot
      applyRobotEffect(processBuffer, len);
      break;
    case 4: // whisper
      applyWhisperEffect(processBuffer, len);
      break;
  }

  // Convert back to int16
  for (int i = 0; i < len; i++) {
    float clamped = fmax(-1.0, fmin(1.0, processBuffer[i]));
    output[i] = (int16_t)(clamped * 32767);
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("Voice Cloak starting...");
  pinMode(LED_PIN, OUTPUT);
  pinMode(POT_PIN, INPUT);
  initI2S();
  Serial.println("Modes: 0=off, 1=deep, 2=high, 3=robot, 4=whisper");
}

void loop() {
  size_t bytesRead, bytesWritten;
  i2s_read(I2S_PORT, inputBuffer, sizeof(inputBuffer), &bytesRead, portMAX_DELAY);

  if (processing) {
    processCloaking(inputBuffer, outputBuffer, BUFFER_SIZE);
    i2s_write(I2S_PORT, outputBuffer, sizeof(outputBuffer), &bytesWritten, portMAX_DELAY);
  }

  // Read pot for pitch adjustment
  int potVal = analogRead(POT_PIN);
  pitchShift = 0.5 + (potVal / 4095.0) * 1.5;

  static int logCount = 0;
  if (++logCount % 100 == 0) {
    float rms = 0;
    for (int i = 0; i < BUFFER_SIZE; i++) rms += (float)inputBuffer[i] * inputBuffer[i];
    rms = sqrt(rms / BUFFER_SIZE);
    Serial.printf("Mode: %d | Pitch: %.2f | RMS: %.0f\n", cloakMode, pitchShift, rms);
    digitalWrite(LED_PIN, rms > 1000);
  }

  if (Serial.available()) {
    char c = Serial.read();
    if (c >= '0' && c <= '4') {
      cloakMode = c - '0';
      Serial.printf("Cloak mode: %d\n", cloakMode);
    }
    if (c == 'p') processing = !processing;
  }
}
