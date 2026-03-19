/*
 * ESP Mesh vs Traditional - firmware.ino
 * Benchmarks ESP-MESH vs traditional Wi-Fi infrastructure mode.
 * Measures latency, throughput, and reliability in both modes
 * and displays comparative results.
 *
 * Hardware: ESP32 DevKit + OLED SSD1306
 * Wiring:  SDA -> GPIO21, SCL -> GPIO22
 */

#include <WiFi.h>
#include <esp_now.h>
#include <esp_wifi.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_W 128
#define SCREEN_H  64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);

#define LED_PIN    2
#define BTN_TEST   4
#define BTN_MODE  15

static const char *WIFI_SSID = "YourNetwork";
static const char *WIFI_PASS = "YourPassword";

// ---------- Benchmark results ----------
typedef struct {
  float avgLatency;    // ms
  float maxLatency;
  float minLatency;
  uint32_t packetsSent;
  uint32_t packetsRecv;
  float packetLoss;    // percentage
  float throughput;    // bytes/sec
} BenchResult;

static BenchResult wifiResult;
static BenchResult meshResult;
static int testMode = 0;  // 0=WiFi, 1=ESP-NOW mesh
static bool testing = false;

// ESP-NOW
static uint8_t broadcastMAC[] = {0xFF,0xFF,0xFF,0xFF,0xFF,0xFF};
static volatile uint32_t espnowRecv = 0;
static volatile unsigned long espnowLatency = 0;
static volatile bool gotReply = false;

typedef struct __attribute__((packed)) {
  uint8_t type;      // 0=ping, 1=pong, 2=data
  uint32_t seqNum;
  uint32_t timestamp;
  uint8_t payload[200];
} BenchPacket;

// ---------- ESP-NOW callbacks ----------
void onRecv(const uint8_t *mac, const uint8_t *data, int len) {
  if (len < sizeof(BenchPacket)) return;
  BenchPacket *pkt = (BenchPacket *)data;

  if (pkt->type == 0) {
    // Ping received -> send pong
    BenchPacket pong;
    pong.type = 1;
    pong.seqNum = pkt->seqNum;
    pong.timestamp = pkt->timestamp;
    esp_now_send(mac, (uint8_t *)&pong, sizeof(pong));
  } else if (pkt->type == 1) {
    // Pong received -> measure latency
    espnowLatency = millis() - pkt->timestamp;
    espnowRecv++;
    gotReply = true;
  }
}

void onSent(const uint8_t *mac, esp_now_send_status_t s) {}

// ---------- Wi-Fi benchmark ----------
void benchmarkWiFi() {
  Serial.println("[BENCH] Wi-Fi infrastructure test...");
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  unsigned long connStart = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - connStart < 10000) {
    delay(100);
  }

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[BENCH] WiFi connect failed!");
    wifiResult.avgLatency = -1;
    return;
  }

  float totalLatency = 0;
  float maxLat = 0, minLat = 9999;
  uint32_t sent = 0, recv = 0;
  uint32_t bytesTransferred = 0;
  unsigned long testStart = millis();

  // Ping gateway
  IPAddress gw = WiFi.gatewayIP();

  for (int i = 0; i < 50; i++) {
    unsigned long pingStart = millis();

    WiFiClient client;
    client.setTimeout(500);
    if (client.connect(gw, 80)) {
      float lat = millis() - pingStart;
      totalLatency += lat;
      if (lat > maxLat) maxLat = lat;
      if (lat < minLat) minLat = lat;
      recv++;
      bytesTransferred += 64;
      client.stop();
    }
    sent++;
    delay(50);
  }

  float elapsed = (millis() - testStart) / 1000.0;

  wifiResult.packetsSent = sent;
  wifiResult.packetsRecv = recv;
  wifiResult.avgLatency = recv > 0 ? totalLatency / recv : -1;
  wifiResult.maxLatency = maxLat;
  wifiResult.minLatency = minLat;
  wifiResult.packetLoss = sent > 0 ? (1.0 - (float)recv / sent) * 100 : 100;
  wifiResult.throughput = bytesTransferred / max(elapsed, 0.1f);

  WiFi.disconnect();
  Serial.printf("[BENCH-WIFI] Avg=%.1fms Loss=%.1f%% Tput=%.0f B/s\n",
                wifiResult.avgLatency, wifiResult.packetLoss, wifiResult.throughput);
}

// ---------- ESP-NOW mesh benchmark ----------
void benchmarkMesh() {
  Serial.println("[BENCH] ESP-NOW mesh test...");
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  esp_wifi_set_channel(6, WIFI_SECOND_CHAN_NONE);

  esp_now_init();
  esp_now_register_recv_cb(onRecv);
  esp_now_register_send_cb(onSent);

  esp_now_peer_info_t peer = {};
  memcpy(peer.peer_addr, broadcastMAC, 6);
  peer.channel = 6;
  esp_now_add_peer(&peer);

  float totalLatency = 0;
  float maxLat = 0, minLat = 9999;
  espnowRecv = 0;
  uint32_t sent = 0;
  unsigned long testStart = millis();

  for (int i = 0; i < 50; i++) {
    BenchPacket ping;
    ping.type = 0;
    ping.seqNum = i;
    ping.timestamp = millis();
    memset(ping.payload, 0xAA, sizeof(ping.payload));

    gotReply = false;
    esp_now_send(broadcastMAC, (uint8_t *)&ping, sizeof(ping));
    sent++;

    unsigned long waitStart = millis();
    while (!gotReply && millis() - waitStart < 200) {
      delay(1);
    }

    if (gotReply) {
      float lat = espnowLatency;
      totalLatency += lat;
      if (lat > maxLat) maxLat = lat;
      if (lat < minLat) minLat = lat;
    }
    delay(50);
  }

  float elapsed = (millis() - testStart) / 1000.0;

  meshResult.packetsSent = sent;
  meshResult.packetsRecv = espnowRecv;
  meshResult.avgLatency = espnowRecv > 0 ? totalLatency / espnowRecv : -1;
  meshResult.maxLatency = maxLat;
  meshResult.minLatency = minLat;
  meshResult.packetLoss = sent > 0 ? (1.0 - (float)espnowRecv / sent) * 100 : 100;
  meshResult.throughput = (espnowRecv * sizeof(BenchPacket)) / max(elapsed, 0.1f);

  esp_now_deinit();
  Serial.printf("[BENCH-MESH] Avg=%.1fms Loss=%.1f%% Tput=%.0f B/s\n",
                meshResult.avgLatency, meshResult.packetLoss, meshResult.throughput);
}

// ---------- Display ----------
void showResults() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);

  oled.setCursor(0, 0);
  oled.print("Mesh vs Traditional");

  oled.setCursor(0, 12);
  oled.print("        WiFi   Mesh");
  oled.setCursor(0, 22);
  oled.printf("Lat:  %5.1f  %5.1f ms", wifiResult.avgLatency, meshResult.avgLatency);
  oled.setCursor(0, 32);
  oled.printf("Loss: %5.1f  %5.1f %%", wifiResult.packetLoss, meshResult.packetLoss);
  oled.setCursor(0, 42);
  oled.printf("Tput: %5.0f  %5.0f B/s", wifiResult.throughput, meshResult.throughput);

  oled.setCursor(0, 54);
  bool meshBetter = meshResult.avgLatency < wifiResult.avgLatency;
  oled.printf("Winner: %s", meshBetter ? "MESH" : "WIFI");

  oled.display();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[MeshVsTrad] Starting...");
  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_TEST, INPUT_PULLUP);
  pinMode(BTN_MODE, INPUT_PULLUP);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(5, 20);
  oled.print("Mesh vs Traditional");
  oled.setCursor(10, 40);
  oled.print("Press BTN to test");
  oled.display();
}

// ---------- Main loop ----------
void loop() {
  if (digitalRead(BTN_TEST) == LOW) {
    delay(200);
    oled.clearDisplay();
    oled.setCursor(20, 28);
    oled.print("Testing...");
    oled.display();

    benchmarkWiFi();
    benchmarkMesh();
    showResults();
  }

  delay(50);
}
