/*
 * ESP Frequency Hunter - firmware.ino
 * Scans 2.4 GHz spectrum channel-by-channel, measures energy
 * per channel, and displays a live spectrum bar graph on OLED.
 *
 * Hardware: ESP32 DevKit + SSD1306 OLED (128x64, I2C)
 * Wiring:  SDA -> GPIO21, SCL -> GPIO22
 */

#include <WiFi.h>
#include <esp_wifi.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_GFX.h>

// ---------- OLED ----------
#define SCREEN_W 128
#define SCREEN_H 64
#define OLED_RST -1
Adafruit_SSD1306 display(SCREEN_W, SCREEN_H, &Wire, OLED_RST);

// ---------- Pins ----------
#define LED_PIN  2
#define BTN_PIN  4  // Freeze / resume display

// ---------- State ----------
#define NUM_CHANNELS 14
static int channelRSSI[NUM_CHANNELS];   // peak RSSI per channel
static int channelCount[NUM_CHANNELS];  // AP count per channel
static bool frozen = false;
static unsigned long lastDebounce = 0;

// ---------- Scan one sweep of all channels ----------
void scanAllChannels() {
  memset(channelRSSI, -100, sizeof(channelRSSI));
  memset(channelCount, 0, sizeof(channelCount));

  int n = WiFi.scanNetworks(false, true, false, 120);
  for (int i = 0; i < n; i++) {
    int ch = WiFi.channel(i);
    if (ch >= 1 && ch <= NUM_CHANNELS) {
      channelCount[ch - 1]++;
      if (WiFi.RSSI(i) > channelRSSI[ch - 1]) {
        channelRSSI[ch - 1] = WiFi.RSSI(i);
      }
    }
  }
  WiFi.scanDelete();
}

// ---------- Draw spectrum on OLED ----------
void drawSpectrum() {
  display.clearDisplay();

  // Title
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.print("Freq Hunter  CH1-14");

  // Bar graph area: y=12..63, x split into 14 bars
  int barW = SCREEN_W / NUM_CHANNELS;
  int graphTop = 12;
  int graphH = SCREEN_H - graphTop - 8;

  for (int c = 0; c < NUM_CHANNELS; c++) {
    // Map RSSI -100..-30 to bar height 0..graphH
    int rssi = channelRSSI[c];
    int h = map(constrain(rssi, -100, -30), -100, -30, 0, graphH);
    int x = c * barW;
    int y = graphTop + graphH - h;
    display.fillRect(x + 1, y, barW - 2, h, SSD1306_WHITE);
  }

  // Channel numbers at bottom
  display.setTextSize(1);
  for (int c = 0; c < NUM_CHANNELS; c += 2) {
    display.setCursor(c * barW, SCREEN_H - 7);
    display.print(c + 1);
  }

  // Find strongest channel
  int best = 0;
  for (int c = 1; c < NUM_CHANNELS; c++) {
    if (channelRSSI[c] > channelRSSI[best]) best = c;
  }
  display.setCursor(80, 0);
  display.printf("P:%d", best + 1);

  display.display();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[FreqHunter] Starting...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_PIN, INPUT_PULLUP);

  Wire.begin(21, 22);
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("[OLED] Init failed!");
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(10, 28);
  display.print("Frequency Hunter");
  display.display();
  delay(1500);

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  Serial.println("[FreqHunter] Ready.");
}

// ---------- Main loop ----------
void loop() {
  // Button toggles freeze
  if (digitalRead(BTN_PIN) == LOW && millis() - lastDebounce > 300) {
    lastDebounce = millis();
    frozen = !frozen;
    Serial.printf("[FreqHunter] Display %s\n", frozen ? "FROZEN" : "LIVE");
  }

  if (!frozen) {
    digitalWrite(LED_PIN, HIGH);
    scanAllChannels();
    drawSpectrum();
    digitalWrite(LED_PIN, LOW);

    // Serial report
    Serial.print("[RSSI] ");
    for (int c = 0; c < NUM_CHANNELS; c++) {
      Serial.printf("CH%d:%d(%d) ", c + 1, channelRSSI[c], channelCount[c]);
    }
    Serial.println();
  }

  delay(500);
}
