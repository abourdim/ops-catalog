# esp-arp-detective — How To Use

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)

## Lab Walkthrough

### Step 1: Start ARP Scan
Click Start Scan to begin monitoring. Simulated devices will appear in the ARP table.

### Step 2: Observe Normal Traffic
Watch legitimate ARP entries appear with green status indicators. Note the IP-MAC-Vendor mappings.

### Step 3: Inject a Spoof
Click Inject Spoof to simulate an ARP spoofing attack. The alert bar activates and the spoofed entry appears in red.

### Step 4: Analyze the Topology
Open Network Topology to see how devices connect. Spoofed connections appear as red lines.

### Step 5: Visualize MITM
Open MITM Visualization to see how the attacker intercepts traffic between victim and gateway.

### Step 6: Try the Challenges
Test your understanding of ARP security concepts.

## What Each Step Teaches

| Step | Concept |
|------|---------|
| 1 | ARP protocol and network discovery |
| 2 | Normal ARP table behavior |
| 3 | ARP spoofing mechanics |
| 4 | Network topology and trust |
| 5 | Man-in-the-Middle attack flow |
| 6 | Defense strategies |

## Going Further

- Use ESP32 to build a real ARP monitor with `esp_wifi_get_arp_table()`
- Implement static ARP entries on your router
- Study Wireshark ARP filters for real detection
