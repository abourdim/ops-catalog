# esp-signal-ghost — How To Use

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)

## Lab Walkthrough

### Step 1: Start Ghosting
Click "Start Ghosting" to begin cycling through random MAC addresses. The large display shows each new MAC.

### Step 2: Watch the Counters
Ghost Devices counts unique MACs generated. Cycles/sec shows the current speed. The chaos meter fills as more ghosts appear.

### Step 3: Enable TURBO
Click the red TURBO button to dramatically increase the cycling speed. Watch the counters accelerate.

### Step 4: Monitor the Device Flood
The scrolling list below shows each ghost device with a fake vendor, RSSI value, and timestamp.

### Step 5: Check the MAC Lab
Open the MAC Lab section to see how ARP table entries grow and the DHCP pool depletes.

### Step 6: Reset
Click Reset to clear all ghost devices and start fresh. Click Stop to pause without clearing.

## What Each Step Teaches

| Step | Concept |
|------|---------|
| 1 | MAC address generation and spoofing |
| 2 | Network device discovery overhead |
| 3 | Flood attack amplification |
| 4 | How networks track connected devices |
| 5 | ARP table overflow and DHCP exhaustion |
| 6 | Attack termination and cleanup |

## Going Further

- Observe how fast the chaos meter reaches 100%
- Think about what port security would do in response
- Compare normal mode vs TURBO mode cycle rates
