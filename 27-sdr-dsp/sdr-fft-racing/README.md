# 🏎️ SDR FFT Racing — Workshop DIY

Race FFT algorithms — compare Naive DFT, Cooley-Tukey, and Split-Radix implementations.

## Features

- **3 FFT algorithms**: Naive DFT O(N²), Cooley-Tukey O(N log N), Split-Radix O(N log N)
- **Visual race**: animated bar chart showing execution times
- **Spectrum comparison**: overlay DFT vs FFT outputs (should be identical)
- **Complexity chart**: O(N²) vs O(N log N) growth curves
- **4 test signals**: sine + harmonics, white noise, impulse, chirp
- **4 window functions**: rectangular, Hann, Hamming, Blackman
- **FFT sizes**: 64 to 1024 points
- **Configurable iterations** for benchmark accuracy
- **Trilingual**: English, Francais, Arabic (RTL)
- **8 themes** with Islamic art inspiration

## How It Works

1. Choose FFT size, test signal, and window function
2. Set iteration count for benchmark precision
3. Click Race to run all three algorithms and compare
4. View results, spectrum overlay, and complexity chart

## Files

| File | Description |
|------|-------------|
| `index.html` | UI with race and spectrum canvases |
| `script.js` | 3 FFT implementations, benchmarking, i18n |
| `style.css` | Shared Workshop DIY theme styles |
| `manifest.json` | PWA manifest |

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
