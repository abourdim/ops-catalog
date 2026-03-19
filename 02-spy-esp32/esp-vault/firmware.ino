/*
 * ESP Vault - firmware.ino
 * Secure password / secret storage on ESP32 using AES-256
 * encryption with NVS (Non-Volatile Storage). Access is
 * protected by PIN entry on a 4x4 matrix keypad.
 *
 * Hardware: ESP32 DevKit + 4x4 keypad + SSD1306 OLED
 * Wiring:  OLED SDA->GPIO21, SCL->GPIO22
 *          Keypad rows->GPIO13,12,14,27  cols->GPIO26,25,33,32
 */

#include <WiFi.h>
#include <Preferences.h>
#include <mbedtls/aes.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

// ---------- OLED ----------
#define SCREEN_W 128
#define SCREEN_H 64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);

// ---------- Keypad 4x4 ----------
#define ROWS 4
#define COLS 4
static const uint8_t rowPins[ROWS] = {13, 12, 14, 27};
static const uint8_t colPins[COLS] = {26, 25, 33, 32};
static const char keys[ROWS][COLS] = {
  {'1','2','3','A'},
  {'4','5','6','B'},
  {'7','8','9','C'},
  {'*','0','#','D'},
};

// ---------- Security ----------
#define PIN_LENGTH     6
#define MAX_ATTEMPTS   3
#define LOCKOUT_MS     30000
static char correctPIN[PIN_LENGTH + 1] = "123456";
static int failedAttempts = 0;
static unsigned long lockoutUntil = 0;
static bool unlocked = false;

// ---------- Vault storage ----------
Preferences prefs;
#define MAX_ENTRIES 10

// AES key derived from PIN (simplified KDF)
static uint8_t aesKey[32];
static mbedtls_aes_context aesCtx;

// ---------- Keypad scan ----------
char scanKeypad() {
  for (int c = 0; c < COLS; c++) {
    pinMode(colPins[c], OUTPUT);
    digitalWrite(colPins[c], LOW);

    for (int r = 0; r < ROWS; r++) {
      pinMode(rowPins[r], INPUT_PULLUP);
      if (digitalRead(rowPins[r]) == LOW) {
        delay(50);  // debounce
        while (digitalRead(rowPins[r]) == LOW) delay(10);
        pinMode(colPins[c], INPUT);
        return keys[r][c];
      }
    }
    pinMode(colPins[c], INPUT);
  }
  return '\0';
}

// ---------- Simple key derivation ----------
void deriveKey(const char *pin) {
  memset(aesKey, 0, sizeof(aesKey));
  for (int i = 0; i < (int)strlen(pin); i++) {
    aesKey[i % 32] ^= pin[i];
    aesKey[(i + 7) % 32] ^= (pin[i] << 3);
    aesKey[(i + 13) % 32] ^= (pin[i] >> 2);
  }
  // Stretch by hashing rounds
  for (int round = 0; round < 1000; round++) {
    for (int i = 0; i < 31; i++) {
      aesKey[i] ^= aesKey[i + 1] + round;
    }
  }
}

// ---------- Encrypt / decrypt 16-byte block ----------
void encryptBlock(const uint8_t *in, uint8_t *out) {
  mbedtls_aes_setkey_enc(&aesCtx, aesKey, 256);
  mbedtls_aes_crypt_ecb(&aesCtx, MBEDTLS_AES_ENCRYPT, in, out);
}

void decryptBlock(const uint8_t *in, uint8_t *out) {
  mbedtls_aes_setkey_dec(&aesCtx, aesKey, 256);
  mbedtls_aes_crypt_ecb(&aesCtx, MBEDTLS_AES_DECRYPT, in, out);
}

// ---------- Display helpers ----------
void showMessage(const char *line1, const char *line2 = "") {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(0, 10);
  oled.println(line1);
  oled.setCursor(0, 30);
  oled.println(line2);
  oled.display();
}

// ---------- PIN entry ----------
bool enterPIN() {
  if (millis() < lockoutUntil) {
    showMessage("LOCKED OUT", "Wait 30 seconds...");
    return false;
  }

  char entered[PIN_LENGTH + 1] = {0};
  int pos = 0;
  showMessage("Enter PIN:", "______");

  while (pos < PIN_LENGTH) {
    char k = scanKeypad();
    if (k >= '0' && k <= '9') {
      entered[pos++] = k;
      char mask[PIN_LENGTH + 1];
      for (int i = 0; i < pos; i++) mask[i] = '*';
      for (int i = pos; i < PIN_LENGTH; i++) mask[i] = '_';
      mask[PIN_LENGTH] = '\0';
      showMessage("Enter PIN:", mask);
    }
  }

  if (strcmp(entered, correctPIN) == 0) {
    failedAttempts = 0;
    showMessage("ACCESS GRANTED");
    deriveKey(entered);
    delay(1000);
    return true;
  } else {
    failedAttempts++;
    if (failedAttempts >= MAX_ATTEMPTS) {
      lockoutUntil = millis() + LOCKOUT_MS;
      showMessage("TOO MANY TRIES", "Locked 30s");
    } else {
      showMessage("WRONG PIN", "Try again");
    }
    delay(1500);
    return false;
  }
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[Vault] Starting...");

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  mbedtls_aes_init(&aesCtx);
  prefs.begin("vault", false);

  // Disable Wi-Fi for security
  WiFi.mode(WIFI_OFF);

  showMessage("ESP VAULT", "Press any key...");
  Serial.println("[Vault] Ready. Enter PIN to unlock.");
}

// ---------- Main loop ----------
void loop() {
  if (!unlocked) {
    char k = scanKeypad();
    if (k != '\0') {
      unlocked = enterPIN();
    }
  } else {
    showMessage("VAULT UNLOCKED", "A=List B=Add #=Lock");
    char k = scanKeypad();

    if (k == 'A') {
      // List stored entries
      for (int i = 0; i < MAX_ENTRIES; i++) {
        char key[8];
        snprintf(key, sizeof(key), "e%d", i);
        String val = prefs.getString(key, "");
        if (val.length() > 0) {
          Serial.printf("[Vault] Entry %d: (encrypted)\n", i);
        }
      }
    }
    else if (k == '#') {
      unlocked = false;
      memset(aesKey, 0, sizeof(aesKey));
      showMessage("LOCKED");
      delay(1000);
    }
  }

  delay(50);
}
