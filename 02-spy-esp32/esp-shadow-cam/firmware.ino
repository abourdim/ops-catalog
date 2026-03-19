/*
 * ESP Shadow Cam - firmware.ino
 * Motion-triggered camera that captures JPEG images using
 * ESP32-CAM module, saves to SD card, and serves a web
 * gallery over Wi-Fi.
 *
 * Hardware: ESP32-CAM (AI-Thinker) + PIR sensor
 * Wiring:  PIR OUT -> GPIO13, PIR VCC -> 3.3V
 */

#include <WiFi.h>
#include <WebServer.h>
#include <esp_camera.h>
#include <FS.h>
#include <SD_MMC.h>

// ---------- Wi-Fi credentials ----------
static const char *WIFI_SSID = "ShadowCam_AP";
static const char *WIFI_PASS = "shadow1234";

// ---------- Pin definitions (AI-Thinker ESP32-CAM) ----------
#define PWDN_GPIO    32
#define RESET_GPIO   -1
#define XCLK_GPIO     0
#define SIOD_GPIO    26
#define SIOC_GPIO    27
#define Y9_GPIO      35
#define Y8_GPIO      34
#define Y7_GPIO      39
#define Y6_GPIO      36
#define Y5_GPIO      21
#define Y4_GPIO      19
#define Y3_GPIO      18
#define Y2_GPIO       5
#define VSYNC_GPIO   25
#define HREF_GPIO    23
#define PCLK_GPIO    22
#define FLASH_GPIO    4
#define PIR_PIN      13

// ---------- State ----------
WebServer server(80);
static uint32_t captureCount = 0;
static unsigned long lastCapture = 0;
static const unsigned long COOLDOWN_MS = 5000;

// ---------- Camera init ----------
bool initCamera() {
  camera_config_t config = {};
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO;
  config.pin_d1 = Y3_GPIO;
  config.pin_d2 = Y4_GPIO;
  config.pin_d3 = Y5_GPIO;
  config.pin_d4 = Y6_GPIO;
  config.pin_d5 = Y7_GPIO;
  config.pin_d6 = Y8_GPIO;
  config.pin_d7 = Y9_GPIO;
  config.pin_xclk = XCLK_GPIO;
  config.pin_pclk = PCLK_GPIO;
  config.pin_vsync = VSYNC_GPIO;
  config.pin_href = HREF_GPIO;
  config.pin_sscb_sda = SIOD_GPIO;
  config.pin_sscb_scl = SIOC_GPIO;
  config.pin_pwdn = PWDN_GPIO;
  config.pin_reset = RESET_GPIO;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_VGA;
  config.jpeg_quality = 12;
  config.fb_count = 1;

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("[CAM] Init failed: 0x%x\n", err);
    return false;
  }
  return true;
}

// ---------- Capture and save ----------
void captureImage() {
  camera_fb_t *fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("[CAM] Capture failed");
    return;
  }

  char path[32];
  snprintf(path, sizeof(path), "/img_%04u.jpg", captureCount++);
  File f = SD_MMC.open(path, FILE_WRITE);
  if (f) {
    f.write(fb->buf, fb->len);
    f.close();
    Serial.printf("[CAM] Saved %s (%u bytes)\n", path, fb->len);
  }
  esp_camera_fb_return(fb);
}

// ---------- Web handlers ----------
void handleRoot() {
  String html = "<html><head><title>ShadowCam</title></head><body>";
  html += "<h1>Shadow Cam Gallery</h1><p>Captures: " + String(captureCount) + "</p>";
  for (int i = captureCount - 1; i >= 0 && i > (int)captureCount - 20; i--) {
    html += "<img src='/img_" + String(i) + "' width='320'><br>";
  }
  html += "</body></html>";
  server.send(200, "text/html", html);
}

void handleImage() {
  String uri = server.uri();
  String idx = uri.substring(5);  // after "/img_"
  char path[32];
  snprintf(path, sizeof(path), "/img_%04d.jpg", idx.toInt());
  File f = SD_MMC.open(path, FILE_READ);
  if (f) {
    server.streamFile(f, "image/jpeg");
    f.close();
  } else {
    server.send(404, "text/plain", "Not found");
  }
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[ShadowCam] Booting...");

  pinMode(FLASH_GPIO, OUTPUT);
  pinMode(PIR_PIN, INPUT);
  digitalWrite(FLASH_GPIO, LOW);

  if (!initCamera()) {
    Serial.println("[CAM] Camera init failed, halting.");
    while (true) delay(1000);
  }

  if (!SD_MMC.begin()) {
    Serial.println("[SD] Mount failed!");
  }

  // Start AP
  WiFi.softAP(WIFI_SSID, WIFI_PASS);
  Serial.printf("[WiFi] AP started: %s @ %s\n",
                WIFI_SSID, WiFi.softAPIP().toString().c_str());

  server.on("/", handleRoot);
  server.onNotFound(handleImage);
  server.begin();

  Serial.println("[ShadowCam] Ready. Watching for motion...");
}

// ---------- Main loop ----------
void loop() {
  server.handleClient();

  if (digitalRead(PIR_PIN) == HIGH && millis() - lastCapture > COOLDOWN_MS) {
    lastCapture = millis();
    Serial.println("[PIR] Motion detected!");
    digitalWrite(FLASH_GPIO, HIGH);
    delay(100);
    captureImage();
    digitalWrite(FLASH_GPIO, LOW);
  }
}
