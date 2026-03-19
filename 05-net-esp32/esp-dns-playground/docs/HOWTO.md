# esp-dns-playground — How To Use

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- Optional: ESP32 board for real DNS server deployment

## Lab Walkthrough

### Step 1: Review Default Rules
The app starts with sample rules redirecting evil.com and ads.tracker.net. Review how domains map to IPs.

### Step 2: Add Custom Rules
Enter a domain name and target IP, then click Add Rule. Try redirecting a known domain to 0.0.0.0 (block) or 192.168.4.1 (redirect to ESP32).

### Step 3: Test the Resolver
Type any domain in the resolver input and click Resolve. Compare the before (normal DNS) and after (ESP DNS) results.

### Step 4: Start Auto Queries
Click Start DNS Server to generate simulated DNS traffic. Watch queries appear in the log with their resolution results.

### Step 5: Watch the Animation
Open the DNS Animation section to see packets flowing from client through ESP32 to the internet, with blocked queries highlighted in red.

### Step 6: Try the Challenges
Test your understanding of DNS concepts in the Challenge section.

## What Each Step Teaches

| Step | Concept |
|------|---------|
| 1 | DNS rule tables and domain mapping |
| 2 | DNS sinkholes and ad-blocking |
| 3 | DNS resolution comparison |
| 4 | DNS query traffic patterns |
| 5 | Network packet visualization |
| 6 | DNS security and filtering concepts |

## Going Further

- Deploy a real DNS server on ESP32 with the DNSServer library
- Build a Pi-hole-like ad blocker with blocklists
- Explore DNS over HTTPS (DoH) for encrypted DNS
