# HOWTO — RF Bridge

## What is this?
RF Bridge simulates an ESP32 acting as a wireless bridge between a HackRF SDR and remote clients over WiFi. IQ samples are streamed in real-time.

## Quick Start
1. Open `index.html` in a browser
2. Select center frequency and bandwidth
3. Click "Connect Bridge" to start streaming
4. Watch the waterfall and monitor throughput stats

## Stream Parameters
| Parameter | Options |
|-----------|---------|
| Center Freq | 88 MHz, 433 MHz, 868 MHz, 915 MHz, 2.4 GHz |
| Bandwidth | 1/2/5/10/20 MHz |
| IQ Format | 8-bit unsigned |
| Protocol | UDP/TCP hybrid |

## Key Metrics
- **Throughput**: Actual data rate (Mbps)
- **Latency**: End-to-end delay (ms)
- **Dropped**: Packet loss percentage
- **Buffer**: Ring buffer fill level
