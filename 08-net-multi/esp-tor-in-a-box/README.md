# esp-tor-in-a-box -- Workshop DIY

Tor in a Box simulates physical onion routing with 3 ESP32 relay nodes. Students type a message that gets wrapped in 3 layers of XOR encryption, then watch each relay peel one layer until the plaintext is revealed at the exit.

## What You Learn

- **Onion Routing**: Multi-layer encryption where each relay peels one layer
- **XOR Encryption**: Simple bitwise cipher demonstrating the layering principle
- **Anonymity**: Why 3 relays (guard, middle, exit) provide sender/receiver unlinkability
- **Relay Roles**: Guard knows sender, exit knows destination, middle knows neither

## Features

- 3-node relay canvas with onion layer visualization
- Message input with triple XOR encryption (wrap at sender, unwrap at each relay)
- Animated packet with shrinking onion layers at each hop
- Layer display showing encrypted hex at each stage
- Random key generation for each message
- Trilingual: English, French, Arabic (RTL)
- 8 visual themes, PWA-ready

## Quick Start

1. Open `index.html` in a modern browser
2. Type a secret message
3. Click **Encrypt & Send**
4. Watch the 3-layer encryption being peeled at each relay

## Project Structure

```
esp-tor-in-a-box/
  index.html        Main app page
  script.js         App logic + onion routing simulation
  style.css         Theme system (do not modify)
  manifest.json     PWA manifest
  docs/HOWTO.md     Step-by-step guide
  README.md         This file
  CHANGES.md        Version history
```

## License

Educational use -- Workshop-DIY project by abourdim.
