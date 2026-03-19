/*
 * ESP ARP Detective - firmware.ino
 * Monitors the local network for ARP spoofing attacks by
 * tracking ARP request/reply traffic and detecting anomalies
 * such as duplicate IP-to-MAC mappings.
 *
 * Hardware: ESP32 DevKit + SSD1306 OLED
 * Wiring:  SDA -> GPIO21, SCL -> GPIO22
 */

#include <WiFi.h>
#include <esp_wifi.h>
#include <lwip/etharp.h>
#include <lwip/ip_addr.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

// ---------- Config ----------
static const char *WIFI_SSID = "YourNetwork";
static const char *WIFI_PASS = "YourPassword";

#define SCREEN_W 128
#define SCREEN_H 64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);

#define LED_PIN      2
#define BUZZER_PIN  15

// ---------- ARP table ----------
#define MAX_HOSTS 32
typedef struct {
  uint32_t ip;
  uint8_t  mac[6];
  uint32_t lastSeen;
  bool     suspicious;
} ARPEntry;

static ARPEntry arpTable[MAX_HOSTS];
static int arpCount = 0;
static uint32_t spoofAlerts = 0;
static uint32_t arpPackets = 0;

// ---------- Helpers ----------
void macToStr(const uint8_t *mac, char *buf) {
  snprintf(buf, 18, "%02X:%02X:%02X:%02X:%02X:%02X",
           mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
}

void ipToStr(uint32_t ip, char *buf) {
  snprintf(buf, 16, "%d.%d.%d.%d",
           ip & 0xFF, (ip >> 8) & 0xFF,
           (ip >> 16) & 0xFF, (ip >> 24) & 0xFF);
}

// ---------- Check ARP entry for spoofing ----------
bool checkARPEntry(uint32_t ip, const uint8_t *mac) {
  for (int i = 0; i < arpCount; i++) {
    if (arpTable[i].ip == ip) {
      if (memcmp(arpTable[i].mac, mac, 6) != 0) {
        // Same IP, different MAC -> potential spoof
        char ipStr[16], oldMac[18], newMac[18];
        ipToStr(ip, ipStr);
        macToStr(arpTable[i].mac, oldMac);
        macToStr(mac, newMac);
        Serial.printf("!!! ARP SPOOF: %s was %s now %s\n",
                      ipStr, oldMac, newMac);
        arpTable[i].suspicious = true;
        spoofAlerts++;
        return true;
      }
      arpTable[i].lastSeen = millis();
      return false;
    }
  }

  // New entry
  if (arpCount < MAX_HOSTS) {
    arpTable[arpCount].ip = ip;
    memcpy(arpTable[arpCount].mac, mac, 6);
    arpTable[arpCount].lastSeen = millis();
    arpTable[arpCount].suspicious = false;
    arpCount++;
  }
  return false;
}

// ---------- Periodic ARP scan via lwIP ----------
void scanARPTable() {
  for (int i = 0; i < ARP_TABLE_SIZE; i++) {
    ip4_addr_t *ipaddr;
    struct netif *netif;
    struct eth_addr *ethaddr;
    if (etharp_get_entry(i, &ipaddr, &netif, &ethaddr)) {
      uint32_t ip = ipaddr->addr;
      checkARPEntry(ip, ethaddr->addr);
      arpPackets++;
    }
  }
}

// ---------- Display ----------
void updateDisplay() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(0, 0);
  oled.printf("ARP Detective");
  oled.setCursor(0, 12);
  oled.printf("Hosts: %d  Pkts: %u", arpCount, arpPackets);
  oled.setCursor(0, 24);
  if (spoofAlerts > 0) {
    oled.printf("!! SPOOF ALERTS: %u !!", spoofAlerts);
  } else {
    oled.print("Status: CLEAN");
  }

  // Show last 3 hosts
  oled.setCursor(0, 38);
  int start = arpCount > 3 ? arpCount - 3 : 0;
  for (int i = start; i < arpCount && i < start + 3; i++) {
    char ipStr[16], macStr[18];
    ipToStr(arpTable[i].ip, ipStr);
    macToStr(arpTable[i].mac, macStr);
    oled.printf("%s %s%s\n", ipStr,
                arpTable[i].suspicious ? "!" : " ",
                macStr + 9);  // Last 3 octets
  }
  oled.display();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[ARPDetective] Starting...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(10, 28);
  oled.print("ARP Detective");
  oled.display();

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("[WiFi] Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.printf("\n[WiFi] Connected: %s\n", WiFi.localIP().toString().c_str());
}

// ---------- Main loop ----------
void loop() {
  static unsigned long lastScan = 0;
  if (millis() - lastScan > 5000) {
    lastScan = millis();
    scanARPTable();
    updateDisplay();

    // Alert if spoof detected
    if (spoofAlerts > 0) {
      digitalWrite(LED_PIN, HIGH);
      tone(BUZZER_PIN, 2500, 200);
    } else {
      digitalWrite(LED_PIN, LOW);
    }

    // Serial dump
    Serial.printf("[ARP] Hosts=%d Alerts=%u\n", arpCount, spoofAlerts);
    for (int i = 0; i < arpCount; i++) {
      char ip[16], mac[18];
      ipToStr(arpTable[i].ip, ip);
      macToStr(arpTable[i].mac, mac);
      Serial.printf("  %-15s  %s  %s\n", ip, mac,
                    arpTable[i].suspicious ? "SUSPICIOUS" : "ok");
    }
  }

  delay(100);
}
