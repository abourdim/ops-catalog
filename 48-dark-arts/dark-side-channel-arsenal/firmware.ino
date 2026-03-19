/*
 * Side Channel Arsenal - ESP32 Firmware
 * Multi-vector side-channel analysis platform combining timing,
 * power, and electromagnetic analysis for cryptographic testing.
 * FOR AUTHORIZED SECURITY TESTING ONLY.
 */

#include <WiFi.h>
#include <WebServer.h>
#include <driver/adc.h>

#define STATUS_LED   2
#define POWER_ADC    36   // Power measurement channel
#define EM_ADC       39   // EM probe channel
#define TRIGGER_IN   4    // Trigger from target
#define CLOCK_OUT    25   // Sync clock output
#define NUM_SAMPLES  2048
#define MAX_TRACES   16

struct SideChannelTrace {
    uint16_t power[NUM_SAMPLES];
    uint16_t em[NUM_SAMPLES];
    uint32_t timingUs;
    uint32_t timestamp;
    uint8_t keyGuess;
    float correlation;
};

SideChannelTrace traces[MAX_TRACES];
int traceCount = 0;
volatile bool capturing = false;
volatile int captureIdx = 0;
uint8_t bestKeyGuess[16] = {0};

WebServer server(80);

const char* AP_SSID = "SideChannel-Lab";
const char* AP_PASS = "research2024";

void IRAM_ATTR onTrigger() {
    if (!capturing) {
        captureIdx = 0;
        capturing = true;
    }
}

void setup() {
    Serial.begin(115200);
    Serial.println("[SCA] Side-Channel Arsenal Starting");
    pinMode(STATUS_LED, OUTPUT);
    pinMode(TRIGGER_IN, INPUT_PULLDOWN);
    pinMode(CLOCK_OUT, OUTPUT);

    analogReadResolution(12);
    adc1_config_width(ADC_WIDTH_BIT_12);
    adc1_config_channel_atten(ADC1_CHANNEL_0, ADC_ATTEN_DB_11);

    attachInterrupt(digitalPinToInterrupt(TRIGGER_IN), onTrigger, RISING);

    WiFi.softAP(AP_SSID, AP_PASS);
    Serial.printf("[NET] Control: %s\n", WiFi.softAPIP().toString().c_str());

    setupRoutes();
    server.begin();
    blinkLED(3, 150);
}

void loop() {
    server.handleClient();

    // Generate sync clock ~10 kHz
    static unsigned long lastClk = 0;
    if (micros() - lastClk >= 50) {
        lastClk = micros();
        digitalWrite(CLOCK_OUT, !digitalRead(CLOCK_OUT));
    }

    if (capturing) {
        dualCapture();
    }
}

void blinkLED(int n, int ms) {
    for (int i = 0; i < n; i++) {
        digitalWrite(STATUS_LED, HIGH); delay(ms);
        digitalWrite(STATUS_LED, LOW); delay(ms);
    }
}

void dualCapture() {
    int idx = traceCount % MAX_TRACES;
    uint32_t startUs = micros();

    for (int i = 0; i < NUM_SAMPLES; i++) {
        traces[idx].power[i] = analogRead(POWER_ADC);
        traces[idx].em[i] = analogRead(EM_ADC);
        delayMicroseconds(5);
    }

    traces[idx].timingUs = micros() - startUs;
    traces[idx].timestamp = millis();
    capturing = false;

    traceCount = min(traceCount + 1, MAX_TRACES);
    Serial.printf("[CAPTURE] Trace %d: %u us\n", idx, traces[idx].timingUs);
    blinkLED(1, 50);
}

float pearsonCorrelation(uint16_t* a, uint16_t* b, int n) {
    float sumA = 0, sumB = 0, sumAB = 0, sumA2 = 0, sumB2 = 0;
    for (int i = 0; i < n; i++) {
        sumA += a[i]; sumB += b[i];
        sumAB += (float)a[i] * b[i];
        sumA2 += (float)a[i] * a[i];
        sumB2 += (float)b[i] * b[i];
    }
    float num = n * sumAB - sumA * sumB;
    float den = sqrt((n * sumA2 - sumA * sumA) * (n * sumB2 - sumB * sumB));
    return (den > 0) ? num / den : 0;
}

void timingAnalysis() {
    if (traceCount < 2) return;
    Serial.println("[TIMING] Analyzing timing variations...");
    float sumTime = 0, minTime = 1e9, maxTime = 0;
    for (int i = 0; i < traceCount; i++) {
        float t = traces[i].timingUs;
        sumTime += t;
        if (t < minTime) minTime = t;
        if (t > maxTime) maxTime = t;
    }
    Serial.printf("[TIMING] Avg: %.0f us, Range: %.0f-%.0f us, Jitter: %.0f us\n",
                  sumTime / traceCount, minTime, maxTime, maxTime - minTime);
}

void cpaAttack(int bytePosition) {
    if (traceCount < 4) return;
    Serial.printf("[CPA] Correlation Power Analysis on byte %d\n", bytePosition);
    float bestCorr = 0;
    uint8_t bestGuess = 0;
    // Simplified CPA: try each key byte hypothesis
    for (int guess = 0; guess < 256; guess++) {
        uint16_t hypothetical[NUM_SAMPLES];
        for (int s = 0; s < NUM_SAMPLES; s++) {
            // Hamming weight model of SBox output
            uint8_t sboxOut = guess ^ (s & 0xFF);  // Simplified
            int hw = 0;
            for (int b = 0; b < 8; b++) hw += (sboxOut >> b) & 1;
            hypothetical[s] = hw * 512;
        }
        float corr = abs(pearsonCorrelation(traces[0].power, hypothetical, NUM_SAMPLES));
        if (corr > bestCorr) {
            bestCorr = corr;
            bestGuess = guess;
        }
    }
    bestKeyGuess[bytePosition] = bestGuess;
    Serial.printf("[CPA] Best guess: 0x%02X (corr=%.4f)\n", bestGuess, bestCorr);
}

void setupRoutes() {
    server.on("/", HTTP_GET, []() {
        String html = "<html><head><title>Side-Channel Arsenal</title></head><body>";
        html += "<h1>Side-Channel Analysis Platform</h1>";
        html += "<p>Traces: " + String(traceCount) + "/" + String(MAX_TRACES) + "</p>";
        html += "<h2>Controls</h2>";
        html += "<p><a href='/capture'>Manual Capture</a> | ";
        html += "<a href='/timing'>Timing Analysis</a> | ";
        html += "<a href='/cpa'>CPA Attack</a></p>";
        html += "<h2>Traces</h2><table border='1'>";
        html += "<tr><th>#</th><th>Time(us)</th><th>Power-EM Corr</th></tr>";
        for (int i = 0; i < traceCount; i++) {
            float c = pearsonCorrelation(traces[i].power, traces[i].em, NUM_SAMPLES);
            html += "<tr><td>" + String(i) + "</td><td>" + String(traces[i].timingUs) +
                    "</td><td>" + String(c, 4) + "</td></tr>";
        }
        html += "</table>";
        html += "<h2>Key Recovery</h2><pre>";
        for (int i = 0; i < 16; i++) {
            char hex[4]; snprintf(hex, 4, "%02X ", bestKeyGuess[i]); html += hex;
        }
        html += "</pre></body></html>";
        server.send(200, "text/html", html);
    });

    server.on("/capture", HTTP_GET, []() {
        captureIdx = 0; capturing = true;
        server.send(200, "text/plain", "Capturing...");
    });

    server.on("/timing", HTTP_GET, []() {
        timingAnalysis();
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/cpa", HTTP_GET, []() {
        for (int b = 0; b < 16; b++) cpaAttack(b);
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/trace", HTTP_GET, []() {
        int id = server.arg("id").toInt();
        if (id < 0 || id >= traceCount) { server.send(404); return; }
        String csv = "idx,power,em\n";
        for (int i = 0; i < NUM_SAMPLES; i++) {
            csv += String(i) + "," + String(traces[id].power[i]) + "," +
                   String(traces[id].em[i]) + "\n";
        }
        server.send(200, "text/csv", csv);
    });
}
