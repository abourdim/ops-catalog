# How To Use Internet Simulator

## Overview

Internet Simulator visualizes how an HTTP request travels through the internet infrastructure: from your browser through DNS, routers, firewalls, and finally to the web server.

---

## Step 1: Enter a URL

1. Open the app in a modern browser.
2. The default URL is `http://workshop-diy.org`.
3. You can change it to `http://example.com`, `http://google.com`, or any domain.
4. Try `http://malware.bad` to see the firewall block the request.

## Step 2: Send the Request

1. Click **Send Request** or press Enter.
2. Watch the red REQ packet travel from Client through DNS, Router, Firewall, to Web Server.
3. If the request is allowed, a green RES packet travels back.

## Step 3: Read the Log

- The request log below the canvas shows each hop with timestamps.
- The Activity Log (scroll icon) shows TX/RX events.
- Blocked requests show a red error in both logs.

## Step 4: Experiment

- Try different domains to see DNS resolve different IP addresses.
- Try blocked domains (malware.bad, phishing.evil, hack.test) to see firewall blocking.
- Watch how the response takes the reverse path.

---

## Node Types

| Node | Role | Color |
|------|------|-------|
| Client | Your browser sending the request | Blue |
| DNS Server | Resolves domain name to IP address | Cyan |
| Router | Forwards packets between networks | Green |
| Firewall | Filters traffic based on security rules | Orange |
| Web Server | Hosts the website and sends responses | Purple |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Packet not moving | Wait for current animation to finish before sending another request |
| No response received | Check if the domain is in the blocked list |
| Canvas looks empty | Try refreshing the browser |
