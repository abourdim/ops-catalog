# HOWTO — bit-micro-wire

## Getting Started

### Step 1: Open the App

Open `index.html` in a modern browser (Chrome, Edge, Firefox). The splash screen will appear for 2.5 seconds, then the main interface loads.

### Step 2: Start Audio Capture

Click the **Start Listening** button (green) in the main card. The browser will request microphone permission:

- **If granted**: Real microphone audio is captured and visualized on the waveform canvas. The volume meter shows live RMS levels. The status pill turns green ("Connected").
- **If denied**: A 440 Hz sine wave is generated as a fallback so you can still explore the simulation without a microphone.

### Step 3: Observe the Waveform

The canvas displays the audio waveform in real time using the current theme accent color. Below it, the volume meter bar shows the loudness (RMS). The BLE stream stats update every 500 ms:

- **Packets**: Total 20-byte BLE packets "sent"
- **Bytes**: Total data volume transferred
- **Latency**: Simulated BLE latency (base 7.5 ms + noise from packet loss)

### Step 4: Simulate BLE Transmission

Open the **Lab** section and adjust the **Packet loss** slider (0-50%). Lost packets cause gaps in the waveform (replaced by silence). Higher loss creates visible distortion. The **Sample rate** slider (4000-16000 Hz) adjusts the simulated sampling frequency.

### Step 5: Generate Transcriptions

Click **Transcribe** to produce a simulated spy-themed transcript. The phrase is randomly selected and displayed in the transcript box. If packet loss is active, characters in the phrase are replaced with block characters to simulate corrupted data.

### Step 6: Stop

Click **Stop** to end the audio capture. The waveform freezes, the volume meter resets, and the status pill turns red ("Disconnected"). Stats are preserved for review.

---

## Challenges

### Challenge 1 — Noisy Word
Set packet loss to 30%, click Transcribe repeatedly, and try to identify the original spy phrase from the garbled output.

### Challenge 2 — Max Throughput
Calculate: at 8 kHz / 8-bit, you produce 8,000 bytes/second. Each BLE packet carries 20 bytes. That requires 400 packets/second. BLE 4.2 can handle ~50-100 packets/sec per connection event with optimized intervals. Discuss the gap and potential solutions.

### Challenge 3 — Voice Compression
Instead of sending raw 8-bit samples, use 4-bit delta encoding: store the difference between consecutive samples using only 4 bits. This halves the bandwidth (200 packets/sec instead of 400). Trade-off: delta overflow causes clipping artifacts on sudden volume changes.

---

## Settings

- **Language**: English, French, Arabic (with automatic RTL)
- **Theme**: 8 built-in themes with musical transitions
- **Sound**: Toggle click/success/error audio feedback
- **Whisper mode**: Voice-to-log using Web Speech API
- **Breathing guide**: Animated breathing with dhikr counter

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No waveform appears | Check browser microphone permissions; the app falls back to sine wave if denied |
| Waveform is flat | Speak or make noise near the microphone; check volume meter |
| Stats not updating | Ensure "Start Listening" was clicked and status shows "Connected" |
| Transcript is empty | Click "Transcribe" button; transcription is simulated, not real speech-to-text |
| Canvas is too small | Resize the browser window; canvas width adjusts to container |

---

## Technical Reference

- **Web Audio API**: `getUserMedia()` for microphone, `OscillatorNode` for simulation
- **AnalyserNode**: `fftSize=2048`, `getByteTimeDomainData()` for waveform
- **BLE simulation**: 20-byte packet MTU, 8000 bytes/sec at 8 kHz/8-bit
- **Packet loss**: Random sample zeroing in the draw loop
- **RMS volume**: `sqrt(mean(samples^2))` normalized to 0-100%
