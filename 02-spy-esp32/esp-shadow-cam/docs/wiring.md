# Shadow Cam — Wiring Guide

## Components
- ESP32-CAM (AI-Thinker module with OV2640)
- PIR Motion Sensor (HC-SR501)
- MicroSD card (for image storage)
- FTDI USB-to-Serial programmer
- Jumper wires
- 5V power supply

## Wiring Diagram

```
ESP32-CAM          PIR Sensor (HC-SR501)
---------          ---------------------
  5V  ────────────  VCC
  GND ────────────  GND
  GPIO13 ─────────  OUT

ESP32-CAM          FTDI Programmer
---------          ----------------
  U0R ────────────  TX
  U0T ────────────  RX
  GND ────────────  GND
  5V  ────────────  VCC
  IO0 ──── GND     (for flash mode only)
```

## Notes
- The ESP32-CAM has a built-in MicroSD card slot — no extra wiring needed for storage.
- GPIO13 is used for the PIR sensor because it does not conflict with the camera or SD card pins.
- Connect IO0 to GND only during firmware upload, then disconnect for normal operation.
- The PIR sensor needs 5V; the ESP32-CAM 5V pin provides this directly.
- Adjust the PIR sensor potentiometers for sensitivity and hold time.
