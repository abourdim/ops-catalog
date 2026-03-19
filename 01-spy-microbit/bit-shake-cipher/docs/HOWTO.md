# How-To: Shake Cipher Lab Guide

## Step 1 — Explore the Accelerometer

Open the app and move your mouse over the main card. Watch the X (red), Y (green), and Z (blue) bars respond to your movement. On mobile, tilt and shake your device to see real accelerometer data.

## Step 2 — Record Your Shake Pattern

Click **Record Pattern**. You have 4 seconds to create a unique motion sequence. Move your mouse in a distinctive pattern (zigzag, circle, figure-8). The pattern display shows the captured data points.

## Step 3 — Lock a Message

Type a secret message in the input field (e.g., "Hello World"). Click **Lock**. The message is encrypted using your shake pattern as a key. The locked display shows the cipher in hexadecimal.

## Step 4 — Shake to Unlock

Click **Shake to Unlock** and reproduce your original shake pattern as closely as possible. The app compares your attempt with the stored pattern using DTW (Dynamic Time Warping).

## Step 5 — Analyze the Match Score

Check the match percentage. Above 55% unlocks the message; below fails. Try multiple times to see how consistent your pattern is. A good pattern should be easy for you to repeat but hard for others.

## Step 6 — Use the Lab

Open **Section B (Lab)** to experiment with pattern comparison. Record Pattern A, then Pattern B, and click **Compare** to see the DTW similarity score. Try recording the same pattern twice vs. two different patterns.

## Step 7 — Take on the Challenges

Open **Section C (Challenges)** and work through the three challenges:

1. **Pattern Complexity** — Create a highly unique pattern that only you can reproduce
2. **Brute Force Test** — Test how many random patterns can break your lock
3. **False Positive Threshold** — Find the balance between security and usability

Record your findings in the Activity Log for discussion with your class.
