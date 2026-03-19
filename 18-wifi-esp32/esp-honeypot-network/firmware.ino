/*
 * ESP Honeypot Network - firmware.ino
 * Multi-service honeypot that simulates an entire network of
 * vulnerable devices. Logs all interaction for security research.
 * Each virtual host appears as a different service on the network.
 *
 * Hardware: ESP32 DevKit + SD card (CS -> GPIO5)
 */

#include <WiFi.h>
#include <WebServer.h>
#include <WiFiServer.h>
#include <SD.h>
#include <SPI.h>

// ---------- Config ----------
static const char *WIFI_SSID = "YourNetwork";
static const char *WIFI_PASS = "YourPassword";
#define SD_CS   5
#define LED_PIN 2

// ---------- Virtual services ----------
WebServer httpServer(80);
WiFiServer telnetSvc(23);
WiFiServer sshSvc(22);
WiFiServer mysqlSvc(3306);
WiFiServer redisSvc(6379);

// ---------- Logging ----------
#define MAX_EVENTS 128
typedef struct {
  uint32_t timestamp;
  char service[8];
  char clientIP[16];
  char action[64];
} HoneypotEvent;

static HoneypotEvent events[MAX_EVENTS];
static int eventCount = 0;
static bool sdReady = false;

void logEvent(const char *svc, const char *ip, const char *action) {
  if (eventCount < MAX_EVENTS) {
    events[eventCount].timestamp = millis();
    strncpy(events[eventCount].service, svc, 7);
    strncpy(events[eventCount].clientIP, ip, 15);
    strncpy(events[eventCount].action, action, 63);
    eventCount++;
  }
  Serial.printf("[HP:%s] %s: %s\n", svc, ip, action);

  if (sdReady) {
    File f = SD.open("/honeypot.log", FILE_APPEND);
    if (f) {
      f.printf("%u,%s,%s,%s\n", millis(), svc, ip, action);
      f.close();
    }
  }
  digitalWrite(LED_PIN, HIGH);
  delay(30);
  digitalWrite(LED_PIN, LOW);
}

// ---------- HTTP honeypot (fake router admin) ----------
void handleHTTPRoot() {
  String ip = httpServer.client().remoteIP().toString();
  logEvent("HTTP", ip.c_str(), "GET /");
  httpServer.send(200, "text/html",
    "<html><head><title>Router Admin</title></head><body>"
    "<h1>TP-Link TL-WR940N</h1>"
    "<form method='POST' action='/login'>"
    "User: <input name='u' value='admin'><br>"
    "Pass: <input name='p' type='password'><br>"
    "<input type='submit' value='Login'></form></body></html>");
}

void handleHTTPLogin() {
  String ip = httpServer.client().remoteIP().toString();
  String user = httpServer.arg("u");
  String pass = httpServer.arg("p");
  logEvent("HTTP", ip.c_str(), ("LOGIN:" + user + "/" + pass).c_str());
  httpServer.send(200, "text/html",
    "<html><body><h1>Error: Invalid credentials</h1></body></html>");
}

// ---------- Telnet honeypot ----------
void handleTelnet() {
  WiFiClient client = telnetSvc.available();
  if (!client) return;
  String ip = client.remoteIP().toString();
  logEvent("TELNET", ip.c_str(), "connect");

  client.print("\r\nBusyBox v1.30.1 built-in shell\r\nlogin: ");
  String input = "";
  unsigned long timeout = millis() + 15000;
  while (client.connected() && millis() < timeout) {
    if (client.available()) {
      String line = client.readStringUntil('\n');
      line.trim();
      logEvent("TELNET", ip.c_str(), line.c_str());
      client.print("Password: ");
      String pass = client.readStringUntil('\n');
      pass.trim();
      logEvent("TELNET", ip.c_str(), ("pass:" + pass).c_str());
      client.println("\r\nLogin incorrect");
      break;
    }
  }
  client.stop();
}

// ---------- SSH honeypot ----------
void handleSSH() {
  WiFiClient client = sshSvc.available();
  if (!client) return;
  String ip = client.remoteIP().toString();
  logEvent("SSH", ip.c_str(), "connect");
  client.println("SSH-2.0-OpenSSH_7.9p1 Debian-10");
  unsigned long timeout = millis() + 5000;
  while (client.connected() && millis() < timeout) {
    if (client.available()) {
      String data = client.readStringUntil('\n');
      logEvent("SSH", ip.c_str(), data.c_str());
    }
  }
  client.stop();
}

// ---------- MySQL honeypot ----------
void handleMySQL() {
  WiFiClient client = mysqlSvc.available();
  if (!client) return;
  String ip = client.remoteIP().toString();
  logEvent("MYSQL", ip.c_str(), "connect");
  // Send MySQL greeting packet
  uint8_t greeting[] = {0x4a, 0x00, 0x00, 0x00, 0x0a, 0x35, 0x2e, 0x37};
  client.write(greeting, sizeof(greeting));
  unsigned long timeout = millis() + 5000;
  while (client.connected() && millis() < timeout) {
    if (client.available()) {
      String data = "";
      while (client.available()) data += (char)client.read();
      logEvent("MYSQL", ip.c_str(), "auth_attempt");
    }
  }
  client.stop();
}

// ---------- Redis honeypot ----------
void handleRedis() {
  WiFiClient client = redisSvc.available();
  if (!client) return;
  String ip = client.remoteIP().toString();
  logEvent("REDIS", ip.c_str(), "connect");

  unsigned long timeout = millis() + 10000;
  while (client.connected() && millis() < timeout) {
    if (client.available()) {
      String cmd = client.readStringUntil('\n');
      cmd.trim();
      logEvent("REDIS", ip.c_str(), cmd.c_str());

      if (cmd.equalsIgnoreCase("PING")) {
        client.println("+PONG");
      } else if (cmd.equalsIgnoreCase("INFO")) {
        client.println("$11\r\nredis:6.2.6");
      } else if (cmd.equalsIgnoreCase("QUIT")) {
        client.println("+OK");
        break;
      } else {
        client.println("-ERR unknown command");
      }
    }
  }
  client.stop();
}

// ---------- Dashboard ----------
void handleDashboard() {
  String html = "<html><head><title>Honeypot Dashboard</title>";
  html += "<meta http-equiv='refresh' content='10'></head><body>";
  html += "<h1>Honeypot Network Dashboard</h1>";
  html += "<p>Events: " + String(eventCount) + "</p>";
  html += "<table border='1'><tr><th>Time</th><th>Service</th><th>IP</th><th>Action</th></tr>";
  int start = max(0, eventCount - 30);
  for (int i = eventCount - 1; i >= start; i--) {
    html += "<tr><td>" + String(events[i].timestamp / 1000) + "s</td>";
    html += "<td>" + String(events[i].service) + "</td>";
    html += "<td>" + String(events[i].clientIP) + "</td>";
    html += "<td>" + String(events[i].action) + "</td></tr>";
  }
  html += "</table></body></html>";
  httpServer.send(200, "text/html", html);
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[HoneypotNet] Starting...");
  pinMode(LED_PIN, OUTPUT);

  if (SD.begin(SD_CS)) { sdReady = true; }

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) { delay(500); }
  Serial.printf("[WiFi] IP: %s\n", WiFi.localIP().toString().c_str());

  httpServer.on("/", handleHTTPRoot);
  httpServer.on("/login", HTTP_POST, handleHTTPLogin);
  httpServer.on("/dashboard", handleDashboard);
  httpServer.begin();
  telnetSvc.begin();
  sshSvc.begin();
  mysqlSvc.begin();
  redisSvc.begin();

  Serial.println("[HoneypotNet] All services active.");
}

// ---------- Main loop ----------
void loop() {
  httpServer.handleClient();
  handleTelnet();
  handleSSH();
  handleMySQL();
  handleRedis();
  delay(10);
}
