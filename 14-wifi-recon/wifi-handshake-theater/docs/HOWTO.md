# How-To Guide — Handshake Theater

## Overview
Handshake Theater visualizes the WPA2 4-way handshake, showing how a client and access point establish an encrypted connection.

## Step-by-Step

### 1. Launch the App
Open `index.html` in any modern browser.

### 2. Play the Handshake
Click **Play** to start the animation. Each of the 4 steps highlights in sequence.

### 3. Watch the Steps
- **Step 1**: AP sends ANonce to client
- **Step 2**: Client sends SNonce + MIC back
- **Step 3**: AP sends encrypted GTK + MIC
- **Step 4**: Client sends ACK, handshake complete

### 4. View Key Derivation
Expand **Key Derivation** to see PMK, ANonce, SNonce, PTK, GTK, and MIC values as they are generated.

### 5. Check the Timeline
Expand **Handshake Timeline** for a chronological record of each event.

### 6. Reset
Click **Reset** to clear everything and replay the animation.

## Tips
- Each step takes 2 seconds for easy observation
- The activity log tracks all EAPOL messages with TX/RX labels
- Use different themes to change the visual style
