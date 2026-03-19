# How-To Guide — Ghost Beacon

## 1. Broadcasting a Hidden Message

1. Open the app and find the **Ghost Beacon Broadcaster** card
2. Type your secret message in the **Secret Message** field (max 16 chars for UUID, 4 for Major/Minor, 10 for Namespace)
3. Select a **Beacon Protocol**: iBeacon (Apple), Eddystone (Google), or Custom BLE ADV
4. Choose an **Encoding Method**:
   - **UUID Steganography**: hides ASCII bytes inside the 16-byte UUID field
   - **Major/Minor Fields**: splits message across the 2+2 byte Major/Minor fields (max 4 chars)
   - **Namespace Encoding**: encodes into the 10-byte Eddystone Namespace (max 10 chars)
   - **TX Power Modulation**: encodes message as hex pattern in TX metadata
5. Adjust **TX Power** with the slider (-40 dBm = very weak, +4 dBm = maximum)
6. Click **Encode & Broadcast** — watch the pulsing animation

## 2. Scanning for Beacons

1. Click **Start Scan** in the Beacon Scanner section
2. The scanner will discover ambient beacons (simulated office/room beacons)
3. If you are broadcasting, your ghost beacon will appear with a ghost icon
4. Each beacon shows: name, protocol, UUID/Namespace, RSSI, and age
5. RSSI color coding: green (strong/close), orange (medium), red (weak/far)

## 3. Decoding Hidden Messages

1. After scanning, select a beacon from the **decoder dropdown**
2. Click **Decode Message**
3. Standard beacons will show "no hidden message detected"
4. Ghost beacons will reveal the decoded secret message with encoding method details

## 4. Lab Experiments

### RSSI Distance Estimator
- Drag the RSSI slider to simulate different signal strengths
- Drag the Reference TX Power slider to set the 1-meter reference
- The formula: distance = 10^((TxPower - RSSI) / (10 * n)), n = 2.5
- Zones: Immediate (<0.5m), Near (<3m), Far (<20m), Unknown (>20m)

### BLE Packet Builder
- Select a packet type (iBeacon, Eddystone-UID, Eddystone-URL)
- Click **Build Packet** to see the raw byte structure
- Color-coded bytes show: Flags, Header, UUID/Namespace, Major/Minor, TX Power

### Multi-Beacon Radar
- Click **Start Radar** to visualize beacons on a radar display
- Beacons appear as dots with distance based on RSSI
- Ghost beacons appear in pink/magenta
- A sweep line rotates continuously

## 5. Challenges

### Challenge 1: Decode the Ghost
- Click Start — a mystery ghost beacon appears in your scanner
- Select it in the decoder and decode the message
- Enter the decoded word and submit

### Challenge 2: Proximity Treasure Hunt
- Click Start — a hidden beacon is far away
- Click "Walk Closer" repeatedly to simulate approaching
- The progress bar fills as you get closer
- The message reveals when you reach under 1 meter

### Challenge 3: Beacon Flood Detection
- Click Start — 5 beacons appear (4 legitimate + 1 fake)
- Look for anomalies: abnormally fast broadcast interval, unusually strong RSSI, suspicious UUID patterns
- Select the suspicious beacon and report it

## 6. Settings & Customization

- **Language**: English, French, Arabic (with automatic RTL)
- **Theme**: 8 built-in themes (6 dark + 2 light)
- **Sound effects**: toggle on/off
- **Activity Log**: filter by type (info, success, error, TX, RX)
