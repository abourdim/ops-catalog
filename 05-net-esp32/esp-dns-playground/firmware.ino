/*
 * ESP DNS Playground - firmware.ino
 * Custom DNS server that lets you configure domain-to-IP
 * mappings via a web UI. Demonstrates DNS resolution,
 * caching, and redirection concepts.
 *
 * Hardware: ESP32 DevKit (no extra components)
 */

#include <WiFi.h>
#include <WebServer.h>
#include <WiFiUdp.h>

// ---------- Config ----------
#define AP_SSID    "DNS_Playground"
#define AP_PASS    "dnslab123"
#define DNS_PORT   53
#define WEB_PORT   80
#define LED_PIN    2

// ---------- DNS record store ----------
#define MAX_RECORDS 16
typedef struct {
  char domain[64];
  IPAddress ip;
  uint32_t hits;
} DNSRecord;

static DNSRecord records[MAX_RECORDS];
static int recordCount = 0;
static uint32_t totalQueries = 0;

WebServer webServer(WEB_PORT);
WiFiUDP udp;

// ---------- Add default records ----------
void addRecord(const char *domain, IPAddress ip) {
  if (recordCount < MAX_RECORDS) {
    strncpy(records[recordCount].domain, domain, 63);
    records[recordCount].ip = ip;
    records[recordCount].hits = 0;
    recordCount++;
  }
}

// ---------- Find record ----------
int findRecord(const char *domain) {
  for (int i = 0; i < recordCount; i++) {
    if (strcasecmp(records[i].domain, domain) == 0) {
      return i;
    }
  }
  return -1;
}

// ---------- Parse DNS query ----------
// Extract domain name from DNS query packet
bool parseDNSQuery(const uint8_t *buf, int len, char *domain, int maxLen) {
  if (len < 12) return false;
  int pos = 12;  // Skip header
  int dpos = 0;

  while (pos < len && buf[pos] != 0) {
    int labelLen = buf[pos++];
    if (labelLen > 63 || pos + labelLen > len) return false;
    if (dpos > 0 && dpos < maxLen - 1) domain[dpos++] = '.';
    for (int i = 0; i < labelLen && dpos < maxLen - 1; i++) {
      domain[dpos++] = buf[pos++];
    }
  }
  domain[dpos] = '\0';
  return true;
}

// ---------- Build DNS response ----------
int buildDNSResponse(const uint8_t *query, int qlen, uint8_t *resp, IPAddress ip) {
  memcpy(resp, query, qlen);
  resp[2] = 0x81; resp[3] = 0x80;  // Flags: response, no error
  resp[6] = 0x00; resp[7] = 0x01;  // 1 answer

  int pos = qlen;
  resp[pos++] = 0xC0; resp[pos++] = 0x0C;  // Name pointer
  resp[pos++] = 0x00; resp[pos++] = 0x01;  // Type A
  resp[pos++] = 0x00; resp[pos++] = 0x01;  // Class IN
  resp[pos++] = 0x00; resp[pos++] = 0x00;
  resp[pos++] = 0x00; resp[pos++] = 0x3C;  // TTL = 60
  resp[pos++] = 0x00; resp[pos++] = 0x04;  // Data length
  resp[pos++] = ip[0];
  resp[pos++] = ip[1];
  resp[pos++] = ip[2];
  resp[pos++] = ip[3];
  return pos;
}

// ---------- Handle DNS ----------
void handleDNS() {
  int pktSize = udp.parsePacket();
  if (pktSize == 0) return;

  uint8_t buf[512];
  int len = udp.read(buf, sizeof(buf));

  char domain[64];
  if (!parseDNSQuery(buf, len, domain, sizeof(domain))) return;

  totalQueries++;
  Serial.printf("[DNS] Query: %s from %s\n",
                domain, udp.remoteIP().toString().c_str());

  int idx = findRecord(domain);
  IPAddress respIP = WiFi.softAPIP();  // Default: resolve to self
  if (idx >= 0) {
    respIP = records[idx].ip;
    records[idx].hits++;
  }

  uint8_t resp[512];
  int rlen = buildDNSResponse(buf, len, resp, respIP);
  udp.beginPacket(udp.remoteIP(), udp.remotePort());
  udp.write(resp, rlen);
  udp.endPacket();
}

// ---------- Web UI ----------
void handleWebRoot() {
  String html = "<html><head><title>DNS Playground</title>";
  html += "<style>body{font-family:monospace;margin:20px}table{border-collapse:collapse}";
  html += "td,th{border:1px solid #ccc;padding:6px}input{margin:4px}</style></head><body>";
  html += "<h1>DNS Playground</h1><p>Queries: " + String(totalQueries) + "</p>";
  html += "<table><tr><th>Domain</th><th>IP</th><th>Hits</th></tr>";
  for (int i = 0; i < recordCount; i++) {
    html += "<tr><td>" + String(records[i].domain) + "</td>";
    html += "<td>" + records[i].ip.toString() + "</td>";
    html += "<td>" + String(records[i].hits) + "</td></tr>";
  }
  html += "</table><hr><h2>Add Record</h2>";
  html += "<form action='/add' method='POST'>";
  html += "Domain: <input name='d'> IP: <input name='ip'>";
  html += "<input type='submit' value='Add'></form></body></html>";
  webServer.send(200, "text/html", html);
}

void handleAddRecord() {
  String d = webServer.arg("d");
  String ipStr = webServer.arg("ip");
  IPAddress ip;
  if (ip.fromString(ipStr) && d.length() > 0) {
    addRecord(d.c_str(), ip);
    Serial.printf("[DNS] Added: %s -> %s\n", d.c_str(), ipStr.c_str());
  }
  webServer.sendHeader("Location", "/");
  webServer.send(302);
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[DNSPlayground] Starting...");
  pinMode(LED_PIN, OUTPUT);

  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_SSID, AP_PASS);
  delay(100);

  IPAddress myIP = WiFi.softAPIP();
  Serial.printf("[AP] %s @ %s\n", AP_SSID, myIP.toString().c_str());

  // Default records
  addRecord("portal.local", myIP);
  addRecord("example.com", IPAddress(93, 184, 216, 34));
  addRecord("blocked.site", myIP);

  udp.begin(DNS_PORT);
  webServer.on("/", handleWebRoot);
  webServer.on("/add", HTTP_POST, handleAddRecord);
  webServer.begin();

  Serial.println("[DNSPlayground] Ready.");
}

// ---------- Main loop ----------
void loop() {
  handleDNS();
  webServer.handleClient();

  static unsigned long lastBlink = 0;
  if (millis() - lastBlink > 1000) {
    lastBlink = millis();
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
  }
}
