# ESP-Vault Wiring Guide

## Components

| Component | Model | Interface |
|-----------|-------|-----------|
| Fingerprint Sensor | R307 / AS608 | UART (Serial2) |
| NFC Reader | PN532 | I2C |
| Keypad | 4x3 Matrix | GPIO |
| Lock Servo | SG90 | PWM |
| Microcontroller | ESP32 DevKit | - |

## Wiring Diagram

### Fingerprint Sensor (AS608/R307)

| Sensor Pin | ESP32 Pin |
|------------|-----------|
| VCC | 3.3V |
| GND | GND |
| TX | GPIO16 (RX2) |
| RX | GPIO17 (TX2) |

### NFC Reader (PN532 - I2C Mode)

| PN532 Pin | ESP32 Pin |
|-----------|-----------|
| VCC | 3.3V |
| GND | GND |
| SDA | GPIO21 |
| SCL | GPIO22 |

Set PN532 DIP switches to I2C mode (switch 1: ON, switch 2: OFF).

### 4x3 Matrix Keypad

| Keypad Pin | ESP32 Pin |
|------------|-----------|
| Row 1 | GPIO13 |
| Row 2 | GPIO12 |
| Row 3 | GPIO14 |
| Row 4 | GPIO27 |
| Col 1 | GPIO26 |
| Col 2 | GPIO25 |
| Col 3 | GPIO33 |

### Servo Lock (SG90)

| Servo Pin | ESP32 Pin |
|-----------|-----------|
| VCC (Red) | 5V |
| GND (Brown) | GND |
| Signal (Orange) | GPIO4 |

## Notes

- The fingerprint sensor runs at 3.3V logic (some modules need 5V power with 3.3V logic level).
- PN532 supports SPI, I2C, and UART. We use I2C for simplicity.
- The keypad uses internal pull-ups on ESP32 GPIO pins.
- The servo draws significant current; use an external 5V supply if powering multiple servos.
