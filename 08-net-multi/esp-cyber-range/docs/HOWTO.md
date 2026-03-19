# How To Use Cyber Range

## Overview

Cyber Range simulates a corporate network where Red Team (attackers) and Blue Team (defenders) compete. Deploy defenses and launch attacks to learn cybersecurity concepts.

---

## Step 1: Understand the Network

The canvas shows a corporate network: Internet connects through a Firewall and Router to two switches, which connect to Web Server, Workstation, Database, and IDS.

## Step 2: Play Blue Team (Defense)

1. Click **Enable Firewall** to block unauthorized port scans.
2. Click **Deploy IDS** to detect lateral movement attempts.
3. Click **Patch Systems** to close known vulnerabilities.
4. Click **Isolate Segment** to prevent data exfiltration from the database.

## Step 3: Play Red Team (Attack)

1. **Port Scan**: Discovers open ports (blocked by firewall).
2. **Exploit Vulnerability**: Exploits CVE on web server (blocked by patching).
3. **Lateral Movement**: Moves from web server to database (detected by IDS).
4. **Data Exfiltration**: Steals data from database (blocked by isolation).

## Step 4: Watch the Scores

- Red Team scores 10 points per successful attack.
- Blue Team scores 5 points per defense deployed and per blocked attack.
- The event feed shows real-time attack/defense notifications.

---

## Defense vs Attack Matrix

| Attack | Countered By |
|--------|-------------|
| Port Scan | Firewall |
| Exploit | Patch Systems |
| Lateral Movement | IDS |
| Data Exfiltration | Isolate Segment |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| All attacks succeed | Deploy defenses first before attacking |
| Score not updating | Check the scoreboard above the team panels |
| Animations not visible | Ensure canvas is visible and not scrolled away |
