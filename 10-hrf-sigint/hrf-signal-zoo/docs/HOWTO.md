# How-To: Signal Zoo — Modulation Encyclopedia

## Getting Started

1. Open `index.html` in any modern browser.
2. Click a modulation button to select it.
3. Three views update simultaneously: waveform, spectrum, and constellation.

## Modulation Types

- **AM**: Amplitude varies with message. Broadcast radio.
- **FM**: Frequency varies with message. FM radio, two-way comms.
- **FSK**: Two discrete frequencies for binary data. Pagers, sensors.
- **BPSK**: Two phase states (0/180). 1 bit/symbol. GPS, DSSS.
- **QPSK**: Four phase states. 2 bits/symbol. Satellite, 4G.
- **16-QAM**: 16 amplitude+phase states. 4 bits/symbol. WiFi, LTE.
- **LoRa**: Chirp spread spectrum. IoT long-range.
- **Zigbee**: O-QPSK with half-sine. Home automation mesh.

## Reading the Displays

### Waveform
- X axis is time, Y axis is amplitude.
- Binary data bits shown along the top.
- Observe how the carrier changes with each bit.

### Spectrum
- Shows frequency content of the modulated signal.
- Carrier at center, sidebands spread outward.
- Bandwidth varies by modulation type.

### Constellation
- I (in-phase) on X axis, Q (quadrature) on Y axis.
- Each cluster represents a unique symbol/bit pattern.
- More points = higher data rate but less noise tolerance.
