/*
 * Sonic Dolphin Attack Lab - ESP32 Firmware
 * Educational ultrasonic voice command injection research tool
 * Generates AM-modulated ultrasound to study voice assistant vulnerabilities
 */

#include <driver/i2s.h>
#include <math.h>

#define I2S_WS 15
#define I2S_SCK 14
#define I2S_SD_OUT 22
#define I2S_SD_IN 13
#define I2S_PORT I2S_NUM_0
#define SAMPLE_RATE 96000
#define BUFFER_SIZE 512
#define CARRIER_FREQ 25000
#define LED_PIN 2
#define BUTTON_PIN 0

int16_t outputBuffer[BUFFER_SIZE];
int16_t captureBuffer[BUFFER_SIZE];
float carrierPhase = 0;
bool transmitting = false;
int testMode = 0;
float modIndex = 0.9;

struct TestSignal {
  const char* name;
  float freq;
  float duration;
};

TestSignal testSignals[] = {
  {"tone_500Hz", 500, 0.5},
  {"tone_1kHz", 1000, 0.5},
  {"tone_2kHz", 2000, 0.5},
  {"sweep_300_3k", 0, 1.0},
  {"silence_ref", 0, 0.5},
};
const int NUM_TESTS = 5;

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

void generateAMUltrasound(float audioFreq, int16_t* buffer, int len) {
  float carrierInc = 2.0 * M_PI * CARRIER_FREQ / SAMPLE_RATE;
  float audioInc = 2.0 * M_PI * audioFreq / SAMPLE_RATE;
  static float audioPhase = 0;

  for (int i = 0; i < len; i++) {
    float audio = (audioFreq > 0) ? sin(audioPhase) : 0;
    float modulated = (1.0 + modIndex * audio) * sin(carrierPhase);
    buffer[i] = (int16_t)(constrain(modulated, -1.0, 1.0) * 32767);

    carrierPhase += carrierInc;
    audioPhase += audioInc;
    if (carrierPhase > 2 * M_PI) carrierPhase -= 2 * M_PI;
    if (audioPhase > 2 * M_PI) audioPhase -= 2 * M_PI;
  }
}

void generateSweepAM(int16_t* buffer, int len) {
  static float sweepFreq = 300;
  static bool up = true;
  float carrierInc = 2.0 * M_PI * CARRIER_FREQ / SAMPLE_RATE;

  for (int i = 0; i < len; i++) {
    static float sweepPhase = 0;
    float audio = sin(sweepPhase);
    float modulated = (1.0 + modIndex * audio) * sin(carrierPhase);
    buffer[i] = (int16_t)(constrain(modulated, -1.0, 1.0) * 32767);

    carrierPhase += carrierInc;
    sweepPhase += 2.0 * M_PI * sweepFreq / SAMPLE_RATE;
    sweepFreq += up ? 1.0 : -1.0;
    if (sweepFreq > 3000) up = false;
    if (sweepFreq < 300) up = true;
  }
}

float measureUltrasonicLevel() {
  size_t bytesRead;
  i2s_read(I2S_PORT, captureBuffer, sizeof(captureBuffer), &bytesRead, portMAX_DELAY);

  // Goertzel at carrier frequency
  float k = 0.5 + (BUFFER_SIZE * (float)CARRIER_FREQ / SAMPLE_RATE);
  float w = 2.0 * M_PI * k / BUFFER_SIZE;
  float coeff = 2.0 * cos(w);
  float s0 = 0, s1 = 0, s2 = 0;
  for (int i = 0; i < BUFFER_SIZE; i++) {
    s0 = captureBuffer[i] / 32768.0 + coeff * s1 - s2;
    s2 = s1; s1 = s0;
  }
  return sqrt(s1 * s1 + s2 * s2 - coeff * s1 * s2);
}

void runTestSuite() {
  Serial.println("=== Dolphin Attack Test Suite ===");
  for (int t = 0; t < NUM_TESTS; t++) {
    Serial.printf("Test %d: %s\n", t, testSignals[t].name);

    int frames = (int)(testSignals[t].duration * SAMPLE_RATE / BUFFER_SIZE);
    for (int f = 0; f < frames; f++) {
      if (t == 3) {
        generateSweepAM(outputBuffer, BUFFER_SIZE);
      } else {
        generateAMUltrasound(testSignals[t].freq, outputBuffer, BUFFER_SIZE);
      }
      size_t written;
      i2s_write(I2S_PORT, outputBuffer, sizeof(outputBuffer), &written, portMAX_DELAY);
    }

    float level = measureUltrasonicLevel();
    Serial.printf("  Ultrasonic level: %.4f\n", level);
    delay(500);
  }
  Serial.println("Test suite complete");
}

void setup() {
  Serial.begin(115200);
  Serial.println("Dolphin Attack Lab starting...");
  Serial.println("EDUCATIONAL USE ONLY - Study voice assistant ultrasonic vulnerabilities");
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  initI2S();
  Serial.println("Commands: t=test suite, 0-4=individual test, m<val>=mod index");
  Serial.println("  c<val>=carrier freq, l=measure level");
}

void loop() {
  if (Serial.available()) {
    char c = Serial.read();

    if (c == 't') runTestSuite();
    if (c >= '0' && c <= '4') {
      int test = c - '0';
      Serial.printf("Running: %s\n", testSignals[test].name);
      transmitting = true;
      testMode = test;
    }
    if (c == 's') { transmitting = false; Serial.println("Stopped"); }
    if (c == 'm') { modIndex = Serial.parseFloat(); Serial.printf("Mod index: %.2f\n", modIndex); }
    if (c == 'l') {
      float level = measureUltrasonicLevel();
      Serial.printf("Ultrasonic level: %.4f\n", level);
    }
  }

  if (transmitting) {
    if (testMode == 3) {
      generateSweepAM(outputBuffer, BUFFER_SIZE);
    } else {
      generateAMUltrasound(testSignals[testMode].freq, outputBuffer, BUFFER_SIZE);
    }
    size_t written;
    i2s_write(I2S_PORT, outputBuffer, sizeof(outputBuffer), &written, portMAX_DELAY);
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
    delay(10);
  }
}
