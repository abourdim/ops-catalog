/*
 * Cable Tap Detector - ESP32 Firmware
 * Detects unauthorized cable taps on network cables using
 * Time Domain Reflectometry (TDR) and impedance anomaly detection.
 * FOR AUTHORIZED SECURITY TESTING ONLY.
 */

#include <WiFi.h>
#include <WebServer.h>
#include <driver/adc.h>

#define STATUS_LED   2
#define PULSE_PIN    25   // TDR pulse output
#define REFLECT_PIN  36   // Reflection measurement ADC
#define CABLE_GND    26   // Cable ground reference
#define NUM_SAMPLES  512
#define MAX_SCANS    32

struct TDRScan {
    uint16_t reflections[NUM_SAMPLES];
    float impedance[NUM_SAMPLES / 4];
    float cableLength;
    int anomalyCount;
    float anomalyPositions[8];
    uint32_t timestamp;
};

TDRScan scans[MAX_SCANS];
int scanCount = 0;
float baselineImpedance = 100.0;  // Expected cable impedance (ohms)
float velocityFactor = 0.66;       // Cat5e velocity factor
bool continuousScan = false;

WebServer server(80);

const char* AP_SSID = "CableTap-Detect";
const char* AP_PASS = "research2024";

void setup() {
    Serial.begin(115200);
    Serial.println("[TDR] Cable Tap Detector Starting");
    pinMode(STATUS_LED, OUTPUT);
    pinMode(PULSE_PIN, OUTPUT);
    pinMode(CABLE_GND, OUTPUT);
    digitalWrite(PULSE_PIN, LOW);
    digitalWrite(CABLE_GND, LOW);

    analogReadResolution(12);
    analogSetAttenuation(ADC_11db);

    WiFi.softAP(AP_SSID, AP_PASS);
    Serial.printf("[NET] Control: %s\n", WiFi.softAPIP().toString().c_str());

    setupRoutes();
    server.begin();
    blinkLED(3, 150);
}

void loop() {
    server.handleClient();

    if (continuousScan) {
        performTDRScan();
        delay(2000);
    }
}

void blinkLED(int n, int ms) {
    for (int i = 0; i < n; i++) {
        digitalWrite(STATUS_LED, HIGH); delay(ms);
        digitalWrite(STATUS_LED, LOW); delay(ms);
    }
}

void sendTDRPulse() {
    // Generate fast rising edge for TDR
    digitalWrite(PULSE_PIN, HIGH);
    delayMicroseconds(1);
    digitalWrite(PULSE_PIN, LOW);
}

void captureReflections(uint16_t* buf, int count) {
    sendTDRPulse();
    for (int i = 0; i < count; i++) {
        buf[i] = analogRead(REFLECT_PIN);
        delayMicroseconds(2);
    }
}

float sampleToDistance(int sampleIdx) {
    // Convert sample index to cable distance (meters)
    float time_us = sampleIdx * 2.0;  // 2 us per sample
    float distance = time_us * 1e-6 * 3e8 * velocityFactor / 2.0;
    return distance;
}

float estimateImpedance(uint16_t reflection, uint16_t reference) {
    float rho = ((float)reflection - reference) / (reference + 1);
    return baselineImpedance * (1 + rho) / (1 - rho + 0.001);
}

void performTDRScan() {
    int idx = scanCount % MAX_SCANS;
    TDRScan* scan = &scans[idx];
    scan->timestamp = millis();
    scan->anomalyCount = 0;

    // Multiple averages for noise reduction
    uint32_t accumulated[NUM_SAMPLES] = {0};
    for (int avg = 0; avg < 16; avg++) {
        captureReflections(scan->reflections, NUM_SAMPLES);
        for (int i = 0; i < NUM_SAMPLES; i++) {
            accumulated[i] += scan->reflections[i];
        }
        delay(1);
    }
    for (int i = 0; i < NUM_SAMPLES; i++) {
        scan->reflections[i] = accumulated[i] / 16;
    }

    // Calculate impedance profile
    uint16_t ref = scan->reflections[0];
    for (int i = 0; i < NUM_SAMPLES / 4; i++) {
        int sampleGroup = i * 4;
        uint16_t avg = (scan->reflections[sampleGroup] + scan->reflections[sampleGroup + 1] +
                       scan->reflections[sampleGroup + 2] + scan->reflections[sampleGroup + 3]) / 4;
        scan->impedance[i] = estimateImpedance(avg, ref);
    }

    // Detect anomalies (impedance deviations > 20%)
    for (int i = 2; i < NUM_SAMPLES / 4 - 2; i++) {
        float dev = abs(scan->impedance[i] - baselineImpedance) / baselineImpedance;
        if (dev > 0.20 && scan->anomalyCount < 8) {
            scan->anomalyPositions[scan->anomalyCount] = sampleToDistance(i * 4);
            scan->anomalyCount++;
        }
    }

    // Estimate cable length (find open/short end)
    scan->cableLength = 0;
    for (int i = NUM_SAMPLES / 4 - 1; i > 0; i--) {
        if (abs(scan->impedance[i] - baselineImpedance) > baselineImpedance * 0.5) {
            scan->cableLength = sampleToDistance(i * 4);
            break;
        }
    }

    scanCount++;
    Serial.printf("[TDR] Scan %d: length=%.1fm anomalies=%d\n",
                  scanCount, scan->cableLength, scan->anomalyCount);
    if (scan->anomalyCount > 0) blinkLED(scan->anomalyCount, 200);
}

void setupRoutes() {
    server.on("/", HTTP_GET, []() {
        String html = "<html><head><title>Cable Tap Detector</title></head><body>";
        html += "<h1>Cable Tap Detector (TDR)</h1>";
        html += "<p>Scans: " + String(scanCount) + " | Baseline Z: " +
                String(baselineImpedance, 0) + " ohms</p>";
        html += "<p><a href='/scan'>Single Scan</a> | ";
        html += "<a href='/continuous'>" + String(continuousScan ? "Stop" : "Start") +
                " Continuous</a></p>";
        if (scanCount > 0) {
            int idx = (scanCount - 1) % MAX_SCANS;
            TDRScan* s = &scans[idx];
            html += "<h2>Latest Scan</h2>";
            html += "<p>Cable length: " + String(s->cableLength, 1) + " m</p>";
            String color = s->anomalyCount > 0 ? "red" : "green";
            html += "<p style='color:" + color + "'>Anomalies: " +
                    String(s->anomalyCount) + "</p>";
            if (s->anomalyCount > 0) {
                html += "<h3>Anomaly Positions</h3><ul>";
                for (int i = 0; i < s->anomalyCount; i++) {
                    html += "<li>" + String(s->anomalyPositions[i], 1) + " m from source</li>";
                }
                html += "</ul>";
            }
            html += "<p><a href='/impedance'>Impedance Profile</a> | ";
            html += "<a href='/raw'>Raw TDR Data</a></p>";
        }
        html += "</body></html>";
        server.send(200, "text/html", html);
    });

    server.on("/scan", HTTP_GET, []() {
        performTDRScan();
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/continuous", HTTP_GET, []() {
        continuousScan = !continuousScan;
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/impedance", HTTP_GET, []() {
        if (scanCount == 0) { server.send(200, "text/plain", "No data"); return; }
        int idx = (scanCount - 1) % MAX_SCANS;
        String csv = "distance_m,impedance_ohm\n";
        for (int i = 0; i < NUM_SAMPLES / 4; i++) {
            csv += String(sampleToDistance(i * 4), 2) + "," +
                   String(scans[idx].impedance[i], 1) + "\n";
        }
        server.send(200, "text/csv", csv);
    });

    server.on("/raw", HTTP_GET, []() {
        if (scanCount == 0) { server.send(200, "text/plain", "No data"); return; }
        int idx = (scanCount - 1) % MAX_SCANS;
        String csv = "sample,value\n";
        for (int i = 0; i < NUM_SAMPLES; i++) {
            csv += String(i) + "," + String(scans[idx].reflections[i]) + "\n";
        }
        server.send(200, "text/csv", csv);
    });
}
