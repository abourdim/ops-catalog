/*
 * ESP Collision Visualizer - firmware.ino
 * Visualizes Wi-Fi channel collisions and co-channel
 * interference in real-time on a TFT display. Shows
 * overlapping channel utilization and collision events.
 *
 * Hardware: ESP32 DevKit + ST7735 TFT (160x128)
 * Wiring:  CS->GPIO5, DC->GPIO16, RST->GPIO17, SDA->GPIO23, SCK->GPIO18
 */

#include <WiFi.h>
#include <esp_wifi.h>
#include <SPI.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>

#define TFT_CS   5
#define TFT_DC  16
#define TFT_RST 17
Adafruit_ST7735 tft(TFT_CS, TFT_DC, TFT_RST);

#define LED_PIN   2
#define BTN_MODE  4

// ---------- Collision tracking ----------
#define NUM_CHANNELS 14

typedef struct {
  int apCount;
  int peakRSSI;
  int avgRSSI;
  int overlapScore;   // How much interference from adjacent channels
  uint32_t collisions;
} ChannelInfo;

static ChannelInfo channels[NUM_CHANNELS];
static uint32_t sweepCount = 0;
static int displayMode = 0;  // 0=collision map, 1=overlap diagram, 2=stats

// Wi-Fi channel center frequencies and overlap
// Channels 1-13 are 5MHz apart, each 22MHz wide
static const int channelOverlap[14][14] = {
  // Overlap matrix (simplified): 1 = overlapping
  {1,1,1,1,1,0,0,0,0,0,0,0,0,0},  // CH1
  {1,1,1,1,1,1,0,0,0,0,0,0,0,0},
  {1,1,1,1,1,1,1,0,0,0,0,0,0,0},
  {1,1,1,1,1,1,1,1,0,0,0,0,0,0},
  {1,1,1,1,1,1,1,1,1,0,0,0,0,0},
  {0,1,1,1,1,1,1,1,1,1,0,0,0,0},
  {0,0,1,1,1,1,1,1,1,1,1,0,0,0},
  {0,0,0,1,1,1,1,1,1,1,1,1,0,0},
  {0,0,0,0,1,1,1,1,1,1,1,1,1,0},
  {0,0,0,0,0,1,1,1,1,1,1,1,1,1},
  {0,0,0,0,0,0,1,1,1,1,1,1,1,1},
  {0,0,0,0,0,0,0,1,1,1,1,1,1,1},
  {0,0,0,0,0,0,0,0,1,1,1,1,1,1},
  {0,0,0,0,0,0,0,0,0,0,0,0,0,1},
};

// ---------- Scan and compute ----------
void scanAndCompute() {
  // Reset
  for (int c = 0; c < NUM_CHANNELS; c++) {
    channels[c].apCount = 0;
    channels[c].peakRSSI = -100;
    channels[c].avgRSSI = 0;
    channels[c].overlapScore = 0;
  }

  int n = WiFi.scanNetworks(false, true, false, 150);
  for (int i = 0; i < n; i++) {
    int ch = WiFi.channel(i) - 1;
    if (ch < 0 || ch >= NUM_CHANNELS) continue;
    channels[ch].apCount++;
    int rssi = WiFi.RSSI(i);
    if (rssi > channels[ch].peakRSSI) channels[ch].peakRSSI = rssi;
    channels[ch].avgRSSI += rssi;
  }

  for (int c = 0; c < NUM_CHANNELS; c++) {
    if (channels[c].apCount > 0) {
      channels[c].avgRSSI /= channels[c].apCount;
    } else {
      channels[c].avgRSSI = -100;
    }
  }

  // Compute overlap scores
  for (int c = 0; c < NUM_CHANNELS; c++) {
    int score = 0;
    for (int o = 0; o < NUM_CHANNELS; o++) {
      if (o != c && channelOverlap[c][o]) {
        score += channels[o].apCount;
        // Stronger signals cause worse interference
        if (channels[o].peakRSSI > -70) score += 2;
      }
    }
    channels[c].overlapScore = score;
    if (score > 5) channels[c].collisions++;
  }

  sweepCount++;
  WiFi.scanDelete();
}

// ---------- Draw collision heatmap ----------
void drawCollisionMap() {
  tft.fillScreen(ST7735_BLACK);
  tft.setTextSize(1);
  tft.setTextColor(ST7735_WHITE);
  tft.setCursor(2, 2);
  tft.printf("Collision Map #%u", sweepCount);

  int barW = 160 / NUM_CHANNELS;
  for (int c = 0; c < NUM_CHANNELS; c++) {
    int x = c * barW;
    // AP count bar (green)
    int apH = min(channels[c].apCount * 8, 40);
    tft.fillRect(x + 1, 60 - apH, barW / 2 - 1, apH, ST7735_GREEN);

    // Overlap score bar (red)
    int ovH = min(channels[c].overlapScore * 4, 40);
    tft.fillRect(x + barW / 2, 60 - ovH, barW / 2 - 1, ovH, ST7735_RED);

    // Channel label
    tft.setCursor(x + 2, 64);
    tft.print(c + 1);

    // Collision indicator
    if (channels[c].overlapScore > 5) {
      tft.fillCircle(x + barW / 2, 75, 3, ST7735_YELLOW);
    }
  }

  // Legend
  tft.setCursor(2, 85);
  tft.setTextColor(ST7735_GREEN);
  tft.print("APs");
  tft.setCursor(30, 85);
  tft.setTextColor(ST7735_RED);
  tft.print("Overlap");
  tft.setCursor(80, 85);
  tft.setTextColor(ST7735_YELLOW);
  tft.print("Collision!");

  // Best non-overlapping channels
  tft.setCursor(2, 100);
  tft.setTextColor(ST7735_CYAN);
  int bestScore = 999;
  int bestCh = 1;
  for (int c = 0; c < NUM_CHANNELS; c++) {
    int total = channels[c].apCount + channels[c].overlapScore;
    if (total < bestScore) { bestScore = total; bestCh = c + 1; }
  }
  tft.printf("Recommend: CH %d", bestCh);
}

// ---------- Draw stats table ----------
void drawStats() {
  tft.fillScreen(ST7735_BLACK);
  tft.setTextSize(1);
  tft.setTextColor(ST7735_WHITE);
  tft.setCursor(2, 2);
  tft.print("CH APs Peak Ovlp Col");

  for (int c = 0; c < NUM_CHANNELS; c++) {
    int y = 14 + c * 8;
    uint16_t color = channels[c].overlapScore > 5 ? ST7735_RED : ST7735_WHITE;
    tft.setTextColor(color);
    tft.setCursor(2, y);
    tft.printf("%2d %3d %4d %4d %3u",
               c + 1, channels[c].apCount, channels[c].peakRSSI,
               channels[c].overlapScore, channels[c].collisions);
  }
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[CollisionViz] Starting...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_MODE, INPUT_PULLUP);

  tft.initR(INITR_BLACKTAB);
  tft.setRotation(1);
  tft.fillScreen(ST7735_BLACK);
  tft.setTextSize(2);
  tft.setTextColor(ST7735_YELLOW);
  tft.setCursor(10, 50);
  tft.print("Collision");
  tft.setCursor(20, 70);
  tft.print("Viz");
  delay(1500);

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  Serial.println("[CollisionViz] Ready.");
}

// ---------- Main loop ----------
void loop() {
  if (digitalRead(BTN_MODE) == LOW) {
    delay(200);
    displayMode = (displayMode + 1) % 2;
  }

  digitalWrite(LED_PIN, HIGH);
  scanAndCompute();
  digitalWrite(LED_PIN, LOW);

  switch (displayMode) {
    case 0: drawCollisionMap(); break;
    case 1: drawStats(); break;
  }

  delay(1000);
}
