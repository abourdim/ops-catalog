/*
 * Sonic Ultrasonic Data Link - ESP32 Firmware
 * I2S ultrasonic transducer sends/receives data above human hearing
 * FSK modulation at 20-24kHz for covert acoustic data transfer
 */

#include <driver/i2s.h>
#include <math.h>

#define I2S_WS 15
#define I2S_SCK 14
#define I2S_SD_OUT 22
#define I2S_SD_IN 13
#define I2S_PORT I2S_NUM_0
#define SAMPLE_RATE 48000
#define BUFFER_SIZE 1024
#define CARRIER_FREQ 21000
#define MARK_FREQ 21500
#define SPACE_FREQ 20500
#define BIT_DURATION_MS 20
#define LED_PIN 2

int16_t txBuffer[BUFFER_SIZE];
int16_t rxBuffer[BUFFER_SIZE];
float rxSpectrum[BUFFER_SIZE / 2];
bool transmitting = false;
String rxMessage = "";
int bitCount = 0;
float snr = 0;

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

void generateTone(float freq, int16_t* buffer, int samples, float amplitude) {
  for (int i = 0; i < samples; i++) {
    float t = (float)i / SAMPLE_RATE;
    buffer[i] = (int16_t)(amplitude * 32767 * sin(2.0 * M_PI * freq * t));
  }
}

void transmitBit(bool bit) {
  float freq = bit ? MARK_FREQ : SPACE_FREQ;
  int samplesPerBit = SAMPLE_RATE * BIT_DURATION_MS / 1000;
  generateTone(freq, txBuffer, samplesPerBit, 0.8);
  size_t written;
  i2s_write(I2S_PORT, txBuffer, samplesPerBit * 2, &written, portMAX_DELAY);
}

void transmitPreamble() {
  for (int i = 0; i < 8; i++) {
    transmitBit(i % 2 == 0);
  }
}

void transmitByte(uint8_t byte) {
  transmitBit(false); // start bit
  for (int i = 0; i < 8; i++) {
    transmitBit((byte >> i) & 1);
  }
  transmitBit(true); // stop bit
}

void transmitMessage(const char* msg) {
  transmitting = true;
  digitalWrite(LED_PIN, HIGH);
  transmitPreamble();
  int len = strlen(msg);
  transmitByte(len);
  for (int i = 0; i < len; i++) {
    transmitByte(msg[i]);
  }
  transmitting = false;
  digitalWrite(LED_PIN, LOW);
  Serial.printf("TX: '%s' (%d bytes)\n", msg, len);
}

float goertzel(int16_t* samples, int numSamples, float targetFreq) {
  float k = 0.5 + (numSamples * targetFreq / SAMPLE_RATE);
  float w = 2.0 * M_PI * k / numSamples;
  float coeff = 2.0 * cos(w);
  float s0 = 0, s1 = 0, s2 = 0;
  for (int i = 0; i < numSamples; i++) {
    s0 = samples[i] / 32768.0 + coeff * s1 - s2;
    s2 = s1; s1 = s0;
  }
  return sqrt(s1 * s1 + s2 * s2 - coeff * s1 * s2);
}

bool demodulatebit() {
  int samplesPerBit = SAMPLE_RATE * BIT_DURATION_MS / 1000;
  size_t bytesRead;
  i2s_read(I2S_PORT, rxBuffer, samplesPerBit * 2, &bytesRead, portMAX_DELAY);

  float markPower = goertzel(rxBuffer, samplesPerBit, MARK_FREQ);
  float spacePower = goertzel(rxBuffer, samplesPerBit, SPACE_FREQ);
  snr = 20 * log10((markPower + spacePower) / 0.01);
  return markPower > spacePower;
}

uint8_t receiveByte() {
  demodulatebit(); // start bit
  uint8_t byte = 0;
  for (int i = 0; i < 8; i++) {
    if (demodulatebit()) byte |= (1 << i);
  }
  demodulatebit(); // stop bit
  return byte;
}

void setup() {
  Serial.begin(115200);
  Serial.println("Ultrasonic Data Link starting...");
  pinMode(LED_PIN, OUTPUT);
  initI2S();
  Serial.println("Commands: t<msg> = transmit, r = receive mode");
}

void loop() {
  if (Serial.available()) {
    char cmd = Serial.read();
    if (cmd == 't') {
      String msg = Serial.readStringUntil('\n');
      msg.trim();
      transmitMessage(msg.c_str());
    } else if (cmd == 'r') {
      Serial.println("Listening for ultrasonic data...");
      uint8_t len = receiveByte();
      if (len > 0 && len < 64) {
        rxMessage = "";
        for (int i = 0; i < len; i++) {
          rxMessage += (char)receiveByte();
        }
        Serial.printf("RX: '%s' | SNR: %.1f dB\n", rxMessage.c_str(), snr);
      }
    }
  }
  delay(10);
}
