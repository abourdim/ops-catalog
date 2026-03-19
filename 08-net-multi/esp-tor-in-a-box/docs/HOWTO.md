# How To Use Tor in a Box

## Overview

Tor in a Box demonstrates onion routing by encrypting a message in 3 layers and sending it through 3 relay nodes (Guard, Middle, Exit). Each relay peels one encryption layer.

---

## Step 1: Type a Message

1. Open the app in a modern browser.
2. Type a secret message in the input field (e.g., "Hello World").

## Step 2: Encrypt and Send

1. Click **Encrypt & Send**.
2. The app generates 3 random XOR keys (shown as key chips).
3. Your message is wrapped in 3 encryption layers.
4. The fully encrypted data appears in the layer display.

## Step 3: Watch the Relays

1. The animated packet travels from Sender through Guard, Middle, Exit to Receiver.
2. At each relay, one encryption layer is peeled off.
3. The packet visually shrinks as layers are removed.
4. The layer display updates with the decrypted data at each hop.

## Step 4: Verify Anonymity

- The Guard relay sees the encrypted packet but cannot read the message.
- The Middle relay sees a differently encrypted packet.
- Only the Exit relay reveals the plaintext.
- No single relay knows both the sender and the final message.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| Onion Routing | Multi-layer encryption, one key per relay |
| XOR Cipher | Simple bitwise encryption: A XOR K = encrypted |
| Guard Relay | First hop, knows sender identity |
| Middle Relay | Intermediate hop, knows neither sender nor receiver |
| Exit Relay | Last hop, knows destination and plaintext |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No animation | Wait for current message to finish before sending another |
| Keys show "--" | Send a message first to generate keys |
| Message too long | Keep messages short for clearer hex display |
