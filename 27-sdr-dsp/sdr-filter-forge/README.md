# 🔬 SDR Filter Forge — Workshop DIY

Design, visualize and test digital filters for SDR signal processing.

## Features

- **FIR filter design**: low-pass, high-pass, band-pass with Hamming window
- **IIR filter design**: Butterworth low-pass, high-pass, band-pass (biquad cascade)
- **Frequency response plot** with dB scale
- **Pole-zero diagram** on the complex plane
- **Filter coefficient display** for both FIR and IIR
- **Live test signal**: multi-frequency signal with before/after comparison
- **Adjustable order** (2-64 taps) and **cutoff frequency**
- **Trilingual**: English, Francais, Arabic (RTL)
- **8 themes** with Islamic art inspiration

## How It Works

1. Select filter type (FIR or IIR) and topology
2. Set order and normalized cutoff frequency
3. Click Design to compute and visualize
4. Click Test to apply filter to a sample signal

## Files

| File | Description |
|------|-------------|
| `index.html` | UI with frequency response and pole-zero canvas |
| `script.js` | Filter design engine, FIR/IIR, i18n, simulation |
| `style.css` | Shared Workshop DIY theme styles |
| `manifest.json` | PWA manifest |

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
