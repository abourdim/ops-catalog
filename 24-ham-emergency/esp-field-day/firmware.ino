/*
 * ESP Field Day - firmware.ino
 * Ham radio Field Day contact logger and scoring system.
 * Logs QSOs (contacts) with callsign, band, mode, and signal
 * reports. Calculates ARRL Field Day scoring in real-time.
 * Accessible via local web UI or serial terminal.
 *
 * Hardware: ESP32 DevKit + SSD1306 OLED + SD card
 * Wiring:  SDA->GPIO21, SCL->GPIO22, SD CS->GPIO5
 */

#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <SD.h>
#include <SPI.h>
#include <time.h>

#define SCREEN_W 128
#define SCREEN_H  64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);

#define SD_CS    5
#define LED_PIN  2
#define BTN_PIN  4

static const char *AP_SSID = "FieldDay_Log";
static const char *AP_PASS = "fd2024log";

WebServer webServer(80);

// ---------- QSO record ----------
#define MAX_QSOS 500
typedef struct {
  uint16_t id;
  char callsign[12];
  char band[6];       // 80m, 40m, 20m, 15m, 10m, 2m, 70cm
  char mode[4];       // CW, SSB, FM, DIG
  char classExch[8];  // e.g., "3A"
  char section[4];    // ARRL section, e.g., "NTX"
  char rstSent[4];
  char rstRecv[4];
  uint32_t timestamp;
} QSO;

static QSO qsoLog[MAX_QSOS];
static int qsoCount = 0;

// ---------- Scoring ----------
// CW/Digital contacts = 2 pts, SSB = 1 pt
static const char *MY_CLASS = "2A";
static const char *MY_SECTION = "NTX";
static const char *MY_CALL = "N0CALL";

int calculateScore() {
  int cwPoints = 0, ssbPoints = 0;
  for (int i = 0; i < qsoCount; i++) {
    if (strcmp(qsoLog[i].mode, "CW") == 0 || strcmp(qsoLog[i].mode, "DIG") == 0) {
      cwPoints += 2;
    } else {
      ssbPoints += 1;
    }
  }
  return cwPoints + ssbPoints;
}

// Count unique sections worked
int uniqueSections() {
  char seen[MAX_QSOS][4];
  int count = 0;
  for (int i = 0; i < qsoCount; i++) {
    bool found = false;
    for (int j = 0; j < count; j++) {
      if (strcmp(seen[j], qsoLog[i].section) == 0) { found = true; break; }
    }
    if (!found && count < MAX_QSOS) {
      strncpy(seen[count], qsoLog[i].section, 3);
      count++;
    }
  }
  return count;
}

// ---------- Check for duplicate QSO ----------
bool isDuplicate(const char *call, const char *band, const char *mode) {
  for (int i = 0; i < qsoCount; i++) {
    if (strcmp(qsoLog[i].callsign, call) == 0 &&
        strcmp(qsoLog[i].band, band) == 0 &&
        strcmp(qsoLog[i].mode, mode) == 0) {
      return true;
    }
  }
  return false;
}

// ---------- Log QSO ----------
bool logQSO(const char *call, const char *band, const char *mode,
            const char *classExch, const char *section,
            const char *rstS, const char *rstR) {
  if (qsoCount >= MAX_QSOS) return false;
  if (isDuplicate(call, band, mode)) {
    Serial.printf("[DUP] %s on %s %s already logged!\n", call, band, mode);
    return false;
  }

  QSO &q = qsoLog[qsoCount];
  q.id = qsoCount + 1;
  strncpy(q.callsign, call, 11);
  strncpy(q.band, band, 5);
  strncpy(q.mode, mode, 3);
  strncpy(q.classExch, classExch, 7);
  strncpy(q.section, section, 3);
  strncpy(q.rstSent, rstS, 3);
  strncpy(q.rstRecv, rstR, 3);
  q.timestamp = millis() / 1000;
  qsoCount++;

  Serial.printf("[QSO #%d] %s %s %s %s %s RS:%s/%s\n",
                qsoCount, call, band, mode, classExch, section, rstS, rstR);

  // Save to SD
  File f = SD.open("/fieldday.csv", FILE_APPEND);
  if (f) {
    f.printf("%d,%s,%s,%s,%s,%s,%s,%s,%u\n",
             q.id, call, band, mode, classExch, section, rstS, rstR, q.timestamp);
    f.close();
  }

  return true;
}

// ---------- Display ----------
void updateDisplay() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);

  oled.setCursor(0, 0);
  oled.printf("Field Day %s %s", MY_CALL, MY_CLASS);
  oled.setCursor(0, 10);
  oled.printf("QSOs: %d  Score: %d", qsoCount, calculateScore());
  oled.setCursor(0, 20);
  oled.printf("Sections: %d", uniqueSections());

  // Band breakdown
  int bandCounts[7] = {0};
  const char *bands[] = {"80m","40m","20m","15m","10m","2m","70cm"};
  for (int i = 0; i < qsoCount; i++) {
    for (int b = 0; b < 7; b++) {
      if (strcmp(qsoLog[i].band, bands[b]) == 0) bandCounts[b]++;
    }
  }
  oled.setCursor(0, 32);
  oled.printf("80:%d 40:%d 20:%d 15:%d",
              bandCounts[0], bandCounts[1], bandCounts[2], bandCounts[3]);
  oled.setCursor(0, 42);
  oled.printf("10:%d  2m:%d  70cm:%d",
              bandCounts[4], bandCounts[5], bandCounts[6]);

  // Last QSO
  if (qsoCount > 0) {
    QSO &last = qsoLog[qsoCount - 1];
    oled.setCursor(0, 54);
    oled.printf("Last: %s %s %s", last.callsign, last.band, last.mode);
  }

  oled.display();
}

// ---------- Web UI ----------
void handleRoot() {
  String html = "<html><head><title>Field Day Logger</title>";
  html += "<style>body{font-family:monospace;margin:20px}table{border-collapse:collapse}";
  html += "td,th{border:1px solid #ccc;padding:4px}input{margin:4px;padding:4px}";
  html += ".score{font-size:24px;color:green}</style></head><body>";
  html += "<h1>Field Day Logger - " + String(MY_CALL) + " " + String(MY_CLASS) + " " + String(MY_SECTION) + "</h1>";
  html += "<p class='score'>QSOs: " + String(qsoCount) + " | Score: " + String(calculateScore());
  html += " | Sections: " + String(uniqueSections()) + "</p>";

  // Log form
  html += "<h2>Log QSO</h2><form action='/log' method='POST'>";
  html += "Call: <input name='call' size='10' autofocus required> ";
  html += "Band: <select name='band'><option>40m</option><option>20m</option>";
  html += "<option>80m</option><option>15m</option><option>10m</option>";
  html += "<option>2m</option><option>70cm</option></select> ";
  html += "Mode: <select name='mode'><option>SSB</option><option>CW</option>";
  html += "<option>DIG</option><option>FM</option></select> ";
  html += "Class: <input name='class' size='4' value='1A'> ";
  html += "Sect: <input name='sect' size='4'> ";
  html += "RST S: <input name='rsts' size='3' value='59'> ";
  html += "RST R: <input name='rstr' size='3' value='59'> ";
  html += "<input type='submit' value='LOG!'></form>";

  // QSO table
  html += "<h2>Log (" + String(qsoCount) + " QSOs)</h2>";
  html += "<table><tr><th>#</th><th>Call</th><th>Band</th><th>Mode</th><th>Class</th><th>Sect</th><th>RST</th></tr>";
  int start = max(0, qsoCount - 25);
  for (int i = qsoCount - 1; i >= start; i--) {
    html += "<tr><td>" + String(qsoLog[i].id) + "</td>";
    html += "<td>" + String(qsoLog[i].callsign) + "</td>";
    html += "<td>" + String(qsoLog[i].band) + "</td>";
    html += "<td>" + String(qsoLog[i].mode) + "</td>";
    html += "<td>" + String(qsoLog[i].classExch) + "</td>";
    html += "<td>" + String(qsoLog[i].section) + "</td>";
    html += "<td>" + String(qsoLog[i].rstSent) + "/" + String(qsoLog[i].rstRecv) + "</td></tr>";
  }
  html += "</table></body></html>";
  webServer.send(200, "text/html", html);
}

void handleLog() {
  String call = webServer.arg("call");
  call.toUpperCase();
  bool ok = logQSO(call.c_str(),
                    webServer.arg("band").c_str(),
                    webServer.arg("mode").c_str(),
                    webServer.arg("class").c_str(),
                    webServer.arg("sect").c_str(),
                    webServer.arg("rsts").c_str(),
                    webServer.arg("rstr").c_str());
  if (!ok) {
    webServer.send(200, "text/html",
      "<html><body><h1>DUPLICATE or LOG FULL</h1><a href='/'>Back</a></body></html>");
    return;
  }
  updateDisplay();
  webServer.sendHeader("Location", "/");
  webServer.send(302);
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[FieldDay] Starting...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_PIN, INPUT_PULLUP);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  SD.begin(SD_CS);

  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_SSID, AP_PASS);
  Serial.printf("[AP] %s @ %s\n", AP_SSID, WiFi.softAPIP().toString().c_str());

  webServer.on("/", handleRoot);
  webServer.on("/log", HTTP_POST, handleLog);
  webServer.begin();

  updateDisplay();
  Serial.printf("[FieldDay] Ready. %s %s %s\n", MY_CALL, MY_CLASS, MY_SECTION);
}

// ---------- Main loop ----------
void loop() {
  webServer.handleClient();

  static unsigned long lastDisp = 0;
  if (millis() - lastDisp > 2000) { lastDisp = millis(); updateDisplay(); }

  digitalWrite(LED_PIN, (millis() / 1000) % 2);
  delay(10);
}
