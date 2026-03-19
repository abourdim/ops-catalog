# Wiring Guide — WiFi Jammer Detector

## Hardware Requirements

| Component        | Quantity | Notes                          |
|------------------|----------|--------------------------------|
| ESP32 DevKit     | 1        | Any ESP32 with WiFi support    |
| USB Cable        | 1        | Micro-USB or USB-C (depends on board) |
| LED (Red)        | 1        | Optional: visual attack alert  |
| LED (Green)      | 1        | Optional: safe status LED      |
| Buzzer           | 1        | Optional: audio alert          |
| 220 Ohm Resistor | 2        | For LEDs                       |

## Wiring Diagram

```
ESP32 DevKit
+------------------+
|                  |
|  GPIO2  --------+--[ 220R ]--[ GREEN LED ]--GND
|  GPIO4  --------+--[ 220R ]--[ RED LED   ]--GND
|  GPIO15 --------+--[ BUZZER+ ]
|  GND    --------+--[ BUZZER- ]
|                  |
|  USB  ----------+-- Computer (Serial Monitor)
+------------------+
```

## Pin Assignment

| GPIO | Function           |
|------|--------------------|
| 2    | Green LED (Safe)   |
| 4    | Red LED (Attack)   |
| 15   | Buzzer (Alert)     |

## Notes

- The ESP32 WiFi chip enters promiscuous mode via `esp_wifi_set_promiscuous(true)`
- No external WiFi antenna needed for short-range detection
- Power via USB from computer or 5V power bank
- No additional wiring required for basic detection (WiFi is built-in)
