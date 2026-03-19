#!/usr/bin/env python3
"""Whale Song Decoder — RPi Acoustic/RF Processing Station
Processes underwater hydrophone data relayed via RF to classify
whale species, track migration, and decode communication patterns.
"""

import numpy as np
import time
import json
import os
import logging
from datetime import datetime
from scipy import signal as scipy_signal
from scipy.fft import fft
from collections import deque

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

PIPE_PATH = "/tmp/sdr_whale_pipe"
LOG_PATH = os.path.expanduser("~/whale_logs/")
AUDIO_RATE = 44100
SPECIES = ["humpback", "blue", "fin", "right", "sperm", "orca", "beluga", "unknown"]

try:
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)
    HYDROPHONE_ADC = 17
    STATUS_LED = 18
    GPIO.setup(STATUS_LED, GPIO.OUT)
    HAS_GPIO = True
except Exception:
    HAS_GPIO = False


class WhaleSongDecoder:
    def __init__(self):
        self.detections = deque(maxlen=1000)
        self.species_counts = {s: 0 for s in SPECIES}
        self.song_patterns = []

    def extract_spectrogram(self, audio, n_fft=2048, hop=512):
        num_frames = (len(audio) - n_fft) // hop + 1
        spec = np.zeros((n_fft // 2, max(1, num_frames)))
        window = np.hanning(n_fft)
        for i in range(num_frames):
            frame = audio[i * hop:i * hop + n_fft]
            spectrum = np.abs(fft(frame * window))[:n_fft // 2]
            spec[:, i] = 20 * np.log10(spectrum + 1e-12)
        return spec

    def classify_species(self, audio):
        spec = self.extract_spectrogram(audio)
        freq_centroid = np.mean(np.argmax(spec, axis=0))
        bandwidth = np.std(np.argmax(spec, axis=0))
        duration = spec.shape[1] * 512 / AUDIO_RATE
        energy = np.mean(spec)
        if freq_centroid < 50 and duration > 5:
            species = "blue"
        elif freq_centroid < 100 and bandwidth > 20:
            species = "fin"
        elif freq_centroid > 200 and bandwidth > 50:
            species = "humpback"
        elif freq_centroid > 500:
            species = "orca"
        elif energy > -20:
            species = "sperm"
        else:
            species = "unknown"
        confidence = min(0.95, 0.4 + bandwidth / 100)
        self.species_counts[species] += 1
        return {"species": species, "confidence": round(confidence, 3),
                "freq_centroid_hz": float(freq_centroid * AUDIO_RATE / 2048),
                "duration_s": round(duration, 2)}

    def detect_song_units(self, audio, min_duration=0.1):
        envelope = np.abs(scipy_signal.hilbert(audio))
        smoothed = scipy_signal.lfilter(np.ones(500) / 500, 1, envelope)
        threshold = np.mean(smoothed) + 2 * np.std(smoothed)
        units = []
        above = smoothed > threshold
        transitions = np.diff(above.astype(int))
        starts = np.where(transitions == 1)[0]
        ends = np.where(transitions == -1)[0]
        for s in starts:
            matching_ends = ends[ends > s]
            if len(matching_ends) > 0:
                e = matching_ends[0]
                dur = (e - s) / AUDIO_RATE
                if dur > min_duration:
                    units.append({"start_s": float(s / AUDIO_RATE), "duration_s": float(dur),
                                  "peak_freq_hz": float(np.argmax(np.abs(fft(audio[s:e][:1024]))) * AUDIO_RATE / 1024)})
        return units

    def log_detection(self, result, units):
        entry = {"timestamp": datetime.now().isoformat(), **result, "num_units": len(units)}
        self.detections.append(entry)
        os.makedirs(LOG_PATH, exist_ok=True)
        with open(os.path.join(LOG_PATH, "detections.jsonl"), 'a') as f:
            f.write(json.dumps(entry) + "\n")


def read_audio_pipe():
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(AUDIO_RATE * 4 * 5)
            if len(raw) >= 4:
                return np.frombuffer(raw, dtype=np.float32)
        except Exception:
            pass
    t = np.arange(AUDIO_RATE * 3) / AUDIO_RATE
    song = sum(0.1 * np.sin(2 * np.pi * f * t) for f in [50, 120, 300, 800, 1200])
    envelope = np.sin(np.pi * t / 3) ** 2
    return (song * envelope).astype(np.float32)


def main():
    logger.info("=== Whale Song Decoder — RPi Acoustic Station ===")
    decoder = WhaleSongDecoder()
    if HAS_GPIO:
        GPIO.output(STATUS_LED, GPIO.HIGH)
    try:
        while True:
            audio = read_audio_pipe()
            if np.mean(audio ** 2) < 1e-8:
                time.sleep(1)
                continue
            result = decoder.classify_species(audio)
            units = decoder.detect_song_units(audio)
            decoder.log_detection(result, units)
            logger.info(f"Species: {result['species']} ({result['confidence']:.0%}) | "
                        f"F0={result['freq_centroid_hz']:.0f}Hz | {len(units)} units | "
                        f"Dur={result['duration_s']:.1f}s")
            time.sleep(2)
    except KeyboardInterrupt:
        logger.info(f"Stopped. Counts: {decoder.species_counts}")
        if HAS_GPIO:
            GPIO.cleanup()


if __name__ == "__main__":
    main()
