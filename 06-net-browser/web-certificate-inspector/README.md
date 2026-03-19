# Certificate Inspector — TLS Chain

**Workshop DIY — Net Browser Collection**

Visualize TLS certificate chains from root to leaf. Inspect valid, expired, and self-signed certificate scenarios.

## Features

- 3 preset certificate chains: valid, expired, self-signed
- Certificate card display with issuer/subject/expiry/algorithm
- Chain validation indicator (green/orange/red)
- Side-by-side chain comparison tool (Section C)
- Trilingual i18n (EN / FR / AR with RTL)
- 8 themes, activity log, sound effects

## Files

| File | Description |
|------|-------------|
| `index.html` | Layout: main card + 3 sections + help/settings panels |
| `script.js` | i18n, simulation engine, cert chain rendering, comparison |
| `style.css` | Shared template styles (unchanged) |
| `manifest.json` | PWA manifest |

## Quick Start

Open `index.html` in a browser. Select a domain scenario, click Inspect Chain, explore the certificate cards.

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
