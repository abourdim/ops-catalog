# HOWTO — bit-micro-vpn

## Getting Started

### Step 1: Open the App
Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari). No server required — everything runs locally.

### Step 2: Send an Encrypted Message
1. Type a secret message in the input field (e.g., "Hello Bob!")
2. Make sure **Encryption** is toggled ON (padlock shows locked)
3. Click the **Encrypt & Send** button
4. Watch the animated packet travel from Alice through the relay to Bob

### Step 3: Observe the Views
- **Relay sees**: Encrypted hex gibberish (the relay cannot read your message)
- **Bob sees**: The original plaintext (Bob has the shared key to decrypt)

### Step 4: Turn Off Encryption
1. Uncheck the **Encryption** toggle (padlock shows unlocked)
2. Send the same message again
3. Notice the relay now shows the plaintext — no protection!

### Step 5: Add More Relay Hops
1. Move the **Relay hops** slider to 2 or 3
2. Send a message and watch the packet travel through multiple relay nodes
3. Each relay only forwards the data — none can read it when encrypted

### Step 6: Try the MITM Attack
1. Send a message with encryption ON
2. Click the **Man-in-the-Middle Attack** button
3. The attacker fails — only sees cipher text
4. Now turn encryption OFF, send again, and try MITM
5. The attacker succeeds — reads everything!

---

## Understanding the Concepts

### XOR Encryption
Each character of the message is combined with a character from the shared key using XOR (exclusive or). The same operation decrypts the message. This is symmetric encryption — both sides use the same key.

### E2E (End-to-End) Encryption
Only Alice and Bob can read the message. Every node in between (relays, routers, ISPs) sees only encrypted data. This is the basis of VPN, HTTPS, and secure messaging.

### Relay Nodes
Relays forward packets between endpoints. In a VPN, relays cannot read the encrypted payload. They only know the source and destination addresses.

### Man-in-the-Middle (MITM) Attack
An attacker positioned at a relay tries to read the traffic. With encryption, they see only gibberish. Without encryption, they see everything in plaintext.

---

## Challenges

### Challenge 1: Read as the Relay
Try to decode a message as the relay node. With encryption on, can you figure out the plaintext? (Hint: you cannot without the key!)

### Challenge 2: Sniff Without Encryption
Turn encryption off, send a message, and observe what appears in the relay view. This demonstrates why unencrypted traffic is dangerous on public networks.

### Challenge 3: Design a Key Exchange
Think about this: before Alice and Bob can use the VPN, they need to agree on a shared key. How can they do this securely if someone is listening? Research Diffie-Hellman key exchange for the answer!

---

## Tips

- Use the **Activity Log** (scroll icon) to see all events and messages
- Try different **themes** in Settings for visual variety
- Switch **languages** (EN/FR/AR) to see full i18n support
- Triple-click the logo for a surprise!
- Use Konami code (up up down down left right left right B A) for retro mode

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Canvas not rendering | Resize the browser window or refresh the page |
| No sound | Enable sound effects in Settings |
| RTL layout issues | Select Arabic language in Settings to activate RTL |
| Toast not disappearing | Click anywhere or wait for auto-hide |
