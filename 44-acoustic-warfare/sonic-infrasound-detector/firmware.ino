/*
 * Sonic Infrasound Detector - ESP32 Firmware
 * I2S mic with low-frequency response detects sub-20Hz infrasound
 * FFT analysis for seismic, weather, and man-made infrasound sources
 */

#include <driver/i2s.h>
#include <math.h>

#define I2S_WS 15
#define I2S_SCK 14
#define I2S_SD_IN 13
#define I2S_PORT I2S_NUM_0
#define SAMPLE_RATE 500
#define BUFFER_SIZE 1024
#define LED_PIN 2
#define ALERT_PIN 25

int16_t audioBuffer[BUFFER_SIZE];
float spectrum[BUFFER_SIZE / 2];
float infrasoundLevel = 0;
float dominantFreq = 0;
String sourceType = "unknown";
bool alertActive = false;
float peakHistory[64];
int histIdx = 0;
float baselineLevel = 0;

void initI2S() {
  i2s_config_t config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
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
    .data_out_num = -1, .data_in_num = I2S_SD_IN
  };
  i2s_driver_install(I2S_PORT, &config, 0, NULL);
  i2s_set_pin(I2S_PORT, &pins);
}

void computeFFT() {
  for (int k = 0; k < BUFFER_SIZE / 2; k++) {
    float re = 0, im = 0;
    for (int n = 0; n < BUFFER_SIZE; n++) {
      float angle = -2.0 * M_PI * k * n / BUFFER_SIZE;
      float sample = audioBuffer[n] / 32768.0;
      re += sample * cos(angle);
      im += sample * sin(angle);
    }
    spectrum[k] = sqrt(re * re + im * im) / BUFFER_SIZE;
  }
}

void analyzeInfrasound() {
  float maxPower = 0;
  int maxBin = 0;
  infrasoundLevel = 0;

  int maxInfrasBin = (int)(20.0 * BUFFER_SIZE / SAMPLE_RATE);
  for (int k = 1; k < maxInfrasBin; k++) {
    infrasoundLevel += spectrum[k] * spectrum[k];
    if (spectrum[k] > maxPower) {
      maxPower = spectrum[k];
      maxBin = k;
    }
  }
  infrasoundLevel = sqrt(infrasoundLevel);
  dominantFreq = (float)maxBin * SAMPLE_RATE / BUFFER_SIZE;

  peakHistory[histIdx] = infrasoundLevel;
  histIdx = (histIdx + 1) % 64;
}

void classifySource() {
  if (dominantFreq < 1.0) {
    sourceType = "seismic";
  } else if (dominantFreq >= 1.0 && dominantFreq < 5.0) {
    sourceType = "weather";
  } else if (dominantFreq >= 5.0 && dominantFreq < 10.0) {
    sourceType = "industrial";
  } else if (dominantFreq >= 10.0 && dominantFreq < 16.0) {
    sourceType = "machinery";
  } else {
    sourceType = "near-audible";
  }

  float trend = 0;
  if (histIdx > 10) {
    float recent = 0, older = 0;
    for (int i = 0; i < 5; i++) {
      recent += peakHistory[(histIdx - 1 - i + 64) % 64];
      older += peakHistory[(histIdx - 6 - i + 64) % 64];
    }
    trend = (recent - older) / 5.0;
    if (trend > 0.01 && dominantFreq < 5.0) {
      sourceType = "approaching";
    }
  }
}

void calibrateBaseline() {
  Serial.println("Calibrating infrasound baseline...");
  float sum = 0;
  for (int i = 0; i < 10; i++) {
    size_t bytesRead;
    i2s_read(I2S_PORT, audioBuffer, sizeof(audioBuffer), &bytesRead, portMAX_DELAY);
    computeFFT();
    analyzeInfrasound();
    sum += infrasoundLevel;
  }
  baselineLevel = sum / 10.0;
  Serial.printf("Baseline: %.4f\n", baselineLevel);
}

void setup() {
  Serial.begin(115200);
  Serial.println("Infrasound Detector starting...");
  pinMode(LED_PIN, OUTPUT);
  pinMode(ALERT_PIN, OUTPUT);
  initI2S();
  calibrateBaseline();
}

void loop() {
  size_t bytesRead;
  i2s_read(I2S_PORT, audioBuffer, sizeof(audioBuffer), &bytesRead, portMAX_DELAY);

  computeFFT();
  analyzeInfrasound();
  classifySource();

  alertActive = infrasoundLevel > baselineLevel * 3.0;
  digitalWrite(LED_PIN, alertActive);
  if (alertActive) {
    tone(ALERT_PIN, 500, 100);
  }

  static int logCount = 0;
  if (++logCount % 5 == 0) {
    Serial.printf("Infrasound: %.4f | Freq: %.2f Hz | Source: %s | Alert: %s\n",
      infrasoundLevel, dominantFreq, sourceType.c_str(),
      alertActive ? "YES" : "no");
  }

  if (Serial.available()) {
    char c = Serial.read();
    if (c == 'c') calibrateBaseline();
    if (c == 's') {
      Serial.printf("Spectrum (0-20Hz):\n");
      int maxBin = (int)(20.0 * BUFFER_SIZE / SAMPLE_RATE);
      for (int k = 0; k < maxBin; k++) {
        float freq = (float)k * SAMPLE_RATE / BUFFER_SIZE;
        Serial.printf("  %.1f Hz: %.5f\n", freq, spectrum[k]);
      }
    }
  }
}
