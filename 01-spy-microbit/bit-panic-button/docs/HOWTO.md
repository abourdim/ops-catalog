# HOWTO — bit-panic-button

Step-by-step guide for students using the Panic Button emergency alert simulation.

---

## What You Will Learn

- How emergency alert systems work
- How secure data destruction (wipe) protects sensitive information
- How radio broadcast messaging sends alerts to multiple receivers
- How to implement countdown timers and abort mechanisms

---

## Step 1: Load Secret Files

1. Open the app in your browser
2. Scroll down to the **Lab** section and expand it
3. Click the **Load Secret Files** button
4. The data vault on the main card will fill with 8 classified files
5. Each file has a name, icon, and classification level (TOP SECRET, CLASSIFIED, SECRET)

---

## Step 2: Configure the Countdown

1. In the **Lab** section, find the countdown slider
2. Drag it to set the countdown duration (3 to 15 seconds)
3. The default is 5 seconds — enough time to react and cancel if needed
4. A longer countdown gives more time to abort; a shorter one is more realistic

---

## Step 3: Trigger the Panic

1. Press the big red **PANIC** button on the main card
2. The button will start pulsing red
3. A countdown timer appears with flashing numbers
4. The **Cancel** button appears below the countdown
5. Watch the Activity Log (click the scroll icon) to see real-time events

---

## Step 4: Observe the Sequence

After the countdown reaches zero:

1. **Broadcast Phase** — Emergency alerts are sent on channels 1, 5, 12, 25, 42, 77, and 99
2. **Wipe Phase** — Each file is overwritten with random data, then deleted
3. **Progress bar** fills as files are destroyed
4. **Files disappear** one by one from the vault
5. Final status: "WIPED — 0 files remaining"

---

## Step 5: Cancel a Panic (Challenge #1)

1. Load files and start a panic sequence
2. Before the countdown reaches zero, press **CANCEL**
3. The sequence aborts — files are safe
4. Check the log for the cancellation confirmation

---

## Step 6: Verify the Wipe

1. After a completed panic sequence, go to the **Lab** section
2. Click **Verify Wipe**
3. If all data was destroyed, you will see a success message
4. If files remain, the wipe was not executed (you cancelled in time!)

---

## Step 7: Reset and Try Again

1. Click **Reset** in the Lab section
2. The vault is cleared, all states return to normal
3. Load new files and experiment with different countdown durations

---

## Tips

- Open the **Activity Log** (scroll icon in header) to see all TX/RX messages
- Use the **How It Works** section to understand the 4-phase protocol
- Try the **Challenge** section for advanced exercises
- Switch languages (Settings > Language) to see the app in French or Arabic
- Enable sound effects (Settings > Sound) for audio feedback

---

## Challenges

### Challenge 1: Cancel Before Wipe
Start the panic and cancel before data is destroyed. Can you react in time with a 3-second countdown?

### Challenge 2: Silent Panic Mode
Think about how you would modify the code to skip the broadcast phase and go straight to wiping. No one would know the data was destroyed.

### Challenge 3: Dead-Man Switch
Imagine a system where the user must press a "heartbeat" button every 30 seconds. If they miss it, panic triggers automatically. How would you implement this with `setInterval`?

---

## Glossary

| Term | Definition |
|------|-----------|
| Panic Button | A physical or digital button that triggers an emergency protocol |
| Secure Erase | Overwriting data with random bytes before deletion to prevent recovery |
| Broadcast | Sending a message to all devices on a radio channel simultaneously |
| Dead-Man Switch | A safety device that activates when the operator fails to perform a periodic action |
| TX | Transmit — sending data out |
| RX | Receive — incoming data |
| Countdown | A timed delay before an action executes, allowing cancellation |

---

Workshop-DIY Educational Project
