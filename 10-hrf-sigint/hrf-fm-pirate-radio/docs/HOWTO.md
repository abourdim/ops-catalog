# How To Use — FM Pirate Radio

## Getting Started

1. Open `index.html` in a modern browser (Chrome, Firefox, Edge)
2. Select a broadcast frequency on the FM dial
3. Choose an audio source (TTS or Tone)
4. Click **GO LIVE** to start broadcasting

## Controls

- **FM Dial Slider**: Tune from 87.5 to 108.0 MHz
- **TTS Text**: Type a message and broadcast it as speech
- **Tone Generator**: Select frequency (100-2000 Hz) and waveform shape
- **GO LIVE / STOP**: Start or stop the broadcast
- **VU Meter**: Shows audio level (green=good, yellow=loud, red=clipping)

## Audio Sources

| Source | Description |
|--------|-------------|
| TTS Text | Uses browser speech synthesis to broadcast typed text |
| Tone Generator | Generates continuous tone at selected frequency |

## FM Modulation Display

The modulation section shows three waveforms:
- **Audio Signal** (green): The baseband audio content
- **Carrier** (blue): The unmodulated FM carrier wave
- **FM Modulated** (yellow): The carrier with frequency varied by audio

## Settings

- Change language (EN/FR/AR) from the Settings panel
- Switch between 8 visual themes
- Enable sound effects for feedback

## Educational Notes

This is a simulation. Real FM broadcasting requires:
- An FM transmitter (e.g., Raspberry Pi + rpitx, or dedicated hardware)
- A broadcast license (unlicensed FM transmission is illegal in most countries)
- An antenna tuned for FM frequencies
