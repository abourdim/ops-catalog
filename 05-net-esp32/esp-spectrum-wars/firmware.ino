/*
 * ESP Spectrum Wars - firmware.ino
 * Real-time 2.4GHz spectrum analyzer that visualizes channel
 * congestion and interference. Two ESP32s can compete to find
 * the cleanest channel automatically.
 *
 * Hardware: ESP32 DevKit + ST7735 TFT (160x128) + button
 * Wiring:  CS->GPIO5, DC->GPIO16, RST->GPIO17, SDA->GPIO23, SCL->GPIO18
 */

#include <WiFi.h>
#include <esp_wifi.h>
#include <SPI.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>

// ---------- TFT ----------
#define TFT_CS   5
#define TFT_DC  16
#define TFT_RST 17
Adafruit_ST7735 tft(TFT_CS, TFT_DC, TFT_RST);

#define LED_PIN   2
#define BTN_MODE  4

// ---------- Spectrum data ----------
#define NUM_CHANNELS 14
static int channelPeak[NUM_CHANNELS];
static int channelAvg[NUM_CHANNELS];
static int channelAPs[NUM_CHANNELS];
static int history[NUM_CHANNELS][32];  // Rolling history
static int histIdx = 0;

// Display modes: 0=bars, 1=waterfall, 2=table
static int displayMode = 0;
static uint32_t sweepCount = 0;

// Color mapping for signal strength
uint16_t rssiToColor(int rssi) {
  if (rssi > -40) return ST7735_RED;
  if (rssi > -55) return ST7735_YELLOW;
  if (rssi > -70) return ST7735_GREEN;
  if (rssi > -85) return ST7735_CYAN;
  return ST7735_BLUE;
}

// ---------- Full channel sweep ----------
void sweepChannels() {
  memset(channelPeak, -100, sizeof(channelPeak));
  memset(channelAvg, 0, sizeof(channelAvg));
  memset(channelAPs, 0, sizeof(channelAPs));

  int n = WiFi.scanNetworks(false, true, false, 150);
  for (int i = 0; i < n; i++) {
    int ch = WiFi.channel(i) - 1;
    if (ch < 0 || ch >= NUM_CHANNELS) continue;

    channelAPs[ch]++;
    int rssi = WiFi.RSSI(i);
    if (rssi > channelPeak[ch]) channelPeak[ch] = rssi;
    channelAvg[ch] += rssi;
  }

  for (int c = 0; c < NUM_CHANNELS; c++) {
    if (channelAPs[c] > 0) channelAvg[c] /= channelAPs[c];
    else channelAvg[c] = -100;
    history[c][histIdx % 32] = channelPeak[c];
  }
  histIdx++;
  sweepCount++;
  WiFi.scanDelete();
}

// ---------- Draw bar chart ----------
void drawBars() {
  tft.fillScreen(ST7735_BLACK);
  tft.setTextSize(1);
  tft.setTextColor(ST7735_WHITE);
  tft.setCursor(2, 2);
  tft.printf("Spectrum Wars #%u", sweepCount);

  int barW = 160 / NUM_CHANNELS;
  int graphH = 90;
  int graphY = 20;

  for (int c = 0; c < NUM_CHANNELS; c++) {
    int h = map(constrain(channelPeak[c], -100, -30), -100, -30, 0, graphH);
    int x = c * barW;
    uint16_t color = rssiToColor(channelPeak[c]);
    tft.fillRect(x + 1, graphY + graphH - h, barW - 2, h, color);

    // Channel label
    tft.setCursor(x + 2, 115);
    tft.setTextColor(ST7735_WHITE);
    tft.print(c + 1);
  }

  // Best channel indicator
  int best = 0;
  for (int c = 1; c < NUM_CHANNELS; c++) {
    if (channelPeak[c] < channelPeak[best]) best = c;
  }
  tft.setCursor(90, 2);
  tft.setTextColor(ST7735_GREEN);
  tft.printf("Best:CH%d", best + 1);
}

// ---------- Draw waterfall ----------
void drawWaterfall() {
  // Scroll existing content up by 3 pixels
  // (simplified: redraw full waterfall from history)
  tft.fillScreen(ST7735_BLACK);
  tft.setTextSize(1);
  tft.setTextColor(ST7735_WHITE);
  tft.setCursor(2, 2);
  tft.print("Waterfall View");

  int cellW = 160 / NUM_CHANNELS;
  int rows = min(histIdx, 32);
  int cellH = max(1, 110 / rows);

  for (int r = 0; r < rows; r++) {
    int hIdx = (histIdx - rows + r) % 32;
    for (int c = 0; c < NUM_CHANNELS; c++) {
      uint16_t color = rssiToColor(history[c][hIdx]);
      tft.fillRect(c * cellW, 14 + r * cellH, cellW - 1, cellH, color);
    }
  }
}

// ---------- Draw table ----------
void drawTable() {
  tft.fillScreen(ST7735_BLACK);
  tft.setTextSize(1);
  tft.setTextColor(ST7735_WHITE);
  tft.setCursor(2, 2);
  tft.print("CH Peak  Avg  APs");

  for (int c = 0; c < NUM_CHANNELS; c++) {
    int y = 14 + c * 8;
    tft.setCursor(2, y);
    tft.setTextColor(rssiToColor(channelPeak[c]));
    tft.printf("%2d %4d %4d %3d",
               c + 1, channelPeak[c], channelAvg[c], channelAPs[c]);
  }
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[SpectrumWars] Starting...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_MODE, INPUT_PULLUP);

  tft.initR(INITR_BLACKTAB);
  tft.setRotation(1);
  tft.fillScreen(ST7735_BLACK);
  tft.setTextColor(ST7735_GREEN);
  tft.setTextSize(2);
  tft.setCursor(10, 50);
  tft.print("Spectrum");
  tft.setCursor(30, 70);
  tft.print("Wars");
  delay(1500);

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  Serial.println("[SpectrumWars] Ready.");
}

// ---------- Main loop ----------
void loop() {
  if (digitalRead(BTN_MODE) == LOW) {
    delay(200);
    displayMode = (displayMode + 1) % 3;
  }

  digitalWrite(LED_PIN, HIGH);
  sweepChannels();
  digitalWrite(LED_PIN, LOW);

  switch (displayMode) {
    case 0: drawBars(); break;
    case 1: drawWaterfall(); break;
    case 2: drawTable(); break;
  }

  Serial.printf("[SWEEP #%u] ", sweepCount);
  for (int c = 0; c < NUM_CHANNELS; c++) {
    Serial.printf("CH%d:%d/%d ", c + 1, channelPeak[c], channelAPs[c]);
  }
  Serial.println();

  delay(500);
}
