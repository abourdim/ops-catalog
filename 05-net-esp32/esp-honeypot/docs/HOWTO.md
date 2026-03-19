# esp-honeypot — How To Use

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- Optional: ESP32 board for real honeypot deployment

## Lab Walkthrough

### Step 1: Configure Services
Toggle SSH, HTTP, and FTP services on or off using the switches. Each service listens on its standard port.

### Step 2: Start the Honeypot
Click "Start Honeypot" to begin receiving simulated attack traffic. The status pill turns green.

### Step 3: Watch the Connection Log
Observe fake login attempts appearing in real time. Each entry shows timestamp, source IP, service, and credentials tried.

### Step 4: Analyze the Attacker Map
Open the Attacker Map section to see geo-IP dots appearing on a world canvas. Each dot represents an attack origin.

### Step 5: Review Credential Harvest
Open the Credential Harvest section to see a table of all captured usernames and passwords, organized by service.

### Step 6: Study the Statistics
The stats row shows total attempts, unique IPs, and total credentials harvested.

### Step 7: Try the Challenges
Open the Challenge section and test your understanding of honeypot security concepts.

## What Each Step Teaches

| Step | Concept |
|------|---------|
| 1 | Service ports and attack surfaces |
| 2 | Passive monitoring and logging |
| 3 | Brute-force attack patterns |
| 4 | Geographic attack analysis |
| 5 | Credential analysis and password hygiene |
| 6 | Attack metrics and threat intelligence |
| 7 | Defensive security thinking |

## Going Further

- Deploy a real honeypot with [Cowrie](https://github.com/cowrie/cowrie)
- Use ESP32 to create a WiFi honeypot access point
- Analyze real attack logs with ELK Stack
