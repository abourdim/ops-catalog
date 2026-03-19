# HOWTO — bit-rf-alarm-system

Step-by-step guide for students and teachers.

---

## Overview

This app simulates a wireless RF alarm system. Students can arm/disarm the alarm, then use attack tools (jamming and replay) to understand real-world security vulnerabilities. Switching to Secure mode demonstrates how rolling codes protect against these attacks.

---

## Getting Started

1. **Open the app** — Load `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).
2. **Explore the main card** — The alarm panel shows the current state (DISARMED by default).
3. **Try the keypad** — Enter `1234` and press OK to arm/disarm via the physical keypad.
4. **Use the remote** — Press "Arm" or "Disarm" to send RF commands wirelessly.

---

## Experiment 1: RF Jamming

**Goal:** Understand how jamming blocks wireless communication.

1. Arm the alarm using the "Arm" button.
2. Press **"Jam Signal"** (red button).
3. Watch the signal quality meter drop to near zero.
4. Try pressing "Disarm" — it fails! The command cannot reach the alarm.
5. Press "Jam Signal" again to stop jamming.
6. Now press "Disarm" — it works.

**Key takeaway:** Jamming prevents ALL communication on the channel.

---

## Experiment 2: Replay Attack (Basic Mode)

**Goal:** Capture and replay a disarm code.

1. Make sure the alarm is in **Basic mode** (security toggle OFF).
2. Arm the alarm.
3. Press **"Record & Replay"** — the tool starts recording.
4. Press **"Disarm"** — the disarm code is captured.
5. Arm the alarm again.
6. Press **"Record & Replay"** again — it replays the captured code.
7. The alarm disarms! The replay attack succeeded.

**Key takeaway:** Fixed codes can be captured and reused.

---

## Experiment 3: Rolling Codes Defeat Replay

**Goal:** See how secure mode blocks replay attacks.

1. Toggle the security switch to **Secure mode** (rolling codes).
2. Arm the alarm.
3. Press "Record & Replay" to start recording.
4. Press "Disarm" — the code is captured.
5. Arm the alarm again.
6. Press "Record & Replay" to replay — it **FAILS**!
7. The alarm triggers an ALERT because the code was already used.

**Key takeaway:** Rolling codes expire after one use. Replay is useless.

---

## Experiment 4: Compare Code Displays

**Goal:** Observe the difference between fixed and rolling codes.

1. In Basic mode, arm and disarm several times. The code display always shows `1234`.
2. Switch to Secure mode. Arm and disarm several times. Each transmission shows a different code (`RC-03EA`, `RC-03EB`, etc.).
3. Discuss: Why is a changing code more secure than a fixed one?

---

## Challenges

### Challenge 1: Disarm Without the Code
- Start in Basic mode with alarm armed.
- Use ONLY attack tools to disarm.
- Solution: Record a legitimate disarm, then replay it.

### Challenge 2: Defeat Rolling Codes
- Switch to Secure mode.
- Try every attack tool.
- Conclusion: Rolling codes cannot be defeated by simple replay.

### Challenge 3: Design an Unbreakable Alarm
- Discussion activity. Think about:
  - AES encryption for code confidentiality
  - Frequency hopping to defeat jammers
  - Two-factor authentication (code + biometric)
  - Tamper detection sensors
  - Challenge-response protocols
  - Time-based code expiration

---

## For Teachers

### Learning Objectives
- Understand RF communication basics
- Identify vulnerabilities in unencrypted wireless protocols
- Explain how jamming and replay attacks work
- Describe countermeasures: rolling codes, encryption, frequency hopping
- Apply security thinking to system design

### Suggested Timeline
| Time | Activity |
|------|----------|
| 10 min | Introduction — open app, explore UI |
| 10 min | Experiment 1 — jamming |
| 15 min | Experiment 2 — replay attack |
| 10 min | Experiment 3 — rolling codes |
| 15 min | Challenge discussion |

### Discussion Questions
1. Why is sending a fixed code over radio dangerous?
2. What happens if an attacker combines jamming WITH recording?
3. How do car key fobs prevent relay attacks?
4. What is the difference between encryption and rolling codes?
5. Can you think of other systems that use wireless codes (garage doors, hotel keys)?

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Buttons do not respond | Reload the page. Check browser console for errors. |
| No sound | Enable sound effects in Settings panel. |
| Text not translated | Change language in Settings. All text uses i18n keys. |
| Alarm stuck in ALERT | Enter code 1234 on keypad and press OK, or press Disarm. |

---

## micro:bit Extension (Optional)

To build a real version with two micro:bits:

1. **micro:bit A (Alarm):** Listens on radio group 7. Displays lock/unlock icons. Sounds buzzer on alert.
2. **micro:bit B (Remote):** Sends "ARM" or "DISARM" strings on button press. Radio group 7.
3. **Jammer concept:** A third micro:bit sending random data continuously on group 7.
4. **Replay concept:** Record received strings and retransmit them.

Use MakeCode radio blocks: `radio.sendString()`, `radio.onReceivedString()`, `radio.setGroup(7)`.

---

Workshop-DIY — [abourdim](https://github.com/abourdim)
