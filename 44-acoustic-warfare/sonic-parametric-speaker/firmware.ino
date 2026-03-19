/*
 * Sonic Parametric Speaker - ESP32 Firmware
 * Ultrasonic carrier amplitude-modulated with audio for directional sound
 * I2S drives ultrasonic transducer array with AM audio modulation
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
#define CARRIER_FREQ 40000
#define LED_PIN 2
#define POT_PIN 36

int16_t inputBuffer[BUFFER_SIZE];
int16_t outputBuffer[BUFFER_SIZE];
float carrierPhase = 0;
float modDepth = 0.8;
int sourceMode = 0; // 0=mic, 1=tone, 2=sweep
float toneFreq = 1000;
bool outputEnabled = false;
float beamAngle = 0; // degrees, for phase steering

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

void generateAMSignal(int16_t* audio, int16_t* output, int len) {
  float carrierInc = 2.0 * M_PI * CARRIER_FREQ / SAMPLE_RATE;

  for (int i = 0; i < len; i++) {
    float audioSample = audio[i] / 32768.0;

    // Pre-process audio: compress and boost
    float compressed = tanh(audioSample * 2.0);

    // AM modulation: carrier * (1 + m * audio)
    float modulated = (1.0 + modDepth * compressed) * sin(carrierPhase);
    carrierPhase += carrierInc;
    if (carrierPhase > 2 * M_PI) carrierPhase -= 2 * M_PI;

    output[i] = (int16_t)(constrain(modulated, -1.0, 1.0) * 32767);
  }
}

void generateTestTone(int16_t* buffer, int len, float freq) {
  static float phase = 0;
  for (int i = 0; i < len; i++) {
    buffer[i] = (int16_t)(sin(phase) * 16384);
    phase += 2.0 * M_PI * freq / SAMPLE_RATE;
    if (phase > 2 * M_PI) phase -= 2 * M_PI;
  }
}

void generateSweep(int16_t* buffer, int len) {
  static float freq = 200;
  static bool sweepUp = true;
  for (int i = 0; i < len; i++) {
    static float phase = 0;
    buffer[i] = (int16_t)(sin(phase) * 16384);
    phase += 2.0 * M_PI * freq / SAMPLE_RATE;
    freq += sweepUp ? 0.5 : -0.5;
    if (freq > 4000) sweepUp = false;
    if (freq < 200) sweepUp = true;
  }
}

float calculateSPL(int16_t* buffer, int len) {
  float rms = 0;
  for (int i = 0; i < len; i++) {
    rms += (float)buffer[i] * buffer[i];
  }
  rms = sqrt(rms / len);
  return 20 * log10(rms / 32768.0 + 1e-10) + 94; // relative dBSPL
}

void setup() {
  Serial.begin(115200);
  Serial.println("Parametric Speaker starting...");
  pinMode(LED_PIN, OUTPUT);
  pinMode(POT_PIN, INPUT);
  analogReadResolution(12);
  initI2S();
  Serial.println("Commands: o=on/off, 0-2=source(mic/tone/sweep)");
  Serial.println("  m<val>=mod depth, f<val>=tone freq, a<val>=beam angle");
}

void loop() {
  if (outputEnabled) {
    // Generate or capture audio source
    switch (sourceMode) {
      case 0: { // mic input
        size_t bytesRead;
        i2s_read(I2S_PORT, inputBuffer, sizeof(inputBuffer), &bytesRead, portMAX_DELAY);
        break;
      }
      case 1: generateTestTone(inputBuffer, BUFFER_SIZE, toneFreq); break;
      case 2: generateSweep(inputBuffer, BUFFER_SIZE); break;
    }

    // Modulate onto ultrasonic carrier
    generateAMSignal(inputBuffer, outputBuffer, BUFFER_SIZE);

    // Output
    size_t written;
    i2s_write(I2S_PORT, outputBuffer, sizeof(outputBuffer), &written, portMAX_DELAY);

    static int logCount = 0;
    if (++logCount % 200 == 0) {
      float spl = calculateSPL(outputBuffer, BUFFER_SIZE);
      Serial.printf("Mode: %d | Mod: %.0f%% | Freq: %.0f Hz | SPL: ~%.0f dB\n",
        sourceMode, modDepth * 100, toneFreq, spl);
    }
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
    delay(10);
  }

  if (Serial.available()) {
    char c = Serial.read();
    if (c == 'o') { outputEnabled = !outputEnabled; Serial.printf("Output: %s\n", outputEnabled?"ON":"OFF"); }
    if (c >= '0' && c <= '2') { sourceMode = c - '0'; Serial.printf("Source: %d\n", sourceMode); }
    if (c == 'm') { modDepth = Serial.parseFloat(); Serial.printf("Mod depth: %.2f\n", modDepth); }
    if (c == 'f') { toneFreq = Serial.parseFloat(); Serial.printf("Tone: %.0f Hz\n", toneFreq); }
  }
}
