/*
 * ESP Network Time Machine - firmware.ino
 * Captures and replays network traffic patterns. Records
 * Wi-Fi activity snapshots over time and can replay historical
 * data on the OLED display for analysis.
 *
 * Hardware: ESP32 DevKit + SSD1306 OLED + SD card
 * Wiring:  SDA->GPIO21, SCL->GPIO22, SD CS->GPIO5
 */

#include <WiFi.h>
#include <esp_wifi.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <SD.h>
#include <SPI.h>

#define SCREEN_W 128
#define SCREEN_H  64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);

#define LED_PIN    2
#define BTN_REC    4   // Record / stop
#define BTN_PLAY  15   // Playback
#define SD_CS      5

// ---------- Snapshot structure ----------
#define SNAPSHOT_INTERVAL 10000  // 10 seconds
#define MAX_SNAPSHOTS     360   // 1 hour of data

typedef struct {
  uint32_t timestamp;
  uint16_t totalAPs;
  uint16_t totalClients;
  int8_t   avgRSSI;
  uint8_t  busiestChannel;
  uint16_t packetRate;  // estimated packets per second
} Snapshot;

static Snapshot snapshots[MAX_SNAPSHOTS];
static int snapshotCount = 0;
static bool recording = false;
static bool playing = false;
static int playIdx = 0;

// Packet counting
static volatile uint32_t pktCounter = 0;
static uint32_t lastPktCount = 0;
static bool sdReady = false;

// ---------- Sniffer callback ----------
void IRAM_ATTR snifferCB(void *buf, wifi_promiscuous_pkt_type_t type) {
  pktCounter++;
}

// ---------- Take a snapshot ----------
void takeSnapshot() {
  Snapshot s;
  s.timestamp = millis();

  // Scan for APs
  int n = WiFi.scanNetworks(false, true, false, 100);
  s.totalAPs = n;
  s.totalClients = WiFi.softAPgetStationNum();

  int rssiSum = 0;
  int channelMax[14] = {0};
  for (int i = 0; i < n; i++) {
    rssiSum += WiFi.RSSI(i);
    int ch = WiFi.channel(i);
    if (ch >= 1 && ch <= 14) channelMax[ch - 1]++;
  }
  s.avgRSSI = n > 0 ? rssiSum / n : -100;

  int busiest = 0;
  for (int c = 1; c < 14; c++) {
    if (channelMax[c] > channelMax[busiest]) busiest = c;
  }
  s.busiestChannel = busiest + 1;

  uint32_t currentPkt = pktCounter;
  s.packetRate = (currentPkt - lastPktCount) * 1000 / SNAPSHOT_INTERVAL;
  lastPktCount = currentPkt;

  WiFi.scanDelete();

  if (snapshotCount < MAX_SNAPSHOTS) {
    snapshots[snapshotCount++] = s;
  }

  // Save to SD
  if (sdReady) {
    File f = SD.open("/timemachine.csv", FILE_APPEND);
    if (f) {
      f.printf("%u,%d,%d,%d,%d,%d\n", s.timestamp, s.totalAPs,
               s.totalClients, s.avgRSSI, s.busiestChannel, s.packetRate);
      f.close();
    }
  }

  Serial.printf("[SNAP #%d] APs=%d RSSI=%d CH=%d Rate=%d/s\n",
                snapshotCount, s.totalAPs, s.avgRSSI,
                s.busiestChannel, s.packetRate);
}

// ---------- Display ----------
void displaySnapshot(const Snapshot &s, int idx) {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);

  oled.setCursor(0, 0);
  if (playing) oled.printf("REPLAY %d/%d", idx + 1, snapshotCount);
  else if (recording) oled.printf("REC %d", snapshotCount);
  else oled.print("Time Machine IDLE");

  oled.setCursor(0, 12);
  oled.printf("APs: %d  Clients: %d", s.totalAPs, s.totalClients);
  oled.setCursor(0, 24);
  oled.printf("Avg RSSI: %d dBm", s.avgRSSI);
  oled.setCursor(0, 36);
  oled.printf("Busiest: CH%d", s.busiestChannel);
  oled.setCursor(0, 48);
  oled.printf("Pkt rate: %d/s", s.packetRate);

  // Mini bar graph of recent snapshots
  int start = max(0, snapshotCount - 20);
  for (int i = start; i < snapshotCount; i++) {
    int x = (i - start) * 6;
    int h = map(constrain(snapshots[i].totalAPs, 0, 30), 0, 30, 0, 8);
    oled.fillRect(x, 56, 5, h, SSD1306_WHITE);
  }

  oled.display();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[TimeMachine] Starting...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_REC, INPUT_PULLUP);
  pinMode(BTN_PLAY, INPUT_PULLUP);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(5, 28);
  oled.print("Network Time Machine");
  oled.display();

  if (SD.begin(SD_CS)) { sdReady = true; Serial.println("[SD] Ready."); }

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  esp_wifi_set_promiscuous(true);
  esp_wifi_set_promiscuous_rx_cb(snifferCB);

  Serial.println("[TimeMachine] Ready. REC=record, PLAY=replay.");
}

// ---------- Main loop ----------
void loop() {
  // Record button
  if (digitalRead(BTN_REC) == LOW) {
    delay(200);
    recording = !recording;
    if (recording) {
      snapshotCount = 0;
      Serial.println("[REC] Started.");
    } else {
      Serial.printf("[REC] Stopped. %d snapshots.\n", snapshotCount);
    }
  }

  // Play button
  if (digitalRead(BTN_PLAY) == LOW) {
    delay(200);
    if (!recording && snapshotCount > 0) {
      playing = !playing;
      playIdx = 0;
    }
  }

  // Recording mode
  if (recording) {
    static unsigned long lastSnap = 0;
    if (millis() - lastSnap > SNAPSHOT_INTERVAL) {
      lastSnap = millis();
      takeSnapshot();
      if (snapshotCount > 0) {
        displaySnapshot(snapshots[snapshotCount - 1], snapshotCount - 1);
      }
    }
    digitalWrite(LED_PIN, (millis() / 500) % 2);
  }

  // Playback mode
  if (playing) {
    static unsigned long lastPlay = 0;
    if (millis() - lastPlay > 1000) {
      lastPlay = millis();
      displaySnapshot(snapshots[playIdx], playIdx);
      playIdx = (playIdx + 1) % snapshotCount;
    }
    digitalWrite(LED_PIN, (millis() / 200) % 2);
  }

  delay(50);
}
