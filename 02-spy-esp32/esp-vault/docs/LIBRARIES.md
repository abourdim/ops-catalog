# Required Arduino Libraries

## Installation

Open Arduino IDE > Sketch > Include Library > Manage Libraries, then search and install:

| Library | Author | Version | Purpose |
|---------|--------|---------|---------|
| Adafruit Fingerprint Sensor Library | Adafruit | 2.x | AS608/R307 fingerprint sensor |
| Adafruit PN532 | Adafruit | 1.x | NFC/RFID reader (I2C) |
| Keypad | Mark Stanley, Alexander Brevig | 3.x | Matrix keypad scanning |
| ESP32Servo | Kevin Harrington | 1.x | Servo control on ESP32 |

## Board Setup

1. Install ESP32 board support in Arduino IDE
2. Select board: "ESP32 Dev Module"
3. Upload speed: 115200
4. Flash frequency: 80 MHz

## Pin Summary

```
ESP32 GPIO Map:
  GPIO4  -> Servo signal
  GPIO12 -> Keypad Row 2
  GPIO13 -> Keypad Row 1
  GPIO14 -> Keypad Row 3
  GPIO16 -> Fingerprint RX (Serial2 RX)
  GPIO17 -> Fingerprint TX (Serial2 TX)
  GPIO21 -> PN532 SDA (I2C)
  GPIO22 -> PN532 SCL (I2C)
  GPIO25 -> Keypad Col 2
  GPIO26 -> Keypad Col 1
  GPIO27 -> Keypad Row 4
  GPIO33 -> Keypad Col 3
```
