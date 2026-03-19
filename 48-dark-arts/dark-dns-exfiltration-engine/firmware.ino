/*
 * DNS Exfiltration Engine - ESP32 Firmware
 * Demonstrates DNS tunneling detection by running a DNS server that
 * logs and analyzes encoded subdomain queries for data exfil patterns.
 * FOR AUTHORIZED SECURITY TESTING ONLY.
 */

#include <WiFi.h>
#include <WiFiUdp.h>
#include <WebServer.h>

#define STATUS_LED 2
#define DNS_PORT 53
#define MAX_QUERIES 128
#define MAX_DOMAIN_LEN 253

struct DNSQuery {
    char domain[MAX_DOMAIN_LEN + 1];
    IPAddress clientIP;
    uint16_t queryType;
    uint32_t timestamp;
    float entropy;
    bool suspicious;
};

WiFiUDP udp;
WebServer server(80);
DNSQuery queryLog[MAX_QUERIES];
int queryCount = 0;
uint32_t totalQueries = 0;
uint32_t suspiciousCount = 0;

const char* AP_SSID = "DNS-Audit-Lab";
const char* AP_PASS = "research2024";

void setup() {
    Serial.begin(115200);
    Serial.println("[DNS-EXFIL] DNS Exfiltration Detection Engine");
    pinMode(STATUS_LED, OUTPUT);

    WiFi.softAP(AP_SSID, AP_PASS);
    Serial.printf("[NET] AP: %s @ %s\n", AP_SSID, WiFi.softAPIP().toString().c_str());

    udp.begin(DNS_PORT);
    Serial.printf("[DNS] Listening on UDP port %d\n", DNS_PORT);

    setupRoutes();
    server.begin();
    blinkLED(3, 150);
}

void loop() {
    server.handleClient();
    handleDNS();
}

void blinkLED(int n, int ms) {
    for (int i = 0; i < n; i++) {
        digitalWrite(STATUS_LED, HIGH); delay(ms);
        digitalWrite(STATUS_LED, LOW); delay(ms);
    }
}

float calculateEntropy(const char* str) {
    int len = strlen(str);
    if (len == 0) return 0;
    int freq[256] = {0};
    for (int i = 0; i < len; i++) freq[(uint8_t)str[i]]++;
    float entropy = 0;
    for (int i = 0; i < 256; i++) {
        if (freq[i] > 0) {
            float p = (float)freq[i] / len;
            entropy -= p * log2(p);
        }
    }
    return entropy;
}

bool isBase64Like(const char* str) {
    int len = strlen(str);
    int b64chars = 0;
    for (int i = 0; i < len; i++) {
        char c = str[i];
        if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') ||
            (c >= '0' && c <= '9') || c == '+' || c == '/' || c == '=') {
            b64chars++;
        }
    }
    return (float)b64chars / len > 0.9 && len > 20;
}

bool isHexEncoded(const char* str) {
    int len = strlen(str);
    int hexchars = 0;
    for (int i = 0; i < len; i++) {
        char c = str[i];
        if ((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F')) {
            hexchars++;
        }
    }
    return (float)hexchars / len > 0.95 && len > 16;
}

bool detectExfiltration(const char* domain, float entropy) {
    // High entropy in subdomain suggests encoded data
    if (entropy > 4.0) return true;
    // Very long subdomain labels
    int maxLabel = 0, currentLabel = 0;
    for (int i = 0; domain[i]; i++) {
        if (domain[i] == '.') { currentLabel = 0; }
        else { currentLabel++; maxLabel = max(maxLabel, currentLabel); }
    }
    if (maxLabel > 40) return true;
    // Base64 or hex encoded patterns
    if (isBase64Like(domain) || isHexEncoded(domain)) return true;
    return false;
}

void handleDNS() {
    int packetSize = udp.parsePacket();
    if (packetSize == 0) return;

    uint8_t buffer[512];
    int len = udp.read(buffer, sizeof(buffer));
    if (len < 12) return;

    // Parse DNS header
    uint16_t txnId = (buffer[0] << 8) | buffer[1];
    uint16_t qdCount = (buffer[4] << 8) | buffer[5];
    if (qdCount == 0) return;

    // Parse question name
    char domain[MAX_DOMAIN_LEN + 1] = {0};
    int pos = 12, dpos = 0;
    while (pos < len && buffer[pos] != 0) {
        int labelLen = buffer[pos++];
        if (dpos > 0 && dpos < MAX_DOMAIN_LEN) domain[dpos++] = '.';
        for (int i = 0; i < labelLen && pos < len && dpos < MAX_DOMAIN_LEN; i++) {
            domain[dpos++] = buffer[pos++];
        }
    }
    domain[dpos] = '\0';
    pos++;
    uint16_t qtype = (pos + 1 < len) ? (buffer[pos] << 8) | buffer[pos + 1] : 0;

    totalQueries++;
    float ent = calculateEntropy(domain);
    bool sus = detectExfiltration(domain, ent);
    if (sus) suspiciousCount++;

    // Log query
    int idx = queryCount % MAX_QUERIES;
    strncpy(queryLog[idx].domain, domain, MAX_DOMAIN_LEN);
    queryLog[idx].clientIP = udp.remoteIP();
    queryLog[idx].queryType = qtype;
    queryLog[idx].timestamp = millis() / 1000;
    queryLog[idx].entropy = ent;
    queryLog[idx].suspicious = sus;
    queryCount++;

    Serial.printf("[DNS] %s -> '%s' type=%u ent=%.2f %s\n",
                  udp.remoteIP().toString().c_str(), domain, qtype, ent,
                  sus ? "SUSPICIOUS" : "ok");

    // Send minimal response (NXDOMAIN)
    buffer[2] = 0x81; buffer[3] = 0x83;  // Response, NXDOMAIN
    buffer[6] = buffer[7] = 0;
    buffer[8] = buffer[9] = 0;
    buffer[10] = buffer[11] = 0;
    udp.beginPacket(udp.remoteIP(), udp.remotePort());
    udp.write(buffer, len);
    udp.endPacket();
}

void setupRoutes() {
    server.on("/", HTTP_GET, []() {
        String html = "<html><head><title>DNS Exfil Monitor</title></head><body>";
        html += "<h1>DNS Exfiltration Monitor</h1>";
        html += "<p>Total: " + String(totalQueries) + " | Suspicious: " +
                String(suspiciousCount) + "</p>";
        html += "<h2>Recent Queries</h2><pre>";
        int start = max(0, queryCount - 30);
        int end = min(queryCount, (int)MAX_QUERIES);
        for (int i = start; i < queryCount && i < start + MAX_QUERIES; i++) {
            int idx = i % MAX_QUERIES;
            char line[300];
            snprintf(line, sizeof(line), "%s [%s] ent=%.2f type=%u %s\n  %s\n",
                     queryLog[idx].suspicious ? "!!" : "  ",
                     queryLog[idx].clientIP.toString().c_str(),
                     queryLog[idx].entropy, queryLog[idx].queryType,
                     queryLog[idx].suspicious ? "EXFIL?" : "",
                     queryLog[idx].domain);
            html += line;
        }
        html += "</pre></body></html>";
        server.send(200, "text/html", html);
    });

    server.on("/stats.json", HTTP_GET, []() {
        String json = "{\"total\":" + String(totalQueries) +
                      ",\"suspicious\":" + String(suspiciousCount) +
                      ",\"rate\":" + String((float)suspiciousCount / max(totalQueries, (uint32_t)1) * 100, 1) + "}";
        server.send(200, "application/json", json);
    });
}
