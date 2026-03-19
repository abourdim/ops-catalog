# How To Use Swarm Net

## Overview

Swarm Net simulates a fleet of ESP32 nodes communicating via ESP-NOW, moving in coordinated formations controlled from a browser command center.

---

## Step 1: Observe the Swarm

1. Open the app in a modern browser.
2. The canvas shows your swarm with 6 default nodes (A through F).
3. Nodes start in "scatter" formation, moving to random positions.
4. Communication lines appear between nearby nodes showing ESP-NOW links.

## Step 2: Change Formations

1. Click one of the formation buttons: **Scatter**, **Line**, **Circle**, **V-Shape**, or **Grid**.
2. Watch all nodes smoothly converge to their assigned positions.
3. Check the **Coherence** percentage in the telemetry dashboard -- it reaches 100% when all nodes are in position.

## Step 3: Send Commands

1. Type a command in the input field (e.g., "rotate").
2. Click **Send** or press Enter.
3. Available commands:
   - **rotate** -- Nodes spin in a circular formation
   - **halt** -- All nodes freeze in place
   - **patrol** -- Nodes sweep the canvas area in a pattern
   - **scatter** -- Nodes disperse to random positions
   - **rally** -- All nodes converge to the center

## Step 4: Set a Rally Point

1. Click anywhere on the canvas.
2. A pulsing red circle marks the rally point.
3. All nodes converge toward that location.
4. You can then switch formations to reorganize around the rally point.

## Step 5: Adjust Parameters

- **Speed slider**: Controls how fast nodes move toward their targets (1-10).
- **Node count slider**: Changes the number of active nodes (3-12).

---

## Telemetry Dashboard

| Metric | Description |
|--------|-------------|
| Formation | Current formation type |
| Active Nodes | Number of nodes in the swarm |
| Messages | Total ESP-NOW messages exchanged |
| Coherence | How close nodes are to their target positions (0-100%) |

---

## Challenges

### Challenge 1: Perfect Circle
Switch to circle formation and wait for 100% coherence. Try to achieve it in under 5 seconds by increasing the speed slider.

### Challenge 2: Patrol Sweep
Send the "patrol" command and observe how nodes systematically sweep through the four corners of the canvas.

### Challenge 3: Mid-Flight Reorganization
Set a rally point by clicking the canvas, then immediately switch to V-shape formation. Watch the swarm reorganize while still in motion.

---

## Settings

- **Theme**: 8 visual themes available (Settings panel).
- **Language**: English, French, Arabic (Arabic enables right-to-left layout).
- **Sound**: Toggle sound effects for click, success, and error events.
- **Log Export**: Copy or download the activity log for your lab report.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Nodes not moving | Check if "halt" command was sent; send "scatter" to resume |
| Low coherence | Increase speed or wait for nodes to reach targets |
| Canvas looks empty | Adjust the node count slider above 3 |
| Commands not working | Make sure to type exact command names (rotate, halt, patrol, scatter, rally) |
