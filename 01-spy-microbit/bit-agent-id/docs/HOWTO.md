# HOWTO — bit-agent-id Workshop Guide

## Overview

This workshop teaches students about encrypted identity authentication using BLE (Bluetooth Low Energy). Students create digital agent identities, sign them with cryptographic keys, broadcast them, and verify each other's identities.

---

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge)
- No internet connection required (runs entirely offline)
- Basic understanding of what encryption means (optional)

---

## Workshop Flow (45-60 minutes)

### Part 1: Introduction (10 min)

1. Open `index.html` in a browser
2. Explain the concept: "Every agent needs a secure ID that cannot be faked"
3. Open Section A ("How It Works") and walk through the 4 steps:
   - **Step 1: Generate Keys** — A pair of keys is created. One is public (everyone can see it), one is private (only you have it).
   - **Step 2: Sign Identity** — Your agent info is combined with the private key to create a unique signature.
   - **Step 3: Broadcast via BLE** — The signed ID is sent over Bluetooth so nearby agents can receive it.
   - **Step 4: Verify Signature** — The receiver uses your public key to check if the signature is valid.

### Part 2: Create Your Identity (10 min)

1. Click **Generate Identity**
2. Observe the agent card: codename, clearance level, avatar, unique hash
3. Look at the public key hash displayed below the card
4. Open the Activity Log to see the key generation details
5. Click **Generate Identity** again — notice everything changes! Each identity is unique.

### Part 3: Broadcast and Verify (10 min)

1. Click **Broadcast ID** — watch the BLE packet simulation in the log
2. Explain each packet: flags, device name, manufacturer data, signature data, TX power
3. Click **Verify Agent** — observe the verification process
4. If VERIFIED: the signature matched the public key
5. If IMPOSTOR: the signature did not match (forged identity detected)
6. Try multiple times to see both outcomes

### Part 4: Lab Experiments (15 min)

Open Section B ("Lab") and run each experiment:

**Experiment 1: Multiple Identities**
- Click "Generate 3 Agents"
- Observe how each agent has completely different keys and hashes
- Discussion: Why are the hashes so different even though the codenames might be similar?

**Experiment 2: Forge an ID**
- Click "Forge Identity"
- Watch the forged identity fail verification
- Discussion: Why can't we create a valid signature without the private key?

**Experiment 3: Authentic vs Forged**
- Click "Compare Both"
- See the side-by-side comparison
- Discussion: What makes the authentic identity pass and the forged one fail?

### Part 5: Challenge (10 min)

Open Section C ("Challenge") and discuss:

1. **Fake ID Challenge** — Can you create a fake ID that passes? (Answer: No, without the private key it's impossible)
2. **Multi-Factor Auth** — How would you add a second factor like a time-based code?
3. **Revocation System** — What if a private key is stolen? How would you invalidate it?

---

## Key Concepts to Reinforce

| Concept | Real-World Example |
|---------|-------------------|
| Public Key | Your email address — anyone can send to it |
| Private Key | Your email password — only you know it |
| Digital Signature | A wax seal on a letter — proves who sent it |
| Hash | A fingerprint — unique to each person |
| BLE Broadcast | A radio station — sends signal to anyone listening |
| Verification | Checking someone's passport at the border |

---

## Discussion Questions

1. Why do we need two keys instead of one?
2. What happens if someone copies your public key? Is that a problem?
3. Why is the hash different every time, even for similar inputs?
4. How is this similar to how your phone connects to Bluetooth devices?
5. What other things in daily life use digital signatures? (hint: HTTPS, app stores, banking)

---

## Extensions

- **micro:bit Integration**: Use the actual micro:bit BLE radio to broadcast identity tokens between devices
- **Classroom Activity**: Have students verify each other's identities — who can collect the most VERIFIED stamps?
- **Advanced**: Implement a Certificate Authority where one "trusted" micro:bit signs other agents' public keys

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No sound effects | Enable sound in Settings |
| Text not updating | Check the language setting |
| Log is empty | Click buttons to trigger actions |
| Stamp not showing | Generate an identity first, then verify |

---

## Credits

Workshop-DIY — [abourdim](https://github.com/abourdim)
