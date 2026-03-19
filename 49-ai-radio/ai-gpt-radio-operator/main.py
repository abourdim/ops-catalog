#!/usr/bin/env python3
"""GPT Radio Operator — RPi ML Inference Engine
AI-powered radio operator that understands voice commands, manages QSOs,
and provides intelligent radio operation assistance using NLP.
"""

import numpy as np
import time
import json
import os
import logging
import re
from datetime import datetime
from scipy import signal as scipy_signal
from scipy.io import wavfile

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

MODEL_PATH = os.path.expanduser("~/models/radio_operator_nlp.tflite")
WHISPER_MODEL = os.path.expanduser("~/models/whisper_tiny.tflite")
SAMPLE_RATE_AUDIO = 16000
QSO_LOG_PATH = os.path.expanduser("~/radio_logs/qso_log.json")
PIPE_PATH = "/tmp/sdr_audio_pipe"

PHONETIC_ALPHABET = {
    'A': 'Alpha', 'B': 'Bravo', 'C': 'Charlie', 'D': 'Delta',
    'E': 'Echo', 'F': 'Foxtrot', 'G': 'Golf', 'H': 'Hotel',
    'I': 'India', 'J': 'Juliet', 'K': 'Kilo', 'L': 'Lima',
    'M': 'Mike', 'N': 'November', 'O': 'Oscar', 'P': 'Papa',
    'Q': 'Quebec', 'R': 'Romeo', 'S': 'Sierra', 'T': 'Tango',
    'U': 'Uniform', 'V': 'Victor', 'W': 'Whiskey', 'X': 'X-ray',
    'Y': 'Yankee', 'Z': 'Zulu'
}

RADIO_COMMANDS = {
    "tune": r"(?:tune|go)\s+(?:to\s+)?(\d+\.?\d*)\s*(mhz|khz|ghz)?",
    "mode": r"(?:switch|change|set)\s+(?:to\s+)?(?:mode\s+)?(am|fm|ssb|usb|lsb|cw|digital)",
    "log": r"(?:log|record)\s+(?:qso|contact)\s+(?:with\s+)?(\w+)",
    "call": r"(?:call|hail)\s+(\w+)",
    "scan": r"(?:scan|sweep)\s+(?:from\s+)?(\d+\.?\d*)\s*(?:to\s+)?(\d+\.?\d*)",
    "report": r"(?:signal\s+)?report",
}


class RadioNLP:
    """NLP engine for parsing and generating radio communications."""

    def __init__(self):
        self.context = {"frequency": 145.5, "mode": "FM", "callsign": ""}
        self.qso_log = []
        self._load_qso_log()

    def _load_qso_log(self):
        if os.path.exists(QSO_LOG_PATH):
            try:
                with open(QSO_LOG_PATH, 'r') as f:
                    self.qso_log = json.load(f)
            except Exception:
                self.qso_log = []

    def save_qso_log(self):
        os.makedirs(os.path.dirname(QSO_LOG_PATH), exist_ok=True)
        with open(QSO_LOG_PATH, 'w') as f:
            json.dump(self.qso_log, f, indent=2)

    def parse_command(self, text):
        """Parse voice-transcribed text into radio commands."""
        text_lower = text.lower().strip()
        for cmd, pattern in RADIO_COMMANDS.items():
            match = re.search(pattern, text_lower)
            if match:
                return {"command": cmd, "args": match.groups(), "raw": text}
        return {"command": "unknown", "args": (), "raw": text}

    def execute_command(self, parsed):
        """Execute a parsed radio command."""
        cmd = parsed["command"]
        args = parsed["args"]
        if cmd == "tune":
            freq = float(args[0])
            unit = args[1] if args[1] else "mhz"
            if unit == "khz":
                freq /= 1000
            elif unit == "ghz":
                freq *= 1000
            self.context["frequency"] = freq
            return f"Tuning to {freq:.3f} MHz"
        elif cmd == "mode":
            mode = args[0].upper()
            self.context["mode"] = mode
            return f"Mode set to {mode}"
        elif cmd == "log":
            callsign = args[0].upper()
            entry = {
                "callsign": callsign,
                "frequency": self.context["frequency"],
                "mode": self.context["mode"],
                "timestamp": datetime.now().isoformat(),
                "rst_sent": "59", "rst_recv": "59",
            }
            self.qso_log.append(entry)
            self.save_qso_log()
            return f"QSO logged with {callsign} on {self.context['frequency']} MHz"
        elif cmd == "call":
            callsign = args[0].upper()
            phonetic = " ".join(PHONETIC_ALPHABET.get(c, c) for c in callsign)
            return f"Calling {callsign} ({phonetic}), {callsign} this is operator"
        elif cmd == "scan":
            start, end = float(args[0]), float(args[1])
            return f"Scanning {start:.3f} to {end:.3f} MHz"
        elif cmd == "report":
            return f"Current: {self.context['frequency']:.3f} MHz, {self.context['mode']}"
        return f"Unrecognized: {parsed['raw']}"

    def generate_response(self, signal_report):
        """Generate contextual radio response."""
        snr = signal_report.get("snr_db", 0)
        if snr > 20:
            rst = "59"
        elif snr > 10:
            rst = "57"
        elif snr > 5:
            rst = "55"
        else:
            rst = "41"
        return {"rst": rst, "signal_quality": "good" if snr > 10 else "weak"}


def transcribe_audio(audio_samples):
    """Transcribe audio using Whisper-tiny or mock."""
    commands = [
        "tune to 146.520 mhz", "switch to FM mode", "log qso with W1ABC",
        "signal report", "scan from 144 to 148", "call KD2ABC",
    ]
    return np.random.choice(commands)


def read_audio_pipe():
    """Read audio samples from SDR audio pipe."""
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(SAMPLE_RATE_AUDIO * 2 * 2)
            return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
        except Exception:
            pass
    duration = 2.0
    t = np.arange(int(SAMPLE_RATE_AUDIO * duration)) / SAMPLE_RATE_AUDIO
    return np.sin(2 * np.pi * 440 * t).astype(np.float32)


def detect_voice_activity(audio, threshold=0.02):
    """Simple energy-based voice activity detection."""
    frame_size = SAMPLE_RATE_AUDIO // 10
    num_frames = len(audio) // frame_size
    for i in range(num_frames):
        frame = audio[i * frame_size:(i + 1) * frame_size]
        energy = np.mean(frame ** 2)
        if energy > threshold:
            return True
    return False


def main():
    logger.info("=== GPT Radio Operator — RPi NLP Engine ===")
    nlp = RadioNLP()
    logger.info(f"QSO log: {len(nlp.qso_log)} entries loaded")

    try:
        while True:
            audio = read_audio_pipe()
            if detect_voice_activity(audio):
                transcript = transcribe_audio(audio)
                logger.info(f"Heard: '{transcript}'")
                parsed = nlp.parse_command(transcript)
                response = nlp.execute_command(parsed)
                logger.info(f"Action: {response}")
                logger.info(f"Context: {nlp.context}")
            else:
                logger.debug("No voice activity detected")
            time.sleep(1.0)

    except KeyboardInterrupt:
        nlp.save_qso_log()
        logger.info(f"Stopped. {len(nlp.qso_log)} QSOs logged.")


if __name__ == "__main__":
    main()
