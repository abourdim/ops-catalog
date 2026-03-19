# Shadow Cam — Arduino Code Reference

## Dependencies
- `esp_camera.h` (built into ESP32 Arduino core)
- `FS.h` and `SD_MMC.h` (for SD card access)
- Arduino ESP32 board package v2.x+

## Key Concepts

### Motion Detection via PIR
```cpp
#define PIR_PIN 13
volatile bool motionDetected = false;

void IRAM_ATTR onMotion() {
  motionDetected = true;
}

void setup() {
  pinMode(PIR_PIN, INPUT);
  attachInterrupt(PIR_PIN, onMotion, RISING);
}
```

### Camera Capture
```cpp
camera_fb_t *fb = esp_camera_fb_get();
if (fb) {
  // fb->buf  = image data (JPEG)
  // fb->len  = data length
  // fb->width, fb->height = dimensions
  processImage(fb);
  esp_camera_fb_return(fb);
}
```

### XOR Encryption
```cpp
void xorEncrypt(uint8_t *data, size_t len, uint8_t key) {
  for (size_t i = 0; i < len; i++) {
    data[i] ^= key;
  }
}
// Decrypt with the same call — XOR is its own inverse
```

### Auto-Delete (File Expiry)
```cpp
void deleteExpiredFiles() {
  File root = SD_MMC.open("/captures");
  File f;
  while (f = root.openNextFile()) {
    // Parse timestamp from filename
    // If older than MAX_AGE_SEC, delete
    if (isExpired(f.name())) {
      SD_MMC.remove(String("/captures/") + f.name());
    }
  }
}
```

### Face Detection (Optional)
The ESP32-CAM supports lightweight face detection via the MTMNN model:
```cpp
#include "fd_forward.h"
// Use mtmn_config_t for face detection settings
// Returns bounding boxes that can be blurred before saving
```

## Upload Instructions
1. Connect FTDI programmer to ESP32-CAM.
2. Hold IO0 to GND, press RST to enter flash mode.
3. Select board: "AI Thinker ESP32-CAM" in Arduino IDE.
4. Upload sketch, then disconnect IO0 from GND.
5. Press RST to start normal operation.
