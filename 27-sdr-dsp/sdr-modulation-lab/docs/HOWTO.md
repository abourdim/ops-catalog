# SDR Modulation Lab — How To Use

## Quick Start
1. Open `index.html` in any modern browser
2. Select a modulation type (AM, FM, BPSK, QPSK, 16-QAM, etc.)
3. Adjust carrier frequency, modulation index, and SNR
4. Click **Start** to begin live simulation

## Displays
- **Time Domain**: modulated waveform showing amplitude vs time
- **Spectrum**: frequency-domain view showing occupied bandwidth
- **Constellation**: I/Q diagram for digital modulations (BPSK, QPSK, QAM)

## Signal Metrics (Section A)
- BER: bit error rate estimate for digital modulations
- EVM: error vector magnitude as percentage
- Bandwidth Occupied: estimated signal bandwidth
- Signal Power: total signal power in dBm

## Demodulation (Section B)
- Shows demodulated baseband signal
- AM uses envelope detection
- FM uses frequency discriminator
- Digital modes use coherent detection

## Tips
- Start with AM at high SNR to understand basics
- Lower SNR to see constellation spread in QPSK/QAM
- Compare AM vs SSB bandwidth in spectrum view
- Note how 16-QAM is more bandwidth-efficient but noise-sensitive
