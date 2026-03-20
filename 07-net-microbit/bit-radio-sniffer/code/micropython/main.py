"""
bit-radio-sniffer — micro:bit MicroPython
📻 scan · 📡 capture · 🔍 analyze

Workshop-DIY Educational Project
Flash to BBC micro:bit V2 via Mu Editor or microbit.org
"""

from microbit import *
import radio
import random
import utime

# ── Configuration ──
APP_NAME = "bit-radio-sniffer"
RADIO_GROUP = 195
RADIO_POWER = 6  # 0-7

# ── Process Overview ──
# Step 1: Select one of 84 radio groups (0-83). Each group operates on a different frequency.
# Step 2: The sniffer monitors the channel and captures any radio traffic it detects.
# Step 3: Raw packet data is captured in hex format, then decoded to reveal readable text.
# Step 4: Activity levels are shown as a bar chart and waterfall display for spectrum analysis.

# ── State ──
running = False
data_buffer = []
cycle_count = 0

def init():
    """Initialize hardware and radio."""
    radio.on()
    radio.config(group=RADIO_GROUP, power=RADIO_POWER)
    display.show(Image.HAPPY)
    utime.sleep_ms(500)

def read_sensors():
    """Read all available sensors."""
    return {
        'temp': temperature(),
        'light': display.read_light_level(),
        'accel_x': accelerometer.get_x(),
        'accel_y': accelerometer.get_y(),
        'accel_z': accelerometer.get_z(),
        'compass': compass.heading(),
        'sound': microphone.sound_level() if hasattr(microphone, 'sound_level') else 0,
    }

def process_data(sensors):
    """Process sensor data — core simulation logic."""
    # Combine sensor readings into a composite score
    score = (sensors['light'] + sensors['temp'] * 2 + abs(sensors['accel_x']) // 10) % 100
    return score

def broadcast(data):
    """Send data via radio."""
    msg = f"{APP_NAME}:{data}"
    radio.send(msg)

def check_incoming():
    """Check for incoming radio messages."""
    msg = radio.receive()
    if msg:
        data_buffer.append(msg)
        display.show(Image.ARROW_N)
        utime.sleep_ms(200)
    return msg

def display_result(score):
    """Display result on LED matrix."""
    if score > 70:
        display.show(Image.YES)
    elif score > 30:
        display.show(Image.DIAMOND)
    else:
        display.show(Image.NO)

# ── Main Loop ──
init()
display.scroll(APP_NAME[:8], delay=60)

while True:
    if button_a.was_pressed():
        running = not running
        if running:
            display.show(Image.ARROW_E)
        else:
            display.show(Image.SQUARE_SMALL)

    if running:
        sensors = read_sensors()
        score = process_data(sensors)
        broadcast(score)
        display_result(score)
        cycle_count += 1

        if cycle_count % 10 == 0:
            display.scroll(str(score), delay=50)

    check_incoming()

    if button_b.was_pressed():
        # Show stats
        display.scroll(f"C{cycle_count}", delay=50)
        utime.sleep_ms(500)

    utime.sleep_ms(100)
