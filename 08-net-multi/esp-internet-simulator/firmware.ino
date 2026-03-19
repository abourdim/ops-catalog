/*
 * ESP Internet Simulator - firmware.ino
 * Simulates a miniature internet with DNS, HTTP, and routing
 * between multiple ESP32 "autonomous systems". Each node acts
 * as a router and hosts a simple website.
 *
 * Hardware: ESP32 DevKit (no extra components)
 */

#include <WiFi.h>
#include <WebServer.h>
#include <WiFiUdp.h>
#include <esp_now.h>
#include <esp_wifi.h>

// ---------- Config ----------
// Change NODE_ID for each ESP32 (0, 1, 2, etc.)
#define NODE_ID       0
#define AP_CHANNEL    6
#define LED_PIN       2

// Each node gets its own subnet
static const char *nodeSSIDs[] = {"AS100_Net", "AS200_Net", "AS300_Net", "AS400_Net"};
static const char *nodePasswords[] = {"as100pass", "as200pass", "as300pass", "as400pass"};
static IPAddress nodeSubnets[] = {
  IPAddress(10, 100, 0, 1),
  IPAddress(10, 200, 0, 1),
  IPAddress(10, 300 - 256, 0, 1),  // wraps to 10.44.0.1
  IPAddress(10, 144, 0, 1),
};

WebServer webServer(80);
WiFiUDP dnsUDP;

// ---------- Routing table ----------
#define MAX_ROUTES 8
typedef struct {
  uint8_t destNode;
  uint8_t nextHop;
  uint8_t metric;
} Route;

static Route routeTable[MAX_ROUTES];
static int routeCount = 0;
static uint32_t packetsRouted = 0;
static uint32_t dnsQueries = 0;

// ---------- Simple DNS ----------
static const char *domainMap[][2] = {
  {"node0.sim", "10.100.0.1"},
  {"node1.sim", "10.200.0.1"},
  {"node2.sim", "10.44.0.1"},
  {"node3.sim", "10.144.0.1"},
  {"www.sim",   "10.100.0.1"},
};
#define DNS_ENTRIES 5

const char* resolveDomain(const char *domain) {
  for (int i = 0; i < DNS_ENTRIES; i++) {
    if (strcasecmp(domainMap[i][0], domain) == 0) {
      return domainMap[i][1];
    }
  }
  return NULL;
}

// ---------- Website ----------
void handleRoot() {
  String html = "<html><head><title>AS" + String((NODE_ID + 1) * 100) + "</title></head><body>";
  html += "<h1>Autonomous System " + String((NODE_ID + 1) * 100) + "</h1>";
  html += "<p>Node " + String(NODE_ID) + " - " + String(nodeSSIDs[NODE_ID]) + "</p>";
  html += "<h2>Routing Table</h2><table border='1'>";
  html += "<tr><th>Dest</th><th>NextHop</th><th>Metric</th></tr>";
  for (int i = 0; i < routeCount; i++) {
    html += "<tr><td>AS" + String((routeTable[i].destNode + 1) * 100) + "</td>";
    html += "<td>Node " + String(routeTable[i].nextHop) + "</td>";
    html += "<td>" + String(routeTable[i].metric) + "</td></tr>";
  }
  html += "</table>";
  html += "<h2>DNS Lookup</h2><form action='/dns' method='GET'>";
  html += "Domain: <input name='q'> <input type='submit' value='Resolve'></form>";
  html += "<h2>Stats</h2><p>Packets routed: " + String(packetsRouted);
  html += " | DNS queries: " + String(dnsQueries) + "</p>";
  html += "<h2>Network Links</h2><ul>";
  for (int i = 0; i < DNS_ENTRIES; i++) {
    html += "<li><a href='http://" + String(domainMap[i][1]) + "'>";
    html += String(domainMap[i][0]) + "</a></li>";
  }
  html += "</ul></body></html>";
  webServer.send(200, "text/html", html);
}

void handleDNS() {
  String query = webServer.arg("q");
  dnsQueries++;
  const char *result = resolveDomain(query.c_str());
  if (result) {
    webServer.send(200, "text/plain", String(query) + " -> " + String(result));
  } else {
    webServer.send(404, "text/plain", "NXDOMAIN: " + query);
  }
}

void handleTraceroute() {
  String dest = webServer.arg("dest");
  String result = "Traceroute to " + dest + ":\n";
  result += "1  " + nodeSubnets[NODE_ID].toString() + "  <1ms\n";
  for (int i = 0; i < routeCount; i++) {
    result += String(i + 2) + "  Node " + String(routeTable[i].nextHop) + "  ~5ms\n";
  }
  result += "* Destination reached (simulated)\n";
  packetsRouted++;
  webServer.send(200, "text/plain", result);
}

// ---------- Add route ----------
void addRoute(uint8_t dest, uint8_t nextHop, uint8_t metric) {
  if (routeCount < MAX_ROUTES) {
    routeTable[routeCount] = {dest, nextHop, metric};
    routeCount++;
  }
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.printf("[InternetSim] Node %d (AS%d) starting...\n", NODE_ID, (NODE_ID + 1) * 100);

  pinMode(LED_PIN, OUTPUT);

  // AP + STA mode
  WiFi.mode(WIFI_AP);
  WiFi.softAP(nodeSSIDs[NODE_ID], nodePasswords[NODE_ID], AP_CHANNEL);
  WiFi.softAPConfig(nodeSubnets[NODE_ID],
                    nodeSubnets[NODE_ID],
                    IPAddress(255, 255, 255, 0));

  Serial.printf("[AP] %s @ %s\n", nodeSSIDs[NODE_ID],
                WiFi.softAPIP().toString().c_str());

  // Build routing table
  for (int i = 0; i < 4; i++) {
    if (i != NODE_ID) {
      addRoute(i, i, abs(i - NODE_ID));
    }
  }

  webServer.on("/", handleRoot);
  webServer.on("/dns", handleDNS);
  webServer.on("/traceroute", handleTraceroute);
  webServer.begin();

  Serial.println("[InternetSim] Ready.");
}

// ---------- Main loop ----------
void loop() {
  webServer.handleClient();

  static unsigned long lastBlink = 0;
  if (millis() - lastBlink > 2000) {
    lastBlink = millis();
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
    Serial.printf("[STATUS] Clients=%d Routes=%d Pkts=%u DNS=%u\n",
                  WiFi.softAPgetStationNum(), routeCount, packetsRouted, dnsQueries);
  }
}
