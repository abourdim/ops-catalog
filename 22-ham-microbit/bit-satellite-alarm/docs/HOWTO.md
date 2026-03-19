# HOWTO — bit-satellite-alarm

A step-by-step guide to using the Satellite Alarm app.

---

## Getting Started

1. **Open the app** — Load `index.html` in any modern browser. The splash screen appears briefly, then the main interface loads.
2. **Sky map** — The circular polar projection shows your overhead sky. North is at the top, East is to the right. Concentric circles mark 30, 60, and 90 degree elevation lines.
3. **Pass list** — Below the sky map, a table shows the next 5 predicted satellite passes with their time, maximum elevation, and duration.

---

## Setting an Alarm

1. Click the **Set Alarm** button (with the bell icon).
2. The countdown timer shows the time remaining until the next pass.
3. When the pass begins, the main card flashes and alarm beeps play.
4. Click Set Alarm again to disable the alarm.

---

## Simulating a Pass

1. Click the **Simulate Pass** button (with the rocket icon).
2. Watch the animated dot trace the ISS trajectory across the sky map.
3. The satellite info panel updates in real time showing current elevation, azimuth, and visibility.
4. The simulation runs at accelerated speed (about 5 seconds for a full pass).

---

## Using the Lab

1. Open the **Lab** section by clicking on it.
2. Adjust the **Observer Latitude** slider to change your north/south position (-90 to +90).
3. Adjust the **Observer Longitude** slider to change your east/west position (-180 to +180).
4. Adjust the **Orbit Altitude** slider to change the satellite height (200-2000 km). The ISS orbits at 408 km.
5. Adjust the **Orbit Inclination** slider to change the orbital tilt (0-90 degrees). The ISS has a 51.6 degree inclination.
6. Click **Run Simulation** to generate new passes and animate a pass with your parameters.
7. Click **Reset** to return all values to ISS defaults (Algiers observer).
8. Click **Time a Pass** to start a stopwatch. Click again to stop and see the elapsed time.

---

## Understanding the Sky Map

The sky map uses a **polar projection** (also called a zenith-centered projection):

- **Center** = directly overhead (zenith, 90 degrees elevation)
- **Edge** = horizon (0 degrees elevation)
- **Concentric circles** = elevation lines at 30 and 60 degrees
- **Cardinal directions** = N (top), E (right), S (bottom), W (left)
- **Green line** = satellite trajectory arc
- **Yellow dot** = current satellite position during simulation

---

## Completing the Challenges

### Challenge 1: Predict the Next Visible Pass
- Look at the pass list for passes occurring near dawn or dusk
- Visible passes need elevation above 20 degrees and twilight conditions
- Run the simulation to verify your prediction

### Challenge 2: Calculate ISS Speed
- Use the Lab timer to measure how long the ISS takes to cross the sky
- The ISS orbits at 408 km altitude, so its orbital radius is 6371 + 408 = 6779 km
- Orbital circumference = 2 x pi x 6779 = approximately 42,590 km
- Orbital period is about 92 minutes
- Speed = 42,590 / 92 = approximately 463 km/min or 7.7 km/s

### Challenge 3: Find the Highest Elevation Pass
- The ISS inclination is 51.6 degrees, meaning it passes directly overhead (90 degree elevation) only at latitudes between -51.6 and +51.6
- Adjust the observer latitude to match the orbital inclination for a zenith pass
- Try latitude 51.6 degrees North and run the simulation

---

## Changing Language

1. Click the **Settings** gear icon in the header.
2. Select your language from the dropdown: English, French, or Arabic.
3. Arabic automatically enables right-to-left layout.
4. All satellite-specific labels, descriptions, and help content switch language.

---

## Tips

- The pass predictions use a simplified orbital model for educational purposes
- Real satellite tracking uses Two-Line Element (TLE) data from NORAD
- The ISS is one of the brightest objects in the night sky (magnitude -3 to -4)
- Best viewing times are within 1-2 hours after sunset or before sunrise, when the ground is dark but the ISS is still sunlit
- Enable sound effects in Settings to hear alarm beeps and button clicks

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Escape | Close all panels |
| Ctrl+Z (in log) | Undo last log entry |
| Konami code | Activate retro theme |

---

Workshop-DIY — [abourdim](https://github.com/abourdim)
