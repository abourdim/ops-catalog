/*
 * ESP Mesh Whisper - firmware.ino
 * Private mesh messaging network using ESP-MESH (painlessMesh).
 * Nodes automatically form a mesh and can exchange encrypted
 * text messages without any internet connection.
 *
 * Hardware: ESP32 DevKit + OLED SSD1306
 * Wiring:  SDA -> GPIO21, SCL -> GPIO22
 */

#include <painlessMesh.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

// ---------- Mesh config ----------
#define MESH_PREFIX   "MeshWhisper"
#define MESH_PASS     "whisper123"
#define MESH_PORT     5555

// ---------- OLED ----------
#define SCREEN_W 128
#define SCREEN_H 64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);

// ---------- Pins ----------
#define LED_PIN    2
#define BTN_SEND   4

// ---------- Objects ----------
painlessMesh mesh;
Scheduler userScheduler;

// ---------- Message log ----------
#define MAX_LOG 6
static String msgLog[MAX_LOG];
static int logIdx = 0;
static uint32_t msgSent = 0;
static uint32_t msgRecv = 0;

// XOR cipher key for simple message obfuscation
static const uint8_t CIPHER_KEY[] = "WhisperKey2024";
#define KEY_LEN 14

// ---------- Simple XOR cipher ----------
String xorCipher(const String &input) {
  String output = input;
  for (int i = 0; i < (int)output.length(); i++) {
    output[i] = output[i] ^ CIPHER_KEY[i % KEY_LEN];
  }
  return output;
}

// ---------- Add to log ----------
void addLog(const String &msg) {
  msgLog[logIdx % MAX_LOG] = msg;
  logIdx++;
}

// ---------- Display ----------
void updateDisplay() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);

  oled.setCursor(0, 0);
  oled.printf("Mesh Whisper  N:%d", mesh.getNodeList().size() + 1);
  oled.setCursor(0, 8);
  oled.printf("TX:%u RX:%u", msgSent, msgRecv);

  // Show message log
  int start = logIdx > MAX_LOG ? logIdx - MAX_LOG : 0;
  for (int i = start; i < logIdx && i < start + 5; i++) {
    oled.setCursor(0, 18 + (i - start) * 9);
    String line = msgLog[i % MAX_LOG];
    if (line.length() > 21) line = line.substring(0, 21);
    oled.print(line);
  }

  oled.display();
}

// ---------- Mesh callbacks ----------
void receivedCallback(uint32_t from, String &msg) {
  // Decrypt
  String plain = xorCipher(msg);
  Serial.printf("[RECV] from %u: %s\n", from, plain.c_str());

  String logEntry = String(from % 10000) + ": " + plain;
  addLog(logEntry);
  msgRecv++;
  updateDisplay();

  digitalWrite(LED_PIN, HIGH);
  delay(100);
  digitalWrite(LED_PIN, LOW);
}

void newConnectionCallback(uint32_t nodeId) {
  Serial.printf("[MESH] New node: %u\n", nodeId);
  addLog("+ Node " + String(nodeId % 10000));
  updateDisplay();
}

void changedConnectionCallback() {
  Serial.printf("[MESH] Topology changed. Nodes: %d\n",
                mesh.getNodeList().size() + 1);
  updateDisplay();
}

// ---------- Pre-defined messages ----------
static const char *quickMessages[] = {
  "Hello mesh!",
  "Status check",
  "All clear",
  "Meet at node",
  "Ping",
};
#define NUM_QUICK_MSG 5
static int quickIdx = 0;

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[MeshWhisper] Starting...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_SEND, INPUT_PULLUP);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(10, 28);
  oled.print("Mesh Whisper");
  oled.display();

  // Init mesh
  mesh.setDebugMsgTypes(ERROR | STARTUP);
  mesh.init(MESH_PREFIX, MESH_PASS, &userScheduler, MESH_PORT);
  mesh.onReceive(&receivedCallback);
  mesh.onNewConnection(&newConnectionCallback);
  mesh.onChangedConnections(&changedConnectionCallback);

  Serial.printf("[MESH] Node ID: %u\n", mesh.getNodeId());
  addLog("My ID: " + String(mesh.getNodeId() % 10000));
  updateDisplay();
}

// ---------- Main loop ----------
void loop() {
  mesh.update();

  // Button sends quick message
  if (digitalRead(BTN_SEND) == LOW) {
    delay(200);
    const char *msg = quickMessages[quickIdx % NUM_QUICK_MSG];
    quickIdx++;

    String encrypted = xorCipher(String(msg));
    mesh.sendBroadcast(encrypted);
    msgSent++;

    addLog("Me: " + String(msg));
    Serial.printf("[SEND] Broadcast: %s\n", msg);
    updateDisplay();

    while (digitalRead(BTN_SEND) == LOW) {
      mesh.update();
      delay(10);
    }
  }
}
