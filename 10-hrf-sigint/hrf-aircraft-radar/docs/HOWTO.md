# How-To: Aircraft Radar — ADS-B Receiver

## Getting Started

1. Open `index.html` in any modern browser.
2. Click **Start Receiver** to begin simulated ADS-B reception.
3. Aircraft will appear on the sky map, moving across the display.

## Using the Sky Map

- Aircraft are shown as directional triangles with callsign labels.
- Each aircraft displays flight level and speed.
- Click an aircraft to select it and view full details in the info panel.
- Compass directions (N/S/E/W) and range rings help orient the display.

## Altitude Chart

- Open the **Altitude Chart** section to see altitude history.
- Each aircraft has a colored trace showing altitude over time.
- Selected aircraft traces are highlighted.

## Aircraft Table

- The **Aircraft Table** shows all tracked flights.
- Columns: Callsign, Altitude, Speed, Heading, Squawk, Type.
- Click any row to select that aircraft.

## Understanding the Data

- **Callsign**: Airline code + flight number (e.g., DAH1234)
- **Altitude**: In feet above sea level
- **Speed**: In knots (nautical miles per hour)
- **Heading**: Direction of travel in degrees (0=North, 90=East)
- **Squawk**: 4-digit transponder code assigned by ATC
- **Type**: ICAO aircraft type designator (e.g., B738 = Boeing 737-800)

## Settings

- Change language (EN/FR/AR) in Settings panel
- Switch between 8 visual themes
- Toggle sound effects
- Activity log tracks all events

## About ADS-B

ADS-B (Automatic Dependent Surveillance-Broadcast) operates on 1090 MHz.
Aircraft broadcast their position, altitude, speed, and identity in unencrypted
Mode-S messages. With an RTL-SDR dongle and antenna, anyone can receive these
signals and track aircraft overhead. This app simulates that experience.
