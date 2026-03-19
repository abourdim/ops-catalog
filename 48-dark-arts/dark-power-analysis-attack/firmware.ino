/*
 * Power Analysis Attack - ESP32 Firmware
 * Side-channel power analysis tool for cryptographic security testing.
 * Measures power consumption variations during crypto operations
 * to detect timing and power leakage vulnerabilities.
 * FOR AUTHORIZED SECURITY TESTING ONLY.
 */

#include <WiFi.h>
#include <WebServer.h>
#include <driver/adc.h>

#define STATUS_LED   2
#define POWER_PIN    36   // ADC1_CH0 - power measurement shunt resistor
#define TRIGGER_PIN  4    // Trigger input from target device
#define CLOCK_PIN    25   // Clock output for synchronization
#define NUM_SAMPLES  4096
#define SAMPLE_RATE  100000  // Target: 100 kSPS

struct PowerTrace {
    uint16_t samples[NUM_SAMPLES];
    uint32_t timestamp;
    uint16_t minVal;
    uint16_t maxVal;
    float mean;
    float stddev;
};

PowerTrace traces[8];
int traceCount = 0;
int currentTrace = 0;
volatile bool capturing = false;
volatile int sampleIndex = 0;

WebServer server(80);
hw_timer_t* sampleTimer = NULL;

const char* AP_SSID = "PowerAnalysis-Lab";
const char* AP_PASS = "research2024";

void IRAM_ATTR onSampleTimer() {
    if (!capturing || sampleIndex >= NUM_SAMPLES) {
        capturing = false;
        return;
    }
    traces[currentTrace].samples[sampleIndex++] = analogRead(POWER_PIN);
}

void IRAM_ATTR onTrigger() {
    if (!capturing) {
        sampleIndex = 0;
        capturing = true;
    }
}

void setup() {
    Serial.begin(115200);
    Serial.println("[POWER] Side-Channel Power Analysis Tool");
    pinMode(STATUS_LED, OUTPUT);
    pinMode(TRIGGER_PIN, INPUT_PULLDOWN);
    pinMode(CLOCK_PIN, OUTPUT);

    analogReadResolution(12);
    analogSetAttenuation(ADC_11db);
    adc1_config_width(ADC_WIDTH_BIT_12);
    adc1_config_channel_atten(ADC1_CHANNEL_0, ADC_ATTEN_DB_11);

    attachInterrupt(digitalPinToInterrupt(TRIGGER_PIN), onTrigger, RISING);

    // Configure sampling timer
    sampleTimer = timerBegin(0, 80, true);  // 1 MHz base
    timerAttachInterrupt(sampleTimer, &onSampleTimer, true);
    timerAlarmWrite(sampleTimer, 1000000 / SAMPLE_RATE, true);  // 100 kHz
    timerAlarmEnable(sampleTimer);

    WiFi.softAP(AP_SSID, AP_PASS);
    Serial.printf("[NET] Control: %s\n", WiFi.softAPIP().toString().c_str());

    setupRoutes();
    server.begin();
    blinkLED(3, 150);
}

void loop() {
    server.handleClient();

    // Generate sync clock
    static unsigned long lastClock = 0;
    if (micros() - lastClock > 50) {
        lastClock = micros();
        digitalWrite(CLOCK_PIN, !digitalRead(CLOCK_PIN));
    }

    // Check for completed capture
    if (!capturing && sampleIndex >= NUM_SAMPLES) {
        analyzeTrace(&traces[currentTrace]);
        Serial.printf("[CAPTURE] Trace %d complete: mean=%.1f std=%.1f\n",
                      currentTrace, traces[currentTrace].mean, traces[currentTrace].stddev);
        if (traceCount < 8) traceCount++;
        currentTrace = (currentTrace + 1) % 8;
        sampleIndex = 0;
        blinkLED(1, 50);
    }
}

void blinkLED(int n, int ms) {
    for (int i = 0; i < n; i++) {
        digitalWrite(STATUS_LED, HIGH); delay(ms);
        digitalWrite(STATUS_LED, LOW); delay(ms);
    }
}

void analyzeTrace(PowerTrace* trace) {
    trace->timestamp = millis();
    trace->minVal = 4095;
    trace->maxVal = 0;
    float sum = 0, sumSq = 0;
    for (int i = 0; i < NUM_SAMPLES; i++) {
        uint16_t v = trace->samples[i];
        if (v < trace->minVal) trace->minVal = v;
        if (v > trace->maxVal) trace->maxVal = v;
        sum += v;
        sumSq += (float)v * v;
    }
    trace->mean = sum / NUM_SAMPLES;
    trace->stddev = sqrt(sumSq / NUM_SAMPLES - trace->mean * trace->mean);
}

float correlateTraces(PowerTrace* a, PowerTrace* b) {
    float meanA = a->mean, meanB = b->mean;
    float num = 0, denA = 0, denB = 0;
    for (int i = 0; i < NUM_SAMPLES; i++) {
        float da = a->samples[i] - meanA;
        float db = b->samples[i] - meanB;
        num += da * db;
        denA += da * da;
        denB += db * db;
    }
    return num / (sqrt(denA) * sqrt(denB) + 1e-10);
}

void setupRoutes() {
    server.on("/", HTTP_GET, []() {
        String html = "<html><head><title>Power Analysis Lab</title></head><body>";
        html += "<h1>Side-Channel Power Analysis</h1>";
        html += "<p>Traces captured: " + String(traceCount) + "/8</p>";
        html += "<p>Sampling: " + String(SAMPLE_RATE / 1000) + " kSPS, " +
                String(NUM_SAMPLES) + " samples/trace</p>";
        html += "<p><a href='/capture'>Manual Capture</a> | <a href='/analyze'>Analyze</a></p>";
        html += "<h2>Traces</h2><table border='1'>";
        html += "<tr><th>#</th><th>Time</th><th>Min</th><th>Max</th><th>Mean</th><th>StdDev</th><th>View</th></tr>";
        for (int i = 0; i < traceCount; i++) {
            html += "<tr><td>" + String(i) + "</td>";
            html += "<td>" + String(traces[i].timestamp / 1000) + "s</td>";
            html += "<td>" + String(traces[i].minVal) + "</td>";
            html += "<td>" + String(traces[i].maxVal) + "</td>";
            html += "<td>" + String(traces[i].mean, 1) + "</td>";
            html += "<td>" + String(traces[i].stddev, 1) + "</td>";
            html += "<td><a href='/trace?id=" + String(i) + "'>CSV</a></td></tr>";
        }
        html += "</table></body></html>";
        server.send(200, "text/html", html);
    });

    server.on("/capture", HTTP_GET, []() {
        sampleIndex = 0;
        capturing = true;
        server.send(200, "text/plain", "Capturing...");
    });

    server.on("/trace", HTTP_GET, []() {
        int id = server.arg("id").toInt();
        if (id < 0 || id >= traceCount) { server.send(404); return; }
        String csv = "sample,value\n";
        for (int i = 0; i < NUM_SAMPLES; i++) {
            csv += String(i) + "," + String(traces[id].samples[i]) + "\n";
        }
        server.send(200, "text/csv", csv);
    });

    server.on("/analyze", HTTP_GET, []() {
        if (traceCount < 2) { server.send(200, "text/plain", "Need 2+ traces"); return; }
        String result = "Correlation Matrix:\n";
        for (int i = 0; i < traceCount; i++) {
            for (int j = 0; j < traceCount; j++) {
                float c = correlateTraces(&traces[i], &traces[j]);
                char buf[12]; snprintf(buf, 12, "%+.3f ", c);
                result += buf;
            }
            result += "\n";
        }
        server.send(200, "text/plain", result);
    });
}
