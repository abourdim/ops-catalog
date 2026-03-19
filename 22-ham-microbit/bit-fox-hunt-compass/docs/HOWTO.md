# HOWTO — bit-fox-hunt-compass

## What You Will Learn

In this activity, you will learn how ham radio operators find hidden transmitters using a technique called **fox hunting** (ARDF). You will practice:

- Reading signal strength to estimate distance
- Following a direction arrow to navigate toward a target
- Using bearing information for efficient path planning
- Minimizing steps to improve your score

---

## Getting Started

1. Open `index.html` in your web browser (Chrome, Firefox, Edge, or Safari)
2. The app loads with a fox already hidden on the field
3. You will see:
   - A green grid map with your position marked as **H** (Hunter)
   - A signal strength bar below the map
   - A direction arrow, distance estimate, step counter, and bearing display

---

## How to Play

### Step 1: Observe the Signal

Look at the **signal bar** at the bottom of the map:
- **Blue** = you are far from the fox
- **Green** = you are getting closer
- **Orange** = you are close
- **Red** = you are very close

### Step 2: Follow the Arrow

The **direction arrow** points toward the fox. It is noisy when you are far away and more accurate when you are close. Use it as a general guide, not an exact pointer.

### Step 3: Move

Use the **N/S/E/W** buttons or your keyboard:
- Arrow keys or WASD to move
- Each move counts as one step

### Step 4: Find the Fox

When you get close enough (within about 1.5 grid cells), the fox is revealed with an animation. Your step count is your score — try to minimize it!

### Step 5: New Hunt

Press **New Hunt** to start a new game with the fox in a different random location.

---

## Reading the Instruments

| Instrument | What It Shows |
|------------|---------------|
| Signal Bar | How strong the radio signal is (closer = stronger) |
| Direction Arrow | Which way the signal is getting stronger |
| Distance | Qualitative estimate: Far, Medium, Close, Very Close |
| Steps | How many moves you have made |
| Bearing | Compass angle from you to the fox (0-360 degrees) |

---

## Tips and Strategies

1. **Move in one direction first** to establish a signal gradient
2. **Compare signal before and after** each move to figure out if you are getting closer or farther
3. **Use the bearing** to plan diagonal approaches (combine N+E or S+W moves)
4. **Minimize backtracking** — each step counts toward your score
5. **Signal noise** is higher when you are far away, so expect some false readings early on

---

## The Science Behind It

### Inverse Square Law

Radio signal strength decreases with the square of the distance:

    Signal = 1 / (distance^2)

If you double your distance from the transmitter, the signal drops to 1/4 of its original strength.

### Direction Finding

Real fox hunters use directional antennas (like Yagi antennas) that receive more signal from one direction. In this simulation, the direction arrow simulates this effect using signal gradient.

### Triangulation

By taking bearing measurements from two or more known positions, you can calculate where the bearing lines cross — that is where the fox is hiding.

---

## Challenges

### Challenge 1: Speed Hunter
Find the fox in under 20 steps. Plan your moves carefully using the bearing.

### Challenge 2: Triple Fox
After finding the first fox, press New Hunt and find two more. Track your total steps across all three.

### Challenge 3: Moving Fox
Imagine the fox moves every 5 steps. Can you still find it? This requires fast reads and quick decisions.

---

## Changing Language

1. Click the gear icon (Settings) in the top right
2. Select your language: English, Francais, or Arabic
3. All text in the app updates automatically
4. Arabic enables right-to-left layout

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Canvas is blank | Resize the browser window or press New Hunt |
| Buttons not responding | Make sure a hunt is active (press New Hunt) |
| Arrow seems wrong | The arrow has intentional noise — keep moving to get better readings |
| Text not translating | Check that all data-i18n keys are present in the LANG object |

---

Workshop-DIY — [abourdim](https://github.com/abourdim)
