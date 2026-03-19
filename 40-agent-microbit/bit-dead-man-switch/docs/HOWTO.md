# HOWTO — bit-dead-man-switch

## What is a Dead Man's Switch?

A dead man's switch is a safety mechanism that requires continuous operator input (movement, button press) to keep a system running. If the operator becomes incapacitated and stops providing input, the switch assumes something is wrong and triggers an emergency response.

**Real-world examples:**
- Train operators must hold a lever — releasing it stops the train
- Lone-worker devices alert dispatch if no movement is detected
- Server watchdog timers reboot systems that stop responding

---

## Lab Setup

### Requirements
- A modern web browser (Chrome, Firefox, Edge, Safari)
- Optional: a mobile device with accelerometer for real motion data

### Step 1 — Open the App
Open `index.html` in your browser. You will see the main card with a motion graph, countdown timer, and control buttons.

### Step 2 — Configure Timeout
Use the **Timeout** slider to set how many seconds of inactivity trigger the alert:
- **5 seconds** — very sensitive, alerts quickly
- **15 seconds** — balanced default
- **60 seconds** — generous, for slow-moving scenarios

### Step 3 — Activate the Switch
Click **Activate Switch**. The status changes to **ACTIVE** (green) and the countdown starts.

### Step 4 — Simulate Motion
Move your mouse over the **Motion Activity** canvas. Each mouse movement:
- Adds a spike to the motion graph
- Resets the watchdog timer back to the timeout value
- Keeps the status in ACTIVE (green)

Alternatively, click **Simulate Movement** to inject a burst of fake motion.

### Step 5 — Observe Warning State
Stop moving. When the timer reaches the last 20% of the countdown:
- Status changes to **WARNING** (yellow)
- A warning log entry appears
- The timer display turns orange

### Step 6 — Trigger the Alert
Keep still until the timer reaches **0:00**:
- Status changes to **ALERT TRIGGERED** (red, flashing)
- A siren alarm sound plays
- The alert is logged with a timestamp
- A simulated SOS broadcast is sent
- The entry appears in the Alert Log

### Step 7 — Reactivate
After an alert, click **Activate Switch** again to restart the monitoring cycle.

---

## Challenges

### Challenge 1: Precision Timing
Set timeout to exactly 10 seconds. Activate the switch and try to let the alert trigger at precisely 0:00 without touching anything after activation. Can you predict the exact moment?

### Challenge 2: Endurance
Keep the switch alive for 2 full minutes using only mouse movement over the canvas. The goal is to never let the timer drop below 50%.

### Challenge 3: Two-Stage Alert Design
Think about how you would modify the system to have:
- A **soft beep** when the timer hits 50% remaining
- A **full siren** only when it hits 0%

This is already partially implemented (WARNING state at 20%). Can you identify how to adjust the threshold in the code?

---

## Understanding the Code

### State Machine
The switch has three states:
```
ACTIVE (green) ──[timer < 20%]──> WARNING (yellow) ──[timer = 0]──> ALERT (red)
    ^                                    |
    └──────[motion detected]─────────────┘
```

### Key Variables
- `dmsActive` — is the switch currently monitoring?
- `dmsTimeout` — total countdown in seconds
- `dmsRemaining` — current countdown value
- `dmsState` — current state ('active', 'warning', 'alert')
- `motionMagnitude` — current motion level (0 to 1)

### Motion Detection
On desktop: mouse movement over the canvas generates motion magnitude from `movementX` and `movementY`.
On mobile: the DeviceMotion API provides real accelerometer data, which is converted to magnitude.

### Watchdog Timer
Runs at 100ms intervals (`setInterval`). Each tick:
1. Decrements `dmsRemaining` by 0.1 seconds
2. Checks if we've entered WARNING zone (< 20% remaining)
3. Checks if timer has expired (triggers alert)

---

## Connecting to Real micro:bit

To connect this simulation to a real micro:bit:

1. Use Web Bluetooth or Web Serial to read accelerometer data
2. Replace mouse-based motion detection with real sensor values
3. The watchdog logic remains the same
4. For radio broadcast, use the micro:bit's radio module to send actual SOS messages

---

## Tips

- Enable **Sound effects** in Settings to hear the alarm
- Open the **Activity Log** to see all events in real time
- Try different **themes** — the motion graph adapts its colors
- Switch to **Arabic** to test RTL layout with the simulation
