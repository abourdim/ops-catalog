/*
 * Sonic Audio Steganography - ESP32 Firmware
 * Hides data in audio signals using LSB and spread spectrum techniques
 * I2S captures/plays audio with embedded hidden messages
 */

#include <driver/i2s.h>
#include <math.h>

#define I2S_WS 15
#define I2S_SCK 14
#define I2S_SD_OUT 22
#define I2S_SD_IN 13
#define I2S_PORT I2S_NUM_0
#define SAMPLE_RATE 44100
#define BUFFER_SIZE 1024
#define LED_PIN 2
#define MAX_MSG_LEN 128

int16_t audioBuffer[BUFFER_SIZE];
int16_t stegoBuffer[BUFFER_SIZE];
uint8_t hiddenMessage[MAX_MSG_LEN];
uint8_t extractedMessage[MAX_MSG_LEN];
int msgLen = 0;
int extractedLen = 0;
float embedStrength = 0.01;
int bitsEmbedded = 0;
int bitsExtracted = 0;

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

void embedLSB(int16_t* cover, int16_t* stego, int len, uint8_t* msg, int msgBytes) {
  memcpy(stego, cover, len * 2);
  bitsEmbedded = 0;
  int totalBits = msgBytes * 8;

  // Embed length first (16 bits)
  for (int i = 0; i < 16 && i < len; i++) {
    int bit = (msgBytes >> i) & 1;
    stego[i] = (stego[i] & 0xFFFE) | bit;
  }

  for (int b = 0; b < totalBits && (b + 16) < len; b++) {
    int byteIdx = b / 8;
    int bitIdx = b % 8;
    int bit = (msg[byteIdx] >> bitIdx) & 1;
    stego[b + 16] = (stego[b + 16] & 0xFFFE) | bit;
    bitsEmbedded++;
  }
}

void embedSpreadSpectrum(int16_t* cover, int16_t* stego, int len, uint8_t* msg, int msgBytes) {
  memcpy(stego, cover, len * 2);
  int chipsPerBit = len / (msgBytes * 8 + 16);
  if (chipsPerBit < 2) return;

  // Simple PN sequence
  uint32_t pn = 0xACE1;
  int bitPos = 0;

  // Embed length
  for (int i = 0; i < 16; i++) {
    int bit = (msgBytes >> i) & 1;
    int sign = bit ? 1 : -1;
    for (int c = 0; c < chipsPerBit && bitPos < len; c++) {
      pn ^= (pn << 13); pn ^= (pn >> 17); pn ^= (pn << 5);
      int chip = (pn & 1) ? 1 : -1;
      stego[bitPos] += (int16_t)(sign * chip * embedStrength * 32767);
      bitPos++;
    }
  }

  // Embed message
  for (int b = 0; b < msgBytes * 8 && bitPos < len; b++) {
    int bit = (msg[b / 8] >> (b % 8)) & 1;
    int sign = bit ? 1 : -1;
    for (int c = 0; c < chipsPerBit && bitPos < len; c++) {
      pn ^= (pn << 13); pn ^= (pn >> 17); pn ^= (pn << 5);
      int chip = (pn & 1) ? 1 : -1;
      stego[bitPos] += (int16_t)(sign * chip * embedStrength * 32767);
      bitPos++;
    }
  }
  bitsEmbedded = msgBytes * 8;
}

void extractLSB(int16_t* stego, int len) {
  int msgBytes = 0;
  for (int i = 0; i < 16 && i < len; i++) {
    msgBytes |= (stego[i] & 1) << i;
  }
  if (msgBytes > MAX_MSG_LEN || msgBytes <= 0) {
    extractedLen = 0;
    return;
  }
  extractedLen = msgBytes;
  memset(extractedMessage, 0, MAX_MSG_LEN);
  bitsExtracted = 0;

  for (int b = 0; b < msgBytes * 8 && (b + 16) < len; b++) {
    int bit = stego[b + 16] & 1;
    extractedMessage[b / 8] |= bit << (b % 8);
    bitsExtracted++;
  }
}

float calculateSNR(int16_t* original, int16_t* stego, int len) {
  float signalPower = 0, noisePower = 0;
  for (int i = 0; i < len; i++) {
    signalPower += (float)original[i] * original[i];
    float diff = original[i] - stego[i];
    noisePower += diff * diff;
  }
  return (noisePower > 0) ? 10 * log10(signalPower / noisePower) : 100;
}

void setup() {
  Serial.begin(115200);
  Serial.println("Audio Steganography starting...");
  pinMode(LED_PIN, OUTPUT);
  initI2S();
  Serial.println("Commands: h<msg>=hide(LSB), s<msg>=hide(SS), x=extract, r=record");
}

void loop() {
  if (Serial.available()) {
    char cmd = Serial.read();

    if (cmd == 'r') {
      size_t bytesRead;
      i2s_read(I2S_PORT, audioBuffer, sizeof(audioBuffer), &bytesRead, portMAX_DELAY);
      Serial.printf("Recorded %d samples\n", bytesRead / 2);
    }
    else if (cmd == 'h') {
      String msg = Serial.readStringUntil('\n');
      msg.trim();
      msgLen = min((int)msg.length(), MAX_MSG_LEN);
      memcpy(hiddenMessage, msg.c_str(), msgLen);
      embedLSB(audioBuffer, stegoBuffer, BUFFER_SIZE, hiddenMessage, msgLen);
      float snr = calculateSNR(audioBuffer, stegoBuffer, BUFFER_SIZE);
      Serial.printf("Hidden (LSB): '%s' | %d bits | SNR: %.1f dB\n", msg.c_str(), bitsEmbedded, snr);
      size_t written;
      i2s_write(I2S_PORT, stegoBuffer, sizeof(stegoBuffer), &written, portMAX_DELAY);
      digitalWrite(LED_PIN, HIGH); delay(100); digitalWrite(LED_PIN, LOW);
    }
    else if (cmd == 's') {
      String msg = Serial.readStringUntil('\n');
      msg.trim();
      msgLen = min((int)msg.length(), MAX_MSG_LEN);
      memcpy(hiddenMessage, msg.c_str(), msgLen);
      embedSpreadSpectrum(audioBuffer, stegoBuffer, BUFFER_SIZE, hiddenMessage, msgLen);
      float snr = calculateSNR(audioBuffer, stegoBuffer, BUFFER_SIZE);
      Serial.printf("Hidden (SS): '%s' | %d bits | SNR: %.1f dB\n", msg.c_str(), bitsEmbedded, snr);
    }
    else if (cmd == 'x') {
      extractLSB(stegoBuffer, BUFFER_SIZE);
      Serial.printf("Extracted: '%s' (%d bytes, %d bits)\n",
        (char*)extractedMessage, extractedLen, bitsExtracted);
    }
  }
  delay(10);
}
