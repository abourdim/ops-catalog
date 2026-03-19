/*
 * ESP Remote SDR - firmware.ino
 * Web-based remote control for an SDR receiver. Commands an
 * Si5351 local oscillator and streams ADC audio samples over
 * WebSocket to a browser-based spectrum display.
 *
 * Hardware: ESP32 DevKit + Si5351 + audio amp + SSD1306 OLED
 * Wiring:  Si5351 SDA->GPIO21 SCL->GPIO22, Audio ADC->GPIO34
 */

#include <WiFi.h>
#include <WebServer.h>
#include <WebSocketsServer.h>
#include <Wire.h>
#include <Adafruit_Si5351.h>
#include <Adafruit_SSD1306.h>
#include <driver/adc.h>

#define SCREEN_W 128
#define SCREEN_H  64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);
Adafruit_Si5351 si5351;

static const char *WIFI_SSID = "YourNetwork";
static const char *WIFI_PASS = "YourPassword";

#define ADC_PIN    34
#define LED_PIN     2
#define BTN_UP      4   // Frequency up
#define BTN_DOWN   15   // Frequency down

WebServer httpServer(80);
WebSocketsServer wsServer(81);

// ---------- SDR state ----------
static uint32_t frequency = 7100000;  // 7.1 MHz default
static uint32_t stepSize = 1000;      // 1 kHz step
static int volume = 50;
static bool streaming = false;

// ADC sample buffer
#define SAMPLE_BUF_SIZE 256
static uint16_t sampleBuf[SAMPLE_BUF_SIZE];

// ---------- Set LO frequency ----------
void setFrequency(uint32_t freq) {
  frequency = freq;
  // Configure Si5351 CLK0
  uint32_t pllFreq = 900000000UL;
  uint32_t divider = pllFreq / freq;
  if (divider < 8) divider = 8;
  si5351.setupPLL(SI5351_PLL_A, divider, 0, 1);
  si5351.setupMultisynth(0, SI5351_PLL_A, divider, 0, 1);
  si5351.enableOutputs(true);

  Serial.printf("[SDR] Freq: %u Hz (%.3f MHz)\n", freq, freq / 1e6);
}

// ---------- Collect ADC samples ----------
void collectSamples() {
  for (int i = 0; i < SAMPLE_BUF_SIZE; i++) {
    sampleBuf[i] = analogRead(ADC_PIN);
  }
}

// ---------- WebSocket events ----------
void wsEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t length) {
  switch (type) {
    case WStype_CONNECTED:
      Serial.printf("[WS] Client %u connected\n", num);
      streaming = true;
      break;
    case WStype_DISCONNECTED:
      Serial.printf("[WS] Client %u disconnected\n", num);
      streaming = false;
      break;
    case WStype_TEXT: {
      String cmd = String((char *)payload);
      if (cmd.startsWith("F:")) {
        uint32_t f = cmd.substring(2).toInt();
        if (f > 100000 && f < 200000000) setFrequency(f);
      } else if (cmd.startsWith("S:")) {
        stepSize = cmd.substring(2).toInt();
      } else if (cmd.startsWith("V:")) {
        volume = cmd.substring(2).toInt();
      }
      break;
    }
    default: break;
  }
}

// ---------- Web UI ----------
void handleRoot() {
  String html = R"(<!DOCTYPE html><html><head><title>Remote SDR</title>
<style>
body{background:#1a1a2e;color:#eee;font-family:monospace;text-align:center;margin:20px}
canvas{background:#0a0a1a;border:1px solid #333;display:block;margin:10px auto}
.freq{font-size:32px;color:#0f0;margin:10px}
button{background:#333;color:#0f0;border:1px solid #0f0;padding:8px 16px;margin:4px;cursor:pointer;font-family:monospace}
input[type=range]{width:200px}
</style></head><body>
<h1>ESP Remote SDR</h1>
<div class='freq' id='freq'>)";
  html += String(frequency / 1000.0, 3) + " kHz";
  html += R"(</div>
<canvas id='spectrum' width='512' height='200'></canvas>
<div>
<button onclick='tune(-10000)'>-10k</button>
<button onclick='tune(-1000)'>-1k</button>
<button onclick='tune(-100)'>-100</button>
<button onclick='tune(100)'>+100</button>
<button onclick='tune(1000)'>+1k</button>
<button onclick='tune(10000)'>+10k</button>
</div>
<p>Volume: <input type='range' min='0' max='100' value='50' oninput='setVol(this.value)'></p>
<script>
var ws=new WebSocket('ws://'+location.hostname+':81/');
var freq=)";
  html += String(frequency);
  html += R"(;
var canvas=document.getElementById('spectrum');
var ctx=canvas.getContext('2d');
function tune(d){freq+=d;ws.send('F:'+freq);document.getElementById('freq').innerText=(freq/1000).toFixed(3)+' kHz'}
function setVol(v){ws.send('V:'+v)}
ws.binaryType='arraybuffer';
ws.onmessage=function(e){
  if(e.data instanceof ArrayBuffer){
    var d=new Uint16Array(e.data);
    ctx.fillStyle='rgba(10,10,26,0.3)';ctx.fillRect(0,0,512,200);
    ctx.strokeStyle='#0f0';ctx.beginPath();
    for(var i=0;i<d.length;i++){var y=200-d[i]/4096*200;ctx.lineTo(i*2,y)}
    ctx.stroke();
  }
};
</script></body></html>)";
  httpServer.send(200, "text/html", html);
}

// ---------- Display ----------
void updateDisplay() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(0, 0);
  oled.print("Remote SDR");
  oled.setCursor(0, 14);
  oled.setTextSize(2);
  if (frequency >= 1000000) {
    oled.printf("%.3f", frequency / 1e6);
    oled.setTextSize(1);
    oled.print(" MHz");
  } else {
    oled.printf("%u", frequency / 1000);
    oled.setTextSize(1);
    oled.print(" kHz");
  }
  oled.setTextSize(1);
  oled.setCursor(0, 36);
  oled.printf("Step: %u Hz", stepSize);
  oled.setCursor(0, 48);
  oled.printf("Stream: %s  Vol:%d", streaming ? "ON" : "OFF", volume);
  oled.setCursor(0, 56);
  oled.printf("IP: %s", WiFi.localIP().toString().c_str());
  oled.display();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[RemoteSDR] Starting...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_UP, INPUT_PULLUP);
  pinMode(BTN_DOWN, INPUT_PULLUP);
  pinMode(ADC_PIN, INPUT);
  analogReadResolution(12);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  si5351.begin();

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) { delay(500); }
  Serial.printf("[WiFi] IP: %s\n", WiFi.localIP().toString().c_str());

  httpServer.on("/", handleRoot);
  httpServer.begin();
  wsServer.begin();
  wsServer.onEvent(wsEvent);

  setFrequency(frequency);
  updateDisplay();
}

// ---------- Main loop ----------
void loop() {
  httpServer.handleClient();
  wsServer.loop();

  // Stream ADC data to WebSocket clients
  if (streaming) {
    static unsigned long lastStream = 0;
    if (millis() - lastStream > 50) {
      lastStream = millis();
      collectSamples();
      wsServer.broadcastBIN((uint8_t *)sampleBuf, sizeof(sampleBuf));
    }
  }

  // Buttons
  if (digitalRead(BTN_UP) == LOW) { delay(150); setFrequency(frequency + stepSize); }
  if (digitalRead(BTN_DOWN) == LOW) { delay(150); setFrequency(frequency - stepSize); }

  static unsigned long lastDisp = 0;
  if (millis() - lastDisp > 500) { lastDisp = millis(); updateDisplay(); }

  delay(5);
}
