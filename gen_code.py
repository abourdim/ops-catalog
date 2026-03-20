#!/usr/bin/env python3
"""Phase 2: Generate hardware code directories for all 488 apps.

Each app gets a code/ directory with platform-appropriate source files:
- MicroPython + MakeCode JS for micro:bit categories
- Arduino .ino for ESP32 categories
- Python for SDR/WiFi/Ham/RPi/general categories
- GNURadio .grc for SDR/HackRF categories

Also adds a "Device Code" collapsible section to index.html and i18n keys to script.js.
"""

import os
import re
import glob
import json

ROOT = os.path.dirname(os.path.abspath(__file__))

# ═══════════════════════════════════════════════════════
# Category → Hardware platform mapping
# ═══════════════════════════════════════════════════════

PLATFORMS = {
    # micro:bit categories → MicroPython + MakeCode
    '01': ['micropython', 'makecode'],
    '07': ['micropython', 'makecode'],
    '11': ['micropython', 'makecode'],
    '22': ['micropython', 'makecode'],
    '40': ['micropython', 'makecode'],
    # ESP32 categories → Arduino
    '02': ['arduino'],
    '05': ['arduino'],
    '12': ['arduino'],
    '18': ['arduino'],
    '23': ['arduino'],
    # Browser-only → Python (standalone script)
    '03': ['python'],
    '06': ['python'],
    # Multi-device → MicroPython + Arduino + Python
    '04': ['micropython', 'arduino', 'python'],
    '08': ['micropython', 'arduino', 'python'],
    '09': ['micropython', 'arduino', 'python'],
    '13': ['micropython', 'arduino', 'python'],
    # HackRF/SDR → Python + GNURadio
    '10': ['python', 'gnuradio'],
    '16': ['python', 'gnuradio'],
    # WiFi → Python (scapy)
    '14': ['python'],
    '15': ['python'],
    '17': ['python'],
    # Ham Radio → Python + GNURadio
    '19': ['python', 'gnuradio'],
    '20': ['python', 'gnuradio'],
    '21': ['python', 'gnuradio'],
    '24': ['python', 'gnuradio'],
    '25': ['python', 'gnuradio'],
    '26': ['python', 'gnuradio'],
    # SDR → Python + GNURadio
    '27': ['python', 'gnuradio'],
    '28': ['python', 'gnuradio'],
    '29': ['python', 'gnuradio'],
    '30': ['python', 'gnuradio'],
    '31': ['python', 'gnuradio'],
    '32': ['python', 'gnuradio'],
    '33': ['python', 'gnuradio'],
    '34': ['python', 'gnuradio'],
    # Antenna → Python
    '35': ['python'],
    '41': ['python'],
    # Raspberry Pi → Python
    '36': ['python'],
    '37': ['python'],
    '38': ['python'],
    # Agent → Python + Arduino
    '39': ['python', 'arduino'],
    '42': ['python', 'arduino'],
    # New categories 43-55 → Python (general)
    '43': ['python'],       # bio-radio
    '44': ['python'],       # acoustic
    '45': ['python'],       # time
    '46': ['python'],       # swarm
    '47': ['python'],       # physics
    '48': ['python'],       # dark arts
    '49': ['python'],       # AI radio
    '50': ['python'],       # civilization
    '51': ['python'],       # social engineering
    '52': ['python', 'arduino'],  # hardware implants
    '53': ['python'],       # crypto attacks
    '54': ['python', 'gnuradio'],  # RF warfare
    '55': ['python'],       # escape/evasion
}


def get_app_info(script_path):
    """Extract app name, title, and description from script.js."""
    with open(script_path, 'r', encoding='utf-8') as f:
        content = f.read()
    title = 'Unknown App'
    subtitle = ''
    m = re.search(r"title\s*:\s*'([^']*)'", content)
    if m:
        title = m.group(1)
    m = re.search(r"subtitle\s*:\s*'([^']*)'", content)
    if m:
        subtitle = m.group(1)
    # Get step descriptions for context
    steps = []
    for i in range(1, 5):
        m = re.search(rf"step{i}Desc\s*:\s*'([^']*)'", content)
        if m:
            steps.append(m.group(1))
    return title, subtitle, steps, content


def sanitize_title(title):
    """Remove emojis and special chars for use in code comments."""
    return re.sub(r'[^\w\s\-/().,!?]', '', title).strip()


# ═══════════════════════════════════════════════════════
# Code generators for each platform
# ═══════════════════════════════════════════════════════

def gen_micropython(title, subtitle, steps, app_name):
    """Generate MicroPython code for micro:bit."""
    safe_title = sanitize_title(title)
    desc_lines = [f"# Step {i+1}: {s}" for i, s in enumerate(steps[:4])]
    desc_block = '\n'.join(desc_lines) if desc_lines else "# Interactive simulation"

    return f'''"""
{safe_title} — micro:bit MicroPython
{subtitle}

Workshop-DIY Educational Project
Flash to BBC micro:bit V2 via Mu Editor or microbit.org
"""

from microbit import *
import radio
import random
import utime

# ── Configuration ──
APP_NAME = "{app_name}"
RADIO_GROUP = {random.randint(1, 255)}
RADIO_POWER = 6  # 0-7

# ── Process Overview ──
{desc_block}

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
    return {{
        'temp': temperature(),
        'light': display.read_light_level(),
        'accel_x': accelerometer.get_x(),
        'accel_y': accelerometer.get_y(),
        'accel_z': accelerometer.get_z(),
        'compass': compass.heading(),
        'sound': microphone.sound_level() if hasattr(microphone, 'sound_level') else 0,
    }}

def process_data(sensors):
    """Process sensor data — core simulation logic."""
    # Combine sensor readings into a composite score
    score = (sensors['light'] + sensors['temp'] * 2 + abs(sensors['accel_x']) // 10) % 100
    return score

def broadcast(data):
    """Send data via radio."""
    msg = f"{{APP_NAME}}:{{data}}"
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
        display.scroll(f"C{{cycle_count}}", delay=50)
        utime.sleep_ms(500)

    utime.sleep_ms(100)
'''


def gen_makecode(title, subtitle, steps, app_name):
    """Generate MakeCode JavaScript for micro:bit."""
    safe_title = sanitize_title(title)

    return f'''/**
 * {safe_title} — MakeCode JavaScript
 * {subtitle}
 *
 * Workshop-DIY Educational Project
 * Paste into makecode.microbit.org editor
 */

// ── Configuration ──
const APP_NAME = "{app_name}"
const RADIO_GROUP = {random.randint(1, 255)}
let running = false
let cycleCount = 0
let score = 0

// ── Initialize ──
radio.setGroup(RADIO_GROUP)
radio.setTransmitPower(6)
basic.showIcon(IconNames.Happy)
basic.pause(500)
basic.showString(APP_NAME.substr(0, 4))

// ── Button A: Toggle simulation ──
input.onButtonPressed(Button.A, function () {{
    running = !running
    if (running) {{
        basic.showIcon(IconNames.SmallDiamond)
    }} else {{
        basic.showIcon(IconNames.Square)
    }}
}})

// ── Button B: Show stats ──
input.onButtonPressed(Button.B, function () {{
    basic.showString("C" + cycleCount)
}})

// ── Receive radio data ──
radio.onReceivedString(function (receivedString) {{
    basic.showIcon(IconNames.Target)
    basic.pause(200)
    if (running) {{
        basic.showIcon(IconNames.SmallDiamond)
    }}
}})

// ── Shake: Reset ──
input.onGesture(Gesture.Shake, function () {{
    cycleCount = 0
    score = 0
    basic.showIcon(IconNames.Happy)
}})

// ── Main Loop ──
basic.forever(function () {{
    if (running) {{
        // Read sensors
        let light = input.lightLevel()
        let temp = input.temperature()
        let accelX = Math.abs(input.acceleration(Dimension.X))

        // Process
        score = (light + temp * 2 + Math.idiv(accelX, 10)) % 100

        // Broadcast
        radio.sendString(APP_NAME + ":" + score)

        // Display result
        if (score > 70) {{
            basic.showIcon(IconNames.Yes)
        }} else if (score > 30) {{
            basic.showIcon(IconNames.Diamond)
        }} else {{
            basic.showIcon(IconNames.No)
        }}

        cycleCount += 1
        basic.pause(100)
    }} else {{
        basic.pause(500)
    }}
}})
'''


def gen_arduino(title, subtitle, steps, app_name):
    """Generate Arduino .ino for ESP32."""
    safe_title = sanitize_title(title)
    desc_lines = [f" *   Step {i+1}: {s}" for i, s in enumerate(steps[:4])]
    desc_block = '\n'.join(desc_lines) if desc_lines else " *   Interactive simulation"

    return f'''/*
 * {safe_title} — ESP32 Arduino
 * {subtitle}
 *
 * Workshop-DIY Educational Project
 * Board: ESP32 Dev Module
 * Upload via Arduino IDE with ESP32 board package
 *
 * Process:
{desc_block}
 */

#include <WiFi.h>
#include <esp_wifi.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>

// ── Configuration ──
#define APP_NAME "{app_name}"
#define LED_PIN 2
#define SCAN_TIME 5  // seconds

// ── State ──
bool running = false;
int cycleCount = 0;
float sensorValue = 0.0;
String lastResult = "";

// ── BLE ──
BLEScan* pBLEScan;

class ScanCallback : public BLEAdvertisedDeviceCallbacks {{
    void onResult(BLEAdvertisedDevice device) {{
        if (device.haveName()) {{
            Serial.printf("  [BLE] %s RSSI:%d\\n", device.getName().c_str(), device.getRSSI());
        }}
    }}
}};

void setup() {{
    Serial.begin(115200);
    Serial.println("\\n=== " APP_NAME " ===");
    Serial.println("Workshop-DIY ESP32 Firmware");
    Serial.println("Commands: START, STOP, SCAN, STATUS\\n");

    pinMode(LED_PIN, OUTPUT);

    // Initialize BLE
    BLEDevice::init(APP_NAME);
    pBLEScan = BLEDevice::getScan();
    pBLEScan->setAdvertisedDeviceCallbacks(new ScanCallback());
    pBLEScan->setActiveScan(true);
    pBLEScan->setInterval(100);
    pBLEScan->setWindow(99);

    // Initialize WiFi in station mode
    WiFi.mode(WIFI_STA);
    WiFi.disconnect();

    // Flash LED to indicate ready
    for (int i = 0; i < 3; i++) {{
        digitalWrite(LED_PIN, HIGH);
        delay(100);
        digitalWrite(LED_PIN, LOW);
        delay(100);
    }}

    Serial.println("[READY] Type START to begin");
}}

void processCommand(String cmd) {{
    cmd.trim();
    cmd.toUpperCase();

    if (cmd == "START") {{
        running = true;
        Serial.println("[START] Simulation running...");
        digitalWrite(LED_PIN, HIGH);
    }}
    else if (cmd == "STOP") {{
        running = false;
        Serial.println("[STOP] Simulation paused");
        digitalWrite(LED_PIN, LOW);
    }}
    else if (cmd == "SCAN") {{
        Serial.println("[SCAN] BLE scan starting...");
        BLEScanResults results = pBLEScan->start(SCAN_TIME, false);
        Serial.printf("[SCAN] Found %d devices\\n", results.getCount());
        pBLEScan->clearResults();
    }}
    else if (cmd == "STATUS") {{
        Serial.printf("[STATUS] Running:%s Cycles:%d Sensor:%.1f\\n",
            running ? "YES" : "NO", cycleCount, sensorValue);
    }}
}}

float readSensors() {{
    // Read analog sensor (or use internal temp)
    float raw = analogRead(36) / 4095.0 * 100.0;
    // Add some WiFi RSSI data
    int networks = WiFi.scanNetworks(false, false, false, 100);
    WiFi.scanDelete();
    return raw + networks * 2.0;
}}

void processData(float value) {{
    sensorValue = value;
    cycleCount++;

    // Classify result
    if (value > 70) {{
        lastResult = "HIGH";
        digitalWrite(LED_PIN, HIGH);
    }} else if (value > 30) {{
        lastResult = "MEDIUM";
        // Blink
        digitalWrite(LED_PIN, (millis() / 500) % 2);
    }} else {{
        lastResult = "LOW";
        digitalWrite(LED_PIN, LOW);
    }}

    if (cycleCount % 10 == 0) {{
        Serial.printf("[DATA] Cycle:%d Value:%.1f Result:%s\\n",
            cycleCount, value, lastResult.c_str());
    }}
}}

void loop() {{
    // Check serial commands
    if (Serial.available()) {{
        String cmd = Serial.readStringUntil('\\n');
        processCommand(cmd);
    }}

    if (running) {{
        float value = readSensors();
        processData(value);
        delay(100);
    }} else {{
        delay(500);
    }}
}}
'''


def gen_python(title, subtitle, steps, app_name, cat_prefix):
    """Generate Python script for SDR/WiFi/Ham/RPi/general."""
    safe_title = sanitize_title(title)
    desc_lines = [f"    Step {i+1}: {s}" for i, s in enumerate(steps[:4])]
    desc_block = '\n'.join(desc_lines) if desc_lines else "    Interactive simulation"

    # Choose imports based on category
    if cat_prefix in ['10', '16', '27', '28', '29', '30', '31', '32', '33', '34', '54']:
        # SDR
        imports = """import numpy as np
from scipy import signal as sig
try:
    from rtlsdr import RtlSdr
    HAS_SDR = True
except ImportError:
    HAS_SDR = False
    print("[WARN] rtlsdr not installed. Running in simulation mode.")
    print("  Install: pip install pyrtlsdr")
import matplotlib.pyplot as plt"""
        hw_setup = """
    if HAS_SDR:
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        print(f"[SDR] Tuned to {CENTER_FREQ/1e6:.3f} MHz, SR={SAMPLE_RATE/1e6:.1f} Msps")
    else:
        print("[SIM] Generating synthetic IQ data...")"""
        read_data = """
    if HAS_SDR:
        samples = sdr.read_samples(NUM_SAMPLES)
    else:
        t = np.arange(NUM_SAMPLES) / SAMPLE_RATE
        noise = np.random.normal(0, 0.1, NUM_SAMPLES) + 1j * np.random.normal(0, 0.1, NUM_SAMPLES)
        signal_component = np.exp(2j * np.pi * 50e3 * t)
        samples = signal_component + noise"""
        constants = """
# ── SDR Configuration ──
CENTER_FREQ = 100.0e6    # 100 MHz
SAMPLE_RATE = 2.048e6    # 2.048 Msps
GAIN = 20                # dB
NUM_SAMPLES = 256 * 1024"""
    elif cat_prefix in ['14', '15', '17']:
        # WiFi
        imports = """import subprocess
import time
import json
try:
    from scapy.all import sniff, Dot11, Dot11Beacon, Dot11ProbeReq, Dot11Elt
    HAS_SCAPY = True
except ImportError:
    HAS_SCAPY = False
    print("[WARN] scapy not installed. Running in simulation mode.")
    print("  Install: pip install scapy")"""
        hw_setup = """
    if HAS_SCAPY:
        print("[WIFI] Scapy loaded. For live capture, run as root with monitor-mode adapter.")
    else:
        print("[SIM] Running WiFi simulation...")"""
        read_data = """
    if HAS_SCAPY:
        packets = sniff(count=100, timeout=10, filter="wlan type mgt")
        for pkt in packets:
            if pkt.haslayer(Dot11Beacon):
                ssid = pkt[Dot11Elt].info.decode('utf-8', errors='ignore')
                bssid = pkt[Dot11].addr2
                print(f"  [AP] {ssid} ({bssid})")
    else:
        fake_aps = [
            {"ssid": "HomeWiFi", "bssid": "AA:BB:CC:DD:EE:01", "ch": 1, "rssi": -45},
            {"ssid": "CoffeeShop", "bssid": "AA:BB:CC:DD:EE:02", "ch": 6, "rssi": -62},
            {"ssid": "IoT_Device", "bssid": "AA:BB:CC:DD:EE:03", "ch": 11, "rssi": -78},
        ]
        for ap in fake_aps:
            print(f"  [AP] {ap['ssid']} ({ap['bssid']}) Ch:{ap['ch']} RSSI:{ap['rssi']}dBm")
            time.sleep(0.3)"""
        constants = """
# ── WiFi Configuration ──
INTERFACE = "wlan0mon"   # Monitor-mode interface
CHANNEL = 0             # 0 = all channels"""
    elif cat_prefix in ['19', '20', '21', '24', '25', '26']:
        # Ham Radio
        imports = """import numpy as np
from scipy import signal as sig
try:
    import pyaudio
    HAS_AUDIO = True
except ImportError:
    HAS_AUDIO = False
    print("[WARN] pyaudio not installed. Running in simulation mode.")
    print("  Install: pip install pyaudio")"""
        hw_setup = """
    if HAS_AUDIO:
        pa = pyaudio.PyAudio()
        stream = pa.open(format=pyaudio.paFloat32, channels=1,
                        rate=SAMPLE_RATE, input=True,
                        frames_per_buffer=BUFFER_SIZE)
        print(f"[AUDIO] Sampling at {SAMPLE_RATE} Hz")
    else:
        print("[SIM] Generating synthetic audio...")"""
        read_data = """
    if HAS_AUDIO:
        audio_data = np.frombuffer(stream.read(BUFFER_SIZE), dtype=np.float32)
    else:
        t = np.arange(BUFFER_SIZE) / SAMPLE_RATE
        audio_data = np.sin(2 * np.pi * 1000 * t) + 0.3 * np.random.randn(BUFFER_SIZE)"""
        constants = """
# ── Audio Configuration ──
SAMPLE_RATE = 44100
BUFFER_SIZE = 4096"""
    elif cat_prefix in ['36', '37', '38']:
        # Raspberry Pi
        imports = """import time
try:
    import RPi.GPIO as GPIO
    HAS_GPIO = True
except ImportError:
    HAS_GPIO = False
    print("[WARN] RPi.GPIO not available. Running in simulation mode.")"""
        hw_setup = """
    if HAS_GPIO:
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(LED_PIN, GPIO.OUT)
        GPIO.setup(SENSOR_PIN, GPIO.IN)
        print("[GPIO] Pins configured")
    else:
        print("[SIM] GPIO simulation mode...")"""
        read_data = """
    if HAS_GPIO:
        value = GPIO.input(SENSOR_PIN)
    else:
        import random
        value = random.randint(0, 1)"""
        constants = """
# ── GPIO Configuration ──
LED_PIN = 17
SENSOR_PIN = 27
BUZZER_PIN = 22"""
    else:
        # General Python
        imports = """import time
import hashlib
import json
import random
import struct"""
        hw_setup = """
    print("[SIM] Running in simulation mode...")"""
        read_data = """
    value = random.random() * 100
    time.sleep(0.1)"""
        constants = """
# ── Configuration ──
SIMULATION_SPEED = 1.0  # multiplier"""

    return f'''#!/usr/bin/env python3
"""
{safe_title}
{subtitle}

Workshop-DIY Educational Project

Process:
{desc_block}

Usage:
    python3 main.py

Requirements:
    pip install -r requirements.txt (if present)
"""

{imports}
{constants}

APP_NAME = "{app_name}"


def setup():
    """Initialize hardware/simulation."""
    print(f"\\n=== {{APP_NAME}} ===")
    print("Workshop-DIY — Educational Simulation\\n")
{hw_setup}


def read_data():
    """Read sensor/signal data."""
{read_data}
    return value


def process(data):
    """Process captured data — core algorithm."""
    # Normalize to 0-100 scale
    if isinstance(data, (int, float)):
        score = float(data) % 100
    else:
        score = abs(hash(str(data))) % 100

    # Classify
    if score > 70:
        level = "HIGH"
    elif score > 30:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {{"score": score, "level": level}}


def display_result(result):
    """Display analysis results."""
    bar = "█" * int(result["score"] / 5) + "░" * (20 - int(result["score"] / 5))
    print(f"  [{{result['level']:>6s}}] {{bar}} {{result['score']:.1f}}")


def main():
    """Main execution loop."""
    setup()
    print("\\n[START] Press Ctrl+C to stop\\n")

    cycle = 0
    try:
        while True:
            data = read_data()
            result = process(data)
            cycle += 1

            if cycle % 5 == 0:
                display_result(result)

            if cycle % 50 == 0:
                print(f"\\n  --- Cycle {{cycle}} complete ---\\n")

    except KeyboardInterrupt:
        print(f"\\n\\n[DONE] {{cycle}} cycles completed")
        print("Workshop-DIY — Keep experimenting! 🔬")


if __name__ == "__main__":
    main()
'''


def gen_gnuradio(title, app_name):
    """Generate a minimal GNURadio Companion .grc flowgraph."""
    safe_title = sanitize_title(title)
    return f'''<?xml version="1.0"?>
<!--
  {safe_title} — GNURadio Companion Flowgraph
  Workshop-DIY Educational Project

  Open in GNURadio Companion (gnuradio-companion)
  Requires: gnuradio >= 3.8
-->
<flow_graph>
  <timestamp>{{}}</timestamp>
  <block>
    <key>options</key>
    <param><key>id</key><value>{app_name.replace('-', '_')}</value></param>
    <param><key>title</key><value>{safe_title}</value></param>
    <param><key>author</key><value>Workshop-DIY</value></param>
    <param><key>description</key><value>Educational SDR flowgraph</value></param>
    <param><key>run</key><value>True</value></param>
    <param><key>realtime_scheduling</key><value></value></param>
  </block>
  <block>
    <key>variable</key>
    <param><key>id</key><value>samp_rate</value></param>
    <param><key>value</key><value>2048000</value></param>
  </block>
  <block>
    <key>variable</key>
    <param><key>id</key><value>center_freq</value></param>
    <param><key>value</key><value>100000000</value></param>
  </block>
  <block>
    <key>variable</key>
    <param><key>id</key><value>gain</value></param>
    <param><key>value</key><value>20</value></param>
  </block>
  <!-- Source: RTL-SDR or simulated -->
  <block>
    <key>analog_sig_source_x</key>
    <param><key>id</key><value>signal_source</value></param>
    <param><key>type</key><value>complex</value></param>
    <param><key>samp_rate</key><value>samp_rate</value></param>
    <param><key>waveform</key><value>analog.GR_COS_WAVE</value></param>
    <param><key>freq</key><value>50000</value></param>
    <param><key>amp</key><value>1</value></param>
  </block>
  <!-- Add noise -->
  <block>
    <key>analog_noise_source_x</key>
    <param><key>id</key><value>noise</value></param>
    <param><key>type</key><value>complex</value></param>
    <param><key>noise_type</key><value>analog.GR_GAUSSIAN</value></param>
    <param><key>amp</key><value>0.1</value></param>
  </block>
  <!-- Combine signal + noise -->
  <block>
    <key>blocks_add_xx</key>
    <param><key>id</key><value>add</value></param>
    <param><key>type</key><value>complex</value></param>
    <param><key>num_inputs</key><value>2</value></param>
  </block>
  <!-- FFT display -->
  <block>
    <key>qtgui_freq_sink_x</key>
    <param><key>id</key><value>freq_display</value></param>
    <param><key>type</key><value>complex</value></param>
    <param><key>name</key><value>{safe_title}</value></param>
    <param><key>fftsize</key><value>1024</value></param>
    <param><key>freqhalf</key><value>True</value></param>
    <param><key>center_freq</key><value>center_freq</value></param>
  </block>
  <!-- Waterfall display -->
  <block>
    <key>qtgui_waterfall_sink_x</key>
    <param><key>id</key><value>waterfall</value></param>
    <param><key>type</key><value>complex</value></param>
    <param><key>name</key><value>Waterfall</value></param>
    <param><key>fftsize</key><value>1024</value></param>
    <param><key>center_freq</key><value>center_freq</value></param>
  </block>
  <!-- Connections -->
  <connection>
    <source_block_id>signal_source</source_block_id><source_key>0</source_key>
    <sink_block_id>add</sink_block_id><sink_key>0</sink_key>
  </connection>
  <connection>
    <source_block_id>noise</source_block_id><source_key>0</source_key>
    <sink_block_id>add</sink_block_id><sink_key>1</sink_key>
  </connection>
  <connection>
    <source_block_id>add</source_block_id><source_key>0</source_key>
    <sink_block_id>freq_display</sink_block_id><sink_key>0</sink_key>
  </connection>
  <connection>
    <source_block_id>add</source_block_id><source_key>0</source_key>
    <sink_block_id>waterfall</sink_block_id><sink_key>0</sink_key>
  </connection>
</flow_graph>
'''


def gen_code_readme(title, subtitle, platforms, app_name):
    """Generate README.md for the code directory."""
    safe_title = sanitize_title(title)
    sections = []
    sections.append(f"# {safe_title} — Device Code\n")
    sections.append(f"> {subtitle}\n")
    sections.append("## Files\n")

    platform_info = {
        'micropython': ('`micropython/main.py`', 'BBC micro:bit V2', 'Flash via [Mu Editor](https://codewith.mu/) or [microbit.org](https://python.microbit.org/)'),
        'makecode': ('`makecode/main.js`', 'BBC micro:bit V2', 'Paste into [MakeCode Editor](https://makecode.microbit.org/)'),
        'arduino': ('`arduino/main.ino`', 'ESP32 Dev Module', 'Upload via [Arduino IDE](https://www.arduino.cc/en/software) with ESP32 board package'),
        'python': ('`python/main.py`', 'Any PC with Python 3', 'Run with `python3 main.py`'),
        'gnuradio': ('`gnuradio/flowgraph.grc`', 'PC with GNURadio 3.8+', 'Open in GNURadio Companion'),
    }

    for p in platforms:
        if p in platform_info:
            f, hw, how = platform_info[p]
            sections.append(f"### {f}\n- **Hardware:** {hw}\n- **How to run:** {how}\n")

    sections.append("## Safety Notice\n")
    sections.append("⚠️ This code is for **educational purposes only**. Never transmit on frequencies you are not licensed to use. Always follow local radio regulations.\n")
    sections.append("## License\n")
    sections.append("Workshop-DIY Educational Project\n")

    return '\n'.join(sections)


# ═══════════════════════════════════════════════════════
# HTML/JS injection for "Device Code" section
# ═══════════════════════════════════════════════════════

def get_code_tab_html(platforms, app_name):
    """Generate the Device Code section HTML."""
    tabs = []
    pres = []

    platform_labels = {
        'micropython': 'MicroPython',
        'makecode': 'MakeCode JS',
        'arduino': 'Arduino C++',
        'python': 'Python',
        'gnuradio': 'GNURadio',
    }

    for i, p in enumerate(platforms):
        active = ' active' if i == 0 else ''
        hidden = '' if i == 0 else ' hidden'
        label = platform_labels.get(p, p)
        tabs.append(f'            <button class="code-tab{active}" data-codetarget="{p}">{label}</button>')
        # We'll just show a link, not embed the full code (too large for HTML)
        ext = {'micropython': 'py', 'makecode': 'js', 'arduino': 'ino', 'python': 'py', 'gnuradio': 'grc'}.get(p, 'txt')
        subdir = p
        pres.append(f'            <div class="code-display{hidden}" id="code-{p}"><p>📄 <a href="code/{subdir}/main.{ext}" target="_blank">code/{subdir}/main.{ext}</a></p><button class="btn-sm" onclick="window.open(\'code/{subdir}/main.{ext}\')">⬇ Download</button></div>')

    tabs_html = '\n'.join(tabs)
    pres_html = '\n'.join(pres)

    return f"""
      <details class="collapsible">
        <summary><span class="icon">📦</span> <span data-i18n="sectionCode">Device Code</span></summary>
        <div class="card">
          <div class="code-tabs" id="codeTabs">
{tabs_html}
          </div>
{pres_html}
        </div>
      </details>"""


def inject_code_section_html(html_content, code_section_html):
    """Inject the Device Code section into index.html before the footer."""
    if 'sectionCode' in html_content:
        return html_content, False  # Already has it

    # Insert before </div> that closes rows-container, or before <footer>
    footer_match = re.search(r'(\s*</div>\s*<footer)', html_content)
    if footer_match:
        pos = footer_match.start()
        html_content = html_content[:pos] + '\n' + code_section_html + '\n' + html_content[pos:]
        return html_content, True

    # Try before footer directly
    footer_match = re.search(r'<footer', html_content)
    if footer_match:
        pos = footer_match.start()
        html_content = html_content[:pos] + code_section_html + '\n    ' + html_content[pos:]
        return html_content, True

    return html_content, False


def inject_code_i18n(script_content, platforms):
    """Add code-related i18n keys to script.js."""
    if 'sectionCode' in script_content:
        return script_content

    platform_labels = {
        'micropython': 'MicroPython',
        'makecode': 'MakeCode JS',
        'arduino': 'Arduino C++',
        'python': 'Python',
        'gnuradio': 'GNURadio',
    }

    new_content = script_content

    i18n_data = {
        'en': "sectionCode:'Device Code'",
        'fr': "sectionCode:'Code Appareil'",
        'ar': "sectionCode:'كود الجهاز'",
    }

    for lang in ['en', 'fr', 'ar']:
        lang_start = re.search(rf'\b{lang}\s*:\s*\{{', new_content)
        if not lang_start:
            continue
        start = lang_start.end()
        depth = 1
        pos = start
        while pos < len(new_content) and depth > 0:
            if new_content[pos] == '{':
                depth += 1
            elif new_content[pos] == '}':
                depth -= 1
            pos += 1
        close_pos = pos - 1
        insert = ',' + i18n_data[lang]
        new_content = new_content[:close_pos] + insert + new_content[close_pos:]

    return new_content


def inject_code_tab_css(html_content):
    """Add code-tab CSS if not present."""
    if '.code-tab' in html_content:
        return html_content

    css = """
    /* Code tabs */
    .code-tabs { display: flex; gap: 0.3rem; flex-wrap: wrap; margin-bottom: 0.8rem; }
    .code-tab { padding: 0.3rem 0.8rem; border-radius: 6px; font-size: 0.75rem; cursor: pointer; background: rgba(var(--accent-rgb),0.1); border: 1px solid rgba(var(--accent-rgb),0.2); color: inherit; transition: all 0.2s; }
    .code-tab.active { background: var(--accent); color: var(--bg, #08091a); }
    .code-display { padding: 0.5rem; border-radius: 6px; background: rgba(0,0,0,0.2); }
    .code-display.hidden { display: none; }
"""
    style_end = html_content.rfind('</style>')
    if style_end > 0:
        html_content = html_content[:style_end] + css + html_content[style_end:]
    return html_content


def inject_tab_switching_js(script_content):
    """Add code tab switching logic to script.js."""
    if 'codeTabs' in script_content:
        return script_content

    js = """
// ── Code Tab Switching ──
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('code-tab')) {
    var tabs = e.target.parentElement;
    tabs.querySelectorAll('.code-tab').forEach(function(t) { t.classList.remove('active'); });
    e.target.classList.add('active');
    var target = e.target.getAttribute('data-codetarget');
    var card = tabs.closest('.card');
    card.querySelectorAll('.code-display').forEach(function(d) { d.classList.add('hidden'); });
    var show = card.querySelector('#code-' + target);
    if (show) show.classList.remove('hidden');
  }
});
"""
    # Append to end of script
    script_content += '\n' + js
    return script_content


# ═══════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════

import random  # for seed in generated code

created = 0
errors = []

for script_path in sorted(glob.glob(os.path.join(ROOT, '[0-9]*', '*', 'script.js'))):
    app_dir = os.path.dirname(script_path)
    app_name = os.path.basename(app_dir)
    cat_name = os.path.basename(os.path.dirname(app_dir))
    cat_prefix = cat_name.split('-')[0]

    # Get platforms for this category
    platforms = PLATFORMS.get(cat_prefix, ['python'])

    # Get app info
    title, subtitle, steps, script_content = get_app_info(script_path)
    safe_title = sanitize_title(title)

    # Seed random for reproducible code
    random.seed(hash(app_name))

    # ── Create code/ directory ──
    code_dir = os.path.join(app_dir, 'code')
    os.makedirs(code_dir, exist_ok=True)

    # Generate code files
    for platform in platforms:
        if platform == 'micropython':
            subdir = os.path.join(code_dir, 'micropython')
            os.makedirs(subdir, exist_ok=True)
            with open(os.path.join(subdir, 'main.py'), 'w', encoding='utf-8') as f:
                f.write(gen_micropython(title, subtitle, steps, app_name))

        elif platform == 'makecode':
            subdir = os.path.join(code_dir, 'makecode')
            os.makedirs(subdir, exist_ok=True)
            with open(os.path.join(subdir, 'main.js'), 'w', encoding='utf-8') as f:
                f.write(gen_makecode(title, subtitle, steps, app_name))

        elif platform == 'arduino':
            subdir = os.path.join(code_dir, 'arduino')
            os.makedirs(subdir, exist_ok=True)
            with open(os.path.join(subdir, 'main.ino'), 'w', encoding='utf-8') as f:
                f.write(gen_arduino(title, subtitle, steps, app_name))

        elif platform == 'python':
            subdir = os.path.join(code_dir, 'python')
            os.makedirs(subdir, exist_ok=True)
            with open(os.path.join(subdir, 'main.py'), 'w', encoding='utf-8') as f:
                f.write(gen_python(title, subtitle, steps, app_name, cat_prefix))

        elif platform == 'gnuradio':
            subdir = os.path.join(code_dir, 'gnuradio')
            os.makedirs(subdir, exist_ok=True)
            with open(os.path.join(subdir, 'flowgraph.grc'), 'w', encoding='utf-8') as f:
                f.write(gen_gnuradio(title, app_name))

    # Generate code/README.md
    with open(os.path.join(code_dir, 'README.md'), 'w', encoding='utf-8') as f:
        f.write(gen_code_readme(title, subtitle, platforms, app_name))

    # ── Update index.html ──
    html_path = os.path.join(app_dir, 'index.html')
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    code_section_html = get_code_tab_html(platforms, app_name)
    html_content = inject_code_tab_css(html_content)
    html_content, html_ok = inject_code_section_html(html_content, code_section_html)

    if html_ok:
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html_content)

    # ── Update script.js ──
    new_script = inject_code_i18n(script_content, platforms)
    new_script = inject_tab_switching_js(new_script)

    if new_script != script_content:
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(new_script)

    created += 1
    if created % 50 == 0:
        print(f"  ... processed {created} apps")

print(f"\n✓ Generated code/ for {created} apps")
if errors:
    print(f"⚠ {len(errors)} errors:")
    for e in errors:
        print(f"  {e}")
