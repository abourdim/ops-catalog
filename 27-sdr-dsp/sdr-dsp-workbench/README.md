# 📡 SDR DSP Workbench — Workshop DIY

Interactive DSP signal processing workbench with live waterfall and spectrum display.

## Features

- **7 signal sources**: sine, square, sawtooth, white noise, chirp, AM, FM
- **5 filter types**: none, low-pass, high-pass, band-pass, notch
- **Live spectrum display** with dB scale and frequency axis
- **Waterfall display** with color-mapped intensity
- **Signal analysis**: peak frequency, bandwidth, SNR, RMS level, crest factor
- **DSP chain builder**: add gain, delay, compressor, distortion blocks
- **FFT sizes**: 256 to 4096 points with Hann windowing
- **Trilingual**: English, Francais, Arabic (RTL)
- **8 themes** with Islamic art inspiration
- **PWA ready** — works offline

## How It Works

1. Select a signal source and adjust frequency
2. Choose a filter type and set cutoff frequency
3. Press Start to begin real-time DSP processing
4. Watch the spectrum and waterfall update live
5. Add DSP chain blocks for additional processing

## Files

| File | Description |
|------|-------------|
| `index.html` | UI layout with canvas displays and controls |
| `script.js` | DSP engine, FFT, filters, i18n, simulation |
| `style.css` | Shared Workshop DIY theme styles |
| `manifest.json` | PWA manifest |

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
