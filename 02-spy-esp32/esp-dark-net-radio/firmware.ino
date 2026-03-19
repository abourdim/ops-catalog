/*
 * ESP Dark Net Radio - firmware.ino
 * Encrypted audio streaming over ESP-NOW mesh network.
 * Uses I2S DAC output for audio playback and ESP-NOW for
 * peer-to-peer encrypted broadcast without Wi-Fi infrastructure.
 *
 * Hardware: ESP32 DevKit + MAX98357A I2S DAC + speaker
 * Wiring:  BCLK -> GPIO26, LRC -> GPIO25, DIN -> GPIO22
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_wifi.h>
#include <driver/i2s.h>
#include <mbedtls/aes.h>

// ---------- Pin definitions ----------
#define I2S_BCLK   26
#define I2S_LRC    25
#define I2S_DOUT   22
#define BTN_TX     4   // Push-to-talk button
#define LED_STATUS 2   // On-board LED

// ---------- Crypto ----------
static const uint8_t AES_KEY[16] = {
  0xDE,0xAD,0xBE,0xEF,0xCA,0xFE,0xBA,0xBE,
  0x01,0x23,0x45,0x67,0x89,0xAB,0xCD,0xEF
};
static mbedtls_aes_context aesCtx;

// ---------- Audio buffer ----------
#define SAMPLE_RATE   16000
#define BLOCK_SIZE    240   // samples per ESP-NOW frame
static int16_t txBuf[BLOCK_SIZE];
static int16_t rxBuf[BLOCK_SIZE];

// ---------- ESP-NOW ----------
static uint8_t broadcastAddr[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};
static volatile bool newAudio = false;

// Callback when data is received over ESP-NOW
void onDataRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len != sizeof(rxBuf)) return;
  uint8_t iv[16] = {0};
  mbedtls_aes_crypt_cbc(&aesCtx, MBEDTLS_AES_DECRYPT, len, iv,
                         data, (uint8_t *)rxBuf);
  newAudio = true;
}

// Callback for send confirmation
void onDataSent(const uint8_t *mac, esp_now_send_status_t status) {
  digitalWrite(LED_STATUS, status == ESP_NOW_SEND_SUCCESS ? HIGH : LOW);
}

// ---------- I2S setup ----------
void initI2S() {
  i2s_config_t cfg = {};
  cfg.mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX);
  cfg.sample_rate = SAMPLE_RATE;
  cfg.bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT;
  cfg.channel_format = I2S_CHANNEL_FMT_ONLY_LEFT;
  cfg.communication_format = I2S_COMM_FORMAT_STAND_I2S;
  cfg.intr_alloc_flags = ESP_INTR_FLAG_LEVEL1;
  cfg.dma_buf_count = 4;
  cfg.dma_buf_len = BLOCK_SIZE;

  i2s_driver_install(I2S_NUM_0, &cfg, 0, NULL);

  i2s_pin_config_t pins = {};
  pins.bck_io_num   = I2S_BCLK;
  pins.ws_io_num    = I2S_LRC;
  pins.data_out_num = I2S_DOUT;
  pins.data_in_num  = I2S_PIN_NO_CHANGE;
  i2s_set_pin(I2S_NUM_0, &pins);
  i2s_zero_dma_buffer(I2S_NUM_0);
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[DarkNetRadio] Booting...");

  pinMode(BTN_TX, INPUT_PULLUP);
  pinMode(LED_STATUS, OUTPUT);

  // Wi-Fi in station mode for ESP-NOW
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  esp_wifi_set_channel(6, WIFI_SECOND_CHAN_NONE);

  // Init AES context
  mbedtls_aes_init(&aesCtx);
  mbedtls_aes_setkey_enc(&aesCtx, AES_KEY, 128);
  mbedtls_aes_setkey_dec(&aesCtx, AES_KEY, 128);

  // Init ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("[ESP-NOW] Init failed!");
    return;
  }
  esp_now_register_recv_cb(onDataRecv);
  esp_now_register_send_cb(onDataSent);

  // Add broadcast peer
  esp_now_peer_info_t peer = {};
  memcpy(peer.peer_addr, broadcastAddr, 6);
  peer.channel = 6;
  peer.encrypt = false;
  esp_now_add_peer(&peer);

  initI2S();
  Serial.println("[DarkNetRadio] Ready. Press button to transmit.");
}

// ---------- Main loop ----------
void loop() {
  // Transmit when push-to-talk is held
  if (digitalRead(BTN_TX) == LOW) {
    // Read ADC as simple mic input (GPIO36 = ADC1_CH0)
    for (int i = 0; i < BLOCK_SIZE; i++) {
      txBuf[i] = (int16_t)(analogRead(36) - 2048) << 4;
    }
    // Encrypt block
    uint8_t enc[sizeof(txBuf)];
    uint8_t iv[16] = {0};
    mbedtls_aes_crypt_cbc(&aesCtx, MBEDTLS_AES_ENCRYPT,
                           sizeof(txBuf), iv,
                           (uint8_t *)txBuf, enc);
    esp_now_send(broadcastAddr, enc, sizeof(enc));
  }

  // Play received audio
  if (newAudio) {
    size_t written = 0;
    i2s_write(I2S_NUM_0, rxBuf, sizeof(rxBuf), &written, portMAX_DELAY);
    newAudio = false;
  }

  delay(1);
}
