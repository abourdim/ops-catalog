# SDR IQ Explorer — How To Use

## Quick Start
1. Open `index.html` in any modern browser
2. Select an IQ signal mode from the dropdown
3. Adjust frequency and optional imbalance parameters
4. Click **Start** to begin live IQ visualization

## Displays
- **IQ Plane (Lissajous)**: plots I vs Q as scatter points
- **Time Domain**: I channel (gold) and Q channel (blue) waveforms
- **Phase/Magnitude**: instantaneous phase (orange) and envelope (green)

## IQ Modes
- **CW**: single complex tone — perfect circle on IQ plane
- **Dual Tone**: two frequencies — creates complex Lissajous pattern
- **Sweep**: frequency sweep — expanding spiral
- **Chirp**: linear frequency chirp
- **QPSK**: 4 constellation points with carrier
- **Noise**: complex Gaussian noise
- **IQ Imbalance**: demonstrates gain/phase mismatch effects

## IQ Statistics (Section A)
- I/Q RMS levels — should be equal for balanced system
- Correlation — should be near zero for orthogonal I/Q
- Image Rejection — higher is better
- Instantaneous Frequency — derived from phase derivative

## IQ Correction (Section B)
- Click **Apply Auto-Correction** to compensate measured imbalance
- Watch the IQ plane change from ellipse back to circle

## Tips
- Start with CW mode and zero imbalance to see perfect circle
- Add gain imbalance to see ellipse on IQ plane
- Add phase imbalance to see tilted ellipse
- Apply correction to see how compensation works
