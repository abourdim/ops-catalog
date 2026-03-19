/*
 * ESP Wi-Fi Jammer Detector - firmware.ino
 * Detects deauthentication flood attacks by monitoring for
 * high rates of 802.11 deauth/disassoc frames in promiscuous mode.
 * Triggers alarm via buzzer and LED when threshold exceeded.
 *
 * Hardware: ESP32 DevKit + piezo buzzer + RGB LED
 * Wiring:  Buzzer -> GPIO15, Red LED -> GPIO4, Green LED -> GPIO16
 */

#include <WiFi.h>
#include <esp_wifi.h>

// ---------- Pins ----------
#define BUZZER_PIN   15
#define LED_RED       4
#define LED_GREEN    16
#define LED_BUILTIN   2

// ---------- Detection config ----------
#define DEAUTH_THRESHOLD   10   // deauths per window
#define WINDOW_MS        3000   // detection window
#define ALARM_DURATION   5000   // alarm length in ms

// ---------- State ----------
static volatile uint32_t deauthCount = 0;
static volatile uint32_t totalPackets = 0;
static uint32_t windowDeauths = 0;
static unsigned long windowStart = 0;
static unsigned long alarmUntil = 0;
static bool alarmActive = false;

// Track attacking MACs
#define MAX_ATTACKERS 16
static uint8_t attackerMACs[MAX_ATTACKERS][6];
static uint32_t attackerHits[MAX_ATTACKERS];
static int numAttackers = 0;

// ---------- Record attacker MAC ----------
void recordAttacker(const uint8_t *mac) {
  // Check if already known
  for (int i = 0; i < numAttackers; i++) {
    if (memcmp(attackerMACs[i], mac, 6) == 0) {
      attackerHits[i]++;
      return;
    }
  }
  // Add new attacker
  if (numAttackers < MAX_ATTACKERS) {
    memcpy(attackerMACs[numAttackers], mac, 6);
    attackerHits[numAttackers] = 1;
    numAttackers++;
  }
}

// ---------- Promiscuous callback ----------
void IRAM_ATTR snifferCB(void *buf, wifi_promiscuous_pkt_type_t type) {
  if (type != WIFI_PKT_MGMT) return;

  wifi_promiscuous_pkt_t *pkt = (wifi_promiscuous_pkt_t *)buf;
  const uint8_t *frame = pkt->payload;
  int len = pkt->rx_ctrl.sig_len;
  if (len < 26) return;

  totalPackets++;

  uint8_t frameType = (frame[0] >> 2) & 0x03;
  uint8_t subType = (frame[0] >> 4) & 0x0F;

  // Deauth = type 0, subtype 12; Disassoc = type 0, subtype 10
  if (frameType == 0 && (subType == 12 || subType == 10)) {
    deauthCount++;
    recordAttacker(&frame[10]);  // Source MAC
  }
}

// ---------- Trigger alarm ----------
void triggerAlarm() {
  alarmActive = true;
  alarmUntil = millis() + ALARM_DURATION;
  Serial.println("!!! JAMMING ATTACK DETECTED !!!");

  // Print known attackers
  for (int i = 0; i < numAttackers; i++) {
    Serial.printf("  Attacker: %02X:%02X:%02X:%02X:%02X:%02X  hits=%u\n",
                  attackerMACs[i][0], attackerMACs[i][1],
                  attackerMACs[i][2], attackerMACs[i][3],
                  attackerMACs[i][4], attackerMACs[i][5],
                  attackerHits[i]);
  }
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[JamDetect] Starting...");

  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(LED_GREEN, HIGH);

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();

  esp_wifi_set_promiscuous(true);
  esp_wifi_set_promiscuous_rx_cb(snifferCB);

  // Filter for management frames only
  wifi_promiscuous_filter_t filt = {};
  filt.filter_mask = WIFI_PROMIS_FILTER_MASK_MGMT;
  esp_wifi_set_promiscuous_filter(&filt);

  windowStart = millis();
  Serial.println("[JamDetect] Monitoring for deauth floods...");
}

// ---------- Main loop ----------
void loop() {
  unsigned long now = millis();

  // Check detection window
  if (now - windowStart >= WINDOW_MS) {
    windowDeauths = deauthCount;
    deauthCount = 0;

    Serial.printf("[MON] Window: %u deauths, %u total pkts\n",
                  windowDeauths, totalPackets);

    if (windowDeauths >= DEAUTH_THRESHOLD) {
      triggerAlarm();
    }

    windowStart = now;
    totalPackets = 0;
  }

  // Alarm state
  if (alarmActive && now < alarmUntil) {
    // Siren pattern
    int freq = (now / 200) % 2 == 0 ? 2000 : 3000;
    tone(BUZZER_PIN, freq);
    digitalWrite(LED_RED, (now / 100) % 2);
    digitalWrite(LED_GREEN, LOW);
  } else if (alarmActive) {
    alarmActive = false;
    noTone(BUZZER_PIN);
    digitalWrite(LED_RED, LOW);
    digitalWrite(LED_GREEN, HIGH);
    Serial.println("[JamDetect] Alarm cleared.");
  }

  // Channel hopping
  static unsigned long lastHop = 0;
  static uint8_t ch = 1;
  if (now - lastHop > 500) {
    lastHop = now;
    ch = (ch % 13) + 1;
    esp_wifi_set_channel(ch, WIFI_SECOND_CHAN_NONE);
  }

  delay(10);
}
