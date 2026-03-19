/*
 * ESP Network Cartographer - firmware.ino
 * Discovers and maps all devices on the local network using
 * ARP scanning, mDNS discovery, and port probing.
 * Results served via built-in web UI.
 *
 * Hardware: ESP32 DevKit + LED
 */

#include <WiFi.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include <lwip/etharp.h>
#include <lwip/ip_addr.h>

// ---------- Config ----------
static const char *WIFI_SSID = "YourNetwork";
static const char *WIFI_PASS = "YourPassword";
#define LED_PIN    2
#define WEB_PORT   80

// ---------- Device database ----------
#define MAX_DEVICES 64
typedef struct {
  IPAddress ip;
  uint8_t mac[6];
  char hostname[32];
  bool ports[5];       // 80, 443, 22, 21, 23
  bool alive;
  unsigned long lastSeen;
} NetDevice;

static NetDevice devices[MAX_DEVICES];
static int deviceCount = 0;
static bool scanning = false;
static int scanProgress = 0;
static const uint16_t probePorts[] = {80, 443, 22, 21, 23};

WebServer webServer(WEB_PORT);

// ---------- Add or update device ----------
int findOrAddDevice(IPAddress ip) {
  for (int i = 0; i < deviceCount; i++) {
    if (devices[i].ip == ip) return i;
  }
  if (deviceCount < MAX_DEVICES) {
    devices[deviceCount].ip = ip;
    memset(devices[deviceCount].mac, 0, 6);
    devices[deviceCount].hostname[0] = '\0';
    memset(devices[deviceCount].ports, 0, sizeof(devices[deviceCount].ports));
    devices[deviceCount].alive = true;
    devices[deviceCount].lastSeen = millis();
    return deviceCount++;
  }
  return -1;
}

// ---------- ARP-based ping sweep ----------
void arpSweep() {
  IPAddress myIP = WiFi.localIP();
  IPAddress subnet = WiFi.subnetMask();
  uint32_t base = (uint32_t)myIP & (uint32_t)subnet;

  Serial.println("[SCAN] Starting ARP sweep...");
  scanning = true;

  for (int i = 1; i < 255; i++) {
    scanProgress = i;
    IPAddress target(
      (base & 0xFF) | ((i) & ~(subnet[0])),
      ((base >> 8) & 0xFF),
      ((base >> 16) & 0xFF),
      ((base >> 24) & 0xFF)
    );
    target = IPAddress((base & 0xFF) + i, (base >> 8) & 0xFF,
                       (base >> 16) & 0xFF, (base >> 24) & 0xFF);

    // Simple connectivity check
    WiFiClient client;
    client.setTimeout(100);
    if (client.connect(target, 80) || client.connect(target, 443)) {
      int idx = findOrAddDevice(target);
      if (idx >= 0) {
        devices[idx].alive = true;
        devices[idx].lastSeen = millis();
      }
      client.stop();
    }

    if (i % 50 == 0) {
      Serial.printf("[SCAN] Progress: %d/254\n", i);
      yield();
    }
  }
  scanning = false;
  Serial.printf("[SCAN] Complete. Found %d devices.\n", deviceCount);
}

// ---------- Port probe ----------
void probeDevicePorts(int idx) {
  for (int p = 0; p < 5; p++) {
    WiFiClient client;
    client.setTimeout(200);
    if (client.connect(devices[idx].ip, probePorts[p])) {
      devices[idx].ports[p] = true;
      client.stop();
    } else {
      devices[idx].ports[p] = false;
    }
  }
}

// ---------- Web UI ----------
void handleRoot() {
  String html = "<html><head><title>Network Cartographer</title>";
  html += "<meta http-equiv='refresh' content='10'>";
  html += "<style>body{font-family:monospace;margin:20px}table{border-collapse:collapse}";
  html += "td,th{border:1px solid #ccc;padding:5px;font-size:12px}.alive{color:green}.dead{color:red}</style></head><body>";
  html += "<h1>Network Cartographer</h1>";
  html += "<p>My IP: " + WiFi.localIP().toString() + " | Devices: " + String(deviceCount);
  if (scanning) html += " | Scanning: " + String(scanProgress) + "/254";
  html += "</p><a href='/scan'>Rescan</a>";
  html += "<table><tr><th>IP</th><th>MAC</th><th>Host</th><th>80</th><th>443</th><th>22</th><th>21</th><th>23</th></tr>";

  for (int i = 0; i < deviceCount; i++) {
    char mac[18];
    snprintf(mac, 18, "%02X:%02X:%02X:%02X:%02X:%02X",
             devices[i].mac[0], devices[i].mac[1], devices[i].mac[2],
             devices[i].mac[3], devices[i].mac[4], devices[i].mac[5]);
    html += "<tr><td class='" + String(devices[i].alive ? "alive" : "dead") + "'>";
    html += devices[i].ip.toString() + "</td>";
    html += "<td>" + String(mac) + "</td>";
    html += "<td>" + String(devices[i].hostname) + "</td>";
    for (int p = 0; p < 5; p++) {
      html += "<td>" + String(devices[i].ports[p] ? "OPEN" : "-") + "</td>";
    }
    html += "</tr>";
  }
  html += "</table></body></html>";
  webServer.send(200, "text/html", html);
}

void handleScan() {
  webServer.sendHeader("Location", "/");
  webServer.send(302);
  arpSweep();
  for (int i = 0; i < deviceCount; i++) {
    probeDevicePorts(i);
  }
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[Cartographer] Starting...");
  pinMode(LED_PIN, OUTPUT);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.printf("\n[WiFi] IP: %s\n", WiFi.localIP().toString().c_str());

  MDNS.begin("cartographer");
  webServer.on("/", handleRoot);
  webServer.on("/scan", handleScan);
  webServer.begin();

  // Initial self-registration
  findOrAddDevice(WiFi.localIP());
  Serial.println("[Cartographer] Ready. Visit http://cartographer.local/");
}

// ---------- Main loop ----------
void loop() {
  webServer.handleClient();
  MDNS.update();

  static unsigned long lastBlink = 0;
  if (millis() - lastBlink > (scanning ? 200 : 1000)) {
    lastBlink = millis();
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
  }
}
