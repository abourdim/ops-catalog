# How-To: GSM Tower Mapper

## Getting Started

1. Open `index.html` in any modern browser.
2. Click **Start Scan** to begin simulated tower detection.
3. Towers appear on the map with coverage circles.

## Reading the Map

- Your position is shown at the center marked "YOU".
- Towers are triangular icons with operator name and signal strength.
- Coverage circles pulse to indicate active transmission.
- Green circles = strong signal, amber = moderate.
- Click a tower to select it and see a dashed line to your position.

## Tower List

- **Cell ID**: Unique cell sector identifier (0-65535)
- **LAC**: Location Area Code grouping nearby cells
- **Band**: Radio technology and frequency (GSM 900, LTE 800, etc.)
- **MCC/MNC**: Mobile Country Code / Mobile Network Code
- **Signal**: Received signal strength in dBm
- **Distance**: Approximate distance from your position in km

## About GSM/LTE Tower Scanning

Cell towers broadcast on specific frequency bands and can be detected with
an RTL-SDR dongle and tools like grgsm_scanner. Each tower sector has a
unique Cell ID combined with LAC and MCC/MNC for global identification.
This technique is used for coverage mapping, network analysis, and
understanding cellular infrastructure.
