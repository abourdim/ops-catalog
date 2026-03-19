/*
 * ESP USB Rubber Ducky - firmware.ino
 * Emulates a USB HID keyboard using ESP32-S2/S3 native USB.
 * Executes programmable keystroke payloads stored in SPIFFS.
 * Educational tool for understanding HID injection attacks.
 *
 * Hardware: ESP32-S2 or ESP32-S3 DevKit (native USB)
 */

#include <USB.h>
#include <USBHIDKeyboard.h>
#include <SPIFFS.h>
#include <FS.h>

// ---------- Pins ----------
#define LED_PIN      2
#define BTN_EXEC     0   // Boot button to trigger payload
#define DIP_SW1     15   // Payload selector bit 0
#define DIP_SW2     16   // Payload selector bit 1

// ---------- HID ----------
USBHIDKeyboard Keyboard;

// ---------- Payload parser ----------
// Simple DuckyScript-like interpreter
void executePayload(const char *filename) {
  File f = SPIFFS.open(filename, "r");
  if (!f) {
    Serial.printf("[DUCKY] Payload not found: %s\n", filename);
    return;
  }

  Serial.printf("[DUCKY] Executing: %s\n", filename);
  digitalWrite(LED_PIN, HIGH);

  while (f.available()) {
    String line = f.readStringUntil('\n');
    line.trim();
    if (line.length() == 0 || line.startsWith("//")) continue;

    if (line.startsWith("DELAY ")) {
      int ms = line.substring(6).toInt();
      delay(ms);
    }
    else if (line.startsWith("STRING ")) {
      String text = line.substring(7);
      Keyboard.print(text);
    }
    else if (line == "ENTER") {
      Keyboard.press(KEY_RETURN);
      delay(50);
      Keyboard.release(KEY_RETURN);
    }
    else if (line == "GUI" || line == "WINDOWS") {
      Keyboard.press(KEY_LEFT_GUI);
      delay(50);
      Keyboard.release(KEY_LEFT_GUI);
    }
    else if (line.startsWith("GUI ")) {
      char key = line.charAt(4);
      Keyboard.press(KEY_LEFT_GUI);
      Keyboard.press(key);
      delay(50);
      Keyboard.releaseAll();
    }
    else if (line == "TAB") {
      Keyboard.press(KEY_TAB);
      delay(50);
      Keyboard.release(KEY_TAB);
    }
    else if (line.startsWith("CTRL ")) {
      char key = line.charAt(5);
      Keyboard.press(KEY_LEFT_CTRL);
      Keyboard.press(key);
      delay(50);
      Keyboard.releaseAll();
    }
    else if (line.startsWith("ALT ")) {
      char key = line.charAt(4);
      Keyboard.press(KEY_LEFT_ALT);
      Keyboard.press(key);
      delay(50);
      Keyboard.releaseAll();
    }
    else if (line == "ESCAPE" || line == "ESC") {
      Keyboard.press(KEY_ESC);
      delay(50);
      Keyboard.release(KEY_ESC);
    }
    else if (line.startsWith("REPEAT ")) {
      // Repeat previous line N times (simplified)
      int count = line.substring(7).toInt();
      Serial.printf("[DUCKY] REPEAT %d (not fully impl)\n", count);
    }

    delay(20);  // Inter-command delay
  }

  f.close();
  Keyboard.releaseAll();
  digitalWrite(LED_PIN, LOW);
  Serial.println("[DUCKY] Payload complete.");
}

// ---------- Select payload based on DIP switches ----------
const char* getPayloadFilename() {
  int sel = 0;
  if (digitalRead(DIP_SW1) == LOW) sel |= 1;
  if (digitalRead(DIP_SW2) == LOW) sel |= 2;

  switch (sel) {
    case 0:  return "/payload0.txt";
    case 1:  return "/payload1.txt";
    case 2:  return "/payload2.txt";
    case 3:  return "/payload3.txt";
    default: return "/payload0.txt";
  }
}

// ---------- Create default payloads ----------
void createDefaultPayloads() {
  if (!SPIFFS.exists("/payload0.txt")) {
    File f = SPIFFS.open("/payload0.txt", "w");
    if (f) {
      f.println("// Default demo payload");
      f.println("DELAY 1000");
      f.println("GUI r");
      f.println("DELAY 500");
      f.println("STRING notepad");
      f.println("ENTER");
      f.println("DELAY 1000");
      f.println("STRING Hello from ESP Rubber Ducky!");
      f.println("ENTER");
      f.close();
    }
  }
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[RubberDucky] Starting...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_EXEC, INPUT_PULLUP);
  pinMode(DIP_SW1, INPUT_PULLUP);
  pinMode(DIP_SW2, INPUT_PULLUP);

  // Init SPIFFS
  if (!SPIFFS.begin(true)) {
    Serial.println("[SPIFFS] Mount failed!");
    return;
  }
  createDefaultPayloads();

  // Init USB HID
  Keyboard.begin();
  USB.begin();

  Serial.println("[RubberDucky] Ready. Press BOOT to inject.");

  // Blink to show ready
  for (int i = 0; i < 3; i++) {
    digitalWrite(LED_PIN, HIGH); delay(100);
    digitalWrite(LED_PIN, LOW);  delay(100);
  }
}

// ---------- Main loop ----------
void loop() {
  if (digitalRead(BTN_EXEC) == LOW) {
    delay(300);  // Debounce
    const char *payload = getPayloadFilename();
    Serial.printf("[DUCKY] Selected: %s\n", payload);
    executePayload(payload);

    // Wait for button release
    while (digitalRead(BTN_EXEC) == LOW) delay(50);
  }

  // Heartbeat blink
  static unsigned long lastBlink = 0;
  if (millis() - lastBlink > 2000) {
    lastBlink = millis();
    digitalWrite(LED_PIN, HIGH);
    delay(20);
    digitalWrite(LED_PIN, LOW);
  }
}
