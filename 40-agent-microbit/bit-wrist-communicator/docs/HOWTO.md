# HOWTO — Wrist Communicator Tap Code

A step-by-step guide for students learning to use the Wrist Communicator tap-code simulator.

---

## What is Tap Code?

Tap code is a way to send secret messages by tapping. Each letter of the alphabet is turned into two numbers: a **row number** and a **column number** from a 5x5 grid. You tap the row count, pause, then tap the column count.

This method was used by prisoners of war (POWs) during the Vietnam War to communicate through cell walls without being detected by guards.

---

## The Grid (Polybius Square)

|   | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| **1** | A | B | C | D | E |
| **2** | F | G | H | I | J |
| **3** | L | M | N | O | P |
| **4** | Q | R | S | T | U |
| **5** | V | W | X | Y | Z |

**Note:** The letter K is replaced by C. If you need to write K, use C instead. The receiver understands from context.

---

## Step 1: Understand the Grid

Each letter has a position defined by its row and column:

- **A** = Row 1, Column 1 → tap once, pause, tap once
- **H** = Row 2, Column 3 → tap twice, pause, tap three times
- **S** = Row 4, Column 3 → tap four times, pause, tap three times
- **Z** = Row 5, Column 5 → tap five times, pause, tap five times

---

## Step 2: Practice Tapping

1. Open the app and look at the 5x5 grid
2. Choose a letter (start with something easy like **A** or **E**)
3. Click the big **TAP** button the correct number of times for the row
4. **Wait** about half a second (the app uses this pause to know you switched from row to column)
5. Click the TAP button the correct number of times for the column
6. Watch the letter appear in the decoded message area

**Tips:**
- Keep your taps rhythmic and even
- The pause between row and column should be clearly longer than the gap between taps
- If you make a mistake, double-click the TAP button to reset

---

## Step 3: Encode a Message

1. Type a word or short sentence in the text input field
2. Click the **Encode** button
3. The app shows the full tap-code sequence (e.g., `2,3  1,5  3,3  3,3  3,4` for "HELLO")
4. Try to tap out the sequence yourself!

---

## Step 4: Listen and Learn

1. After encoding a message, click the **Play** button
2. The app will tap out the sequence with audio beeps
3. Watch the grid — each letter's cell lights up as it is tapped
4. Adjust the speed:
   - **Slow** — Good for beginners, easy to follow
   - **Medium** — Normal speed
   - **Fast** — Challenge yourself!

---

## Step 5: Try the Challenges

### Challenge 1: Decode by Ear
- Encode a word, then close your eyes
- Click Play and listen to the taps
- Try to decode the word using just the grid from memory

### Challenge 2: Speed Encode
- Tap out your full name in under 30 seconds
- Check if the decoded output matches your name exactly

### Challenge 3: Shorthand Code
- Create abbreviations for common words:
  - "HELLO" (5 letters) → "HI" (2 letters) — saves 60% of taps!
  - "THANK YOU" (8 letters) → "TY" (2 letters)
- Write your abbreviations down as a codebook
- Trade codebooks with a partner and try communicating

---

## micro:bit Extension

If you have a micro:bit:

1. **Sender:** Program Button A as a tap input. Count taps and display the pattern on the LED matrix.
2. **Receiver:** Use the radio module to receive tap counts and decode them using the Polybius square.
3. **Wrist Mode:** Wear the micro:bit on your wrist. Use the accelerometer to detect wrist shakes as taps.
4. **Haptic Feedback:** Connect a vibration motor to give the receiver physical tap feedback.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Tapping too fast, no pause detected | Make the pause between row and column clearly longer (about half a second) |
| Getting K wrong | Remember: K = C in tap code |
| Forgetting which number is row vs. column | Row comes first, then column |
| Running letters together | Wait longer between letters than between row and column |

---

## Fun Facts

- Tap code was used by POWs as early as World War I
- American POWs in Vietnam would tap on walls, use broom handles, or even cough in patterns
- The code is simple enough to memorize without any written reference
- Some POWs became so fast they could have full conversations through walls

---

Workshop-DIY — [abourdim](https://github.com/abourdim)
