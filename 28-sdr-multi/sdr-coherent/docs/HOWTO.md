# SDR Coherent Receiver — How To Use

## Quick Start
1. Open `index.html` in any modern browser
2. Set number of SDR elements (2-16) and spacing
3. Adjust beam steering angle and signal arrival angle
4. Click **Start** to see live beam pattern and array response

## Controls
- **Elements**: number of SDR receivers in the array
- **Spacing**: distance between elements in wavelengths (0.5 lambda typical)
- **Beam Steering**: direction the array focuses sensitivity
- **Signal Angle**: direction of incoming signal
- **SNR**: signal-to-noise ratio

## Array Performance (Section A)
- Array Gain: theoretical gain from coherent combining (10 log10 N)
- Beam Width: -3dB width of main lobe in degrees
- Sidelobe Level: strongest sidelobe relative to main beam
- SNR Improvement: gained by coherent combining

## Phase Calibration (Section B)
- Click **Add Phase Errors** to simulate realistic SDR clock mismatches
- Watch how beam pattern degrades
- Click **Calibrate** to correct errors and restore pattern

## Tips
- Half-wavelength spacing (0.50 lambda) avoids grating lobes
- More elements = narrower beam and higher gain
- Steer beam to signal direction for maximum reception
- Phase errors broaden beam and raise sidelobes
