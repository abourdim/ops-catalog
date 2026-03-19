# Workshop-DIY Ops Catalog

> Interactive catalog of 413 hands-on DIY hardware, radio, and security projects across 50 categories. Trilingual (EN/FR/AR) with a built-in voting system.

---

## Overview

The **Ops Catalog** is a self-contained, single-page web application that serves as the master directory for the Workshop-DIY educational lab. It organizes 413 project ideas into 50 categories spanning radio frequency engineering, cybersecurity, embedded hardware, signal intelligence, acoustic science, swarm computing, and more.

Every project targets real hardware (BBC micro:bit, ESP32, HackRF One, Raspberry Pi, WiFi adapters) or runs entirely in the browser. The catalog supports **English**, **French**, and **Arabic** (with full RTL support), and includes a voting system so teams can collectively decide which projects to build first.

---

## Quick Start

**No build step required.** The catalog is a single `index.html` file with zero dependencies.

```bash
# Option 1 -- just open in any browser
open index.html            # macOS
xdg-open index.html        # Linux
start index.html           # Windows

# Option 2 -- serve locally (useful for team access on LAN)
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## Categories

### Spy Ops (4 categories)

| # | Icon | Category | Apps | Hardware |
|---|------|----------|------|----------|
| 01 | :detective: | Spy Ops -- micro:bit | 9 | micro:bit |
| 02 | :closed_lock_with_key: | Spy Ops -- ESP32 | 10 | ESP32 |
| 03 | :dark_sunglasses: | Spy Ops -- Browser | 10 | None |
| 04 | :dart: | Spy Ops -- Combos | 3 | Mixed |

### Network (5 categories)

| # | Icon | Category | Apps | Hardware |
|---|------|----------|------|----------|
| 05 | :globe_with_meridians: | Network -- ESP32 | 12 | ESP32 |
| 06 | :spider_web: | Network -- Browser | 14 | None |
| 07 | :signal_strength: | Network -- micro:bit | 5 | micro:bit |
| 08 | :link: | Network -- Multi-Node | 7 | ESP32 x3+ |
| 09 | :trophy: | Network -- Ultimate | 3 | Mixed |

### HackRF (4 categories)

| # | Icon | Category | Apps | Hardware |
|---|------|----------|------|----------|
| 10 | :satellite: | HackRF -- Signal Intel | 14 | HackRF |
| 11 | :radio: | HackRF + micro:bit | 4 | HackRF + micro:bit |
| 12 | :zap: | HackRF + ESP32 | 6 | HackRF + ESP32 |
| 13 | :shield: | HackRF -- Spy Ops | 7 | HackRF |

### WiFi (5 categories)

| # | Icon | Category | Apps | Hardware |
|---|------|----------|------|----------|
| 14 | :mag: | WiFi Monitor -- Recon | 10 | WiFi Adapter |
| 15 | :ghost: | WiFi Monitor -- Spy | 7 | WiFi Adapter |
| 16 | :bar_chart: | WiFi + HackRF | 5 | WiFi + HackRF |
| 17 | :school: | WiFi -- Classroom | 5 | WiFi Adapter |
| 18 | :honey_pot: | WiFi + ESP32 | 5 | WiFi + ESP32 |

### Ham Radio (8 categories)

| # | Icon | Category | Apps | Hardware |
|---|------|----------|------|----------|
| 19 | :radio: | Ham Radio -- Core | 8 | HackRF |
| 20 | :speech_balloon: | Ham -- Digital Modes | 11 | HackRF |
| 21 | :artificial_satellite: | Ham -- Satellites | 7 | HackRF |
| 22 | :robot: | Ham + micro:bit | 4 | HackRF + micro:bit |
| 23 | :gear: | Ham + ESP32 | 6 | HackRF + ESP32 |
| 24 | :camping: | Ham -- Emergency | 5 | Mixed |
| 25 | :mortar_board: | Ham -- Learning | 4 | HackRF |
| 26 | :crown: | Ham -- God-Tier | 4 | Full Stack |

### SDR (8 categories)

| # | Icon | Category | Apps | Hardware |
|---|------|----------|------|----------|
| 27 | :wrench: | SDR -- DSP & Processing | 8 | HackRF |
| 28 | :bar_chart: | SDR -- Multi-Receiver | 6 | HackRF x2+ |
| 29 | :small_airplane: | SDR -- Aviation/Maritime | 7 | HackRF |
| 30 | :microscope: | SDR -- Science | 5 | HackRF |
| 31 | :factory: | SDR -- IoT/Industrial | 6 | HackRF |
| 32 | :hammer_and_wrench: | SDR -- Tools | 6 | HackRF |
| 33 | :mortar_board: | SDR -- Learning | 5 | HackRF |
| 34 | :crown: | SDR -- God-Tier | 4 | Full Stack |

### Antenna (2 categories)

| # | Icon | Category | Apps | Hardware |
|---|------|----------|------|----------|
| 35 | :satellite: | Antenna -- Build & Test | 10 | HackRF |
| 36 | :satellite: | Antenna + Raspberry Pi | 5 | RPi + HackRF |

### Raspberry Pi (2 categories)

| # | Icon | Category | Apps | Hardware |
|---|------|----------|------|----------|
| 37 | :pie: | Raspberry Pi -- Core | 15 | Raspberry Pi |
| 38 | :pie: | Raspberry Pi + Antenna | 1 | RPi + Antenna |

### Secret Agent (4 categories)

| # | Icon | Category | Apps | Hardware |
|---|------|----------|------|----------|
| 39 | :detective: | Agent -- Field Gear | 12 | RPi + Mixed |
| 40 | :robot: | Agent + micro:bit | 5 | RPi + micro:bit |
| 41 | :satellite: | Agent + Antenna | 4 | RPi + HackRF |
| 42 | :skull: | Agent -- Ultimate Kits | 6 | Full Stack |

### Frontier Categories (8 categories)

| # | Icon | Category | Apps | Hardware |
|---|------|----------|------|----------|
| 43 | :dna: | Bio-Radio -- Body as Antenna | 15 | Mixed |
| 44 | :loud_sound: | Acoustic Warfare -- Sound Weapons | 15 | Mixed |
| 45 | :stopwatch: | Time Manipulation -- Chrono Hacks | 15 | Mixed |
| 46 | :bee: | Swarm Intelligence -- Hive Mind | 15 | ESP32 / micro:bit |
| 47 | :atom_symbol: | Impossible Physics -- Reality Hacks | 15 | HackRF / RPi |
| 48 | :skull: | Dark Arts -- Offensive Security | 15 | Mixed |
| 49 | :robot: | AI Radio -- Neural RF | 15 | RPi / HackRF |
| 50 | :earth_africa: | Civilization Hacks -- Save the World | 15 | Mixed |

---

## Hardware Requirements

| Device | Description | Link |
|--------|-------------|------|
| **BBC micro:bit v2** | Wearable sensors, BLE mesh, CW paddle, field agent gadget | [microbit.org](https://microbit.org) |
| **ESP32 DevKit** | WiFi/BLE scanner, mesh nodes, honeypots, IoT bridge, LoRa | [espressif.com](https://www.espressif.com/en/products/socs/esp32) |
| **HackRF One** | 1 MHz -- 6 GHz SDR transceiver for spectrum analysis and signal work | [greatscottgadgets.com](https://greatscottgadgets.com/hackrf/) |
| **RTL-SDR v3/v4** | Budget wideband receiver for aviation, weather satellites, ham | [rtl-sdr.com](https://www.rtl-sdr.com/) |
| **WiFi Monitor Adapter** | 802.11 packet capture, probe tracking, deauth detection | Atheros / Realtek chipset |
| **Raspberry Pi 4/5** | SDR server, repeater, SIGINT station, Tor router, mesh node | [raspberrypi.com](https://www.raspberrypi.com/) |
| **Antennas** | Yagi, dipole, magnetic loop, fractal, PCB, covert -- build, test, compare | DIY / commercial |

Many browser-only projects (categories 03, 06, 09, 17, 25, 33) require **no hardware at all**.

---

## File Structure

Each of the 50 category folders contains individual app directories. The file layout depends on the target hardware:

```
ops-catalog/
  index.html                          # Main catalog (single-page app)
  README.md
  01-spy-microbit/
    bit-dead-drop/
      index.html                      # App UI (browser dashboard)
      script.js                       # Browser-side logic
      makecode.js                     # MakeCode / micro:bit firmware
    bit-shake-cipher/
      ...
  02-spy-esp32/
    esp-ghost-beacon/
      index.html                      # App UI
      script.js                       # Browser-side logic
      firmware.ino                    # Arduino/ESP32 firmware
    ...
  10-hrf-sigint/
    hrf-rf-waterfall/
      index.html
      script.js
      hackrf.py                       # HackRF Python control script
    ...
  37-pi-core/
    pi-sdr-station/
      index.html
      script.js
      main.py                         # Raspberry Pi Python service
    ...
  50-civilization-hacks/
    civ-mesh-internet-disaster/
      index.html
      script.js
      firmware.ino
      hackrf.py
      main.py
    ...
```

### File types by hardware target

| File | Purpose | Hardware |
|------|---------|----------|
| `index.html` | App dashboard and UI | Browser |
| `script.js` | Browser-side logic, Web Bluetooth/Serial, visualization | Browser |
| `makecode.js` | MakeCode firmware for micro:bit | BBC micro:bit |
| `firmware.ino` | Arduino sketch for ESP32 boards | ESP32 |
| `hackrf.py` | Python script for HackRF SDR control | HackRF One |
| `main.py` | Python service for Raspberry Pi | Raspberry Pi |

---

## Features

- **8 visual themes** -- Terminal (green), Midnight (purple), Ember (orange), Arctic (light), Phosphor (retro green), Signal (cyan), Redshift (red), Sand (warm light)
- **3 languages** -- English, French, Arabic with full RTL layout support
- **Voting system** -- Enter your agent codename, vote on projects, export results as JSON
- **Live search** -- Filter projects instantly by keyword across all 413 entries
- **Hardware filters** -- Show only projects for a specific board (micro:bit, ESP32, HackRF, WiFi, RPi, Browser-only, Mixed)
- **Sort modes** -- By category (default) or by vote count
- **Split-click navigation** -- Click a project card to open its dedicated app page
- **Collapsible categories** -- Expand/collapse individual sections or all at once

---

## Stats

| Metric | Count |
|--------|-------|
| Total projects | **413** |
| Categories | **50** |
| Hardware firmware files | **508+** |
| Languages | **3** (EN, FR, AR) |
| Visual themes | **8** |
| External dependencies | **0** |

---

## License

MIT

---

## Credits

Built by the **Workshop-DIY** team.
