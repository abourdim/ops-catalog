# esp-dead-letter-box — How To Use

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)

## Lab Walkthrough

### Step 1: Scan for Networks
Click "Scan Networks" to discover nearby WiFi access points. Normal APs appear with their SSIDs.

### Step 2: Find Hidden APs
Look for entries marked [HIDDEN] in red. These are the dead drops. If you don't see them, increase the signal strength slider and try Active Probe.

### Step 3: Connect to the Dead Drop
Click on a hidden AP to connect. The app reveals the hidden SSID and opens the file vault.

### Step 4: Browse the Vault
The vault contains encrypted files. Click any file to see its encrypted hex content.

### Step 5: Decrypt Files
Enter the decryption key `ESPION` and click "Decrypt Selected". The file content is revealed using XOR decryption.

### Step 6: Download Files
Click "Download" to save the selected file (encrypted or decrypted) to your device.

### Step 7: Try the Challenges
Test your knowledge about hidden SSIDs, XOR weaknesses, and dead drop security.

## What Each Step Teaches

| Step | Concept |
|------|---------|
| 1 | WiFi beacon scanning |
| 2 | Hidden SSID detection |
| 3 | AP association |
| 4 | Encrypted file storage |
| 5 | XOR symmetric decryption |
| 6 | Data exfiltration |
| 7 | Security analysis |

## Going Further

- Try decrypting with the wrong key to see garbled output
- Compare active probe vs passive scan results
- Think about how AES would improve security over XOR
