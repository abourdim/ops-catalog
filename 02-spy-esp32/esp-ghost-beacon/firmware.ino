/*
 * ESP Ghost Beacon - firmware.ino
 * Broadcasts configurable Wi-Fi beacon frames to create
 * phantom SSIDs visible in nearby device scan lists.
 * Educational tool for understanding 802.11 beacon mechanics.
 *
 * Hardware: ESP32 DevKit (no extra components needed)
 */

#include <WiFi.h>
#include <esp_wifi.h>

// ---------- Config ----------
#define LED_PIN       2
#define BTN_CYCLE     4    // Button to cycle beacon sets
#define MAX_SSIDS     8
#define BEACON_INTERVAL_MS 100

// Beacon frame template (minimum valid 802.11 beacon)
// Follows IEEE 802.11 management frame structure
static uint8_t beaconPacket[128] = {
  0x80, 0x00,                         // Frame Control: beacon
  0x00, 0x00,                         // Duration
  0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, // Destination: broadcast
  0xDE, 0xAD, 0xBE, 0xEF, 0x00, 0x01, // Source (randomized)
  0xDE, 0xAD, 0xBE, 0xEF, 0x00, 0x01, // BSSID (same as source)
  0x00, 0x00,                         // Sequence number
  // Fixed parameters (8 bytes)
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Timestamp
  0x64, 0x00,                         // Beacon interval: 100 TU
  0x31, 0x04,                         // Capability info
  // Tagged parameters start at byte 36
  0x00,       // Tag: SSID
  0x08,       // Length (placeholder)
  // SSID bytes follow here
};

// SSID sets (educational / humorous names)
static const char *ssidSets[][MAX_SSIDS] = {
  {"Ghost_Net_1", "Ghost_Net_2", "Phantom_AP", "ShadowSSID",
   "Invisible", "EchoNode", "DarkWave", "SpectreLAN"},
  {"Test_Lab_A", "Test_Lab_B", "RF_Probe_1", "RF_Probe_2",
   "Beacon_Demo", "802.11_Edu", "SignalGhost", "WaveFront"},
};
#define NUM_SETS 2
static int currentSet = 0;
static int currentSSID = 0;
static uint8_t channelHop = 1;

// ---------- Randomize BSSID ----------
void randomizeBSSID() {
  for (int i = 0; i < 6; i++) {
    uint8_t b = random(256);
    beaconPacket[10 + i] = b;  // Source
    beaconPacket[16 + i] = b;  // BSSID
  }
  beaconPacket[10] |= 0x02;  // Locally administered bit
  beaconPacket[16] |= 0x02;
}

// ---------- Build and send beacon ----------
void sendBeacon(const char *ssid) {
  int len = strlen(ssid);
  if (len > 32) len = 32;

  beaconPacket[37] = (uint8_t)len;  // SSID length tag
  memcpy(&beaconPacket[38], ssid, len);

  // DS Parameter Set (channel)
  int pos = 38 + len;
  beaconPacket[pos++] = 0x03;  // Tag: DS Parameter
  beaconPacket[pos++] = 0x01;  // Length
  beaconPacket[pos++] = channelHop;

  // Supported rates
  beaconPacket[pos++] = 0x01;  // Tag: Supported Rates
  beaconPacket[pos++] = 0x04;
  beaconPacket[pos++] = 0x82;  // 1 Mbps
  beaconPacket[pos++] = 0x84;  // 2 Mbps
  beaconPacket[pos++] = 0x8B;  // 5.5 Mbps
  beaconPacket[pos++] = 0x96;  // 11 Mbps

  randomizeBSSID();
  esp_wifi_80211_tx(WIFI_IF_STA, beaconPacket, pos, false);
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[GhostBeacon] Starting...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_CYCLE, INPUT_PULLUP);

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE);

  // Enable promiscuous mode for raw TX
  esp_wifi_set_promiscuous(true);

  randomSeed(esp_random());
  Serial.printf("[GhostBeacon] Broadcasting set %d\n", currentSet);
}

// ---------- Main loop ----------
void loop() {
  // Cycle button
  if (digitalRead(BTN_CYCLE) == LOW) {
    delay(200);  // debounce
    currentSet = (currentSet + 1) % NUM_SETS;
    Serial.printf("[GhostBeacon] Switched to set %d\n", currentSet);
  }

  // Send one beacon per loop iteration
  const char *ssid = ssidSets[currentSet][currentSSID];
  sendBeacon(ssid);

  // Advance to next SSID
  currentSSID = (currentSSID + 1) % MAX_SSIDS;

  // Channel hop every full rotation
  if (currentSSID == 0) {
    channelHop = (channelHop % 13) + 1;
    esp_wifi_set_channel(channelHop, WIFI_SECOND_CHAN_NONE);
  }

  digitalWrite(LED_PIN, currentSSID == 0 ? HIGH : LOW);
  delay(BEACON_INTERVAL_MS);
}
