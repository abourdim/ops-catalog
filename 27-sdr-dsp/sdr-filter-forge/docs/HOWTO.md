# SDR Filter Forge — How To Use

## Quick Start
1. Open `index.html` in any modern browser
2. Select a filter type from the dropdown (FIR or IIR)
3. Adjust the filter order and cutoff frequency
4. Click **Design** to compute and visualize the filter

## Filter Types
- **FIR Low-Pass**: passes low frequencies, blocks high
- **FIR High-Pass**: passes high frequencies, blocks low
- **FIR Band-Pass**: passes a frequency band
- **IIR Butterworth LP/HP/BP**: efficient recursive filters

## Displays
- **Frequency Response**: magnitude response in dB vs normalized frequency
- **Pole-Zero Plot**: zeros (circles) and poles (crosses) on the complex plane

## Coefficients (Section A)
- View computed filter coefficients
- FIR: tap weights h[n]
- IIR: biquad section b/a coefficients

## Live Test (Section B)
- Click **Test** to apply the filter to a multi-frequency test signal
- Gray = original signal, colored = filtered output

## Tips
- Start with FIR low-pass, order 16, cutoff 0.5
- Increase order for sharper roll-off
- Watch pole-zero plot to check IIR stability
- Compare FIR vs IIR with same cutoff to see differences
