# How To Use — Replay Lab

## Getting Started

1. Open `index.html` in a modern browser (Chrome, Firefox, Edge)
2. Click **Transmit** to send a keyfob signal
3. Click **Capture** to record the transmission
4. Click **Replay** to retransmit the captured signal

## The Experiment

### Fixed Code Mode (default)
1. Transmit a keyfob signal (always sends the same code)
2. Capture the signal
3. Replay it -- the door opens! This shows the vulnerability

### Rolling Code Mode
1. Toggle **Rolling Code** ON
2. Transmit -- the keyfob sends a new code each time
3. Capture and replay -- the door stays locked!
4. The code has already been used and the receiver expects the next one

## Controls

- **Transmit**: Simulate a keyfob press
- **Capture**: Record the last transmission
- **Replay**: Retransmit the captured signal
- **Rolling Code Toggle**: Switch between fixed and rolling code modes

## Educational Notes

Rolling codes (KeeLoq, etc.) use synchronized counters. Each press generates a new code, making captured signals useless for replay.
