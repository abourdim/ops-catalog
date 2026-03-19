# How To Use — RF Waterfall

## Getting Started

1. Open `index.html` in a modern browser (Chrome, Firefox, Edge)
2. Click **Start Scan** to begin the waterfall display
3. Watch as simulated RF signals appear on the spectrogram

## Controls

- **Start/Stop**: Begin or halt the scanning simulation
- **Clear**: Reset the waterfall display and detected signal list
- **Speed**: Adjust scan line scrolling speed
- **Center Frequency**: Set the center of the displayed band (0-6000 MHz)
- **Span**: Set the width of the displayed frequency range (50-6000 MHz)

## Preset Bands

| Button | Center | Span | What You See |
|--------|--------|------|-------------|
| FM | 98 MHz | 40 MHz | FM broadcast stations |
| ISM 433 | 433 MHz | 20 MHz | Keyfobs, weather sensors |
| ISM 915 | 915 MHz | 50 MHz | LoRa, RFID (Americas) |
| WiFi 2.4 | 2450 MHz | 100 MHz | WiFi channels 1, 6, 11 + BLE |
| WiFi 5 | 5500 MHz | 500 MHz | WiFi 5 GHz bands |
| Full 0-6GHz | 3000 MHz | 6000 MHz | Entire spectrum overview |

## Understanding the Display

- **Colors**: Blue = weak signal (noise floor), Green/Yellow = moderate, Red/White = strong
- **Horizontal axis**: Frequency (labeled at bottom)
- **Vertical axis**: Time (newest at top, scrolling down)
- **Signal labels**: Appear at the top of the waterfall for known bands

## Detected Signals

Open the **Detected Signals** section to see all signals found during scanning, with power levels and hit counters.

## Settings

- Change language (EN/FR/AR) from the Settings panel
- Switch between 8 visual themes
- Enable sound effects for feedback

## Educational Notes

This is a simulation for learning purposes. Real spectrum analysis requires:
- An SDR dongle (e.g., RTL-SDR, HackRF)
- Software like GQRX, SDR#, or GNU Radio
- An appropriate antenna for the frequency range
