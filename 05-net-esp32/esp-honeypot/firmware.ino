/*
 * ESP Honeypot - firmware.ino
 * Simulates vulnerable network services (HTTP, Telnet, FTP)
 * to log connection attempts and potential attack patterns.
 * All connections are logged to Serial and SD card.
 *
 * Hardware: ESP32 DevKit + SD card module (CS -> GPIO5)
 */

#include <WiFi.h>
#include <WiFiServer.h>
#include <SD.h>
#include <SPI.h>

// ---------- Config ----------
static const char *WIFI_SSID = "YourNetwork";
static const char *WIFI_PASS = "YourPassword";
#define SD_CS   5
#define LED_PIN 2

// ---------- Fake service ports ----------
WiFiServer httpServer(80);
WiFiServer telnetServer(23);
WiFiServer ftpServer(21);

// ---------- Stats ----------
static uint32_t httpHits = 0;
static uint32_t telnetHits = 0;
static uint32_t ftpHits = 0;
static bool sdReady = false;

// ---------- Logging ----------
void logEvent(const char *service, const char *clientIP, const char *data) {
  Serial.printf("[HONEYPOT] %s from %s: %s\n", service, clientIP, data);
  if (sdReady) {
    File f = SD.open("/honeypot.log", FILE_APPEND);
    if (f) {
      f.printf("%lu,%s,%s,%s\n", millis(), service, clientIP, data);
      f.close();
    }
  }
  digitalWrite(LED_PIN, HIGH);
  delay(50);
  digitalWrite(LED_PIN, LOW);
}

// ---------- Handle fake HTTP ----------
void handleHTTP() {
  WiFiClient client = httpServer.available();
  if (!client) return;

  httpHits++;
  String clientIP = client.remoteIP().toString();

  // Read request
  String request = "";
  unsigned long timeout = millis() + 2000;
  while (client.connected() && millis() < timeout) {
    if (client.available()) {
      char c = client.read();
      request += c;
      if (request.endsWith("\r\n\r\n")) break;
    }
  }

  // Extract first line
  int nl = request.indexOf('\n');
  String firstLine = request.substring(0, nl > 0 ? nl : 60);
  firstLine.trim();
  logEvent("HTTP", clientIP.c_str(), firstLine.c_str());

  // Send fake response
  client.println("HTTP/1.1 200 OK");
  client.println("Server: Apache/2.4.41 (Ubuntu)");
  client.println("Content-Type: text/html");
  client.println();
  client.println("<html><head><title>Welcome</title></head>");
  client.println("<body><h1>It works!</h1>");
  client.println("<p>Apache/2.4.41 (Ubuntu) Server</p>");
  client.println("</body></html>");
  client.stop();
}

// ---------- Handle fake Telnet ----------
void handleTelnet() {
  WiFiClient client = telnetServer.available();
  if (!client) return;

  telnetHits++;
  String clientIP = client.remoteIP().toString();
  logEvent("TELNET", clientIP.c_str(), "connection");

  client.print("Ubuntu 20.04 LTS\r\nlogin: ");
  String login = "";
  unsigned long timeout = millis() + 10000;
  while (client.connected() && millis() < timeout) {
    if (client.available()) {
      char c = client.read();
      if (c == '\n' || c == '\r') break;
      login += c;
    }
  }
  logEvent("TELNET", clientIP.c_str(), ("user=" + login).c_str());

  client.print("Password: ");
  String pass = "";
  timeout = millis() + 10000;
  while (client.connected() && millis() < timeout) {
    if (client.available()) {
      char c = client.read();
      if (c == '\n' || c == '\r') break;
      pass += c;
    }
  }
  logEvent("TELNET", clientIP.c_str(), ("pass=" + pass).c_str());

  client.println("\r\nLogin incorrect");
  delay(1000);
  client.stop();
}

// ---------- Handle fake FTP ----------
void handleFTP() {
  WiFiClient client = ftpServer.available();
  if (!client) return;

  ftpHits++;
  String clientIP = client.remoteIP().toString();
  logEvent("FTP", clientIP.c_str(), "connection");

  client.println("220 ProFTPD 1.3.5 Server ready.");

  unsigned long timeout = millis() + 15000;
  while (client.connected() && millis() < timeout) {
    if (client.available()) {
      String cmd = client.readStringUntil('\n');
      cmd.trim();
      logEvent("FTP", clientIP.c_str(), cmd.c_str());

      if (cmd.startsWith("USER")) {
        client.println("331 Password required.");
      } else if (cmd.startsWith("PASS")) {
        client.println("530 Login incorrect.");
        break;
      } else if (cmd.startsWith("QUIT")) {
        client.println("221 Goodbye.");
        break;
      } else {
        client.println("500 Unknown command.");
      }
    }
  }
  client.stop();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[Honeypot] Starting...");
  pinMode(LED_PIN, OUTPUT);

  if (SD.begin(SD_CS)) {
    sdReady = true;
    Serial.println("[SD] Logging to /honeypot.log");
  }

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.printf("\n[WiFi] IP: %s\n", WiFi.localIP().toString().c_str());

  httpServer.begin();
  telnetServer.begin();
  ftpServer.begin();
  Serial.println("[Honeypot] Services active on ports 80, 23, 21.");
}

// ---------- Main loop ----------
void loop() {
  handleHTTP();
  handleTelnet();
  handleFTP();

  static unsigned long lastStats = 0;
  if (millis() - lastStats > 30000) {
    lastStats = millis();
    Serial.printf("[STATS] HTTP=%u Telnet=%u FTP=%u\n",
                  httpHits, telnetHits, ftpHits);
  }
  delay(10);
}
