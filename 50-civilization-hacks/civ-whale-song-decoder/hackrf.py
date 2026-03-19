#!/usr/bin/env python3
"""Whale Song Decoder — RTL-SDR Hydrophone Data Receiver
Receives acoustic data relayed from underwater hydrophone buoys
via VHF radio link. Demodulates and extracts audio for analysis.
"""

import numpy as np
import time
import os
import logging
from scipy import signal as scipy_signal
from scipy.fft import fft, fftshift

logging.basicConfig(level=logging.INFO, format='%(asctime)s [SDR] %(message)s')
logger = logging.getLogger(__name__)

CENTER_FREQ = 161.975e6
SAMPLE_RATE = 2.4e6
AUDIO_RATE = 44100
GAIN = 40
NUM_SAMPLES = 256 * 1024
PIPE_PATH = "/tmp/sdr_whale_pipe"


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        logger.info(f"SDR: {CENTER_FREQ/1e6:.3f}MHz hydrophone relay")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_samples(sdr, num_samples=NUM_SAMPLES):
    if sdr is not None:
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    whale_freqs = [50, 120, 300, 800, 1200, 2000]
    audio_signal = sum(np.random.uniform(0.05, 0.2) * np.sin(2 * np.pi * f * t)
                       for f in whale_freqs)
    fm_dev = 5e3
    phase = 2 * np.pi * np.cumsum(audio_signal * fm_dev / SAMPLE_RATE)
    iq = 0.3 * np.exp(1j * phase)
    noise = 0.05 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    return (iq + noise).astype(np.complex64)


def fm_demodulate(iq):
    return np.angle(iq[1:] * np.conj(iq[:-1]))


def decimate_to_audio(signal_data, in_rate=SAMPLE_RATE, out_rate=AUDIO_RATE):
    ratio = max(1, int(in_rate / out_rate))
    cutoff = min(out_rate / 2 / (in_rate / 2), 0.99)
    b, a = scipy_signal.butter(5, cutoff)
    filtered = scipy_signal.lfilter(b, a, signal_data)
    return filtered[::ratio]


def hydrophone_bandpass(audio, low=10, high=20000, fs=AUDIO_RATE):
    nyq = fs / 2
    b, a = scipy_signal.butter(4, [max(low / nyq, 0.001), min(high / nyq, 0.99)], btype='band')
    return scipy_signal.lfilter(b, a, audio)


def detect_whale_presence(audio, threshold=0.01):
    low_energy = np.mean(audio[:len(audio) // 4] ** 2)
    return low_energy > threshold


def setup_pipe():
    if os.path.exists(PIPE_PATH):
        os.remove(PIPE_PATH)
    os.mkfifo(PIPE_PATH)
    logger.info(f"Pipe: {PIPE_PATH}")


def send_audio(audio):
    try:
        fd = os.open(PIPE_PATH, os.O_WRONLY | os.O_NONBLOCK)
        os.write(fd, audio.astype(np.float32).tobytes())
        os.close(fd)
        return True
    except OSError:
        return False


def main():
    logger.info("=== Whale Song Decoder — SDR Hydrophone Receiver ===")
    sdr = init_sdr()
    setup_pipe()
    captures = 0
    try:
        while True:
            iq = capture_samples(sdr)
            demod = fm_demodulate(iq)
            audio = decimate_to_audio(demod)
            audio = hydrophone_bandpass(audio)
            audio = audio / (np.max(np.abs(audio)) + 1e-12)
            has_whale = detect_whale_presence(audio)
            captures += 1
            if has_whale:
                sent = send_audio(audio)
                logger.info(f"Cap {captures}: WHALE DETECTED | {len(audio)} smp {'-> RPi' if sent else ''}")
            elif captures % 10 == 0:
                logger.info(f"Cap {captures}: monitoring...")
            time.sleep(2)
    except KeyboardInterrupt:
        logger.info(f"Stopped after {captures} captures.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
