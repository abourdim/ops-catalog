# Shadow Cam — Extension Ideas

## Student Challenges

### 1. Adjustable Auto-Delete Timer
Change the `AUTO_DELETE_SEC` constant or add a slider to let users control how long captures survive before being erased.

### 2. Double Encryption
Apply XOR twice with two different keys. Students learn that double-XOR with the same key cancels out, so keys must differ.

### 3. Panic Button
Add a button that instantly calls `clearAllCaptures()` and zeros out all image data. Useful for teaching secure deletion.

### 4. Timestamp Watermark
Before encryption, draw the current date/time onto the capture canvas. This teaches image manipulation and forensic metadata.

### 5. Motion Heatmap
Track mouse positions over time and render a heatmap overlay on the viewfinder. Teaches data visualization.

### 6. MQTT Alert Integration
When motion is detected, publish an MQTT message to a broker. Another app (like esp-dead-zone) can subscribe and respond.

### 7. Multi-Camera Grid
Duplicate the viewfinder canvas 4x and simulate multiple camera feeds. Teaches layout and state management.

### 8. AES Encryption Upgrade
Replace XOR with Web Crypto API's AES-GCM for real encryption. Compare performance and security.

## Real Hardware Extensions
- Replace PIR with radar sensor (RCWL-0516) for through-wall detection.
- Add IR LEDs for night vision capability.
- Stream video over WebSocket to a local dashboard.
- Use TensorFlow Lite Micro for on-device person detection.
- Add a buzzer for audible motion alerts.
