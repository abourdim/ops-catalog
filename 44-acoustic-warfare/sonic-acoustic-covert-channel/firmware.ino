/*
 * Sonic Acoustic Covert Channel - ESP32 Firmware
 * I2S speaker/mic creates hidden data channel via near-ultrasonic audio
 * OFDM-like multi-tone encoding for robust covert communication
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
#define NUM_SUBCARRIERS 8
#define BASE_FREQ 17000
#define FREQ_SPACING 200
#define SYMBOL_DURATION_MS 50
#define LED_PIN 2

int16_t txBuffer[BUFFER_SIZE];
int16_t rxBuffer[BUFFER_SIZE];
float subcarrierPhases[NUM_SUBCARRIERS];
bool txActive = false;
String rxData = "";
int symbolsSent = 0;
int symbolsReceived = 0;
float channelSNR = 0;

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

float goertzel(int16_t* buf, int len, float freq) {
  float k = 0.5 + len * freq / SAMPLE_RATE;
  float w = 2.0 * M_PI * k / len;
  float coeff = 2.0 * cos(w);
  float s0 = 0, s1 = 0, s2 = 0;
  for (int i = 0; i < len; i++) {
    s0 = buf[i] / 32768.0 + coeff * s1 - s2;
    s2 = s1; s1 = s0;
  }
  return sqrt(s1 * s1 + s2 * s2 - coeff * s1 * s2);
}

void encodeSymbol(uint8_t byte, int16_t* buffer, int len) {
  memset(buffer, 0, len * 2);
  float amplitude = 0.5 / NUM_SUBCARRIERS;

  for (int sc = 0; sc < NUM_SUBCARRIERS; sc++) {
    bool bitSet = (byte >> sc) & 1;
    if (bitSet) {
      float freq = BASE_FREQ + sc * FREQ_SPACING;
      float phaseInc = 2.0 * M_PI * freq / SAMPLE_RATE;
      for (int i = 0; i < len; i++) {
        float sample = amplitude * sin(subcarrierPhases[sc]);
        buffer[i] += (int16_t)(sample * 32767);
        subcarrierPhases[sc] += phaseInc;
      }
    }
  }
  // Apply window
  for (int i = 0; i < len; i++) {
    float window = 0.5 * (1 - cos(2 * M_PI * i / len));
    buffer[i] = (int16_t)(buffer[i] * window);
  }
}

uint8_t decodeSymbol(int16_t* buffer, int len) {
  uint8_t byte = 0;
  float signalPower = 0, noisePower = 0;

  for (int sc = 0; sc < NUM_SUBCARRIERS; sc++) {
    float freq = BASE_FREQ + sc * FREQ_SPACING;
    float power = goertzel(buffer, len, freq);
    float noiseFreq = freq + FREQ_SPACING / 2;
    float noise = goertzel(buffer, len, noiseFreq);

    signalPower += power;
    noisePower += noise;

    if (power > noise * 2.0) {
      byte |= (1 << sc);
    }
  }
  channelSNR = (noisePower > 0) ? 20 * log10(signalPower / noisePower) : 40;
  return byte;
}

void transmitPreamble() {
  // All subcarriers on as sync
  for (int rep = 0; rep < 3; rep++) {
    encodeSymbol(0xFF, txBuffer, BUFFER_SIZE);
    size_t written;
    i2s_write(I2S_PORT, txBuffer, sizeof(txBuffer), &written, portMAX_DELAY);
  }
}

void transmitMessage(const char* msg) {
  Serial.printf("TX covert: '%s'\n", msg);
  transmitPreamble();
  int len = strlen(msg);

  encodeSymbol(len, txBuffer, BUFFER_SIZE);
  size_t written;
  i2s_write(I2S_PORT, txBuffer, sizeof(txBuffer), &written, portMAX_DELAY);

  for (int i = 0; i < len; i++) {
    encodeSymbol(msg[i], txBuffer, BUFFER_SIZE);
    i2s_write(I2S_PORT, txBuffer, sizeof(txBuffer), &written, portMAX_DELAY);
    symbolsSent++;
  }
  Serial.printf("Sent %d symbols\n", len);
}

bool detectPreamble() {
  size_t bytesRead;
  i2s_read(I2S_PORT, rxBuffer, sizeof(rxBuffer), &bytesRead, portMAX_DELAY);
  uint8_t decoded = decodeSymbol(rxBuffer, BUFFER_SIZE);
  return decoded == 0xFF;
}

void receiveMessage() {
  Serial.println("Listening for covert channel...");
  while (!detectPreamble()) {}
  Serial.println("Preamble detected!");

  size_t bytesRead;
  i2s_read(I2S_PORT, rxBuffer, sizeof(rxBuffer), &bytesRead, portMAX_DELAY);
  uint8_t len = decodeSymbol(rxBuffer, BUFFER_SIZE);

  if (len > 0 && len < 128) {
    rxData = "";
    for (int i = 0; i < len; i++) {
      i2s_read(I2S_PORT, rxBuffer, sizeof(rxBuffer), &bytesRead, portMAX_DELAY);
      uint8_t ch = decodeSymbol(rxBuffer, BUFFER_SIZE);
      rxData += (char)ch;
      symbolsReceived++;
    }
    Serial.printf("RX covert: '%s' | SNR: %.1f dB\n", rxData.c_str(), channelSNR);
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("Acoustic Covert Channel starting...");
  pinMode(LED_PIN, OUTPUT);
  initI2S();
  memset(subcarrierPhases, 0, sizeof(subcarrierPhases));
  Serial.println("Commands: t<msg>=transmit, r=receive, s=stats");
}

void loop() {
  if (Serial.available()) {
    char c = Serial.read();
    if (c == 't') {
      String msg = Serial.readStringUntil('\n');
      msg.trim();
      digitalWrite(LED_PIN, HIGH);
      transmitMessage(msg.c_str());
      digitalWrite(LED_PIN, LOW);
    }
    if (c == 'r') receiveMessage();
    if (c == 's') {
      Serial.printf("Symbols TX: %d | RX: %d | SNR: %.1f dB\n",
        symbolsSent, symbolsReceived, channelSNR);
    }
  }
  delay(10);
}
