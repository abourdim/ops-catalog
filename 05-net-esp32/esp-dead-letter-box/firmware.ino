/*
 * ESP Dead Letter Box - firmware.ino
 * Covert message exchange system using BLE advertisements.
 * Messages are embedded in BLE manufacturer-specific data
 * fields, visible only to devices scanning with the correct filter.
 *
 * Hardware: ESP32 DevKit + button + OLED SSD1306
 * Wiring:  SDA -> GPIO21, SCL -> GPIO22, BTN -> GPIO4
 */

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEAdvertising.h>
#include <BLEScan.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

// ---------- Config ----------
#define SCREEN_W     128
#define SCREEN_H      64
#define LED_PIN        2
#define BTN_SEND       4
#define SCAN_TIME      3    // BLE scan seconds
#define COMPANY_ID  0xFFFF  // Custom manufacturer ID

Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);
BLEScan *pBLEScan;

// ---------- Message storage ----------
#define MAX_MESSAGES 8
#define MSG_MAX_LEN  20

static char inbox[MAX_MESSAGES][MSG_MAX_LEN + 1];
static int inboxCount = 0;
static char outMsg[MSG_MAX_LEN + 1] = "Hello Dead Drop!";
static bool scanning = true;

// ---------- BLE scan callback ----------
class DeadLetterCallback : public BLEAdvertisedDeviceCallbacks {
  void onResult(BLEAdvertisedDevice dev) {
    if (!dev.haveManufacturerData()) return;

    std::string mfgData = dev.getManufacturerData();
    if (mfgData.length() < 4) return;

    // Check company ID
    uint16_t cid = (uint8_t)mfgData[0] | ((uint8_t)mfgData[1] << 8);
    if (cid != COMPANY_ID) return;

    // Extract message (bytes 2..end)
    int len = mfgData.length() - 2;
    if (len > MSG_MAX_LEN) len = MSG_MAX_LEN;

    if (inboxCount < MAX_MESSAGES) {
      memcpy(inbox[inboxCount], mfgData.c_str() + 2, len);
      inbox[inboxCount][len] = '\0';
      Serial.printf("[DLB] Received: '%s' from %s\n",
                    inbox[inboxCount],
                    dev.getAddress().toString().c_str());
      inboxCount++;
    }
  }
};

// ---------- Advertise message ----------
void broadcastMessage(const char *msg) {
  BLEAdvertising *adv = BLEDevice::getAdvertising();
  adv->stop();

  BLEAdvertisementData advData;
  // Build manufacturer data: 2-byte company ID + message
  int len = strlen(msg);
  if (len > MSG_MAX_LEN) len = MSG_MAX_LEN;
  char mfg[MSG_MAX_LEN + 2];
  mfg[0] = COMPANY_ID & 0xFF;
  mfg[1] = (COMPANY_ID >> 8) & 0xFF;
  memcpy(&mfg[2], msg, len);
  advData.setManufacturerData(std::string(mfg, len + 2));
  advData.setFlags(ESP_BLE_ADV_FLAG_GEN_DISC | ESP_BLE_ADV_FLAG_BREDR_NOT_SPT);

  adv->setAdvertisementData(advData);
  adv->start();

  Serial.printf("[DLB] Broadcasting: '%s'\n", msg);
  digitalWrite(LED_PIN, HIGH);
}

// ---------- Stop advertising ----------
void stopBroadcast() {
  BLEDevice::getAdvertising()->stop();
  digitalWrite(LED_PIN, LOW);
}

// ---------- Scan for messages ----------
void scanForMessages() {
  Serial.println("[DLB] Scanning...");
  pBLEScan->clearResults();
  pBLEScan->start(SCAN_TIME, false);
  pBLEScan->clearResults();
}

// ---------- Display ----------
void updateDisplay() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(0, 0);
  oled.print("Dead Letter Box");
  oled.setCursor(0, 10);
  oled.printf("Inbox: %d msgs", inboxCount);

  // Show latest messages
  int start = inboxCount > 4 ? inboxCount - 4 : 0;
  for (int i = start; i < inboxCount; i++) {
    oled.setCursor(0, 22 + (i - start) * 10);
    oled.printf("> %.20s", inbox[i]);
  }

  oled.setCursor(0, SCREEN_H - 8);
  oled.print("BTN=Send  Auto-scan");
  oled.display();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[DeadLetterBox] Starting...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_SEND, INPUT_PULLUP);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  updateDisplay();

  BLEDevice::init("DLB_Node");
  pBLEScan = BLEDevice::getScan();
  pBLEScan->setAdvertisedDeviceCallbacks(new DeadLetterCallback());
  pBLEScan->setActiveScan(true);
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(80);

  Serial.println("[DeadLetterBox] Ready.");
}

// ---------- Main loop ----------
void loop() {
  // Button press -> broadcast message
  if (digitalRead(BTN_SEND) == LOW) {
    delay(200);
    broadcastMessage(outMsg);
    delay(5000);  // Advertise for 5 seconds
    stopBroadcast();
  }

  // Periodic scan
  static unsigned long lastScan = 0;
  if (millis() - lastScan > 10000) {
    lastScan = millis();
    stopBroadcast();
    scanForMessages();
    updateDisplay();
  }

  delay(50);
}
