# 🔄 SDR IQ Explorer — Workshop DIY

Visualize I/Q (In-phase/Quadrature) data with Lissajous patterns, phase analysis, and IQ correction.

## Features

- **7 IQ modes**: CW, dual tone, sweep, chirp, QPSK, noise, IQ imbalance demo
- **Lissajous / IQ plane**: scatter plot of I vs Q components
- **Time-domain display**: separate I and Q channel waveforms
- **Phase & magnitude**: instantaneous phase and envelope
- **IQ statistics**: RMS, correlation, image rejection, instantaneous frequency
- **Auto IQ correction**: compensate gain and phase imbalance
- **Adjustable imbalance**: gain (dB) and phase (deg) controls
- **Trilingual**: English, Francais, Arabic (RTL)
- **8 themes** with Islamic art inspiration

## How It Works

1. Select an IQ signal mode
2. Adjust frequency and imbalance parameters
3. Press Start to see live Lissajous and time-domain displays
4. Use auto-correction to fix IQ imbalance

## Files

| File | Description |
|------|-------------|
| `index.html` | UI with IQ plane, time, and phase canvases |
| `script.js` | IQ generation, imbalance, correction, i18n |
| `style.css` | Shared Workshop DIY theme styles |
| `manifest.json` | PWA manifest |

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
