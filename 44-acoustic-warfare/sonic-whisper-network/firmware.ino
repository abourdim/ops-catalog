/*
 * Sonic Whisper Network - ESP32 Firmware
 * Near-ultrasonic mesh communication between ESP32 nodes
 * I2S audio FSK at 18-20kHz for barely-audible data network
 */

#include <driver/i2s.h>
#include <WiFi.h>
#include <math.h>

#define I2S_WS 15
#define I2S_SCK 14
#define I2S_SD_OUT 22
#define I2S_SD_IN 13
#define I2S_PORT I2S_NUM_0
#define SAMPLE_RATE 48000
#define BUFFER_SIZE 512
#define MARK_FREQ 19000
#define SPACE_FREQ 18000
#define SYMBOL_MS 15
#define LED_PIN 2
#define MAX_MSG_LEN 64

int16_t txBuf[BUFFER_SIZE];
int16_t rxBuf[BUFFER_SIZE];
uint8_t nodeId;
bool listening = true;
String lastReceived = "";
int msgCount = 0;
float linkQuality = 0;

struct WhisperPacket {
  uint8_t src;
  uint8_t dst;
  uint8_t ttl;
  uint8_t len;
  char data[MAX_MSG_LEN];
  uint8_t checksum;
};

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

void transmitBit(bool bit) {
  float freq = bit ? MARK_FREQ : SPACE_FREQ;
  int samples = SAMPLE_RATE * SYMBOL_MS / 1000;
  samples = min(samples, BUFFER_SIZE);

  for (int i = 0; i < samples; i++) {
    float t = (float)i / SAMPLE_RATE;
    float window = (i < 20 || i > samples - 20) ?
      0.5 * (1 - cos(M_PI * min(i, samples - i) / 20.0)) : 1.0;
    txBuf[i] = (int16_t)(window * 24000 * sin(2 * M_PI * freq * t));
  }
  size_t written;
  i2s_write(I2S_PORT, txBuf, samples * 2, &written, portMAX_DELAY);
}

void transmitByte(uint8_t byte) {
  transmitBit(false); // start
  for (int i = 0; i < 8; i++) {
    transmitBit((byte >> i) & 1);
  }
  transmitBit(true); // stop
}

uint8_t calcChecksum(WhisperPacket* pkt) {
  uint8_t cs = pkt->src ^ pkt->dst ^ pkt->ttl ^ pkt->len;
  for (int i = 0; i < pkt->len; i++) cs ^= pkt->data[i];
  return cs;
}

void transmitPacket(WhisperPacket* pkt) {
  pkt->checksum = calcChecksum(pkt);
  // Preamble
  for (int i = 0; i < 4; i++) transmitBit(i % 2);

  transmitByte(0xAA); // sync
  transmitByte(pkt->src);
  transmitByte(pkt->dst);
  transmitByte(pkt->ttl);
  transmitByte(pkt->len);
  for (int i = 0; i < pkt->len; i++) {
    transmitByte(pkt->data[i]);
  }
  transmitByte(pkt->checksum);
  msgCount++;
}

bool receiveBit() {
  int samples = SAMPLE_RATE * SYMBOL_MS / 1000;
  samples = min(samples, BUFFER_SIZE);
  size_t bytesRead;
  i2s_read(I2S_PORT, rxBuf, samples * 2, &bytesRead, portMAX_DELAY);

  float markPower = goertzel(rxBuf, samples, MARK_FREQ);
  float spacePower = goertzel(rxBuf, samples, SPACE_FREQ);
  linkQuality = (markPower + spacePower > 0.01) ?
    abs(markPower - spacePower) / (markPower + spacePower) : 0;
  return markPower > spacePower;
}

uint8_t receiveByte() {
  receiveBit(); // start
  uint8_t byte = 0;
  for (int i = 0; i < 8; i++) {
    if (receiveBit()) byte |= (1 << i);
  }
  receiveBit(); // stop
  return byte;
}

void sendWhisper(uint8_t dst, const char* msg) {
  WhisperPacket pkt;
  pkt.src = nodeId;
  pkt.dst = dst;
  pkt.ttl = 3;
  pkt.len = min((int)strlen(msg), MAX_MSG_LEN);
  memcpy(pkt.data, msg, pkt.len);

  Serial.printf("TX whisper -> %d: '%s'\n", dst, msg);
  digitalWrite(LED_PIN, HIGH);
  transmitPacket(&pkt);
  digitalWrite(LED_PIN, LOW);
}

void setup() {
  Serial.begin(115200);
  Serial.println("Whisper Network starting...");
  pinMode(LED_PIN, OUTPUT);
  WiFi.mode(WIFI_STA);
  nodeId = WiFi.macAddress()[5];
  initI2S();
  Serial.printf("Node ID: %d\n", nodeId);
  Serial.println("Commands: w<dst>:<msg>=whisper, l=listen, s=stats");
}

void loop() {
  if (Serial.available()) {
    char c = Serial.read();
    if (c == 'w') {
      int dst = Serial.parseInt();
      Serial.read(); // colon
      String msg = Serial.readStringUntil('\n');
      msg.trim();
      sendWhisper(dst, msg.c_str());
    }
    if (c == 'l') { listening = true; Serial.println("Listening..."); }
    if (c == 's') Serial.printf("Node: %d | Messages: %d | Quality: %.0f%%\n",
      nodeId, msgCount, linkQuality * 100);
  }
  delay(10);
}
