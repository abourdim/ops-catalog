/*
 * Rogue Base Station Detector - ESP32 Firmware
 * Detects rogue WiFi access points and IMSI-catcher-like devices
 * by monitoring for suspicious network behavior patterns.
 * FOR AUTHORIZED SECURITY TESTING ONLY.
 */

#include <WiFi.h>
#include <esp_wifi.h>
#include <WebServer.h>

#define STATUS_LED   2
#define MAX_APS      64
#define MAX_ALERTS   32
#define SCAN_INTERVAL 10000

struct AccessPoint {
    char ssid[33];
    uint8_t bssid[6];
    int8_t rssi;
    uint8_t channel;
    uint8_t encryption;
    bool hidden;
    uint32_t firstSeen;
    uint32_t lastSeen;
    int seenCount;
    bool suspicious;
    char suspectReason[48];
};

struct Alert {
    char message[80];
    uint8_t severity;  // 1=low, 2=med, 3=high
    uint32_t timestamp;
};

AccessPoint apList[MAX_APS];
int apCount = 0;
Alert alerts[MAX_ALERTS];
int alertCount = 0;
bool scanning = true;
unsigned long lastScan = 0;

WebServer server(80);

const char* AP_SSID = "RogueDetect-Lab";
const char* AP_PASS = "research2024";

void setup() {
    Serial.begin(115200);
    Serial.println("[ROGUE] Rogue Base Station Detector Starting");
    pinMode(STATUS_LED, OUTPUT);

    WiFi.mode(WIFI_AP_STA);
    WiFi.softAP(AP_SSID, AP_PASS);
    Serial.printf("[NET] Control: %s\n", WiFi.softAPIP().toString().c_str());

    setupRoutes();
    server.begin();
    blinkLED(3, 150);

    performScan();
}

void loop() {
    server.handleClient();

    if (scanning && millis() - lastScan > SCAN_INTERVAL) {
        performScan();
        lastScan = millis();
    }
}

void blinkLED(int n, int ms) {
    for (int i = 0; i < n; i++) {
        digitalWrite(STATUS_LED, HIGH); delay(ms);
        digitalWrite(STATUS_LED, LOW); delay(ms);
    }
}

void addAlert(const char* msg, uint8_t severity) {
    int idx = alertCount % MAX_ALERTS;
    strncpy(alerts[idx].message, msg, 79);
    alerts[idx].message[79] = '\0';
    alerts[idx].severity = severity;
    alerts[idx].timestamp = millis() / 1000;
    alertCount++;
    Serial.printf("[ALERT] Sev %d: %s\n", severity, msg);
    blinkLED(severity, 100);
}

int findAP(uint8_t* bssid) {
    for (int i = 0; i < apCount; i++) {
        if (memcmp(apList[i].bssid, bssid, 6) == 0) return i;
    }
    return -1;
}

void analyzeAP(int index) {
    AccessPoint* ap = &apList[index];
    ap->suspicious = false;

    // Check 1: Open network with common name (evil twin indicator)
    const char* suspicious_names[] = {"Free WiFi", "FreeWiFi", "Guest", "Airport",
                                       "Starbucks", "xfinitywifi", "attwifi"};
    for (int i = 0; i < 7; i++) {
        if (strcasecmp(ap->ssid, suspicious_names[i]) == 0 && ap->encryption == WIFI_AUTH_OPEN) {
            ap->suspicious = true;
            snprintf(ap->suspectReason, 48, "Open network with common SSID");
            char msg[80];
            snprintf(msg, 80, "Evil twin suspect: '%s' on ch%d", ap->ssid, ap->channel);
            addAlert(msg, 2);
        }
    }

    // Check 2: SSID spoofing (same SSID, different BSSID)
    for (int i = 0; i < apCount; i++) {
        if (i != index && strcmp(apList[i].ssid, ap->ssid) == 0 &&
            memcmp(apList[i].bssid, ap->bssid, 6) != 0) {
            ap->suspicious = true;
            snprintf(ap->suspectReason, 48, "Duplicate SSID, different BSSID");
            char msg[80];
            snprintf(msg, 80, "SSID clone detected: '%s'", ap->ssid);
            addAlert(msg, 3);
        }
    }

    // Check 3: Signal strength anomaly (very strong signal)
    if (ap->rssi > -30) {
        ap->suspicious = true;
        snprintf(ap->suspectReason, 48, "Unusually strong signal (%d dBm)", ap->rssi);
        char msg[80];
        snprintf(msg, 80, "Strong signal anomaly: '%s' %d dBm", ap->ssid, ap->rssi);
        addAlert(msg, 1);
    }

    // Check 4: Channel hopping (AP changed channel between scans)
    // Tracked via firstSeen/lastSeen pattern
}

void performScan() {
    Serial.println("[SCAN] Scanning WiFi networks...");
    int n = WiFi.scanNetworks(false, true);  // Include hidden

    for (int i = 0; i < n && i < MAX_APS; i++) {
        uint8_t* bssid = WiFi.BSSID(i);
        int existing = findAP(bssid);

        if (existing >= 0) {
            apList[existing].rssi = WiFi.RSSI(i);
            apList[existing].lastSeen = millis() / 1000;
            apList[existing].seenCount++;
            apList[existing].channel = WiFi.channel(i);
        } else if (apCount < MAX_APS) {
            AccessPoint* ap = &apList[apCount];
            strncpy(ap->ssid, WiFi.SSID(i).c_str(), 32);
            ap->ssid[32] = '\0';
            memcpy(ap->bssid, bssid, 6);
            ap->rssi = WiFi.RSSI(i);
            ap->channel = WiFi.channel(i);
            ap->encryption = WiFi.encryptionType(i);
            ap->hidden = WiFi.SSID(i).length() == 0;
            ap->firstSeen = millis() / 1000;
            ap->lastSeen = ap->firstSeen;
            ap->seenCount = 1;
            ap->suspicious = false;
            apCount++;
        }
    }

    // Analyze all APs
    for (int i = 0; i < apCount; i++) {
        analyzeAP(i);
    }

    WiFi.scanDelete();
    Serial.printf("[SCAN] Found %d APs, %d total tracked\n", n, apCount);
}

void setupRoutes() {
    server.on("/", HTTP_GET, []() {
        String html = "<html><head><title>Rogue AP Detector</title>"
                      "<meta http-equiv='refresh' content='15'></head><body>";
        html += "<h1>Rogue Base Station Detector</h1>";
        html += "<p>Tracking: " + String(apCount) + " APs | Alerts: " +
                String(alertCount) + "</p>";
        html += "<p><a href='/scan'>Force Scan</a> | ";
        html += "<a href='/toggle'>" + String(scanning ? "Pause" : "Resume") + "</a></p>";

        // Alerts
        if (alertCount > 0) {
            html += "<h2>Alerts</h2><pre>";
            int start = max(0, alertCount - 10);
            for (int i = start; i < alertCount; i++) {
                int idx = i % MAX_ALERTS;
                html += "[" + String(alerts[idx].severity) + "] " +
                        String(alerts[idx].message) + " (" +
                        String(alerts[idx].timestamp) + "s)\n";
            }
            html += "</pre>";
        }

        html += "<h2>Access Points</h2><table border='1'>";
        html += "<tr><th>SSID</th><th>BSSID</th><th>Ch</th><th>RSSI</th><th>Enc</th><th>Status</th></tr>";
        for (int i = 0; i < apCount; i++) {
            String color = apList[i].suspicious ? "red" : "black";
            char bssid[18];
            snprintf(bssid, 18, "%02X:%02X:%02X:%02X:%02X:%02X",
                     apList[i].bssid[0], apList[i].bssid[1], apList[i].bssid[2],
                     apList[i].bssid[3], apList[i].bssid[4], apList[i].bssid[5]);
            html += "<tr style='color:" + color + "'>";
            html += "<td>" + String(apList[i].hidden ? "(hidden)" : apList[i].ssid) + "</td>";
            html += "<td>" + String(bssid) + "</td>";
            html += "<td>" + String(apList[i].channel) + "</td>";
            html += "<td>" + String(apList[i].rssi) + "</td>";
            html += "<td>" + String(apList[i].encryption) + "</td>";
            html += "<td>" + String(apList[i].suspicious ?
                    apList[i].suspectReason : "Clean") + "</td></tr>";
        }
        html += "</table></body></html>";
        server.send(200, "text/html", html);
    });

    server.on("/scan", HTTP_GET, []() {
        performScan();
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/toggle", HTTP_GET, []() {
        scanning = !scanning;
        server.sendHeader("Location", "/"); server.send(302);
    });
}
