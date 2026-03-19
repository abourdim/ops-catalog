# SDR Signal Generator — How To Use

## Quick Start
1. Open `index.html` in any modern browser
2. Select a signal type from the dropdown
3. Adjust frequency, amplitude, DC offset, and noise level
4. Click **Generate** to see live waveform and spectrum

## Signal Types
- **Sine/Square/Sawtooth/Triangle**: basic waveforms
- **White/Pink Noise**: random signals for testing
- **Sweep**: frequency sweep across band
- **Multi-Tone**: custom additive synthesis via Tone Builder
- **OFDM**: simulated orthogonal frequency division multiplexing
- **Pulse**: periodic pulse train

## Audio Output
- Click **Play Audio** to hear the signal through speakers
- Uses Web Audio API oscillator for real-time synthesis

## Signal Properties (Section A)
- RMS, peak-to-peak, crest factor, THD, bandwidth

## Tone Builder (Section B)
- Add tones with + Add Tone (up to 8)
- Set individual frequency and amplitude per tone
- Click X to remove a tone
- Select "Multi-Tone" signal type to use builder tones

## Tips
- Use sine + low noise to test basic frequency response
- Multi-tone with close frequencies reveals intermodulation
- OFDM signal has high peak-to-average ratio (PAPR)
- Pink noise has equal power per octave — useful for audio testing
