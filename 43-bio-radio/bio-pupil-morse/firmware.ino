/*
 * Bio Pupil Morse - ESP32 Firmware
 * IR LED + phototransistor detects pupil dilation for Morse input
 * BLE transmits pupil-encoded messages
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLE2902.h>

#define IR_LED_PIN 25
#define PHOTO_PIN 36
#define VIS_LED 2
#define SAMPLE_RATE 100
#define BLINK_THRESH_MS 150
#define DOT_MAX_MS 400
#define DASH_MAX_MS 1000
#define CHAR_GAP_MS 1500
#define WORD_GAP_MS 3000
#define SERVICE_UUID "bb223344-5566-7788-9900-aabbccddeef0"
#define CHAR_UUID    "bb223344-5566-7788-9900-aabbccddeef1"

BLECharacteristic* pChar = NULL;
bool bleConn = false;

float pupilBaseline = 0;
float pupilSize = 0;
float dilationRatio = 0;
bool eyeClosed = false;
unsigned long closeStart = 0;
unsigned long openStart = 0;
String morseBuffer = "";
String message = "";
int blinkCount = 0;

const char* morseTable[] = {
  ".-","-...","-.-.","-..",".","..-.","--.","....","..",".---",
  "-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-",
  "..-","...-",".--","-..-","-.--","--.."
};

class BLECB : public BLEServerCallbacks {
  void onConnect(BLEServer* s) { bleConn = true; }
  void onDisconnect(BLEServer* s) { bleConn = false; }
};

void calibratePupil() {
  Serial.println("Calibrating pupil sensor...");
  digitalWrite(IR_LED_PIN, HIGH);
  delay(100);
  long sum = 0;
  for (int i = 0; i < 100; i++) {
    sum += analogRead(PHOTO_PIN);
    delay(10);
  }
  pupilBaseline = sum / 100.0;
  Serial.printf("Pupil baseline: %.0f\n", pupilBaseline);
}

float readPupil() {
  int raw = analogRead(PHOTO_PIN);
  float smoothed = pupilSize * 0.7 + raw * 0.3;
  pupilSize = smoothed;
  dilationRatio = (pupilBaseline > 0) ? smoothed / pupilBaseline : 1.0;
  return smoothed;
}

bool detectBlink(float reading) {
  static bool wasClosed = false;
  bool closed = reading < pupilBaseline * 0.5;

  if (closed && !wasClosed) {
    closeStart = millis();
    wasClosed = true;
    return false;
  } else if (!closed && wasClosed) {
    wasClosed = false;
    openStart = millis();
    return true;
  }
  return false;
}

char decodeMorse(String code) {
  for (int i = 0; i < 26; i++) {
    if (code == morseTable[i]) return 'A' + i;
  }
  return '?';
}

void processBlink(unsigned long duration) {
  if (duration < BLINK_THRESH_MS) return; // noise
  blinkCount++;

  if (duration < DOT_MAX_MS) {
    morseBuffer += ".";
    Serial.printf("Blink: DOT (%lu ms)\n", duration);
  } else if (duration < DASH_MAX_MS) {
    morseBuffer += "-";
    Serial.printf("Blink: DASH (%lu ms)\n", duration);
  } else {
    Serial.printf("Blink: LONG (%lu ms) - ignored\n", duration);
  }
}

void checkGaps() {
  unsigned long sinceOpen = millis() - openStart;

  if (morseBuffer.length() > 0 && sinceOpen > CHAR_GAP_MS) {
    char decoded = decodeMorse(morseBuffer);
    message += decoded;
    Serial.printf("Decoded: %c (from %s) | Message: %s\n",
      decoded, morseBuffer.c_str(), message.c_str());

    if (bleConn) {
      char buf[128];
      snprintf(buf, sizeof(buf), "{\"char\":\"%c\",\"morse\":\"%s\",\"msg\":\"%s\",\"blinks\":%d}",
        decoded, morseBuffer.c_str(), message.c_str(), blinkCount);
      pChar->setValue(buf);
      pChar->notify();
    }
    morseBuffer = "";
  }

  if (sinceOpen > WORD_GAP_MS && message.length() > 0 &&
      message.charAt(message.length() - 1) != ' ') {
    message += " ";
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("Pupil Morse starting...");
  pinMode(IR_LED_PIN, OUTPUT);
  pinMode(PHOTO_PIN, INPUT);
  pinMode(VIS_LED, OUTPUT);
  analogReadResolution(12);

  calibratePupil();

  BLEDevice::init("PupilMorse");
  BLEServer* srv = BLEDevice::createServer();
  srv->setCallbacks(new BLECB());
  BLEService* svc = srv->createService(SERVICE_UUID);
  pChar = svc->createCharacteristic(CHAR_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
  pChar->addDescriptor(new BLE2902());
  svc->start();
  BLEDevice::getAdvertising()->start();
}

void loop() {
  float reading = readPupil();
  bool blinked = detectBlink(reading);

  if (blinked) {
    unsigned long dur = openStart - closeStart;
    processBlink(dur);
    digitalWrite(VIS_LED, HIGH);
    delay(30);
    digitalWrite(VIS_LED, LOW);
  }

  checkGaps();

  if (Serial.available()) {
    char c = Serial.read();
    if (c == 'c') calibratePupil();
    if (c == 'r') { message = ""; morseBuffer = ""; blinkCount = 0; }
  }

  delay(1000 / SAMPLE_RATE);
}
