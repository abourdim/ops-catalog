/*
 * Sonic Acoustic Fence - ESP32 Firmware
 * I2S mic array detects intrusions via acoustic anomaly detection
 * Ultrasonic barrier with break-beam detection
 */

#include <driver/i2s.h>
#include <math.h>
#include <WiFi.h>

#define I2S_WS 15
#define I2S_SCK 14
#define I2S_SD_IN 13
#define I2S_SD_OUT 22
#define I2S_PORT I2S_NUM_0
#define SAMPLE_RATE 44100
#define BUFFER_SIZE 512
#define ULTRASONIC_FREQ 40000
#define LED_ALARM 2
#define BUZZER_PIN 25
#define NUM_ZONES 4

int16_t rxBuffer[BUFFER_SIZE];
float ambientProfile[32];
float currentProfile[32];
bool calibrated = false;
bool armed = false;
bool alarmTriggered = false;
float anomalyScore = 0;
float zoneEnergy[NUM_ZONES];
int intrusionCount = 0;
unsigned long lastAlarm = 0;

void initI2S() {
  i2s_config_t config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX | I2S_MODE_TX),
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

void computeSpectralProfile(int16_t* buffer, float* profile, int bins) {
  int binsPerBand = (BUFFER_SIZE / 2) / bins;
  for (int b = 0; b < bins; b++) {
    float power = 0;
    for (int k = b * binsPerBand; k < (b + 1) * binsPerBand; k++) {
      float re = 0, im = 0;
      for (int n = 0; n < BUFFER_SIZE; n++) {
        float angle = -2.0 * M_PI * k * n / BUFFER_SIZE;
        float sample = buffer[n] / 32768.0;
        re += sample * cos(angle);
        im += sample * sin(angle);
      }
      power += re * re + im * im;
    }
    profile[b] = log(power + 1e-10);
  }
}

void calibrateAmbient() {
  Serial.println("Calibrating ambient sound profile...");
  size_t bytesRead;
  float tempProfile[32];
  memset(ambientProfile, 0, sizeof(ambientProfile));

  for (int avg = 0; avg < 5; avg++) {
    i2s_read(I2S_PORT, rxBuffer, sizeof(rxBuffer), &bytesRead, portMAX_DELAY);
    computeSpectralProfile(rxBuffer, tempProfile, 32);
    for (int i = 0; i < 32; i++) {
      ambientProfile[i] += tempProfile[i] / 5.0;
    }
  }
  calibrated = true;
  Serial.println("Ambient profile captured");
}

float computeAnomaly() {
  float score = 0;
  for (int i = 0; i < 32; i++) {
    float diff = currentProfile[i] - ambientProfile[i];
    score += diff * diff;
  }
  return sqrt(score / 32);
}

void classifyZones() {
  for (int z = 0; z < NUM_ZONES; z++) {
    float energy = 0;
    int start = z * 8;
    for (int i = start; i < start + 8; i++) {
      energy += exp(currentProfile[i]);
    }
    zoneEnergy[z] = energy;
  }
}

void triggerAlarm(int zone) {
  if (millis() - lastAlarm < 2000) return;
  alarmTriggered = true;
  intrusionCount++;
  lastAlarm = millis();
  digitalWrite(LED_ALARM, HIGH);
  tone(BUZZER_PIN, 2000, 500);
  Serial.printf("ALARM! Zone %d | Anomaly: %.2f | Intrusions: %d\n",
    zone, anomalyScore, intrusionCount);
}

void setup() {
  Serial.begin(115200);
  Serial.println("Acoustic Fence starting...");
  pinMode(LED_ALARM, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  initI2S();
  calibrateAmbient();
  Serial.println("Commands: a=arm, d=disarm, c=recalibrate");
}

void loop() {
  size_t bytesRead;
  i2s_read(I2S_PORT, rxBuffer, sizeof(rxBuffer), &bytesRead, portMAX_DELAY);

  if (calibrated) {
    computeSpectralProfile(rxBuffer, currentProfile, 32);
    anomalyScore = computeAnomaly();
    classifyZones();

    if (armed && anomalyScore > 1.5) {
      int maxZone = 0;
      float maxEnergy = 0;
      for (int z = 0; z < NUM_ZONES; z++) {
        if (zoneEnergy[z] > maxEnergy) {
          maxEnergy = zoneEnergy[z];
          maxZone = z;
        }
      }
      triggerAlarm(maxZone);
    } else {
      alarmTriggered = false;
      digitalWrite(LED_ALARM, LOW);
    }

    static int logCount = 0;
    if (++logCount % 50 == 0) {
      Serial.printf("Anomaly: %.2f | Armed: %s | Zones: %.1f %.1f %.1f %.1f\n",
        anomalyScore, armed ? "YES" : "NO",
        zoneEnergy[0], zoneEnergy[1], zoneEnergy[2], zoneEnergy[3]);
    }
  }

  if (Serial.available()) {
    char c = Serial.read();
    if (c == 'a') { armed = true; Serial.println("ARMED"); }
    if (c == 'd') { armed = false; Serial.println("DISARMED"); }
    if (c == 'c') calibrateAmbient();
  }
}
