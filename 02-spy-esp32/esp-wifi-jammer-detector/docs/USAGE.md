# Usage Guide — WiFi Jammer Detector

## Quick Start

1. Open `index.html` in a modern browser
2. Click **Start Monitor** to begin deauth packet monitoring
3. Observe the threat level indicator (green/yellow/red)
4. Use **Simulate Attack** to see how the detector responds to a deauth flood

## Main Dashboard

### Threat Level Indicator
- **Green (SAFE)**: No deauth packets detected. Network is secure.
- **Yellow (WARNING)**: Moderate deauth activity detected. Could be normal network management or early stages of an attack.
- **Red (ATTACK)**: High-rate deauth flood detected. Active attack in progress.

### Statistics
- **Deauth Packets**: Total deauthentication frames captured since monitoring started
- **Pkts/sec**: Current deauthentication packet rate per second
- **Attacks Detected**: Number of distinct attack events (threshold exceeded)
- **Uptime**: Time elapsed since monitor was started

### Attack Timeline
Canvas graph showing deauth packets per second over the last 60 seconds. The red dashed line indicates the alert threshold. Color coding matches threat levels.

### Alert Log
Chronological log of security events with timestamps. Color-coded by severity.

### Attack Sources
Lists identified attacker MAC addresses sorted by packet count, showing the channel and total packets from each source.

## Controls

| Button           | Function                                           |
|------------------|----------------------------------------------------|
| Start Monitor    | Begin/stop real-time deauth monitoring              |
| Simulate Attack  | Trigger a simulated deauth flood (5-10 seconds)    |
| Reset            | Clear all data and reset the monitor                |

## Network Scanner (Section A)

Click **Scan Networks** to discover simulated nearby WiFi networks. Each network shows:
- SSID and signal strength (bars)
- Channel and RSSI in dBm
- Security protocol (WPA3, WPA2, Open)
- PMF (Protected Management Frames) status

Networks with PMF enabled are resistant to deauth attacks.

## Defense Toolkit (Section B)

- **Auto Channel Hopping**: Simulates ESP32 cycling through WiFi channels
- **MAC Randomization**: Simulates randomizing the detector's MAC address
- **Alert Threshold**: Adjust the packets/sec threshold that triggers attack alerts (1-50)
- **Auto-Log Attacks**: Automatically log detected attacks to the activity log
- **Export Security Report**: Download a JSON report with all monitoring data

## Learning Lab (Section C)

Educational content covering:
- Deauthentication attacks and how they work
- WiFi jammer mechanisms
- Network protection strategies
- IEEE 802.11w (PMF) explained
- ESP32 detection capabilities
- Legal and ethical considerations

## Keyboard Shortcuts

- **Escape**: Close all panels
- **Ctrl+Z** (in log panel): Undo last log entry
- **Konami Code**: Activate retro theme
