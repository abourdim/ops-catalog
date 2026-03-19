# SDR FFT Racing — How To Use

## Quick Start
1. Open `index.html` in any modern browser
2. Select FFT size (64-1024), test signal, and window function
3. Set iteration count (higher = more accurate benchmark)
4. Click **Race!** to run the benchmark

## Algorithms
- **Naive DFT**: direct O(N²) computation — baseline reference
- **Cooley-Tukey**: classic radix-2 decimation-in-time FFT
- **Split-Radix**: optimized FFT with pre-computed twiddle factors

## Race Results (Section A)
- Execution time for each algorithm over all iterations
- Max numerical error between DFT and FFT (should be near zero)
- Winner indicator

## Complexity Chart (Section B)
- Shows O(N²) vs O(N log N) growth curves
- Demonstrates why FFT is essential for large signal blocks

## Tips
- Start with small FFT (64) and few iterations to see quick results
- Increase to 512 or 1024 to see dramatic DFT slowdown
- Try different signals — performance is independent of signal content
- Window functions affect spectrum but not FFT speed
- Error between DFT and FFT should be at machine precision (~1e-7)
