#!/usr/bin/env python3
"""Neural Demodulator — RTL-SDR Capture & Preprocessing
Captures signals, applies channel estimation and equalization,
then feeds preprocessed IQ to the neural demodulator.
"""

import numpy as np
import time
import os
import logging
from scipy import signal as scipy_signal
from scipy.fft import fft, ifft, fftshift

logging.basicConfig(level=logging.INFO, format='%(asctime)s [SDR] %(message)s')
logger = logging.getLogger(__name__)

CENTER_FREQ = 144.39e6
SAMPLE_RATE = 2.4e6
GAIN = 35
PIPE_PATH = "/tmp/sdr_demod_pipe"
SYMBOL_RATE = 9600
NUM_SAMPLES = 256 * 1024


def init_sdr():
    """Initialize RTL-SDR device."""
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        logger.info(f"SDR ready: {CENTER_FREQ/1e6:.3f}MHz, {SAMPLE_RATE/1e6:.1f}MS/s")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_samples(sdr, num_samples=NUM_SAMPLES):
    """Capture IQ samples from SDR."""
    if sdr is not None:
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    symbols = np.repeat(np.random.choice([-1, 1], num_samples // 250), 250)[:num_samples]
    carrier = np.exp(2j * np.pi * 50e3 * t)
    signal_data = symbols * carrier
    channel = np.array([1.0, 0.3 * np.exp(1j * 0.5), 0.1 * np.exp(1j * 1.2)])
    signal_data = np.convolve(signal_data, channel, mode='same')
    snr_db = np.random.uniform(5, 25)
    noise_power = 10 ** (-snr_db / 10)
    noise = np.sqrt(noise_power / 2) * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    return (signal_data + noise).astype(np.complex64)


def agc(iq_samples, target_power=1.0):
    """Automatic gain control to normalize signal power."""
    current_power = np.mean(np.abs(iq_samples) ** 2)
    if current_power > 0:
        gain = np.sqrt(target_power / current_power)
        return iq_samples * gain
    return iq_samples


def remove_dc_offset(iq_samples):
    """Remove DC bias from IQ samples."""
    return iq_samples - np.mean(iq_samples)


def channel_estimate(iq_samples, pilot_spacing=64):
    """Estimate channel frequency response using pilot-based method."""
    spectrum = fft(iq_samples[:1024])
    pilot_indices = np.arange(0, 1024, pilot_spacing)
    pilot_values = spectrum[pilot_indices]
    channel_full = np.interp(
        np.arange(1024),
        pilot_indices,
        np.abs(pilot_values)
    ) * np.exp(1j * np.interp(
        np.arange(1024),
        pilot_indices,
        np.angle(pilot_values)
    ))
    return channel_full


def equalize(iq_samples, channel_est):
    """Apply zero-forcing equalization."""
    block_size = len(channel_est)
    num_blocks = len(iq_samples) // block_size
    equalized = np.zeros_like(iq_samples)
    regularization = 0.01
    equalizer = np.conj(channel_est) / (np.abs(channel_est) ** 2 + regularization)
    for i in range(num_blocks):
        block = iq_samples[i * block_size:(i + 1) * block_size]
        block_fft = fft(block)
        eq_fft = block_fft * equalizer
        equalized[i * block_size:(i + 1) * block_size] = ifft(eq_fft)
    return equalized


def matched_filter(iq_samples, sps=int(SAMPLE_RATE / SYMBOL_RATE)):
    """Apply root-raised-cosine matched filter."""
    alpha = 0.35
    num_taps = min(sps * 8, len(iq_samples) // 2)
    t = np.arange(-num_taps // 2, num_taps // 2) / sps
    t[t == 0] = 1e-12
    h = (np.sin(np.pi * t * (1 - alpha)) + 4 * alpha * t * np.cos(np.pi * t * (1 + alpha))) / \
        (np.pi * t * (1 - (4 * alpha * t) ** 2 + 1e-12))
    h /= np.sqrt(np.sum(h ** 2))
    filtered = scipy_signal.lfilter(h, 1.0, iq_samples)
    return filtered


def estimate_snr(iq_samples):
    """Estimate signal-to-noise ratio."""
    signal_power = np.mean(np.abs(iq_samples) ** 2)
    noise_est = np.var(np.diff(iq_samples)) / 2
    if noise_est > 0:
        return float(10 * np.log10(signal_power / noise_est))
    return 30.0


def setup_pipe():
    """Create named pipe for IPC."""
    if os.path.exists(PIPE_PATH):
        os.remove(PIPE_PATH)
    os.mkfifo(PIPE_PATH)
    logger.info(f"Pipe created: {PIPE_PATH}")


def send_to_pipe(iq_data):
    """Send processed IQ to ML engine."""
    try:
        fd = os.open(PIPE_PATH, os.O_WRONLY | os.O_NONBLOCK)
        os.write(fd, iq_data.astype(np.complex64).tobytes())
        os.close(fd)
        return True
    except OSError:
        return False


def main():
    logger.info("=== Neural Demodulator — SDR Capture Engine ===")
    sdr = init_sdr()
    setup_pipe()
    blocks_processed = 0

    try:
        while True:
            raw_iq = capture_samples(sdr)
            iq = remove_dc_offset(raw_iq)
            iq = agc(iq)
            channel = channel_estimate(iq)
            iq = equalize(iq, channel)
            iq = matched_filter(iq)
            snr = estimate_snr(iq)
            sent = send_to_pipe(iq)
            blocks_processed += 1
            logger.info(f"Block {blocks_processed}: {len(iq)} samples | "
                        f"SNR={snr:.1f}dB | {'-> ML' if sent else 'pipe busy'}")
            time.sleep(0.1)

    except KeyboardInterrupt:
        logger.info(f"Stopped after {blocks_processed} blocks.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
