# esp-wifi-thermometer — How To Use

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)

## Lab Walkthrough

### Step 1: Explore the Heatmap
Move your cursor over the main canvas. The RSSI reading changes based on distance from simulated access points.

### Step 2: Click to Measure
Click on the canvas to place a measurement point. Each click adds a data point to the signal analysis graph.

### Step 3: Start Walk Mode
Click Start Walk Mode. A simulated walker moves randomly, painting the heatmap and recording RSSI history.

### Step 4: Analyze the Room
Open Room Layout to see the floor plan with AP positions, signal coverage circles, and wall obstacles.

### Step 5: Check the Graph
Open Signal Analysis to see RSSI plotted over time during your walk.

### Step 6: Try the Challenges
Test your understanding of WiFi signal concepts.

## What Each Step Teaches

| Step | Concept |
|------|---------|
| 1 | RSSI and distance relationship |
| 2 | Point measurement technique |
| 3 | Site survey methodology |
| 4 | AP placement and wall effects |
| 5 | Signal trend analysis |
| 6 | Network planning principles |

## Going Further

- Use ESP32 with `WiFi.scanNetworks()` for real RSSI data
- Build a physical WiFi heatmap tool with an ESP32 and GPS module
- Study professional tools like Ekahau for enterprise site surveys
