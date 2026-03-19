# HOWTO — bit-signal-meter

## Step-by-step Guide to the Signal Meter Simulation

---

### 1. Understanding the Display

When you open the app, you see:

- **5x5 LED Grid**: A simulated micro:bit LED matrix (25 LEDs in a 5-column, 5-row grid)
- **S-Meter Reading**: Shows the current S-unit value (e.g., S5, S9, S9+20dB)
- **dBm Value**: Shows the absolute signal power in decibels relative to one milliwatt
- **SNR Display**: Shows the signal-to-noise ratio in dB

---

### 2. Using the Signal Slider

1. Locate the **Signal Level** slider below the LED grid
2. Drag it from left (-120 dBm, very weak) to right (-30 dBm, very strong)
3. Watch the LED bar graph fill columns from left to right
4. The S-meter reading updates in real-time
5. Each 6 dB increase moves one S-unit up

**Try this**: Start at -120 dBm and slowly increase. Notice each S-unit step.

---

### 3. Adjusting the Noise Floor

1. Locate the **Noise Floor** slider
2. Drag it to change the background noise level
3. Watch the SNR value change (SNR = signal - noise floor)
4. Higher noise floor = lower SNR = harder to detect signals
5. The LED display adds random fluctuation based on noise level

**Try this**: Set signal to -90 dBm, then move noise floor from -140 up to -85 dBm. Watch how the bar graph becomes unstable.

---

### 4. Running Auto Scan

1. Click the **Auto Scan** button
2. The signal slider automatically sweeps from -120 dBm to -30 dBm
3. Watch the LED grid animate through all signal levels
4. The status pill turns green during scanning
5. A toast message shows scanning progress
6. Click again to stop the scan early

---

### 5. Clicking Individual LEDs

- Click any LED cell to toggle it on/off manually
- This lets you design custom patterns
- Manual toggles are independent of the signal simulation
- Use this to plan your Challenge solutions

---

### 6. Reading the S-Meter Scale

| S-Unit | dBm Value | LED Columns Lit |
|--------|-----------|-----------------|
| S0 | < -121 | 0 |
| S1-S2 | -121 to -109 | 1 |
| S3-S4 | -109 to -97 | 2 |
| S5-S6 | -97 to -85 | 3 |
| S7-S8 | -85 to -73 | 4 |
| S9+ | > -73 | 5 |

---

### 7. Understanding SNR

- **SNR** = Signal Level - Noise Floor (in dB)
- SNR > 20 dB: Excellent reception
- SNR 10-20 dB: Good reception
- SNR 6-10 dB: Marginal reception
- SNR < 6 dB: Signal barely detectable

---

### 8. Section A — How It Works

Open the collapsible section to learn the 4-step pipeline:
1. Antenna picks up the radio signal
2. ADC converts analog voltage to digital
3. Software converts to dBm and S-units
4. LED matrix displays bar graph

---

### 9. Section B — Lab Experiments

Four structured experiments:
1. **Signal-to-LED Mapping**: Observe bar graph vs slider position
2. **S-Meter Calibration**: Verify 6 dB per S-unit
3. **SNR Measurement**: Study noise effects on display
4. **Analog vs Digital**: Compare LED approximation to smooth meter

---

### 10. Section C — Challenges

Three challenges to extend your learning:
1. **Custom LED Patterns**: Design unique patterns for S1, S5, S9
2. **Signal in Noise**: Find the minimum detectable SNR
3. **Peak-Hold Meter**: Remember and display the highest signal seen

---

### Tips

- Use the **Activity Log** (scroll icon) to track all signal events
- Change **language** in Settings for French or Arabic versions
- Try different **themes** to see the LED grid in different color schemes
- The LED grid uses three brightness levels: dim, on, and bright
