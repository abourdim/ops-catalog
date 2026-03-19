#!/usr/bin/env python3
"""Underground Rescue Radio — RTL-SDR VLF/ELF Receiver
Receives ultra-low-frequency through-the-earth signals from
underground transmitters. Specialized for mine rescue operations.
"""

import numpy as np
import time
import os
import json
import logging
from scipy import signal as scipy_signal
from scipy.fft import fft, fftshift

logging.basicConfig(level=logging.INFO, format='%(asctime)s [SDR] %(message)s')
logger = logging.getLogger(__name__)

CENTER_FREQ = 24e3
SAMPLE_RATE = 2.4e6
GAIN = 49
NUM_SAMPLES = 512 * 1024
PIPE_PATH = "/tmp/sdr_rescue_pipe"
CARRIER_FREQ = 2000
SYMBOL_RATE = 5


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        logger.info(f"SDR VLF: {CENTER_FREQ/1e3:.0f}kHz, max gain")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_samples(sdr, num_samples=NUM_SAMPLES):
    if sdr is not None:
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    noise = 0.1 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    if np.random.rand() < 0.2:
        bits = np.random.randint(0, 2, 50)
        sps = int(SAMPLE_RATE / SYMBOL_RATE)
        symbols = np.repeat(bits, min(sps, num_samples // len(bits)))[:num_samples]
        f0, f1 = CARRIER_FREQ - 50, CARRIER_FREQ + 50
        freq = f0 + symbols[:num_samples] * (f1 - f0)
        phase = 2 * np.pi * np.cumsum(freq) / SAMPLE_RATE
        signal_data = 0.01 * np.exp(1j * phase)
        noise[:len(signal_data)] += signal_data
    return noise.astype(np.complex64)


def narrowband_filter(iq_samples, center_hz=CARRIER_FREQ, bw_hz=200):
    """Ultra-narrowband filter for VLF extraction."""
    t = np.arange(len(iq_samples)) / SAMPLE_RATE
    shifted = iq_samples * np.exp(-2j * np.pi * center_hz * t)
    decimation = max(1, int(SAMPLE_RATE / (bw_hz * 4)))
    cutoff = min(bw_hz / (SAMPLE_RATE / 2), 0.99)
    b, a = scipy_signal.butter(6, cutoff)
    filtered = scipy_signal.lfilter(b, a, shifted)
    return scipy_signal.decimate(filtered, decimation, zero_phase=True)


def fsk_demodulate(filtered_iq, symbol_rate=SYMBOL_RATE, sample_rate_filtered=None):
    """Demodulate FSK symbols from filtered signal."""
    if sample_rate_filtered is None:
        sample_rate_filtered = SAMPLE_RATE / max(1, int(SAMPLE_RATE / 800))
    inst_freq = np.diff(np.unwrap(np.angle(filtered_iq)))
    sps = max(1, int(sample_rate_filtered / symbol_rate))
    bits = []
    for i in range(0, len(inst_freq) - sps, sps):
        avg_freq = np.mean(inst_freq[i:i + sps])
        bits.append(1 if avg_freq > 0 else 0)
    return bits


def measure_vlf_snr(iq_samples):
    """Measure VLF signal SNR."""
    filtered = narrowband_filter(iq_samples)
    signal_power = np.mean(np.abs(filtered) ** 2)
    noise_power = np.var(np.diff(filtered).real) + 1e-12
    return float(10 * np.log10(signal_power / noise_power))


def detect_signal_presence(iq_samples, threshold_db=-20):
    """Detect if TTE signal is present."""
    snr = measure_vlf_snr(iq_samples)
    return snr > threshold_db, snr


def setup_pipe():
    if os.path.exists(PIPE_PATH):
        os.remove(PIPE_PATH)
    os.mkfifo(PIPE_PATH)
    logger.info(f"Pipe: {PIPE_PATH}")


def send_data(data):
    try:
        fd = os.open(PIPE_PATH, os.O_WRONLY | os.O_NONBLOCK)
        os.write(fd, json.dumps(data).encode())
        os.close(fd)
        return True
    except OSError:
        return False


def main():
    logger.info("=== Underground Rescue Radio — SDR VLF Receiver ===")
    sdr = init_sdr()
    setup_pipe()
    captures = 0
    try:
        while True:
            iq = capture_samples(sdr)
            detected, snr = detect_signal_presence(iq)
            captures += 1
            if detected:
                filtered = narrowband_filter(iq)
                bits = fsk_demodulate(filtered)
                data = {"bits": bits, "snr_db": snr, "timestamp": time.time()}
                sent = send_data(data)
                logger.info(f"SIGNAL! SNR={snr:.1f}dB | {len(bits)} bits {'-> RPi' if sent else ''}")
            elif captures % 10 == 0:
                logger.info(f"Cap {captures}: listening... SNR={snr:.1f}dB")
            time.sleep(1)
    except KeyboardInterrupt:
        logger.info(f"Stopped after {captures} captures.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
