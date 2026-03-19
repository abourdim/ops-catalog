/*
 * ESP Cyber Range - firmware.ino
 * Creates an isolated network lab for practicing network
 * security skills. Runs multiple simulated services with
 * configurable vulnerabilities for educational penetration testing.
 *
 * Hardware: ESP32 DevKit (no extra components)
 */

#include <WiFi.h>
#include <WebServer.h>
#include <WiFiServer.h>

// ---------- Config ----------
#define AP_SSID   "CyberRange_Lab"
#define AP_PASS   "range1234"
#define LED_PIN   2

// ---------- Servers ----------
WebServer webServer(80);
WiFiServer sshHoneypot(22);
WiFiServer ftpServer(21);
WiFiServer smtpServer(25);

// ---------- Challenge state ----------
static bool flag1Found = false;  // Web directory traversal
static bool flag2Found = false;  // Weak credentials
static bool flag3Found = false;  // Hidden API endpoint
static uint32_t totalConnections = 0;
static uint32_t attackAttempts = 0;

// ---------- Simulated users (weak creds for training) ----------
struct Credential {
  const char *user;
  const char *pass;
};
static const Credential creds[] = {
  {"admin", "admin"},
  {"root", "toor"},
  {"user", "password123"},
  {"test", "test"},
};
#define NUM_CREDS 4

// ---------- Web: Vulnerable app simulation ----------
void handleWebRoot() {
  totalConnections++;
  String html = "<html><head><title>Corp Portal</title></head><body>";
  html += "<h1>Corporate Portal v1.0</h1>";
  html += "<p>Welcome to the internal portal.</p>";
  html += "<p><a href='/login'>Login</a> | <a href='/about'>About</a></p>";
  html += "<!-- TODO: remove debug endpoint /api/debug -->";
  html += "</body></html>";
  webServer.send(200, "text/html", html);
}

void handleLogin() {
  if (webServer.method() == HTTP_POST) {
    String user = webServer.arg("username");
    String pass = webServer.arg("password");
    attackAttempts++;

    for (int i = 0; i < NUM_CREDS; i++) {
      if (user == creds[i].user && pass == creds[i].pass) {
        flag2Found = true;
        webServer.send(200, "text/html",
          "<h1>Welcome admin!</h1><p>FLAG{weak_creds_pwned}</p>");
        Serial.printf("[RANGE] Flag 2 captured by %s\n",
                      webServer.client().remoteIP().toString().c_str());
        return;
      }
    }
    webServer.send(401, "text/html", "<h1>Invalid credentials</h1>");
    return;
  }

  String html = "<html><body><h2>Login</h2>";
  html += "<form method='POST'>";
  html += "User: <input name='username'><br>";
  html += "Pass: <input name='password' type='password'><br>";
  html += "<input type='submit' value='Login'></form></body></html>";
  webServer.send(200, "text/html", html);
}

void handleDebugAPI() {
  flag3Found = true;
  Serial.printf("[RANGE] Flag 3 captured!\n");
  String json = "{\"flag\":\"FLAG{hidden_api_found}\",\"server_info\":{";
  json += "\"uptime\":" + String(millis() / 1000) + ",";
  json += "\"free_heap\":" + String(ESP.getFreeHeap()) + ",";
  json += "\"connections\":" + String(totalConnections) + "}}";
  webServer.send(200, "application/json", json);
}

void handleTraversal() {
  String path = webServer.uri();
  if (path.indexOf("..") >= 0) {
    flag1Found = true;
    attackAttempts++;
    Serial.printf("[RANGE] Flag 1 captured (path traversal)\n");
    webServer.send(200, "text/plain",
      "FLAG{directory_traversal_detected}\n/etc/passwd simulation\nroot:x:0:0:root:/root:/bin/bash");
    return;
  }
  webServer.send(404, "text/plain", "Not found");
}

void handleScoreboard() {
  String html = "<html><body><h1>Cyber Range Scoreboard</h1>";
  html += "<table border='1'><tr><th>Challenge</th><th>Status</th></tr>";
  html += "<tr><td>Path Traversal</td><td>" + String(flag1Found ? "CAPTURED" : "Active") + "</td></tr>";
  html += "<tr><td>Weak Credentials</td><td>" + String(flag2Found ? "CAPTURED" : "Active") + "</td></tr>";
  html += "<tr><td>Hidden API</td><td>" + String(flag3Found ? "CAPTURED" : "Active") + "</td></tr>";
  html += "</table><p>Total connections: " + String(totalConnections) + "</p>";
  html += "<p>Attack attempts: " + String(attackAttempts) + "</p>";
  html += "</body></html>";
  webServer.send(200, "text/html", html);
}

// ---------- SSH Honeypot ----------
void handleSSH() {
  WiFiClient client = sshHoneypot.available();
  if (!client) return;
  totalConnections++;
  client.println("SSH-2.0-OpenSSH_7.9p1 Debian-10+deb10u2");
  unsigned long timeout = millis() + 5000;
  while (client.connected() && millis() < timeout) {
    if (client.available()) {
      String line = client.readStringUntil('\n');
      Serial.printf("[SSH] %s: %s\n", client.remoteIP().toString().c_str(), line.c_str());
      attackAttempts++;
    }
  }
  client.stop();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[CyberRange] Starting...");
  pinMode(LED_PIN, OUTPUT);

  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_SSID, AP_PASS);
  Serial.printf("[AP] %s @ %s\n", AP_SSID, WiFi.softAPIP().toString().c_str());

  webServer.on("/", handleWebRoot);
  webServer.on("/login", handleLogin);
  webServer.on("/api/debug", handleDebugAPI);
  webServer.on("/scoreboard", handleScoreboard);
  webServer.onNotFound(handleTraversal);
  webServer.begin();

  sshHoneypot.begin();
  ftpServer.begin();
  smtpServer.begin();

  Serial.println("[CyberRange] Lab active. Services: HTTP/SSH/FTP/SMTP");
}

// ---------- Main loop ----------
void loop() {
  webServer.handleClient();
  handleSSH();

  static unsigned long lastBlink = 0;
  if (millis() - lastBlink > 1000) {
    lastBlink = millis();
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
  }
}
