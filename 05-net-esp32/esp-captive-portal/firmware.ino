/*
 * ESP Captive Portal - firmware.ino
 * Creates an open Wi-Fi AP with a captive portal that redirects
 * all HTTP requests to a custom landing page. Educational tool
 * for understanding captive portal mechanisms.
 *
 * Hardware: ESP32 DevKit (no extra components needed)
 */

#include <WiFi.h>
#include <WebServer.h>
#include <DNSServer.h>

// ---------- Config ----------
#define AP_SSID     "FreeWiFi_Demo"
#define AP_CHANNEL  6
#define DNS_PORT    53
#define WEB_PORT    80
#define LED_PIN     2

// ---------- Objects ----------
DNSServer dnsServer;
WebServer webServer(WEB_PORT);

// ---------- State ----------
static uint32_t totalVisitors = 0;
static uint32_t pageViews = 0;

// ---------- HTML pages ----------
static const char LANDING_PAGE[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Welcome Portal</title>
<style>
  body { font-family: Arial; text-align: center; margin: 40px; background: #f0f0f0; }
  .card { background: white; padding: 30px; border-radius: 10px; max-width: 400px; margin: auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
  h1 { color: #333; }
  .btn { background: #4CAF50; color: white; padding: 12px 30px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; }
  .stats { color: #666; font-size: 12px; margin-top: 20px; }
</style></head><body>
<div class="card">
  <h1>Welcome!</h1>
  <p>This is a captive portal demonstration.</p>
  <p>In a real scenario, users would see a login or terms page here.</p>
  <form action="/accept" method="POST">
    <button class="btn" type="submit">Continue</button>
  </form>
  <div class="stats">Visitors: %VISITORS% | Views: %VIEWS%</div>
</div></body></html>
)rawliteral";

static const char SUCCESS_PAGE[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Connected</title>
<style>
  body { font-family: Arial; text-align: center; margin: 40px; }
  .check { font-size: 60px; color: #4CAF50; }
</style></head><body>
<div class="check">&#10004;</div>
<h1>Connected!</h1>
<p>You have passed through the captive portal.</p>
</body></html>
)rawliteral";

// ---------- Request handlers ----------
void handleRoot() {
  pageViews++;
  String page = FPSTR(LANDING_PAGE);
  page.replace("%VISITORS%", String(totalVisitors));
  page.replace("%VIEWS%", String(pageViews));
  webServer.send(200, "text/html", page);
  Serial.printf("[PORTAL] Landing page served. Views=%u\n", pageViews);
}

void handleAccept() {
  totalVisitors++;
  webServer.send(200, "text/html", FPSTR(SUCCESS_PAGE));
  Serial.printf("[PORTAL] Visitor accepted (#%u)\n", totalVisitors);
  digitalWrite(LED_PIN, HIGH);
  delay(200);
  digitalWrite(LED_PIN, LOW);
}

// Apple/Android captive portal detection endpoints
void handleHotspotDetect() {
  webServer.sendHeader("Location", "http://portal.local/");
  webServer.send(302, "text/plain", "");
}

void handleGenerateError() {
  webServer.sendHeader("Location", "http://portal.local/");
  webServer.send(302, "text/plain", "");
}

void handleNotFound() {
  // Redirect everything to landing page
  webServer.sendHeader("Location", "http://portal.local/");
  webServer.send(302, "text/plain", "");
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[CaptivePortal] Starting...");

  pinMode(LED_PIN, OUTPUT);

  // Create AP
  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_SSID, NULL, AP_CHANNEL);
  delay(100);

  IPAddress apIP = WiFi.softAPIP();
  Serial.printf("[AP] SSID: %s  IP: %s\n", AP_SSID, apIP.toString().c_str());

  // DNS: redirect all domains to our IP
  dnsServer.setErrorReplyCode(DNSReplyCode::NoError);
  dnsServer.start(DNS_PORT, "*", apIP);

  // Web routes
  webServer.on("/", HTTP_GET, handleRoot);
  webServer.on("/accept", HTTP_POST, handleAccept);
  webServer.on("/hotspot-detect.html", handleHotspotDetect);
  webServer.on("/generate_204", handleGenerateError);
  webServer.on("/gen_204", handleGenerateError);
  webServer.on("/connecttest.txt", handleGenerateError);
  webServer.onNotFound(handleNotFound);
  webServer.begin();

  Serial.println("[CaptivePortal] Ready.");
}

// ---------- Main loop ----------
void loop() {
  dnsServer.processNextRequest();
  webServer.handleClient();

  // Status report
  static unsigned long lastReport = 0;
  if (millis() - lastReport > 30000) {
    lastReport = millis();
    Serial.printf("[STATUS] Clients=%d  Visitors=%u  Views=%u\n",
                  WiFi.softAPgetStationNum(), totalVisitors, pageViews);
  }
}
