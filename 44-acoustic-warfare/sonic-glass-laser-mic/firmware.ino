/*
 * Sonic Glass Laser Mic - ESP32 Firmware
 * Laser diode + photodiode reads vibrations from glass surfaces
 * I2S DAC outputs recovered audio, FFT analyzes voice content
 */

#include <driver/i2s.h>
#include <math.h>

#define LASER_PIN 25
#define PHOTO_PIN 36
#define PHOTO_REF 39
#define I2S_WS 15
#define I2S_SCK 14
#define I2S_SD_OUT 22
#define I2S_PORT I2S_NUM_0
#define SAMPLE_RATE 16000
#define BUFFER_SIZE 512
#define LED_PIN 2

int16_t audioBuffer[BUFFER_SIZE];
float spectrum[BUFFER_SIZE / 2];
float signalBuffer[BUFFER_SIZE];
int bufIdx = 0;
float signalLevel = 0;
float noiseFloor = 0;
float snr = 0;
bool laserOn = false;
bool recording = false;
float autoGain = 1.0;

void initI2S() {
  i2s_config_t config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX),
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
    .data_out_num = I2S_SD_OUT, .data_in_num = -1
  };
  i2s_driver_install(I2S_PORT, &config, 0, NULL);
  i2s_set_pin(I2S_PORT, &pins);
}

float readLaserReturn() {
  int raw = analogRead(PHOTO_PIN);
  int ref = analogRead(PHOTO_REF);
  return (raw - ref) / 4095.0;
}

void calibrateNoise() {
  Serial.println("Calibrating noise floor (keep surface still)...");
  float sum = 0, sumSq = 0;
  for (int i = 0; i < 1000; i++) {
    float val = readLaserReturn();
    sum += val;
    sumSq += val * val;
    delayMicroseconds(62);
  }
  float mean = sum / 1000;
  noiseFloor = sqrt(sumSq / 1000 - mean * mean);
  Serial.printf("Noise floor: %.5f\n", noiseFloor);
}

void adjustAutoGain() {
  float rms = 0;
  for (int i = 0; i < BUFFER_SIZE; i++) {
    rms += signalBuffer[i] * signalBuffer[i];
  }
  rms = sqrt(rms / BUFFER_SIZE);

  if (rms > 0.001) {
    float targetRMS = 0.3;
    autoGain = autoGain * 0.9 + (targetRMS / rms) * 0.1;
    autoGain = constrain(autoGain, 0.1, 100.0);
  }
  snr = (noiseFloor > 0) ? 20 * log10(rms / noiseFloor) : 0;
}

void computeSpectrum() {
  for (int k = 0; k < BUFFER_SIZE / 2; k++) {
    float re = 0, im = 0;
    for (int n = 0; n < BUFFER_SIZE; n++) {
      float angle = -2.0 * M_PI * k * n / BUFFER_SIZE;
      re += signalBuffer[n] * cos(angle);
      im += signalBuffer[n] * sin(angle);
    }
    spectrum[k] = sqrt(re * re + im * im) / BUFFER_SIZE;
  }
}

bool detectVoice() {
  float voiceBand = 0, totalBand = 0;
  int voiceLow = (int)(300.0 * BUFFER_SIZE / SAMPLE_RATE);
  int voiceHigh = (int)(3400.0 * BUFFER_SIZE / SAMPLE_RATE);
  for (int k = 1; k < BUFFER_SIZE / 2; k++) {
    totalBand += spectrum[k];
    if (k >= voiceLow && k <= voiceHigh) {
      voiceBand += spectrum[k];
    }
  }
  return (totalBand > 0) ? (voiceBand / totalBand > 0.5) : false;
}

void setup() {
  Serial.begin(115200);
  Serial.println("Glass Laser Mic starting...");
  pinMode(LASER_PIN, OUTPUT);
  pinMode(PHOTO_PIN, INPUT);
  pinMode(PHOTO_REF, INPUT);
  pinMode(LED_PIN, OUTPUT);
  analogReadResolution(12);
  initI2S();
  Serial.println("Commands: l=laser on/off, c=calibrate, r=record, s=spectrum");
}

void loop() {
  if (laserOn) {
    float sample = readLaserReturn();
    signalBuffer[bufIdx] = sample;
    bufIdx = (bufIdx + 1) % BUFFER_SIZE;

    audioBuffer[bufIdx] = (int16_t)(constrain(sample * autoGain, -1.0, 1.0) * 32767);

    if (bufIdx == 0) {
      adjustAutoGain();

      if (recording) {
        size_t written;
        i2s_write(I2S_PORT, audioBuffer, sizeof(audioBuffer), &written, portMAX_DELAY);
      }

      computeSpectrum();
      bool voiceDetected = detectVoice();

      static int logCount = 0;
      if (++logCount % 20 == 0) {
        Serial.printf("SNR: %.1f dB | Gain: %.1f | Voice: %s\n",
          snr, autoGain, voiceDetected ? "YES" : "no");
      }
      digitalWrite(LED_PIN, voiceDetected);
    }
  }

  if (Serial.available()) {
    char c = Serial.read();
    if (c == 'l') { laserOn = !laserOn; digitalWrite(LASER_PIN, laserOn); Serial.printf("Laser: %s\n", laserOn?"ON":"OFF"); }
    if (c == 'c') calibrateNoise();
    if (c == 'r') { recording = !recording; Serial.printf("Recording: %s\n", recording?"ON":"OFF"); }
    if (c == 's') {
      Serial.println("=== Voice Spectrum ===");
      for (int k = 0; k < 32; k++) {
        float freq = k * SAMPLE_RATE / BUFFER_SIZE;
        Serial.printf("%.0f Hz: %.4f\n", freq, spectrum[k]);
      }
    }
  }

  if (laserOn) delayMicroseconds(62); // ~16kHz
  else delay(10);
}
