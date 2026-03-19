# SDR DSP Workbench — How To Use

## Quick Start
1. Open `index.html` in any modern browser
2. Select a signal source (sine, square, sawtooth, noise, chirp, AM, FM)
3. Adjust the frequency slider (100-4000 Hz)
4. Choose a filter type and set the cutoff frequency
5. Click **Start** to begin live DSP processing

## Displays
- **Spectrum**: real-time frequency-domain view with dB scale
- **Waterfall**: scrolling time-frequency display with color intensity mapping

## Signal Analysis (Section A)
- Peak Frequency: dominant frequency component
- Bandwidth: -3dB bandwidth around peak
- SNR: signal-to-noise ratio in dB
- RMS Level: root mean square level in dBFS
- Crest Factor: peak-to-RMS ratio

## DSP Chain Builder (Section B)
- Click **+ Gain** to add a 2x amplifier
- Click **+ Delay** to add a 100-sample echo
- Click **+ Compressor** to add dynamic range compression
- Click **+ Distortion** to add soft-clip distortion via tanh
- Click any block to remove it from the chain
- Click **Clear** to remove all blocks

## DSP Theory (Section C)
- Learn about FFT, filters, Nyquist theorem, windowing, and convolution

## Settings
- Change language: English, Francais, Arabic (auto-RTL)
- Change theme: 8 built-in themes
- Toggle sound effects

## Tips
- Start with a sine wave to understand basic filtering
- Compare low-pass vs high-pass to see filter effects on spectrum
- Add noise source + band-pass filter to isolate frequency bands
- Use the chain builder to understand signal processing pipelines
