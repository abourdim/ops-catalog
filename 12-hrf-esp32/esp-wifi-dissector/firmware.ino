/*
 * ESP Wi-Fi Dissector - firmware.ino
 * Deep packet inspection tool that decodes and displays
 * 802.11 frame fields in human-readable format. Operates
 * in promiscuous mode, parsing management, control, and
 * data frame headers.
 *
 * Hardware: ESP32 DevKit + OLED SSD1306
 * Wiring:  SDA -> GPIO21, SCL -> GPIO22
 */

#include <WiFi.h>
#include <esp_wifi.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_W 128
#define SCREEN_H  64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);

#define LED_PIN    2
#define BTN_PAUSE  4
#define BTN_FILTER 15

// ---------- Frame parsing ----------
typedef struct {
  uint8_t type;
  uint8_t subtype;
  const char *typeName;
  uint8_t srcMAC[6];
  uint8_t dstMAC[6];
  uint8_t bssid[6];
  int rssi;
  int length;
  uint8_t channel;
  bool toDS;
  bool fromDS;
  bool isProtected;
  // Management frame specific
  char ssid[33];
  uint16_t seqNum;
} ParsedFrame;

static ParsedFrame lastFrame;
static volatile uint32_t frameCount = 0;
static volatile uint32_t mgmtCount = 0;
static volatile uint32_t dataCount = 0;
static volatile uint32_t ctrlCount = 0;
static volatile bool newFrame = false;
static bool paused = false;
static int filterType = -1;  // -1=all, 0=mgmt, 1=ctrl, 2=data

// Subtype names for management frames
static const char *mgmtSubtypes[] = {
  "AssocReq", "AssocResp", "ReassocReq", "ReassocResp",
  "ProbeReq", "ProbeResp", "TimingAdv", "Reserved",
  "Beacon", "ATIM", "Disassoc", "Auth",
  "Deauth", "Action", "ActionNA", "Reserved"
};

// ---------- Parse 802.11 frame ----------
void parseFrame(const uint8_t *frame, int len, int rssi, uint8_t ch) {
  if (len < 24) return;

  ParsedFrame pf;
  pf.type = (frame[0] >> 2) & 0x03;
  pf.subtype = (frame[0] >> 4) & 0x0F;
  pf.toDS = (frame[1] >> 0) & 0x01;
  pf.fromDS = (frame[1] >> 1) & 0x01;
  pf.isProtected = (frame[1] >> 6) & 0x01;
  pf.rssi = rssi;
  pf.length = len;
  pf.channel = ch;
  pf.seqNum = ((frame[23] << 4) | (frame[22] >> 4));
  pf.ssid[0] = '\0';

  // Address fields depend on To/From DS bits
  memcpy(pf.dstMAC, &frame[4], 6);
  memcpy(pf.srcMAC, &frame[10], 6);
  memcpy(pf.bssid, &frame[16], 6);

  // Type name
  if (pf.type == 0) {
    pf.typeName = mgmtSubtypes[pf.subtype];
    mgmtCount++;
    // Extract SSID from beacons and probe requests
    if ((pf.subtype == 8 || pf.subtype == 4 || pf.subtype == 5) && len > 38) {
      uint8_t ssidLen = frame[37];
      if (ssidLen > 0 && ssidLen < 33 && 38 + ssidLen <= len) {
        memcpy(pf.ssid, &frame[38], ssidLen);
        pf.ssid[ssidLen] = '\0';
      }
    }
  } else if (pf.type == 1) {
    pf.typeName = "Control";
    ctrlCount++;
  } else if (pf.type == 2) {
    pf.typeName = pf.isProtected ? "Data(Enc)" : "Data";
    dataCount++;
  } else {
    pf.typeName = "Unknown";
  }

  // Apply filter
  if (filterType >= 0 && pf.type != filterType) return;

  memcpy(&lastFrame, &pf, sizeof(ParsedFrame));
  newFrame = true;
}

// ---------- Promiscuous callback ----------
void IRAM_ATTR snifferCB(void *buf, wifi_promiscuous_pkt_type_t type) {
  wifi_promiscuous_pkt_t *pkt = (wifi_promiscuous_pkt_t *)buf;
  frameCount++;
  if (!paused) {
    parseFrame(pkt->payload, pkt->rx_ctrl.sig_len,
               pkt->rx_ctrl.rssi, pkt->rx_ctrl.channel);
  }
}

// ---------- Display ----------
void updateDisplay() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);

  oled.setCursor(0, 0);
  oled.printf("Dissector %s", paused ? "[PAUSE]" : "[LIVE]");
  oled.setCursor(80, 0);
  oled.printf("F:%s", filterType < 0 ? "ALL" :
              filterType == 0 ? "MGT" : filterType == 1 ? "CTL" : "DAT");

  if (newFrame) {
    oled.setCursor(0, 10);
    oled.printf("%-10s  CH%d  %ddBm", lastFrame.typeName,
                lastFrame.channel, lastFrame.rssi);

    oled.setCursor(0, 20);
    oled.printf("Src: %02X:%02X:%02X:%02X:%02X:%02X",
                lastFrame.srcMAC[0], lastFrame.srcMAC[1], lastFrame.srcMAC[2],
                lastFrame.srcMAC[3], lastFrame.srcMAC[4], lastFrame.srcMAC[5]);

    oled.setCursor(0, 30);
    oled.printf("Dst: %02X:%02X:%02X:%02X:%02X:%02X",
                lastFrame.dstMAC[0], lastFrame.dstMAC[1], lastFrame.dstMAC[2],
                lastFrame.dstMAC[3], lastFrame.dstMAC[4], lastFrame.dstMAC[5]);

    oled.setCursor(0, 40);
    oled.printf("Len:%d Seq:%d %s%s",
                lastFrame.length, lastFrame.seqNum,
                lastFrame.isProtected ? "ENC " : "",
                lastFrame.ssid);
  }

  oled.setCursor(0, 54);
  oled.printf("M:%u D:%u C:%u T:%u", mgmtCount, dataCount, ctrlCount, frameCount);
  oled.display();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[Dissector] Starting...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_PAUSE, INPUT_PULLUP);
  pinMode(BTN_FILTER, INPUT_PULLUP);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  esp_wifi_set_promiscuous(true);
  esp_wifi_set_promiscuous_rx_cb(snifferCB);

  Serial.println("[Dissector] Ready.");
  updateDisplay();
}

// ---------- Main loop ----------
void loop() {
  if (digitalRead(BTN_PAUSE) == LOW) { delay(200); paused = !paused; }
  if (digitalRead(BTN_FILTER) == LOW) { delay(200); filterType = (filterType + 1) % 4; if (filterType == 3) filterType = -1; }

  // Channel hop
  static unsigned long lastHop = 0;
  static uint8_t ch = 1;
  if (!paused && millis() - lastHop > 1000) {
    lastHop = millis();
    ch = (ch % 13) + 1;
    esp_wifi_set_channel(ch, WIFI_SECOND_CHAN_NONE);
  }

  // Display update
  static unsigned long lastDisp = 0;
  if (millis() - lastDisp > 200) {
    lastDisp = millis();
    updateDisplay();
    if (newFrame) {
      Serial.printf("[%s] CH%d RSSI=%d Src=%02X:%02X:%02X:%02X:%02X:%02X Len=%d %s\n",
                    lastFrame.typeName, lastFrame.channel, lastFrame.rssi,
                    lastFrame.srcMAC[0], lastFrame.srcMAC[1], lastFrame.srcMAC[2],
                    lastFrame.srcMAC[3], lastFrame.srcMAC[4], lastFrame.srcMAC[5],
                    lastFrame.length, lastFrame.ssid);
      newFrame = false;
    }
  }

  delay(10);
}
