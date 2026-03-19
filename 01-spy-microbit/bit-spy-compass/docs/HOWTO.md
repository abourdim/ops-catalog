# Spy Compass — Lab Guide

A step-by-step guide to navigate secret waypoints using the micro:bit magnetometer.

## Step 1: Open the App

Open `index.html` in your browser. You will see the compass rose with a red needle pointing North (simulated). The heading display shows your current direction in degrees.

## Step 2: Understand the Compass

The compass needle rotates based on heading data. In simulation mode, it drifts slowly. On a real device with a magnetometer (micro:bit or phone), it tracks the actual magnetic North. The cardinal letters (N, E, S, W) rotate around the dial.

## Step 3: Review the Waypoints

Three spy waypoints are shown below the compass:
- **Alpha Base** — bearing 045 (northeast)
- **Bravo Tower** — bearing 160 (south-southeast)
- **Charlie Bunker** — bearing 290 (west-northwest)

Each waypoint has a fixed bearing from the starting position.

## Step 4: Select a Target

Use the dropdown menu to select one of the three waypoints. Press the **Navigate** button. The status pill turns green to indicate active navigation. A green arrow appears on the compass showing the target bearing.

## Step 5: Navigate Toward the Target

Turn your device (or watch the simulation) so the red compass needle aligns with the green target arrow. The bearing difference display updates in real time. The map view (Section B) shows your position moving toward the target with a trail line.

## Step 6: Arrive at the Target

When the bearing difference stays below 5 degrees for 3 continuous seconds, the "Arrived! Mission Complete!" indicator appears. A success sound plays and the event is logged. The status pill returns to disconnected.

## Step 7: Try the Challenges

Open Section C to attempt the spy challenges:
1. Navigate blindfolded using only audio cues from the compass heading
2. Find the shortest path visiting all 3 waypoints in sequence
3. Manually calculate the bearing between two waypoints using a protractor and map

## Tips

- Open the Activity Log to see all navigation events with timestamps
- Enable sound effects in Settings for audio feedback
- Try different themes for a fun visual experience
- On mobile, the app uses the real magnetometer via the DeviceOrientation API
- Calibrate a real micro:bit by tilting it in a full circle before use
