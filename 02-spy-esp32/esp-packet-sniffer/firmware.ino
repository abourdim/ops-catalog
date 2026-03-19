/*
 * ESP Packet Sniffer - firmware.ino
 * Captures 802.11 Wi-Fi frames in promiscuous mode and
 * logs frame type, RSSI, source MAC, and channel to Serial
 * and optional SD card.
 *
 * Hardware: ESP32 DevKit + optional SD card (CS -> GPIO5)
 */

#include <WiFi.h>
#include <esp_wifi.h>
#include <SD.h>
#include <SPI.h>

// ---------- Pins ----------
#define LED_PIN    2
#define BTN_CH_UP  4   // Channel hop button
#define SD_CS_PIN  5

// ---------- State ----------
static uint8_t currentChannel = 1;
static uint32_t pktCount = 0;
static uint32_t mgmtCount = 0;
static uint32_t dataCount = 0;
static uint32_t ctrlCount = 0;
static bool sdReady = false;
static File logFile;

// 802.11 frame type names
static const char *frameTypeStr(uint8_t type, uint8_t subtype) {
  switch (type) {
    case 0: // Management
      switch (subtype) {
        case 0:  return "AssocReq";
        case 1:  return "AssocResp";
        case 4:  return "ProbeReq";
        case 5:  return "ProbeResp";
        case 8:  return "Beacon";
        case 11: return "Auth";
        case 12: return "Deauth";
        default: return "Mgmt";
      }
    case 1: return "Ctrl";
    case 2: return "Data";
    default: return "Unknown";
  }
}

// ---------- Promiscuous callback ----------
void IRAM_ATTR snifferCallback(void *buf, wifi_promiscuous_pkt_type_t type) {
  wifi_promiscuous_pkt_t *pkt = (wifi_promiscuous_pkt_t *)buf;
  const uint8_t *frame = pkt->payload;
  int rssi = pkt->rx_ctrl.rssi;
  int len = pkt->rx_ctrl.sig_len;

  if (len < 24) return;  // Too short for a valid frame header

  uint8_t frameType = (frame[0] >> 2) & 0x03;
  uint8_t frameSubtype = (frame[0] >> 4) & 0x0F;

  // Source MAC at offset 10
  char srcMac[18];
  snprintf(srcMac, sizeof(srcMac), "%02X:%02X:%02X:%02X:%02X:%02X",
           frame[10], frame[11], frame[12],
           frame[13], frame[14], frame[15]);

  pktCount++;
  if (frameType == 0) mgmtCount++;
  else if (frameType == 1) ctrlCount++;
  else if (frameType == 2) dataCount++;

  const char *typeStr = frameTypeStr(frameType, frameSubtype);

  Serial.printf("[%7u] CH%2d RSSI:%4d %-10s %s  len=%d\n",
                pktCount, currentChannel, rssi, typeStr, srcMac, len);

  // Log to SD if available
  if (sdReady && logFile) {
    logFile.printf("%lu,%d,%d,%s,%s,%d\n",
                   millis(), currentChannel, rssi, typeStr, srcMac, len);
    if (pktCount % 50 == 0) logFile.flush();
  }

  digitalWrite(LED_PIN, !digitalRead(LED_PIN));
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[PacketSniffer] Initializing...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_CH_UP, INPUT_PULLUP);

  // Optional SD card
  if (SD.begin(SD_CS_PIN)) {
    sdReady = true;
    logFile = SD.open("/packets.csv", FILE_APPEND);
    if (logFile) {
      logFile.println("time_ms,channel,rssi,type,src_mac,length");
    }
    Serial.println("[SD] Logging enabled.");
  } else {
    Serial.println("[SD] No card, serial-only mode.");
  }

  // Wi-Fi promiscuous mode
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  esp_wifi_set_promiscuous(true);
  esp_wifi_set_promiscuous_rx_cb(snifferCallback);
  esp_wifi_set_channel(currentChannel, WIFI_SECOND_CHAN_NONE);

  Serial.printf("[PacketSniffer] Listening on channel %d\n", currentChannel);
}

// ---------- Main loop ----------
void loop() {
  // Manual channel change
  if (digitalRead(BTN_CH_UP) == LOW) {
    delay(200);
    currentChannel = (currentChannel % 13) + 1;
    esp_wifi_set_channel(currentChannel, WIFI_SECOND_CHAN_NONE);
    Serial.printf("[CH] Switched to channel %d\n", currentChannel);
  }

  // Auto channel hop every 2 seconds
  static unsigned long lastHop = 0;
  if (millis() - lastHop > 2000) {
    lastHop = millis();
    currentChannel = (currentChannel % 13) + 1;
    esp_wifi_set_channel(currentChannel, WIFI_SECOND_CHAN_NONE);
  }

  // Stats every 10 seconds
  static unsigned long lastStats = 0;
  if (millis() - lastStats > 10000) {
    lastStats = millis();
    Serial.printf("[STATS] Total=%u  Mgmt=%u  Data=%u  Ctrl=%u\n",
                  pktCount, mgmtCount, dataCount, ctrlCount);
  }

  delay(10);
}
