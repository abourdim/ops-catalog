/*
 * ESP RF IoT Audit - firmware.ino
 * Audits RF-based IoT devices (433MHz, BLE, Wi-Fi) for
 * security weaknesses: unencrypted communications, replay
 * vulnerability, weak authentication, and default credentials.
 *
 * Hardware: ESP32 DevKit + 433MHz RX module + OLED SSD1306
 * Wiring:  RF RX -> GPIO13, SDA -> GPIO21, SCL -> GPIO22
 */

#include <WiFi.h>
#include <esp_wifi.h>
#include <BLEDevice.h>
#include <BLEScan.h>
#include <RCSwitch.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_W 128
#define SCREEN_H  64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);

#define LED_PIN    2
#define RF_RX_PIN 13
#define BTN_AUDIT  4  // Start audit
#define BTN_MODE  15  // Switch audit type

RCSwitch rfRX = RCSwitch();
BLEScan *pBLEScan;

// ---------- Audit results ----------
#define MAX_FINDINGS 24
typedef struct {
  char device[24];
  char issue[32];
  uint8_t severity;  // 1=low, 2=medium, 3=high, 4=critical
} AuditFinding;

static AuditFinding findings[MAX_FINDINGS];
static int findingCount = 0;
static int auditMode = 0;  // 0=WiFi, 1=BLE, 2=RF
static const char *modeNames[] = {"WiFi Audit", "BLE Audit", "RF Audit"};

// ---------- Add finding ----------
void addFinding(const char *device, const char *issue, uint8_t severity) {
  if (findingCount >= MAX_FINDINGS) return;
  strncpy(findings[findingCount].device, device, 23);
  strncpy(findings[findingCount].issue, issue, 31);
  findings[findingCount].severity = severity;
  findingCount++;

  const char *sevStr[] = {"", "LOW", "MED", "HIGH", "CRIT"};
  Serial.printf("[AUDIT] [%s] %s: %s\n", sevStr[severity], device, issue);
}

// ---------- Wi-Fi audit ----------
void auditWiFi() {
  Serial.println("[AUDIT] Scanning Wi-Fi...");
  int n = WiFi.scanNetworks(false, true);

  for (int i = 0; i < n; i++) {
    String ssid = WiFi.SSID(i);
    wifi_auth_mode_t auth = WiFi.encryptionType(i);

    // Check for open networks
    if (auth == WIFI_AUTH_OPEN && ssid.length() > 0) {
      addFinding(ssid.c_str(), "Open/no encryption", 4);
    }

    // Check for WEP (deprecated)
    if (auth == WIFI_AUTH_WEP) {
      addFinding(ssid.c_str(), "WEP (broken crypto)", 3);
    }

    // Check for default SSID patterns
    if (ssid.startsWith("TP-Link") || ssid.startsWith("NETGEAR") ||
        ssid.startsWith("linksys") || ssid.startsWith("default")) {
      addFinding(ssid.c_str(), "Default SSID (unconfigured)", 2);
    }

    // Check for hidden SSID
    if (ssid.length() == 0) {
      char bssid[18];
      snprintf(bssid, 18, "%02X:%02X:%02X:%02X:%02X:%02X",
               WiFi.BSSID(i)[0], WiFi.BSSID(i)[1], WiFi.BSSID(i)[2],
               WiFi.BSSID(i)[3], WiFi.BSSID(i)[4], WiFi.BSSID(i)[5]);
      addFinding(bssid, "Hidden SSID (obscurity)", 1);
    }
  }
  WiFi.scanDelete();
}

// ---------- BLE audit ----------
class AuditBLECallback : public BLEAdvertisedDeviceCallbacks {
  void onResult(BLEAdvertisedDevice dev) override {
    String name = dev.haveName() ? String(dev.getName().c_str()) : "Unknown";

    // Check for devices broadcasting in clear
    if (dev.haveServiceData()) {
      addFinding(name.c_str(), "Svc data in cleartext", 2);
    }

    // Check for easily trackable devices
    if (dev.getAddressType() == BLE_ADDR_TYPE_PUBLIC) {
      addFinding(name.c_str(), "Public BLE address (trackable)", 2);
    }

    // Check for devices with no pairing
    if (dev.haveManufacturerData()) {
      std::string mfg = dev.getManufacturerData();
      if (mfg.length() > 20) {
        addFinding(name.c_str(), "Large MFG payload (data leak?)", 1);
      }
    }
  }
};

void auditBLE() {
  Serial.println("[AUDIT] Scanning BLE...");
  pBLEScan->start(5, false);
  pBLEScan->clearResults();
}

// ---------- RF audit ----------
void auditRF() {
  Serial.println("[AUDIT] Listening for 433MHz...");
  unsigned long start = millis();
  int rfCount = 0;

  while (millis() - start < 10000) {
    if (rfRX.available()) {
      unsigned long code = rfRX.getReceivedValue();
      unsigned int bits = rfRX.getReceivedBitlength();
      unsigned int proto = rfRX.getReceivedProtocol();
      rfRX.resetAvailable();

      if (code == 0) continue;
      rfCount++;

      char devName[24];
      snprintf(devName, 24, "RF_%lu", code % 10000);

      // All basic 433MHz is unencrypted
      addFinding(devName, "No encryption (replay vuln)", 3);

      if (bits < 16) {
        addFinding(devName, "Short code (brute-force)", 3);
      }

      if (proto == 1 && bits == 24) {
        addFinding(devName, "Common PT2262 (replay easy)", 2);
      }
    }
    delay(10);
  }
  Serial.printf("[RF] Captured %d signals.\n", rfCount);
}

// ---------- Display ----------
void updateDisplay() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(0, 0);
  oled.printf("IoT Audit [%s]", modeNames[auditMode]);
  oled.setCursor(0, 10);
  oled.printf("Findings: %d", findingCount);

  int start = max(0, findingCount - 4);
  for (int i = start; i < findingCount; i++) {
    int y = 22 + (i - start) * 10;
    oled.setCursor(0, y);
    oled.printf("%d:%.10s %.14s", findings[i].severity,
                findings[i].device, findings[i].issue);
  }
  oled.display();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[IoTAudit] Starting...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_AUDIT, INPUT_PULLUP);
  pinMode(BTN_MODE, INPUT_PULLUP);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();

  BLEDevice::init("IoT_Auditor");
  pBLEScan = BLEDevice::getScan();
  pBLEScan->setAdvertisedDeviceCallbacks(new AuditBLECallback());
  pBLEScan->setActiveScan(true);

  rfRX.enableReceive(digitalPinToInterrupt(RF_RX_PIN));

  updateDisplay();
  Serial.println("[IoTAudit] Ready.");
}

// ---------- Main loop ----------
void loop() {
  if (digitalRead(BTN_MODE) == LOW) {
    delay(200);
    auditMode = (auditMode + 1) % 3;
    updateDisplay();
  }

  if (digitalRead(BTN_AUDIT) == LOW) {
    delay(200);
    findingCount = 0;
    digitalWrite(LED_PIN, HIGH);
    switch (auditMode) {
      case 0: auditWiFi(); break;
      case 1: auditBLE(); break;
      case 2: auditRF(); break;
    }
    digitalWrite(LED_PIN, LOW);
    updateDisplay();

    Serial.printf("\n=== AUDIT REPORT (%d findings) ===\n", findingCount);
    for (int i = 0; i < findingCount; i++) {
      Serial.printf("  [%d] %s: %s\n", findings[i].severity,
                    findings[i].device, findings[i].issue);
    }
  }

  delay(50);
}
