# esp-internet-simulator -- Workshop DIY

Internet Simulator is an interactive web app where each node represents a real internet component (DNS server, Router, Firewall, Web Server). Students trace an HTTP request journey through the full network stack.

## What You Learn

- **DNS Resolution**: How domain names map to IP addresses
- **Routing**: How packets travel through network devices
- **Firewalls**: How security rules filter traffic
- **HTTP Request/Response**: The complete lifecycle of a web request

## Features

- Network canvas with labeled nodes (Client, DNS, Router, Firewall, Web Server)
- Animated packet traveling through the network on each request
- DNS resolution simulation with domain-to-IP mapping
- Firewall with blocked domain list (try malware.bad)
- Request/response path visualization with return journey
- Hop-by-hop request log with timestamps
- Trilingual: English, French, Arabic (RTL)
- 8 visual themes, PWA-ready

## Quick Start

1. Open `index.html` in a modern browser
2. Enter a URL (or use the default)
3. Click **Send Request** and watch the packet journey
4. Check the request log for hop details

## Project Structure

```
esp-internet-simulator/
  index.html        Main app page
  script.js         App logic + network simulation
  style.css         Theme system (do not modify)
  manifest.json     PWA manifest
  docs/HOWTO.md     Step-by-step guide
  README.md         This file
  CHANGES.md        Version history
```

## License

Educational use -- Workshop-DIY project by abourdim.
