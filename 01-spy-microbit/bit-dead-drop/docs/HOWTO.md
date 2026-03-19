# bit-dead-drop — How To Use

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- Optional: Two micro:bit v2 boards for real BLE testing

## Lab Walkthrough

### Step 1: Write Your Secret Message
Type a secret message in the input field. Keep it short — real BLE packets are limited to ~20 bytes.

### Step 2: Set the Encryption Key
Enter a shared key. Both agents must know this key. In the real world, keys are exchanged in person or via a secure channel.

### Step 3: Encrypt the Message
Click "Encrypt" to see your message transformed into cipher text using XOR encryption. Watch the Activity Log for the encryption event.

### Step 4: Drop the Message
Click "Send Drop" to broadcast the encrypted message via simulated BLE. The canvas shows the packet traveling through the air.

### Step 5: Receive the Drop
Switch to "Receive" mode. Click "Scan" in the Lab section to detect nearby drops. The RSSI slider simulates distance — lower values mean weaker signal.

### Step 6: Decrypt the Message
When you receive a drop, enter the correct key and decrypt. Wrong key = garbled output!

### Step 7: Try the Challenges
Open the Challenge section and test your understanding. Can you break the cipher without the key?

## What Each Step Teaches

| Step | Concept |
|------|---------|
| 1 | Plaintext and message formatting |
| 2 | Shared secret keys |
| 3 | XOR cipher (symmetric encryption) |
| 4 | BLE advertising/broadcasting |
| 5 | BLE scanning and RSSI |
| 6 | Decryption and key verification |
| 7 | Cryptanalysis basics |

## Going Further

- Flash real micro:bit code using [MakeCode](https://makecode.microbit.org/)
- Try AES encryption instead of XOR
- Build a multi-hop relay with 3+ micro:bits
