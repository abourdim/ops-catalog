/*
 * ESP Beacon Controller - firmware.ino
 * Controls a ham radio CW beacon transmitter. Generates
 * Morse code keying signals for automated beacon operation
 * with configurable message, speed, and interval.
 *
 * Hardware: ESP32 DevKit + relay/transistor for PTT + OLED
 * Wiring:  KEY_OUT -> GPIO25 (PWM tone), PTT -> GPIO26, Buzzer -> GPIO27
 */

#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_W 128
#define SCREEN_H  64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);

#define KEY_OUT     25  // CW keying output (sidetone on PWM)
#define PTT_PIN     26  // Push-to-talk relay
#define BUZZER_PIN  27  // Sidetone speaker
#define LED_PIN      2
#define BTN_START    4
#define BTN_SPEED   15

// ---------- Config ----------
static const char *WIFI_SSID = "YourNetwork";
static const char *WIFI_PASS = "YourPassword";

static char beaconMessage[64] = "VVV DE N0CALL/B N0CALL/B K";
static int wpm = 15;                   // Words per minute
static uint32_t beaconInterval = 600;  // Seconds between beacons
static int toneFreq = 700;             // Hz sidetone
static bool beaconActive = false;
static uint32_t beaconCount = 0;

WebServer webServer(80);

// ---------- Morse code table ----------
static const char *morseTable[] = {
  ".-",    // A
  "-...",  // B
  "-.-.",  // C
  "-..",   // D
  ".",     // E
  "..-.",  // F
  "--.",   // G
  "....",  // H
  "..",    // I
  ".---",  // J
  "-.-",   // K
  ".-..",  // L
  "--",    // M
  "-.",    // N
  "---",   // O
  ".--.",  // P
  "--.-",  // Q
  ".-.",   // R
  "...",   // S
  "-",     // T
  "..-",   // U
  "...-",  // V
  ".--",   // W
  "-..-",  // X
  "-.--",  // Y
  "--..",  // Z
};

static const char *numMorse[] = {
  "-----", ".----", "..---", "...--", "....-",
  ".....", "-....", "--...", "---..", "----.",
};

// ---------- Timing ----------
int ditLength() { return 1200 / wpm; }  // ms
int dahLength() { return ditLength() * 3; }
int elementGap() { return ditLength(); }
int charGap() { return ditLength() * 3; }
int wordGap() { return ditLength() * 7; }

// ---------- Key transmitter ----------
void keyDown() {
  digitalWrite(KEY_OUT, HIGH);
  digitalWrite(PTT_PIN, HIGH);
  digitalWrite(LED_PIN, HIGH);
  tone(BUZZER_PIN, toneFreq);
}

void keyUp() {
  digitalWrite(KEY_OUT, LOW);
  digitalWrite(LED_PIN, LOW);
  noTone(BUZZER_PIN);
}

// ---------- Send Morse character ----------
void sendMorseChar(char c) {
  const char *pattern = NULL;

  if (c >= 'A' && c <= 'Z') pattern = morseTable[c - 'A'];
  else if (c >= 'a' && c <= 'z') pattern = morseTable[c - 'a'];
  else if (c >= '0' && c <= '9') pattern = numMorse[c - '0'];
  else if (c == '/') pattern = "-..-.";
  else if (c == ' ') { delay(wordGap()); return; }
  else return;

  for (int i = 0; pattern[i]; i++) {
    keyDown();
    if (pattern[i] == '.') delay(ditLength());
    else delay(dahLength());
    keyUp();
    delay(elementGap());
  }
  delay(charGap() - elementGap());
}

// ---------- Send full message ----------
void sendBeacon() {
  beaconCount++;
  Serial.printf("[BEACON #%u] Sending: %s @ %d WPM\n",
                beaconCount, beaconMessage, wpm);

  // PTT on
  digitalWrite(PTT_PIN, HIGH);
  delay(500);  // TX delay

  for (int i = 0; beaconMessage[i]; i++) {
    sendMorseChar(beaconMessage[i]);
  }

  // PTT off
  delay(200);
  digitalWrite(PTT_PIN, LOW);
  keyUp();

  Serial.println("[BEACON] Transmission complete.");
}

// ---------- Display ----------
void updateDisplay() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);

  oled.setCursor(0, 0);
  oled.printf("CW Beacon %s", beaconActive ? "[ON]" : "[OFF]");
  oled.setCursor(0, 12);
  oled.printf("WPM: %d  Tone: %dHz", wpm, toneFreq);
  oled.setCursor(0, 24);
  oled.printf("Interval: %us", beaconInterval);
  oled.setCursor(0, 36);
  oled.printf("Count: %u", beaconCount);
  oled.setCursor(0, 48);
  // Scroll message if too long
  int msgLen = strlen(beaconMessage);
  int dispLen = min(msgLen, 21);
  int offset = (millis() / 500) % max(1, msgLen - 20);
  oled.printf("%.21s", &beaconMessage[offset]);

  oled.display();
}

// ---------- Web config ----------
void handleRoot() {
  String html = "<html><head><title>Beacon Controller</title></head><body>";
  html += "<h1>CW Beacon Controller</h1>";
  html += "<p>Status: " + String(beaconActive ? "ACTIVE" : "IDLE");
  html += " | Count: " + String(beaconCount) + "</p>";
  html += "<form action='/config' method='POST'>";
  html += "Message: <input name='msg' value='" + String(beaconMessage) + "' size='40'><br>";
  html += "WPM: <input name='wpm' value='" + String(wpm) + "' size='5'><br>";
  html += "Interval (s): <input name='int' value='" + String(beaconInterval) + "' size='5'><br>";
  html += "Tone (Hz): <input name='tone' value='" + String(toneFreq) + "' size='5'><br>";
  html += "<input type='submit' value='Update'></form>";
  html += "<a href='/start'>Start</a> | <a href='/stop'>Stop</a> | <a href='/once'>Send Once</a>";
  html += "</body></html>";
  webServer.send(200, "text/html", html);
}

void handleConfig() {
  if (webServer.hasArg("msg")) strncpy(beaconMessage, webServer.arg("msg").c_str(), 63);
  if (webServer.hasArg("wpm")) wpm = webServer.arg("wpm").toInt();
  if (webServer.hasArg("int")) beaconInterval = webServer.arg("int").toInt();
  if (webServer.hasArg("tone")) toneFreq = webServer.arg("tone").toInt();
  webServer.sendHeader("Location", "/");
  webServer.send(302);
}

void handleStart() { beaconActive = true; webServer.sendHeader("Location", "/"); webServer.send(302); }
void handleStop()  { beaconActive = false; webServer.sendHeader("Location", "/"); webServer.send(302); }
void handleOnce()  { sendBeacon(); webServer.sendHeader("Location", "/"); webServer.send(302); }

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[BeaconCtrl] Starting...");

  pinMode(KEY_OUT, OUTPUT);
  pinMode(PTT_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_START, INPUT_PULLUP);
  pinMode(BTN_SPEED, INPUT_PULLUP);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) { delay(500); }
  Serial.printf("[WiFi] IP: %s\n", WiFi.localIP().toString().c_str());

  webServer.on("/", handleRoot);
  webServer.on("/config", HTTP_POST, handleConfig);
  webServer.on("/start", handleStart);
  webServer.on("/stop", handleStop);
  webServer.on("/once", handleOnce);
  webServer.begin();

  updateDisplay();
}

// ---------- Main loop ----------
void loop() {
  webServer.handleClient();

  if (digitalRead(BTN_START) == LOW) { delay(200); beaconActive = !beaconActive; }
  if (digitalRead(BTN_SPEED) == LOW) { delay(200); wpm = (wpm % 30) + 5; }

  // Beacon timer
  static unsigned long lastBeacon = 0;
  if (beaconActive && millis() - lastBeacon > beaconInterval * 1000UL) {
    lastBeacon = millis();
    sendBeacon();
  }

  static unsigned long lastDisp = 0;
  if (millis() - lastDisp > 500) { lastDisp = millis(); updateDisplay(); }

  delay(10);
}
