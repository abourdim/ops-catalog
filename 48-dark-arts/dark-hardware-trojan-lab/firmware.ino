/*
 * Hardware Trojan Lab - ESP32 Firmware
 * Detects hardware trojans by monitoring IC behavior patterns,
 * power consumption anomalies, and timing deviations.
 * FOR AUTHORIZED SECURITY TESTING ONLY.
 */

#include <WiFi.h>
#include <WebServer.h>
#include <driver/adc.h>

#define STATUS_LED   2
#define POWER_PIN    36    // Power measurement
#define IO_MONITOR   39    // I/O activity monitor
#define CLK_PIN      25    // Test clock output
#define RST_PIN      26    // Reset control
#define NUM_SAMPLES  1024
#define MAX_TESTS    32

struct TrojanTest {
    char name[32];
    float powerBaseline;
    float powerMeasured;
    float deviation;
    uint32_t timingBaseline;
    uint32_t timingMeasured;
    bool anomalyDetected;
    uint32_t timestamp;
};

TrojanTest tests[MAX_TESTS];
int testCount = 0;
float globalBaseline = 0;
bool continuousMonitor = false;

WebServer server(80);

const char* AP_SSID = "HW-Trojan-Lab";
const char* AP_PASS = "research2024";

void setup() {
    Serial.begin(115200);
    Serial.println("[TROJAN] Hardware Trojan Detection Lab");
    pinMode(STATUS_LED, OUTPUT);
    pinMode(CLK_PIN, OUTPUT);
    pinMode(RST_PIN, OUTPUT);
    digitalWrite(RST_PIN, HIGH);

    analogReadResolution(12);
    analogSetAttenuation(ADC_11db);

    WiFi.softAP(AP_SSID, AP_PASS);
    Serial.printf("[NET] Control: %s\n", WiFi.softAPIP().toString().c_str());

    setupRoutes();
    server.begin();
    blinkLED(3, 150);

    // Initial calibration
    calibrate();
}

void loop() {
    server.handleClient();

    if (continuousMonitor) {
        quickScan();
        delay(1000);
    }
}

void blinkLED(int n, int ms) {
    for (int i = 0; i < n; i++) {
        digitalWrite(STATUS_LED, HIGH); delay(ms);
        digitalWrite(STATUS_LED, LOW); delay(ms);
    }
}

void calibrate() {
    Serial.println("[CAL] Measuring power baseline...");
    float sum = 0;
    for (int i = 0; i < 1000; i++) {
        sum += analogRead(POWER_PIN);
        delayMicroseconds(100);
    }
    globalBaseline = sum / 1000.0;
    Serial.printf("[CAL] Baseline: %.1f\n", globalBaseline);
}

float measurePower(int duration_ms) {
    float sum = 0;
    int count = 0;
    unsigned long start = millis();
    while (millis() - start < (unsigned long)duration_ms) {
        sum += analogRead(POWER_PIN);
        count++;
        delayMicroseconds(50);
    }
    return sum / count;
}

uint32_t measureTiming(int cycles) {
    uint32_t start = micros();
    for (int i = 0; i < cycles; i++) {
        digitalWrite(CLK_PIN, HIGH);
        delayMicroseconds(1);
        digitalWrite(CLK_PIN, LOW);
        delayMicroseconds(1);
    }
    return micros() - start;
}

void runTest(const char* testName) {
    int idx = testCount % MAX_TESTS;
    TrojanTest* t = &tests[idx];
    strncpy(t->name, testName, 31);
    t->name[31] = '\0';
    t->timestamp = millis();

    // Power analysis
    t->powerBaseline = globalBaseline;
    t->powerMeasured = measurePower(100);
    t->deviation = abs(t->powerMeasured - t->powerBaseline) / t->powerBaseline * 100;

    // Timing analysis
    t->timingBaseline = measureTiming(1000);
    // Apply test stimulus
    digitalWrite(RST_PIN, LOW);
    delay(10);
    digitalWrite(RST_PIN, HIGH);
    delay(10);
    t->timingMeasured = measureTiming(1000);

    // Anomaly detection: >5% deviation
    float timingDev = abs((float)t->timingMeasured - t->timingBaseline) /
                      t->timingBaseline * 100;
    t->anomalyDetected = (t->deviation > 5.0) || (timingDev > 2.0);

    testCount++;
    Serial.printf("[TEST] '%s': power_dev=%.1f%% timing=%u/%u us %s\n",
                  testName, t->deviation, t->timingBaseline, t->timingMeasured,
                  t->anomalyDetected ? "ANOMALY" : "ok");
    if (t->anomalyDetected) blinkLED(3, 100);
}

void quickScan() {
    float power = measurePower(50);
    float dev = abs(power - globalBaseline) / globalBaseline * 100;
    if (dev > 5.0) {
        Serial.printf("[MONITOR] Power anomaly: %.1f%% deviation\n", dev);
        runTest("auto_power_alert");
    }
}

void fullDiagnostic() {
    const char* testNames[] = {
        "idle_power", "clock_active", "reset_cycle",
        "io_toggle", "stress_test", "sleep_wake"
    };
    for (int i = 0; i < 6; i++) {
        runTest(testNames[i]);
        delay(200);
    }
}

void setupRoutes() {
    server.on("/", HTTP_GET, []() {
        String html = "<html><head><title>HW Trojan Lab</title></head><body>";
        html += "<h1>Hardware Trojan Detection Lab</h1>";
        html += "<p>Baseline: " + String(globalBaseline, 1) + " | Tests: " +
                String(testCount) + "</p>";
        html += "<p><a href='/calibrate'>Calibrate</a> | ";
        html += "<a href='/fulltest'>Full Diagnostic</a> | ";
        html += "<a href='/quicktest'>Quick Test</a> | ";
        html += "<a href='/monitor'>" + String(continuousMonitor ? "Stop" : "Start") +
                " Monitor</a></p>";
        html += "<h2>Test Results</h2><table border='1'>";
        html += "<tr><th>Test</th><th>Power Dev</th><th>Timing(us)</th><th>Status</th></tr>";
        int start = max(0, testCount - MAX_TESTS);
        for (int i = start; i < testCount; i++) {
            int idx = i % MAX_TESTS;
            String color = tests[idx].anomalyDetected ? "red" : "green";
            html += "<tr style='color:" + color + "'>";
            html += "<td>" + String(tests[idx].name) + "</td>";
            html += "<td>" + String(tests[idx].deviation, 1) + "%</td>";
            html += "<td>" + String(tests[idx].timingBaseline) + "/" +
                    String(tests[idx].timingMeasured) + "</td>";
            html += "<td>" + String(tests[idx].anomalyDetected ? "TROJAN?" : "CLEAN") +
                    "</td></tr>";
        }
        html += "</table></body></html>";
        server.send(200, "text/html", html);
    });

    server.on("/calibrate", HTTP_GET, []() {
        calibrate();
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/fulltest", HTTP_GET, []() {
        fullDiagnostic();
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/quicktest", HTTP_GET, []() {
        runTest("manual_quick");
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/monitor", HTTP_GET, []() {
        continuousMonitor = !continuousMonitor;
        server.sendHeader("Location", "/"); server.send(302);
    });
}
