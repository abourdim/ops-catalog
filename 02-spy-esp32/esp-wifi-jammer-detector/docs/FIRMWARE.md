# Firmware Guide — WiFi Jammer Detector

## Overview

The ESP32 firmware puts the WiFi chip into promiscuous mode to capture all 802.11 frames on a given channel. It filters for deauthentication (type 0xC0) and disassociation (type 0xA0) management frames, counts them per second, and triggers alerts when the rate exceeds a configurable threshold.

## Arduino IDE Setup

1. Install ESP32 board support via Board Manager
2. Select your ESP32 board (e.g., "ESP32 Dev Module")
3. Set upload speed to 115200
4. Select the correct COM port

## Key Firmware Concepts

### Promiscuous Mode
```cpp
#include "esp_wifi.h"

esp_wifi_set_promiscuous(true);
esp_wifi_set_promiscuous_rx_cb(&sniffer_callback);
```

### Frame Type Detection
```cpp
void sniffer_callback(void *buf, wifi_promiscuous_pkt_type_t type) {
  if (type != WIFI_PKT_MGMT) return;

  const wifi_promiscuous_pkt_t *pkt = (wifi_promiscuous_pkt_t *)buf;
  const uint8_t *frame = pkt->payload;
  uint8_t frameType = frame[0];

  // 0xC0 = Deauthentication, 0xA0 = Disassociation
  if (frameType == 0xC0 || frameType == 0xA0) {
    deauthCount++;
    // Extract source MAC from frame[10..15]
  }
}
```

### Channel Hopping
```cpp
void channelHop() {
  static uint8_t channel = 1;
  esp_wifi_set_channel(channel, WIFI_SECOND_CHAN_NONE);
  channel = (channel % 13) + 1;
}
```

## Serial Output Format

The firmware outputs JSON over serial at 115200 baud:

```json
{"type":"deauth","src":"DE:AD:BE:EF:00:01","dst":"FF:FF:FF:FF:FF:FF","ch":6,"rssi":-42,"pps":25}
```

## Configuration

| Parameter        | Default | Description                    |
|------------------|---------|--------------------------------|
| ALERT_THRESHOLD  | 10      | Packets/sec to trigger alert   |
| CHANNEL_HOP_MS   | 500     | Channel hop interval (ms)      |
| SERIAL_BAUD      | 115200  | Serial communication speed     |
| LED_PIN_GREEN    | 2       | GPIO for safe status LED       |
| LED_PIN_RED      | 4       | GPIO for attack alert LED      |
| BUZZER_PIN       | 15      | GPIO for buzzer                |
