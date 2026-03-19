/*
 * Rubber Ducky Generator - ESP32 Firmware
 * USB HID keystroke injection tester for security auditing.
 * Generates and tests HID payloads to verify endpoint protection.
 * Uses ESP32-S2/S3 USB HID capabilities.
 * FOR AUTHORIZED SECURITY TESTING ONLY.
 */

#include <WiFi.h>
#include <WebServer.h>

// Note: USB HID requires ESP32-S2 or S3. This code provides
// the framework with serial output for testing on standard ESP32.
#define STATUS_LED   2
#define MAX_SCRIPTS  8
#define MAX_LINES    64
#define MAX_LINE_LEN 128

struct DuckyScript {
    char name[32];
    char lines[MAX_LINES][MAX_LINE_LEN];
    int lineCount;
    uint32_t created;
    int runCount;
};

DuckyScript scripts[MAX_SCRIPTS];
int scriptCount = 0;
bool executing = false;
int currentScript = -1;
int currentLine = 0;
int defaultDelay = 100;

WebServer server(80);

const char* AP_SSID = "Ducky-Lab";
const char* AP_PASS = "research2024";

void setup() {
    Serial.begin(115200);
    Serial.println("[DUCKY] Rubber Ducky Generator Starting");
    pinMode(STATUS_LED, OUTPUT);

    WiFi.softAP(AP_SSID, AP_PASS);
    Serial.printf("[NET] Control: %s\n", WiFi.softAPIP().toString().c_str());

    // Load default test scripts
    loadDefaultScripts();

    setupRoutes();
    server.begin();
    blinkLED(3, 150);
}

void loop() {
    server.handleClient();

    if (executing && currentScript >= 0) {
        executeNextLine();
    }
}

void blinkLED(int n, int ms) {
    for (int i = 0; i < n; i++) {
        digitalWrite(STATUS_LED, HIGH); delay(ms);
        digitalWrite(STATUS_LED, LOW); delay(ms);
    }
}

void loadDefaultScripts() {
    // Test script 1: System info collector (benign)
    DuckyScript* s = &scripts[0];
    strcpy(s->name, "sys_info_test");
    strcpy(s->lines[0], "DELAY 1000");
    strcpy(s->lines[1], "GUI r");
    strcpy(s->lines[2], "DELAY 500");
    strcpy(s->lines[3], "STRING notepad");
    strcpy(s->lines[4], "ENTER");
    strcpy(s->lines[5], "DELAY 500");
    strcpy(s->lines[6], "STRING Security audit test - timestamp: ");
    strcpy(s->lines[7], "ENTER");
    s->lineCount = 8;
    s->created = millis();
    s->runCount = 0;
    scriptCount = 1;
}

void parseDuckyLine(const char* line) {
    char cmd[32] = {0};
    char arg[MAX_LINE_LEN] = {0};
    sscanf(line, "%31s %127[^\n]", cmd, arg);

    if (strcmp(cmd, "DELAY") == 0) {
        int ms = atoi(arg);
        Serial.printf("[HID] DELAY %d ms\n", ms);
        delay(ms);
    } else if (strcmp(cmd, "STRING") == 0) {
        Serial.printf("[HID] TYPE: %s\n", arg);
        // On USB HID: type each character
        typeString(arg);
    } else if (strcmp(cmd, "ENTER") == 0) {
        Serial.println("[HID] ENTER");
        pressKey(0x28);  // HID Enter
    } else if (strcmp(cmd, "GUI") == 0 || strcmp(cmd, "WINDOWS") == 0) {
        Serial.printf("[HID] GUI+%s\n", arg);
        pressModifiedKey(0x08, arg[0]);  // GUI modifier
    } else if (strcmp(cmd, "ALT") == 0) {
        Serial.printf("[HID] ALT+%s\n", arg);
        pressModifiedKey(0x04, arg[0]);
    } else if (strcmp(cmd, "CTRL") == 0) {
        Serial.printf("[HID] CTRL+%s\n", arg);
        pressModifiedKey(0x01, arg[0]);
    } else if (strcmp(cmd, "TAB") == 0) {
        Serial.println("[HID] TAB");
        pressKey(0x2B);
    } else if (strcmp(cmd, "ESCAPE") == 0 || strcmp(cmd, "ESC") == 0) {
        Serial.println("[HID] ESCAPE");
        pressKey(0x29);
    } else if (strcmp(cmd, "DEFAULT_DELAY") == 0) {
        defaultDelay = atoi(arg);
    } else if (strcmp(cmd, "REM") == 0) {
        // Comment, skip
    } else {
        Serial.printf("[HID] Unknown: %s\n", cmd);
    }
}

void typeString(const char* str) {
    // In real USB HID, this sends keystroke reports
    // Here we output what would be typed
    for (int i = 0; str[i]; i++) {
        Serial.printf("[KEY] '%c' (0x%02X)\n", str[i], charToHID(str[i]));
        delay(10);
    }
}

uint8_t charToHID(char c) {
    if (c >= 'a' && c <= 'z') return 0x04 + (c - 'a');
    if (c >= 'A' && c <= 'Z') return 0x04 + (c - 'A');  // + shift
    if (c >= '1' && c <= '9') return 0x1E + (c - '1');
    if (c == '0') return 0x27;
    if (c == ' ') return 0x2C;
    if (c == '.') return 0x37;
    if (c == '-') return 0x2D;
    return 0x00;
}

void pressKey(uint8_t keycode) {
    Serial.printf("[KEY] Press 0x%02X\n", keycode);
    delay(50);
}

void pressModifiedKey(uint8_t modifier, char key) {
    uint8_t hid = charToHID(key);
    Serial.printf("[KEY] Mod:0x%02X + Key:0x%02X\n", modifier, hid);
    delay(50);
}

void executeNextLine() {
    if (currentLine >= scripts[currentScript].lineCount) {
        executing = false;
        scripts[currentScript].runCount++;
        Serial.printf("[EXEC] Script '%s' complete\n", scripts[currentScript].name);
        blinkLED(2, 200);
        return;
    }
    parseDuckyLine(scripts[currentScript].lines[currentLine]);
    currentLine++;
    delay(defaultDelay);
}

void setupRoutes() {
    server.on("/", HTTP_GET, []() {
        String html = "<html><head><title>Rubber Ducky Lab</title></head><body>";
        html += "<h1>USB HID Keystroke Injection Tester</h1>";
        if (executing) {
            html += "<p style='color:red'>EXECUTING: " +
                    String(scripts[currentScript].name) + " line " +
                    String(currentLine) + "/" +
                    String(scripts[currentScript].lineCount) + "</p>";
        }
        html += "<h2>Scripts (" + String(scriptCount) + ")</h2><table border='1'>";
        html += "<tr><th>Name</th><th>Lines</th><th>Runs</th><th>Actions</th></tr>";
        for (int i = 0; i < scriptCount; i++) {
            html += "<tr><td>" + String(scripts[i].name) + "</td>";
            html += "<td>" + String(scripts[i].lineCount) + "</td>";
            html += "<td>" + String(scripts[i].runCount) + "</td>";
            html += "<td><a href='/run?id=" + String(i) + "'>Run</a> | ";
            html += "<a href='/view?id=" + String(i) + "'>View</a></td></tr>";
        }
        html += "</table>";
        html += "<h2>New Script</h2>";
        html += "<form action='/upload' method='POST'>";
        html += "Name: <input name='name' value='test_script'><br>";
        html += "DuckyScript:<br><textarea name='code' rows='10' cols='60'>";
        html += "REM Security audit test\nDELAY 1000\nGUI r\nDELAY 500\n";
        html += "STRING notepad\nENTER\nDELAY 500\nSTRING Audit complete\n";
        html += "</textarea><br><input type='submit' value='Upload'></form>";
        html += "</body></html>";
        server.send(200, "text/html", html);
    });

    server.on("/run", HTTP_GET, []() {
        int id = server.arg("id").toInt();
        if (id >= 0 && id < scriptCount) {
            currentScript = id;
            currentLine = 0;
            executing = true;
            Serial.printf("[EXEC] Running '%s'\n", scripts[id].name);
        }
        server.sendHeader("Location", "/"); server.send(302);
    });

    server.on("/view", HTTP_GET, []() {
        int id = server.arg("id").toInt();
        if (id < 0 || id >= scriptCount) { server.send(404); return; }
        String txt = "Script: " + String(scripts[id].name) + "\n\n";
        for (int i = 0; i < scripts[id].lineCount; i++) {
            txt += String(i + 1) + ": " + String(scripts[id].lines[i]) + "\n";
        }
        server.send(200, "text/plain", txt);
    });

    server.on("/upload", HTTP_POST, []() {
        if (scriptCount >= MAX_SCRIPTS) { server.send(507, "text/plain", "Full"); return; }
        String name = server.arg("name");
        String code = server.arg("code");
        DuckyScript* s = &scripts[scriptCount];
        strncpy(s->name, name.c_str(), 31);
        s->name[31] = '\0';
        s->lineCount = 0;
        s->created = millis();
        s->runCount = 0;
        int start = 0;
        for (int i = 0; i <= (int)code.length() && s->lineCount < MAX_LINES; i++) {
            if (i == (int)code.length() || code[i] == '\n') {
                String line = code.substring(start, i);
                line.trim();
                if (line.length() > 0) {
                    strncpy(s->lines[s->lineCount], line.c_str(), MAX_LINE_LEN - 1);
                    s->lineCount++;
                }
                start = i + 1;
            }
        }
        scriptCount++;
        server.sendHeader("Location", "/"); server.send(302);
    });
}
