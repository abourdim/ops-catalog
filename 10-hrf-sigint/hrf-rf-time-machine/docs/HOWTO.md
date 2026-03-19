# How-To: RF Time Machine — Spectrum DVR

## Getting Started

1. Open `index.html` in any modern browser.
2. Click **Record** to start capturing spectrum frames.
3. The waterfall will build up showing signals over time.

## Transport Controls

- **Record**: Start capturing simulated spectrum frames.
- **Stop**: Halt recording or playback.
- **Play**: Replay recorded frames from current position.
- **Rewind**: Jump back to the beginning of the recording.

## Timeline Scrubber

- After stopping, drag the timeline slider to seek to any point.
- The waterfall and spectrum views update to show the selected frame.
- The time display shows current position and total duration.

## Reading the Waterfall

- X axis shows frequency (centered on 100.0 MHz, 2.4 MHz bandwidth).
- Y axis is time — newest data at the bottom.
- Color represents signal power: blue = noise floor, yellow = moderate, red = strong.
- Horizontal lines indicate persistent signals (e.g., FM stations).
- Brief bursts appear as short colored streaks.

## Live Spectrum

- Shows the current FFT frame as a traditional spectrum plot.
- Updates in real-time during recording or as you scrub the timeline.

## About Spectrum DVR

A Spectrum DVR records FFT frames over time, creating a rewindable waterfall.
This is invaluable for catching intermittent signals, analyzing time-varying
behavior, or reviewing spectrum activity you may have missed. Tools like
gqrx, SDR#, and inspectrum provide this capability with real SDR hardware.
