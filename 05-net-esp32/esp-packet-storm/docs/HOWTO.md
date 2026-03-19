# esp-packet-storm — How To Use

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)

## Lab Walkthrough

### Step 1: Select Protocol
Choose TCP, UDP, ICMP, ARP, or MIX from the dropdown. MIX generates a random mix of all types.

### Step 2: Set the Rate
Adjust the rate slider to control how many packets per second are generated (1-100 pps).

### Step 3: Start the Storm
Click "Start Storm" to begin. Watch packets flow across the matrix-style canvas with color-coded trails.

### Step 4: Inspect Packets
The hex inspector shows raw packet data for each generated packet, including headers, IPs, ports, and flags.

### Step 5: Analyze Protocol Breakdown
The protocol bar shows the ratio of TCP (blue), UDP (green), ICMP (yellow), and ARP (red) packets.

### Step 6: Stop and Review
Click "Stop" to halt generation. Review statistics and the activity log for a summary.

## What Each Step Teaches

| Step | Concept |
|------|---------|
| 1 | Network protocol types |
| 2 | Traffic rate and bandwidth |
| 3 | Packet generation and flow |
| 4 | Hex packet inspection (like Wireshark) |
| 5 | Protocol distribution analysis |
| 6 | Traffic monitoring |

## Going Further

- Compare TCP vs UDP packet structures in the hex inspector
- Generate a pure ARP storm and observe the header format
- Think about how an IDS would flag this traffic
