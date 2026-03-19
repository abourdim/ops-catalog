/*
 * Ghost Network Builder - ESP32 Firmware
 * Creates ephemeral WiFi networks for security testing and honeypot research.
 * Rotates SSIDs, monitors probe requests, and logs client behavior.
 * FOR AUTHORIZED SECURITY TESTING ONLY.
 */

#include <WiFi.h>
#include <esp_wifi.h>
#include <WebServer.h>

#define STATUS_LED 2
#define MAX_NETWORKS 8
#define MAX_PROBES 64
#define SSID_ROTATE_MS 30000

struct GhostNetwork {
    char ssid[33];
    uint8_t channel;
    bool active;
    uint32_t clientCount;
};

struct ProbeRecord {
    uint8_t mac[6];
    char ssid[33];
    int8_t rssi;
    uint32_t timestamp;
};

GhostNetwork networks[MAX_NETWORKS];
ProbeRecord probes[MAX_PROBES];
int probeCount = 0;
int activeNetworks = 0;
unsigned long lastRotate = 0;
bool rotationEnabled = false;

WebServer server(80);

// Common SSID templates for testing
const char* ssidTemplates[] = {
    "FreeWiFi", "Guest_Network", "Printer_Setup",
    "Conference_Room", "IoT_Device_%d", "Test_AP_%d",
    "SecurityAudit_%d", "HoneyNet_%d"
};
const int numTemplates = 8;

void setup() {
    Serial.begin(115200);
    Serial.println("[GHOST] Ghost Network Builder Starting");
    pinMode(STATUS_LED, OUTPUT);

    WiFi.mode(WIFI_AP_STA);
    WiFi.softAP("GhostNet-Control", "audit2024", 1, 0, 4);
    Serial.printf("[NET] Control panel: %s\n", WiFi.softAPIP().toString().c_str());

    // Enable promiscuous mode for probe monitoring
    esp_wifi_set_promiscuous(true);
    esp_wifi_set_promiscuous_rx_cb(promiscuousCallback);

    setupRoutes();
    server.begin();
    blinkLED(3, 150);
}

void loop() {
    server.handleClient();

    if (rotationEnabled && millis() - lastRotate > SSID_ROTATE_MS) {
        rotateNetworks();
        lastRotate = millis();
    }
}

void blinkLED(int count, int ms) {
    for (int i = 0; i < count; i++) {
        digitalWrite(STATUS_LED, HIGH); delay(ms);
        digitalWrite(STATUS_LED, LOW); delay(ms);
    }
}

void promiscuousCallback(void* buf, wifi_promiscuous_pkt_type_t type) {
    if (type != WIFI_PKT_MGMT) return;

    const wifi_promiscuous_pkt_t* pkt = (wifi_promiscuous_pkt_t*)buf;
    const uint8_t* frame = pkt->payload;
    uint16_t frameControl = frame[0] | (frame[1] << 8);
    uint8_t subtype = (frameControl >> 4) & 0x0F;

    // Probe request subtype = 4
    if (subtype != 4) return;
    if (probeCount >= MAX_PROBES) probeCount = 0;  // Circular buffer

    ProbeRecord* pr = &probes[probeCount];
    memcpy(pr->mac, &frame[10], 6);
    pr->rssi = pkt->rx_ctrl.rssi;
    pr->timestamp = millis() / 1000;

    // Extract SSID from tagged parameters
    int pos = 24;
    int frameLen = pkt->rx_ctrl.sig_len;
    if (pos < frameLen && frame[pos] == 0) {  // SSID tag
        int ssidLen = frame[pos + 1];
        ssidLen = min(ssidLen, 32);
        memcpy(pr->ssid, &frame[pos + 2], ssidLen);
        pr->ssid[ssidLen] = '\0';
    } else {
        strcpy(pr->ssid, "<broadcast>");
    }

    probeCount++;
    Serial.printf("[PROBE] %02X:%02X:%02X:%02X:%02X:%02X -> '%s' RSSI:%d\n",
                  pr->mac[0], pr->mac[1], pr->mac[2],
                  pr->mac[3], pr->mac[4], pr->mac[5],
                  pr->ssid, pr->rssi);
}

void createGhostNetwork(const char* ssid, uint8_t channel) {
    if (activeNetworks >= MAX_NETWORKS) return;
    GhostNetwork* gn = &networks[activeNetworks];
    strncpy(gn->ssid, ssid, 32);
    gn->ssid[32] = '\0';
    gn->channel = channel;
    gn->active = true;
    gn->clientCount = 0;
    activeNetworks++;
    Serial.printf("[GHOST] Created: '%s' on ch%d\n", ssid, channel);
}

void rotateNetworks() {
    Serial.println("[ROTATE] Cycling ghost networks");
    for (int i = 0; i < activeNetworks; i++) {
        char newSsid[33];
        int tmpl = random(numTemplates);
        snprintf(newSsid, sizeof(newSsid), ssidTemplates[tmpl], random(100));
        strncpy(networks[i].ssid, newSsid, 32);
        networks[i].clientCount = 0;
    }
    blinkLED(1, 100);
}

void setupRoutes() {
    server.on("/", HTTP_GET, []() {
        String html = "<html><head><title>Ghost Network Control</title></head><body>";
        html += "<h1>Ghost Network Builder</h1>";
        html += "<h2>Active Networks (" + String(activeNetworks) + ")</h2><ul>";
        for (int i = 0; i < activeNetworks; i++) {
            html += "<li>" + String(networks[i].ssid) + " (ch" +
                    String(networks[i].channel) + ") - " +
                    String(networks[i].clientCount) + " clients</li>";
        }
        html += "</ul><h2>Probe Log (" + String(probeCount) + ")</h2><pre>";
        int start = max(0, probeCount - 20);
        for (int i = start; i < probeCount; i++) {
            char line[120];
            snprintf(line, sizeof(line), "%02X:%02X:%02X:%02X:%02X:%02X RSSI:%d '%s' @%us\n",
                     probes[i].mac[0], probes[i].mac[1], probes[i].mac[2],
                     probes[i].mac[3], probes[i].mac[4], probes[i].mac[5],
                     probes[i].rssi, probes[i].ssid, probes[i].timestamp);
            html += line;
        }
        html += "</pre>";
        html += "<form action='/create' method='GET'>";
        html += "SSID: <input name='ssid' value='TestNet'> ";
        html += "Ch: <input name='ch' value='6' size='3'> ";
        html += "<input type='submit' value='Create'></form>";
        html += "<p><a href='/rotate'>Toggle Rotation</a> | ";
        html += "<a href='/clear'>Clear Probes</a></p>";
        html += "</body></html>";
        server.send(200, "text/html", html);
    });

    server.on("/create", HTTP_GET, []() {
        String ssid = server.arg("ssid");
        int ch = server.arg("ch").toInt();
        if (ssid.length() > 0 && ch >= 1 && ch <= 13) {
            createGhostNetwork(ssid.c_str(), ch);
        }
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/rotate", HTTP_GET, []() {
        rotationEnabled = !rotationEnabled;
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/clear", HTTP_GET, []() {
        probeCount = 0;
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/probes.json", HTTP_GET, []() {
        String json = "[";
        for (int i = 0; i < probeCount; i++) {
            if (i > 0) json += ",";
            char entry[200];
            snprintf(entry, sizeof(entry),
                     "{\"mac\":\"%02X:%02X:%02X:%02X:%02X:%02X\",\"ssid\":\"%s\",\"rssi\":%d,\"time\":%u}",
                     probes[i].mac[0], probes[i].mac[1], probes[i].mac[2],
                     probes[i].mac[3], probes[i].mac[4], probes[i].mac[5],
                     probes[i].ssid, probes[i].rssi, probes[i].timestamp);
            json += entry;
        }
        json += "]";
        server.send(200, "application/json", json);
    });
}
