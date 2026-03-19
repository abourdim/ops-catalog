# esp-dark-net-radio — How To Use

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- Optional: ESP32 boards for real mesh testing

## Lab Walkthrough

### Step 1: Explore the Mesh
Open the app and observe the mesh topology canvas. Nodes represent ESP32 devices forming a private WiFi mesh.

### Step 2: Add Nodes
Click "Add Node" to grow the mesh. Watch nodes auto-discover neighbors and form connections.

### Step 3: Send Encrypted Messages
Type a message, select source and destination nodes, and click "Send". Watch the encrypted message hop through relay nodes.

### Step 4: Break a Link
Click on a connection to break it. The mesh detects the failure and reroutes messages through alternate paths.

### Step 5: Voice Simulation
Click "Voice" to simulate voice packet streaming over the mesh. Watch packets flow in real-time.

### Step 6: Try the Lab
Open Section B to experiment with different mesh topologies, encryption settings, and failure scenarios.

### Step 7: Complete the Challenges
Test your knowledge with 3 challenges about mesh resilience, encryption, and network design.

## What Each Step Teaches

| Step | Concept |
|------|---------|
| 1 | Mesh network topology |
| 2 | Node discovery and ESP-NOW |
| 3 | End-to-end encryption over mesh |
| 4 | Self-healing and rerouting |
| 5 | Real-time voice over mesh |
| 6 | Network design principles |
| 7 | Applied mesh networking |

## Going Further

- Flash ESP32 boards with ESP-NOW mesh firmware
- Test with real encrypted messaging
- Build a mesh with 5+ ESP32 nodes
