/*
 * Bio Muscle Telegraph - ESP32 Firmware
 * EMG sensor reads muscle signals, converts to Morse-like telegraph
 * BLE transmits decoded muscle messages
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLE2902.h>

#define EMG_PIN 36
#define EMG_REF_PIN 39
#define LED_PIN 2
#define BUZZER_PIN 25
#define SAMPLE_RATE 500
#define DOT_THRESH_MS 200
#define DASH_THRESH_MS 600
#define SPACE_THRESH_MS 1500
#define SERVICE_UUID "ee334455-6677-8899-aabb-ccddeeff0011"
#define CHAR_UUID    "ee334455-6677-8899-aabb-ccddeeff0012"

BLECharacteristic* pChar = NULL;
bool bleConn = false;

float emgBaseline = 0;
float emgEnvelope = 0;
float contractionThreshold = 0.15;
bool contracted = false;
unsigned long contractionStart = 0;
unsigned long relaxStart = 0;
String morseBuffer = "";
String decodedMsg = "";
int signalBuffer[64];
int sigIdx = 0;

const char* morseTable[] = {
  ".-","-...","-.-.","-..",".","..-.","--.","....","..",".---",
  "-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-",
  "..-","...-",".--","-..-","-.--","--.."
};

class BLECB : public BLEServerCallbacks {
  void onConnect(BLEServer* s) { bleConn = true; }
  void onDisconnect(BLEServer* s) { bleConn = false; }
};

void calibrateEMG() {
  long sum = 0;
  for (int i = 0; i < 200; i++) {
    sum += abs(analogRead(EMG_PIN) - analogRead(EMG_REF_PIN));
    delay(2);
  }
  emgBaseline = sum / 200.0 / 4095.0;
  contractionThreshold = emgBaseline + 0.15;
  Serial.printf("EMG baseline: %.4f, threshold: %.4f\n", emgBaseline, contractionThreshold);
}

float readEMG() {
  int raw = abs(analogRead(EMG_PIN) - analogRead(EMG_REF_PIN));
  float normalized = raw / 4095.0;
  emgEnvelope = emgEnvelope * 0.9 + normalized * 0.1;
  return emgEnvelope;
}

char decodeMorse(String code) {
  for (int i = 0; i < 26; i++) {
    if (code == morseTable[i]) return 'A' + i;
  }
  if (code == "-----") return '0';
  if (code == ".----") return '1';
  if (code == "..---") return '2';
  if (code == "...--") return '3';
  if (code == "....-") return '4';
  if (code == ".....") return '5';
  return '?';
}

void processContraction(unsigned long duration) {
  if (duration < DOT_THRESH_MS) {
    morseBuffer += ".";
    tone(BUZZER_PIN, 800, 100);
  } else if (duration < DASH_THRESH_MS) {
    morseBuffer += "-";
    tone(BUZZER_PIN, 600, 300);
  }
  Serial.printf("Contraction: %lu ms -> %s\n", duration, morseBuffer.c_str());
}

void processRelaxation(unsigned long duration) {
  if (duration > SPACE_THRESH_MS && morseBuffer.length() > 0) {
    char decoded = decodeMorse(morseBuffer);
    decodedMsg += decoded;
    Serial.printf("Decoded: %c (from %s) | Msg: %s\n",
      decoded, morseBuffer.c_str(), decodedMsg.c_str());

    if (bleConn) {
      char buf[96];
      snprintf(buf, sizeof(buf), "{\"char\":\"%c\",\"morse\":\"%s\",\"msg\":\"%s\"}",
        decoded, morseBuffer.c_str(), decodedMsg.c_str());
      pChar->setValue(buf);
      pChar->notify();
    }
    morseBuffer = "";
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("Muscle Telegraph starting...");
  pinMode(EMG_PIN, INPUT);
  pinMode(EMG_REF_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  analogReadResolution(12);
  calibrateEMG();

  BLEDevice::init("MuscleTelegraph");
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
  float emg = readEMG();
  unsigned long now = millis();

  if (emg > contractionThreshold && !contracted) {
    contracted = true;
    contractionStart = now;
    processRelaxation(now - relaxStart);
    digitalWrite(LED_PIN, HIGH);
  } else if (emg < contractionThreshold * 0.7 && contracted) {
    contracted = false;
    relaxStart = now;
    processContraction(now - contractionStart);
    digitalWrite(LED_PIN, LOW);
  }

  signalBuffer[sigIdx] = (int)(emg * 1000);
  sigIdx = (sigIdx + 1) % 64;

  delay(2);
}
