# HOWTO — bit-invisible-ink

## Step-by-Step Tutorial: Self-Destructing Messages

---

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installation or server required — runs 100% locally

---

### Step 1: Open the App

Open `index.html` in your browser. The splash screen appears briefly, then you see the main interface with the message composer.

---

### Step 2: Compose a Secret Message

1. Click inside the **text area** in the main card
2. Type your secret message (up to 280 characters)
3. The character counter in the bottom-right updates as you type

---

### Step 3: Set the Self-Destruct Timer

1. Use the **dropdown** next to the text area
2. Choose a delay:
   - **5s** — very short, good for quick secrets
   - **10s** — default, balanced
   - **30s** — gives the reader more time
   - **60s** — long read window

---

### Step 4: Send the Message

1. Click the **"Send Secret Message"** button
2. Watch the log panel — you will see:
   - "Encrypting message..." (simulated encryption)
   - "Simulating BLE transfer..." (simulated wireless send)
   - "Message queued" confirmation
3. The status pill turns **green** (Connected)

---

### Step 5: Watch the Message Arrive

1. The message appears in the **received message area** with a fade-in animation
2. A **read receipt** is logged with the exact time
3. The **self-destruct countdown** starts immediately

---

### Step 6: Observe the Destruction

1. The countdown bar shrinks as time runs out
2. When the timer hits zero:
   - Each character is **scrambled** with random symbols
   - Then each character **dissolves** (fades up and disappears)
3. The burn area shows: **"Message destroyed. No trace remains."**
4. The destruction is logged in the Activity Log

---

### Step 7: Send Multiple Messages

1. Send several messages before the first one is destroyed
2. A **queue badge** appears showing how many messages are pending
3. Messages are processed one at a time, in order (FIFO)

---

### Step 8: Try Screenshot Detection

1. While a message is displayed, press **PrintScreen** or switch tabs
2. The app detects the attempt and **accelerates destruction**
3. An alert appears: "Screenshot attempt detected!"
4. The message burns immediately

---

### Step 9: Review the Destruction Log

1. Open **Section B (Lab)**
2. The **destruction log** shows all events:
   - SENT — when each message was sent
   - READ — when each message was opened
   - DESTROYED — when each message was burned
   - SCREENSHOT ATTEMPT — if detected

---

### Step 10: Take the Challenges

Open **Section C (Challenge)** and try:

1. **Recover a destroyed message** — Can you find any trace in the Activity Log or browser memory?
2. **Build read-once** — What happens if you set the timer concept to 0 seconds?
3. **Screenshot detection** — How would you improve the detection mechanism?

---

### Customization

- **Change language**: Settings > Language (English, French, Arabic)
- **Change theme**: Settings > Theme (8 options including light themes)
- **Enable sounds**: Settings > Sound effects toggle
- **View logs**: Click the Activity Log (scroll icon) button in the header

---

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Message does not appear | Check that the compose area is not empty |
| Timer not counting | Ensure only one message is processing at a time |
| No sound | Enable "Sound effects" in Settings |
| Layout looks wrong | Try a different theme; ensure browser is up to date |

---

### Learning Objectives

After completing this workshop, students will understand:

- **Ephemeral messaging**: Why some messages are designed to disappear
- **Timer-based destruction**: How countdown mechanisms trigger data deletion
- **Read receipts**: How apps track when messages are opened
- **Data persistence**: Why "deleted" data is not always truly gone
- **Privacy vs. forensics**: The tension between privacy tools and data recovery

---

Workshop-DIY — [abourdim](https://github.com/abourdim)
