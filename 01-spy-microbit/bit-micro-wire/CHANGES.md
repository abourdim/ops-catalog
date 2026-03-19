# CHANGES — bit-micro-wire

## v1.0 — 2025-03-18

### Added
- Main card with live waveform canvas (Web Audio AnalyserNode)
- RMS-based volume meter with gradient bar
- Start Listening / Stop / Transcribe buttons
- BLE stream stats: packets sent, bytes transferred, simulated latency
- Simulated BLE packetization (20-byte packets at 8 kHz / 8-bit)
- Packet loss slider (0-50%) with real-time waveform corruption
- Sample rate slider (4000-16000 Hz)
- Fake transcription with spy-themed phrases in EN/FR/AR
- Character-level noise injection on transcripts based on packet loss
- Section A: "How It Works" — 4-step explanation of audio-to-BLE pipeline
- Section B: "Lab" — interactive mic/sim controls with packet loss and sample rate
- Section C: "Challenge" — 3 exercises (noisy word, max throughput, voice compression)
- Help panel FAQ: microphone, audio sampling, BLE bandwidth, privacy
- Help panel How-To: 4-step usage guide
- Help panel Wiki: Audio Sampling, BLE Data Channels, Voice Transcription, micro:bit Microphone
- Full i18n for EN, FR, AR (all new keys)
- Sine wave fallback when microphone permission is denied
- README.md with full documentation
- docs/HOWTO.md step-by-step guide

### Infrastructure (preserved from template v1.2)
- 8 themes with melodies
- Trilingual i18n with RTL support
- Activity log with filters, export, time-travel
- Splash screen, Konami code, matrix rain, Morse code
- Ghost cursors, pixel pet, breathing guide, dhikr counter
- PWA manifest, debug panel, shake-to-report
