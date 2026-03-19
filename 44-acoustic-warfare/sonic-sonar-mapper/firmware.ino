/*
 * Sonic Sonar Mapper - ESP32 Firmware
 * Ultrasonic transducer pair for room mapping via echo timing
 * I2S output generates chirps, I2S input captures echoes for TOF
 */

#include <driver/i2s.h>
#include <math.h>

#define I2S_WS 15
#define I2S_SCK 14
#define I2S_SD_OUT 22
#define I2S_SD_IN 13
#define I2S_PORT I2S_NUM_0
#define SAMPLE_RATE 48000
#define BUFFER_SIZE 2048
#define CHIRP_START_FREQ 20000
#define CHIRP_END_FREQ 25000
#define CHIRP_DURATION_MS 10
#define SPEED_OF_SOUND 343.0
#define MAX_RANGE_M 5.0
#define LED_PIN 2
#define SERVO_PIN 25

int16_t txBuffer[BUFFER_SIZE];
int16_t rxBuffer[BUFFER_SIZE];
float correlationBuffer[BUFFER_SIZE];

struct MapPoint {
  float angle;
  float distance;
  float confidence;
};

MapPoint sonarMap[36]; // 10 degree resolution
int mapPoints = 0;
float currentAngle = 0;
float lastDistance = 0;
bool scanning = false;

void initI2S() {
  i2s_config_t config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX | I2S_MODE_RX),
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
    .data_out_num = I2S_SD_OUT, .data_in_num = I2S_SD_IN
  };
  i2s_driver_install(I2S_PORT, &config, 0, NULL);
  i2s_set_pin(I2S_PORT, &pins);
}

void generateChirp() {
  int chirpSamples = SAMPLE_RATE * CHIRP_DURATION_MS / 1000;
  for (int i = 0; i < chirpSamples && i < BUFFER_SIZE; i++) {
    float t = (float)i / SAMPLE_RATE;
    float freq = CHIRP_START_FREQ + (CHIRP_END_FREQ - CHIRP_START_FREQ) * t / (CHIRP_DURATION_MS / 1000.0);
    float window = 0.5 * (1.0 - cos(2.0 * M_PI * i / chirpSamples));
    txBuffer[i] = (int16_t)(window * 32767 * sin(2.0 * M_PI * freq * t));
  }
  for (int i = SAMPLE_RATE * CHIRP_DURATION_MS / 1000; i < BUFFER_SIZE; i++) {
    txBuffer[i] = 0;
  }
}

float crossCorrelate(int16_t* ref, int16_t* sig, int len) {
  float maxCorr = 0;
  int maxLag = 0;
  int maxSearch = min(len, (int)(2 * MAX_RANGE_M / SPEED_OF_SOUND * SAMPLE_RATE));

  for (int lag = 10; lag < maxSearch; lag++) {
    float corr = 0;
    for (int i = 0; i < len - lag; i++) {
      corr += (float)ref[i] * sig[i + lag];
    }
    correlationBuffer[lag] = corr;
    if (corr > maxCorr) {
      maxCorr = corr;
      maxLag = lag;
    }
  }
  return (float)maxLag / SAMPLE_RATE * SPEED_OF_SOUND / 2.0;
}

float measureDistance() {
  generateChirp();
  size_t written, bytesRead;
  i2s_write(I2S_PORT, txBuffer, sizeof(txBuffer), &written, portMAX_DELAY);
  i2s_read(I2S_PORT, rxBuffer, sizeof(rxBuffer), &bytesRead, portMAX_DELAY);
  return crossCorrelate(txBuffer, rxBuffer, BUFFER_SIZE);
}

float calculateConfidence() {
  float maxCorr = 0, totalCorr = 0;
  int maxSearch = (int)(2 * MAX_RANGE_M / SPEED_OF_SOUND * SAMPLE_RATE);
  for (int i = 10; i < maxSearch && i < BUFFER_SIZE; i++) {
    totalCorr += abs(correlationBuffer[i]);
    if (correlationBuffer[i] > maxCorr) maxCorr = correlationBuffer[i];
  }
  return (totalCorr > 0) ? maxCorr / totalCorr : 0;
}

void performScan() {
  Serial.println("Starting 360-degree scan...");
  scanning = true;
  mapPoints = 0;

  for (int deg = 0; deg < 360; deg += 10) {
    currentAngle = deg;
    int servoPos = map(deg, 0, 360, 0, 180);
    ledcWrite(0, map(servoPos, 0, 180, 26, 128));
    delay(100);

    float dist = measureDistance();
    float conf = calculateConfidence();

    sonarMap[mapPoints].angle = deg;
    sonarMap[mapPoints].distance = dist;
    sonarMap[mapPoints].confidence = conf;
    mapPoints++;

    Serial.printf("  %3d deg: %.2f m (conf: %.1f%%)\n", deg, dist, conf * 100);
  }
  scanning = false;
  Serial.println("Scan complete");
}

void setup() {
  Serial.begin(115200);
  Serial.println("Sonar Mapper starting...");
  pinMode(LED_PIN, OUTPUT);
  ledcSetup(0, 50, 8);
  ledcAttachPin(SERVO_PIN, 0);
  initI2S();
  generateChirp();
  Serial.println("Commands: m=measure, s=scan, p=print map");
}

void loop() {
  if (Serial.available()) {
    char c = Serial.read();
    if (c == 'm') {
      lastDistance = measureDistance();
      float conf = calculateConfidence();
      Serial.printf("Distance: %.2f m | Confidence: %.0f%%\n", lastDistance, conf * 100);
      digitalWrite(LED_PIN, HIGH);
      delay(50);
      digitalWrite(LED_PIN, LOW);
    }
    if (c == 's') performScan();
    if (c == 'p') {
      Serial.println("=== Sonar Map ===");
      for (int i = 0; i < mapPoints; i++) {
        Serial.printf("  %6.1f deg -> %5.2f m (%.0f%%)\n",
          sonarMap[i].angle, sonarMap[i].distance, sonarMap[i].confidence * 100);
      }
    }
  }
  delay(10);
}
