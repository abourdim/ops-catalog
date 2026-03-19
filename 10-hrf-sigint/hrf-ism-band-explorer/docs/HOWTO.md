# How-To: ISM Band Explorer

## Getting Started

1. Open `index.html` in any modern browser.
2. Click **Start Scanner** to begin ISM band scanning.
3. Devices will appear as they are detected.

## Selecting a Band

- Use the band dropdown to choose 433, 868, or 915 MHz.
- Each band has its own set of device types and protocols.
- Switching bands restarts the scan.

## Reading the Device List

- **Device**: Name of the detected device or sensor type.
- **Freq**: Exact transmission frequency in MHz.
- **Protocol**: Identified protocol name (e.g., LoRaWAN, Oregon v2.1).
- **Signal**: Signal strength in dBm with visual bars.
- **Last Seen**: Timestamp of most recent transmission.

## Protocol Identification

- Click any device row to see detailed protocol information.
- Details include modulation type, data rate, and a description.

## About ISM Bands

ISM bands at 433, 868, and 915 MHz are unlicensed spectrum allocations for
low-power devices. With an RTL-SDR dongle and rtl_433 software, you can
receive and decode hundreds of device protocols including weather stations,
car key fobs, tire pressure sensors, LoRa IoT devices, and more.
