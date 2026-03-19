/*
 * ESP BLE X-Ray - firmware.ino
 * Deep-scans BLE devices revealing services, characteristics,
 * advertisement data, and manufacturer info. Provides a
 * complete X-ray view of nearby Bluetooth Low Energy devices.
 *
 * Hardware: ESP32 DevKit + OLED SSD1306
 * Wiring:  SDA -> GPIO21, SCL -> GPIO22
 */

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEClient.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_W 128
#define SCREEN_H  64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);

#define LED_PIN  2
#define BTN_SCAN 4
#define BTN_DEEP 15  // Deep inspect selected device

// ---------- Device database ----------
#define MAX_DEVICES 32
typedef struct {
  BLEAddress addr;
  char name[24];
  int rssi;
  uint8_t addrType;
  bool connectable;
  uint16_t appearance;
  int8_t txPower;
  uint16_t companyId;
  uint8_t serviceCount;
  unsigned long lastSeen;
} BLEDeviceInfo;

static BLEDeviceInfo devices[MAX_DEVICES];
static int deviceCount = 0;
static int selectedDev = 0;
static bool scanning = false;

BLEScan *pBLEScan;

// ---------- Known company IDs ----------
const char* getCompanyName(uint16_t id) {
  switch (id) {
    case 0x004C: return "Apple";
    case 0x0006: return "Microsoft";
    case 0x000F: return "Broadcom";
    case 0x0059: return "Nordic Semi";
    case 0x00E0: return "Google";
    case 0x0075: return "Samsung";
    case 0x0310: return "Xiaomi";
    default: return "Unknown";
  }
}

// ---------- Scan callback ----------
class XRayCallback : public BLEAdvertisedDeviceCallbacks {
  void onResult(BLEAdvertisedDevice dev) override {
    // Find or add device
    int idx = -1;
    for (int i = 0; i < deviceCount; i++) {
      if (devices[i].addr.equals(dev.getAddress())) { idx = i; break; }
    }
    if (idx < 0 && deviceCount < MAX_DEVICES) {
      idx = deviceCount++;
      devices[idx].addr = dev.getAddress();
    }
    if (idx < 0) return;

    devices[idx].rssi = dev.getRSSI();
    devices[idx].lastSeen = millis();
    devices[idx].connectable = dev.isAdvertisingService(BLEUUID("180F")); // Battery

    if (dev.haveName()) {
      strncpy(devices[idx].name, dev.getName().c_str(), 23);
    }
    if (dev.haveTXPower()) {
      devices[idx].txPower = dev.getTXPower();
    }
    if (dev.haveAppearance()) {
      devices[idx].appearance = dev.getAppearance();
    }
    if (dev.haveManufacturerData()) {
      std::string mfg = dev.getManufacturerData();
      if (mfg.length() >= 2) {
        devices[idx].companyId = (uint8_t)mfg[0] | ((uint8_t)mfg[1] << 8);
      }
    }
    if (dev.haveServiceUUID()) {
      devices[idx].serviceCount++;
    }
  }
};

// ---------- Deep inspection via GATT connect ----------
void deepInspect(int idx) {
  Serial.printf("[XRAY] Deep inspecting %s...\n",
                devices[idx].addr.toString().c_str());

  BLEClient *client = BLEDevice::createClient();
  if (!client->connect(devices[idx].addr)) {
    Serial.println("[XRAY] Connection failed.");
    delete client;
    return;
  }

  Serial.println("[XRAY] Connected! Enumerating services...");
  auto *services = client->getServices();
  for (auto &pair : *services) {
    BLERemoteService *svc = pair.second;
    Serial.printf("  Service: %s\n", svc->getUUID().toString().c_str());

    auto *chars = svc->getCharacteristics();
    for (auto &cpair : *chars) {
      BLERemoteCharacteristic *chr = cpair.second;
      Serial.printf("    Char: %s  Props: 0x%02X",
                    chr->getUUID().toString().c_str(),
                    chr->getProperties());
      if (chr->canRead()) {
        std::string val = chr->readValue();
        Serial.printf("  Val: ");
        for (int i = 0; i < (int)val.length() && i < 16; i++) {
          Serial.printf("%02X ", (uint8_t)val[i]);
        }
      }
      Serial.println();
    }
  }

  client->disconnect();
  delete client;
  Serial.println("[XRAY] Deep inspection complete.");
}

// ---------- Display ----------
void updateDisplay() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(0, 0);
  oled.printf("BLE X-Ray  %d devs", deviceCount);

  // List devices
  int start = max(0, selectedDev - 3);
  for (int i = start; i < min(deviceCount, start + 5); i++) {
    int y = 10 + (i - start) * 10;
    oled.setCursor(0, y);
    if (i == selectedDev) oled.print("> ");
    else oled.print("  ");

    if (devices[i].name[0]) {
      oled.printf("%.12s %d", devices[i].name, devices[i].rssi);
    } else {
      oled.printf("%.12s %d",
                  devices[i].addr.toString().c_str() + 9,
                  devices[i].rssi);
    }
    if (devices[i].companyId > 0) {
      oled.printf(" %s", getCompanyName(devices[i].companyId));
    }
  }

  oled.display();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[BLE-XRAY] Starting...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_SCAN, INPUT_PULLUP);
  pinMode(BTN_DEEP, INPUT_PULLUP);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(20, 28);
  oled.print("BLE X-Ray");
  oled.display();

  BLEDevice::init("BLE_XRay");
  pBLEScan = BLEDevice::getScan();
  pBLEScan->setAdvertisedDeviceCallbacks(new XRayCallback());
  pBLEScan->setActiveScan(true);
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(80);

  Serial.println("[BLE-XRAY] Ready. Press SCAN to begin.");
}

// ---------- Main loop ----------
void loop() {
  // Scan button
  if (digitalRead(BTN_SCAN) == LOW) {
    delay(200);
    Serial.println("[XRAY] Scanning...");
    digitalWrite(LED_PIN, HIGH);
    pBLEScan->start(5, false);
    pBLEScan->clearResults();
    digitalWrite(LED_PIN, LOW);
    updateDisplay();

    // Print full report
    for (int i = 0; i < deviceCount; i++) {
      Serial.printf("[DEV %d] %s  '%s'  RSSI=%d  Company=%s(0x%04X)  Svc=%d\n",
                    i, devices[i].addr.toString().c_str(),
                    devices[i].name, devices[i].rssi,
                    getCompanyName(devices[i].companyId),
                    devices[i].companyId, devices[i].serviceCount);
    }
  }

  // Deep inspect button
  if (digitalRead(BTN_DEEP) == LOW) {
    delay(200);
    if (deviceCount > 0) {
      deepInspect(selectedDev);
      selectedDev = (selectedDev + 1) % deviceCount;
      updateDisplay();
    }
  }

  delay(50);
}
