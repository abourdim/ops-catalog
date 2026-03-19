# How-To: Pi SDR Station

## Getting Started

1. Open `index.html` in any modern browser.
2. Click **Start SDR** to begin simulated reception.
3. The waterfall display and FFT spectrum will activate.

## Tuning Frequencies

- Enter a frequency in the input field (24-1766 MHz).
- Click **Tune** to change the center frequency.
- The waterfall frequency range updates automatically based on sample rate.

## Adjusting Settings

- **Gain**: Use the slider to adjust receiver gain (0-50 dB).
- **Mode**: Select demodulation mode (FM, AM, USB, LSB, RAW IQ).
- **Sample Rate**: Choose bandwidth from 250 kHz to 2.4 MHz.

## Reading the Displays

- **Waterfall**: Time flows downward. Bright colors = strong signals.
- **FFT**: Real-time power spectrum. Peaks indicate active signals.
- **Audio Meter**: Shows demodulated audio output level.
- **SNR**: Signal-to-noise ratio of current reception.

## Pi System Monitoring

- CPU usage, RAM, temperature, and uptime are shown in the top cards.
- Values simulate realistic Raspberry Pi behavior under SDR load.

## Settings

- Change language (EN/FR/AR) in Settings panel
- Switch between 8 visual themes
- Toggle sound effects
- Activity log tracks all events

## About SDR

Software-Defined Radio uses software to process radio signals instead of dedicated hardware. An RTL-SDR dongle costs around $25 and can receive from 24 MHz to 1.766 GHz. Combined with a Raspberry Pi, it becomes a powerful remote SDR server accessible over the network.
