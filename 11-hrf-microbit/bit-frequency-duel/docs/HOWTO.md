# HOWTO — bit-frequency-duel

## Student Lab Guide: Exploring the 2.4GHz Spectrum

---

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- No hardware required — this is a simulation

---

### Step 1: Understand the Waterfall Display

1. Open the app in your browser
2. Watch the waterfall canvas scrolling upward
3. Notice the frequency axis at the bottom: 2.400 GHz on the left, 2.485 GHz on the right
4. Dark areas = quiet frequencies, bright areas = active signals
5. The color scale goes: dark (noise) -> blue (weak) -> green (medium) -> yellow (strong) -> red (very strong)

**Question:** Can you spot the three wide colored bumps? Those are WiFi signals.

---

### Step 2: Identify Signal Types

Look at the waterfall and identify:

- **WiFi** (wide bumps): Three broad humps centered at channels 1, 6, and 11 — these are the most common WiFi channels
- **Bluetooth** (narrow spikes): Random thin spikes that hop around the band — Bluetooth frequency-hops 1600 times per second
- **Noise** (dark floor): The low-level random background present everywhere

**Question:** Why does Bluetooth hop frequencies instead of staying on one channel?

---

### Step 3: Choose a Channel

1. Move the **Channel** slider from 0 to 83
2. Watch the interference meter change as you move through WiFi zones
3. Try to find a channel where interference reads 0%
4. Channels near 12, 37, and 62 will show high interference (WiFi overlap)

**Tip:** Channels 20–30 and 45–55 are often clear — they fall between WiFi channels.

---

### Step 4: Transmit a Burst

1. Select your chosen channel on the slider
2. Set the power level (start with 4)
3. Press the **Transmit** button
4. Watch for the green spike on the waterfall at your chosen channel
5. Check the Activity Log for the transmission result

**Question:** What happens to the interference reading when you transmit on channel 37?

---

### Step 5: Experiment with Power

1. Transmit on the same channel at power level 0 (minimum)
2. Now transmit at power level 7 (maximum)
3. Compare how visible the signal is on the waterfall
4. Notice how higher power makes the green spike taller and wider

**Question:** Why might you want to use lower power even though higher power gives a stronger signal?

---

### Step 6: Complete the Challenges

Open the **Challenge** section and try:

1. **Find the quietest channel** — Transmit with 0% interference. Move the slider until the meter reads 0, then transmit.

2. **Avoid WiFi interference** — WiFi sits at channels 12, 37, and 62 (each +/- 10 channels wide). Find a gap and transmit cleanly.

3. **Identify all signal types** — Look at the waterfall and describe each signal type you see: micro:bit (green, narrow), WiFi (blue-yellow, wide), Bluetooth (purple, random), noise (gray, low).

---

### Key Concepts Learned

| Concept | What You Learned |
|---------|-----------------|
| ISM Band | The 2.4GHz band is shared by many wireless technologies |
| Waterfall Display | Spectrograms show frequency vs time with color = power |
| Interference | Signals that overlap in frequency cause interference |
| Channel Selection | Choosing the right channel avoids interference |
| Bandwidth | WiFi uses 20MHz channels, micro:bit uses 1MHz |
| Power Control | Higher power = more visible but more interference potential |

---

### Going Further

- Research how micro:bit radio groups map to channels
- Learn about WiFi channel bonding (40MHz, 80MHz) in 5GHz bands
- Explore how Bluetooth Low Energy uses advertising channels
- Try building a real spectrum scanner with a micro:bit and radio.receivedSignalStrength()

---

### Glossary

| Term | Definition |
|------|-----------|
| **ISM Band** | Industrial, Scientific, Medical — license-free radio band |
| **Spectrogram** | Visual display of signal strength across frequency over time |
| **Waterfall** | A scrolling spectrogram where time moves vertically |
| **Interference** | Unwanted signal overlap that degrades communication |
| **Channel** | A specific frequency slice allocated for communication |
| **Bandwidth** | The width of a channel in MHz |
| **dBm** | Decibels relative to 1 milliwatt — unit for signal power |
