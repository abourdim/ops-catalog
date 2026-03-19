# HOWTO — Collision Visualizer

## What is this?
Collision Visualizer shows what happens when two 2.4 GHz transmitters broadcast on the same frequency. Bits collide, errors occur, and the Bit Error Rate rises.

## Quick Start
1. Open `index.html` in a browser
2. Click "Start Simulation"
3. Adjust TX1 and TX2 power with sliders
4. Watch the collision zone (red) on the canvas
5. See errored bits highlighted in red in the bit stream

## Key Concepts
- **BER**: Percentage of bits received incorrectly
- **SIR**: Signal-to-Interference Ratio (power difference in dB)
- **Capture Effect**: When SIR > 6 dB, the stronger signal dominates
- **Equal Power**: Maximum interference and highest BER

## Experiment Ideas
- Set both TX to 10 dBm — maximum collision
- Set TX1=20, TX2=2 — capture effect kicks in
- Watch BER chart respond to power changes in real time
