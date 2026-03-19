# esp-spectrum-wars — How To Use

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)

## Lab Walkthrough

### Step 1: Start the Battle
Click Start Battle. Three devices begin competing for bandwidth on the same WiFi channel.

### Step 2: Observe Throughput
Watch the stats row showing total collisions and average throughput. Device-specific stats appear in the device list.

### Step 3: Add More Devices
Click + Add Device to increase competition. Watch throughput drop and collisions increase with each new device.

### Step 4: Analyze the Spectrum
The main canvas shows overlapping signal waveforms. Collision flashes appear when packets overlap.

### Step 5: Check Throughput Graph
Open Throughput Graph to see each device's bandwidth over time as colored lines.

### Step 6: Visualize Collisions
Open Collision Visualization to see packets flowing from transmitters to the AP, with collisions marked as X.

### Step 7: Try the Challenges
Test your understanding of spectrum contention concepts.

## What Each Step Teaches

| Step | Concept |
|------|---------|
| 1 | Shared medium fundamentals |
| 2 | Throughput measurement |
| 3 | Contention scaling |
| 4 | Spectral overlap visualization |
| 5 | Bandwidth fairness |
| 6 | Collision detection and retransmission |
| 7 | Modern WiFi solutions (OFDMA, MU-MIMO) |

## Going Further

- Use ESP32 with `WiFi.scanNetworks()` to detect real channel congestion
- Experiment with channel selection to avoid interference
- Study WiFi 6/6E channel allocation with 160 MHz channels
