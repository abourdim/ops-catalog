# CHANGES — bit-stealth-alarm

## v1.0 (2026-03-18)

### Added
- Alarm state machine: disarmed, armed, triggered with auto-rearm after 3 seconds
- Light sensor simulation with ambient baseline, noise, and door-open spike events
- Motion sensor simulation with resting baseline, noise, and shake spike events
- Adjustable light threshold slider (0-255, default 128)
- Adjustable motion threshold slider (0-500, default 150)
- Real-time gauges for light and motion levels with danger coloring above threshold
- Alert history panel with timestamped entries showing sensor type and trigger value
- Test Intrusion button to simulate both light and motion spikes simultaneously
- Lab section with adjustable simulation noise slider (0-50)
- Simulate Door Open and Simulate Shake buttons in the Lab
- Optional Ambient Light API integration for real device light sensor data
- Optional DeviceMotion API integration for real device accelerometer data
- Section A (How It Works): 4-step explanation of sensor sampling, comparison, triggering, and logging
- Section C (Challenges): 3 challenges — bypass alarm, find optimal thresholds, design silent alarm
- Full trilingual i18n support (English, French, Arabic) for all alarm-specific keys
- Help panel FAQ: light sensor, accelerometer, thresholds, false alarms
- Help panel How-To: 4 steps for using the alarm
- Help panel Wiki: Light Sensors, Accelerometer, Threshold Detection, Security Systems
- App-specific CSS in head for alarm-status, gauge, alert-history, challenge-card styles
- manifest.json updated with bit-stealth-alarm name and description

### Based On
- Workshop-DIY Template v1.2 (all infrastructure preserved)
