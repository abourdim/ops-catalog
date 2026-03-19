/*
 * TEMPEST Spy - ESP32 Firmware
 * Monitors electromagnetic emanations from electronic equipment
 * to detect information leakage through unintentional RF emissions.
 * TEMPEST defense testing tool.
 * FOR AUTHORIZED SECURITY TESTING ONLY.
 */

#include <WiFi.h>
#include <WebServer.h>
#include <driver/adc.h>

#define STATUS_LED  2
#define RF_ADC_PIN  36    // Wideband RF detector input
#define TRIGGER_PIN 4     // Sync trigger
#define NUM_SAMPLES 2048
#define SCAN_BANDS  16

struct EmissionBand {
    float centerFreq;    // MHz (reference only, ADC measures envelope)
    float peakPower;
    float avgPower;
    float bandwidth;
    bool anomalous;
    uint32_t timestamp;
};

struct ScanResult {
    EmissionBand bands[SCAN_BANDS];
    int bandCount;
    float noiseFloor;
    uint32_t scanTime;
};

uint16_t sampleBuffer[NUM_SAMPLES];
ScanResult lastScan;
int scanCount = 0;
float baselineNoise = 0;
bool monitorMode = false;

WebServer server(80);

const char* AP_SSID = "TEMPEST-Lab";
const char* AP_PASS = "research2024";

void setup() {
    Serial.begin(115200);
    Serial.println("[TEMPEST] EM Emanation Monitor Starting");
    pinMode(STATUS_LED, OUTPUT);
    pinMode(TRIGGER_PIN, INPUT_PULLDOWN);

    analogReadResolution(12);
    analogSetAttenuation(ADC_11db);

    WiFi.softAP(AP_SSID, AP_PASS);
    Serial.printf("[NET] Control: %s\n", WiFi.softAPIP().toString().c_str());

    setupRoutes();
    server.begin();

    // Calibrate noise floor
    calibrateBaseline();
    blinkLED(3, 150);
}

void loop() {
    server.handleClient();

    if (monitorMode) {
        performScan();
        checkAnomalies();
        delay(500);
    }
}

void blinkLED(int n, int ms) {
    for (int i = 0; i < n; i++) {
        digitalWrite(STATUS_LED, HIGH); delay(ms);
        digitalWrite(STATUS_LED, LOW); delay(ms);
    }
}

void calibrateBaseline() {
    Serial.println("[CAL] Calibrating noise floor...");
    float sum = 0;
    for (int i = 0; i < 1000; i++) {
        sum += analogRead(RF_ADC_PIN);
        delayMicroseconds(100);
    }
    baselineNoise = sum / 1000.0;
    Serial.printf("[CAL] Baseline: %.1f ADC counts\n", baselineNoise);
}

void captureFast(uint16_t* buf, int count) {
    for (int i = 0; i < count; i++) {
        buf[i] = analogRead(RF_ADC_PIN);
        delayMicroseconds(10);  // ~100 kHz sampling
    }
}

float computeRMS(uint16_t* buf, int count) {
    float sumSq = 0;
    for (int i = 0; i < count; i++) {
        float v = buf[i] - baselineNoise;
        sumSq += v * v;
    }
    return sqrt(sumSq / count);
}

float computePeak(uint16_t* buf, int count) {
    float peak = 0;
    for (int i = 0; i < count; i++) {
        float v = abs((float)buf[i] - baselineNoise);
        if (v > peak) peak = v;
    }
    return peak;
}

void performScan() {
    lastScan.scanTime = millis();
    lastScan.noiseFloor = baselineNoise;
    lastScan.bandCount = 0;

    // Capture multiple segments for spectral analysis
    for (int band = 0; band < SCAN_BANDS && lastScan.bandCount < SCAN_BANDS; band++) {
        captureFast(sampleBuffer, NUM_SAMPLES);

        EmissionBand* eb = &lastScan.bands[lastScan.bandCount];
        eb->centerFreq = 50.0 + band * 100.0;  // Notional frequency labels
        eb->peakPower = computePeak(sampleBuffer, NUM_SAMPLES);
        eb->avgPower = computeRMS(sampleBuffer, NUM_SAMPLES);
        eb->timestamp = millis();

        // Estimate bandwidth from autocorrelation
        float autoCorr = 0, totalPower = 0;
        for (int i = 0; i < NUM_SAMPLES - 1; i++) {
            float v1 = sampleBuffer[i] - baselineNoise;
            float v2 = sampleBuffer[i + 1] - baselineNoise;
            autoCorr += v1 * v2;
            totalPower += v1 * v1;
        }
        eb->bandwidth = (totalPower > 0) ? (1.0 - autoCorr / totalPower) * 50.0 : 0;
        eb->anomalous = (eb->peakPower > baselineNoise * 3.0);

        lastScan.bandCount++;
    }
    scanCount++;
}

void checkAnomalies() {
    for (int i = 0; i < lastScan.bandCount; i++) {
        if (lastScan.bands[i].anomalous) {
            Serial.printf("[ALERT] Emission at band %d: peak=%.1f avg=%.1f\n",
                          i, lastScan.bands[i].peakPower, lastScan.bands[i].avgPower);
            blinkLED(1, 50);
        }
    }
}

void setupRoutes() {
    server.on("/", HTTP_GET, []() {
        String html = "<html><head><title>TEMPEST Monitor</title>"
                      "<meta http-equiv='refresh' content='3'></head><body>";
        html += "<h1>TEMPEST EM Emanation Monitor</h1>";
        html += "<p>Scans: " + String(scanCount) + " | Baseline: " +
                String(baselineNoise, 1) + "</p>";
        html += "<p><a href='/start'>Start Monitor</a> | <a href='/stop'>Stop</a> | ";
        html += "<a href='/calibrate'>Recalibrate</a></p>";
        html += "<h2>Emission Bands</h2><table border='1'>";
        html += "<tr><th>Band</th><th>Freq(ref)</th><th>Peak</th><th>Avg</th><th>BW</th><th>Status</th></tr>";
        for (int i = 0; i < lastScan.bandCount; i++) {
            EmissionBand* b = &lastScan.bands[i];
            String color = b->anomalous ? "red" : "green";
            html += "<tr style='color:" + color + "'>";
            html += "<td>" + String(i) + "</td>";
            html += "<td>" + String(b->centerFreq, 0) + " MHz</td>";
            html += "<td>" + String(b->peakPower, 1) + "</td>";
            html += "<td>" + String(b->avgPower, 1) + "</td>";
            html += "<td>" + String(b->bandwidth, 1) + " kHz</td>";
            html += "<td>" + String(b->anomalous ? "LEAKING" : "Clean") + "</td></tr>";
        }
        html += "</table></body></html>";
        server.send(200, "text/html", html);
    });

    server.on("/start", HTTP_GET, []() {
        monitorMode = true;
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/stop", HTTP_GET, []() {
        monitorMode = false;
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/calibrate", HTTP_GET, []() {
        calibrateBaseline();
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/raw", HTTP_GET, []() {
        captureFast(sampleBuffer, NUM_SAMPLES);
        String csv = "index,value\n";
        for (int i = 0; i < NUM_SAMPLES; i++) {
            csv += String(i) + "," + String(sampleBuffer[i]) + "\n";
        }
        server.send(200, "text/csv", csv);
    });
}
