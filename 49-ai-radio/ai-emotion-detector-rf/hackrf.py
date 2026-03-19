#!/usr/bin/env python3
"""Emotion Detector RF — RTL-SDR Micro-Doppler Radar Capture
Captures CW radar reflections to detect micro-Doppler signatures
from breathing, heartbeat, and body micro-movements.
"""

import numpy as np
import time
import os
import logging
from scipy import signal as scipy_signal
from scipy.fft import fft, fftshift

logging.basicConfig(level=logging.INFO, format='%(asctime)s [SDR] %(message)s')
logger = logging.getLogger(__name__)

CENTER_FREQ = 2.4e9
SAMPLE_RATE = 2.4e6
GAIN = 45
NUM_SAMPLES = 128 * 1024
PIPE_PATH = "/tmp/sdr_emotion_pipe"
CLUTTER_REMOVAL = True


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        logger.info(f"SDR radar: {CENTER_FREQ/1e9:.3f}GHz")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_samples(sdr, num_samples=NUM_SAMPLES):
    if sdr is not None:
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    breathing_rate = np.random.uniform(0.15, 0.4)
    heart_rate = np.random.uniform(0.9, 1.8)
    body_motion = np.random.uniform(0, 0.005)
    clutter = 0.8 * np.exp(1j * 0.1)
    breathing_phase = 0.005 * np.sin(2 * np.pi * breathing_rate * t)
    heart_phase = 0.0008 * np.sin(2 * np.pi * heart_rate * t)
    motion_phase = body_motion * np.sin(2 * np.pi * 0.5 * t)
    target = 0.1 * np.exp(1j * (breathing_phase + heart_phase + motion_phase))
    noise = 0.01 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    return (clutter + target + noise).astype(np.complex64)


def remove_clutter(iq_samples, alpha=0.99):
    """Remove static clutter using exponential averaging."""
    clutter_est = np.mean(iq_samples[:1024])
    cleaned = np.zeros_like(iq_samples)
    for i in range(len(iq_samples)):
        clutter_est = alpha * clutter_est + (1 - alpha) * iq_samples[i]
        cleaned[i] = iq_samples[i] - clutter_est
    return cleaned


def extract_phase_signal(iq_samples, decimate_factor=256):
    """Extract high-resolution phase signal for vital signs."""
    phase = np.unwrap(np.angle(iq_samples))
    if decimate_factor > 1:
        phase_decimated = scipy_signal.decimate(phase, decimate_factor, zero_phase=True)
    else:
        phase_decimated = phase
    return phase_decimated


def compute_micro_doppler(iq_samples, stft_size=256, hop=64):
    """Compute micro-Doppler spectrogram."""
    num_frames = (len(iq_samples) - stft_size) // hop
    spectrogram = np.zeros((stft_size, max(1, num_frames)))
    window = np.hanning(stft_size)
    for i in range(num_frames):
        segment = iq_samples[i * hop:i * hop + stft_size]
        spec = fftshift(fft(segment * window))
        spectrogram[:, i] = 20 * np.log10(np.abs(spec) + 1e-12)
    return spectrogram


def measure_signal_quality(iq_samples):
    """Measure radar return signal quality."""
    power = np.mean(np.abs(iq_samples) ** 2)
    snr_est = 10 * np.log10(power / (np.var(np.diff(iq_samples).real) + 1e-12))
    return {
        "power_db": float(10 * np.log10(power + 1e-12)),
        "snr_db": float(snr_est),
        "phase_noise": float(np.std(np.diff(np.angle(iq_samples)))),
    }


def bandpass_phase(phase_signal, low_hz, high_hz, fs):
    """Bandpass filter phase signal for specific vital sign."""
    nyq = fs / 2
    if high_hz >= nyq:
        high_hz = nyq * 0.99
    b, a = scipy_signal.butter(4, [low_hz / nyq, high_hz / nyq], btype='band')
    return scipy_signal.lfilter(b, a, phase_signal)


def setup_pipe():
    if os.path.exists(PIPE_PATH):
        os.remove(PIPE_PATH)
    os.mkfifo(PIPE_PATH)
    logger.info(f"Pipe: {PIPE_PATH}")


def send_to_pipe(iq_data):
    try:
        fd = os.open(PIPE_PATH, os.O_WRONLY | os.O_NONBLOCK)
        os.write(fd, iq_data.astype(np.complex64).tobytes())
        os.close(fd)
        return True
    except OSError:
        return False


def main():
    logger.info("=== Emotion Detector RF — SDR Radar Capture ===")
    sdr = init_sdr()
    setup_pipe()
    captures = 0

    try:
        while True:
            iq = capture_samples(sdr)
            if CLUTTER_REMOVAL:
                iq_clean = remove_clutter(iq)
            else:
                iq_clean = iq
            quality = measure_signal_quality(iq_clean)
            sent = send_to_pipe(iq_clean)
            captures += 1
            if captures % 5 == 0:
                logger.info(f"Cap {captures}: SNR={quality['snr_db']:.1f}dB | "
                            f"Pwr={quality['power_db']:.1f}dB | "
                            f"PhaseNoise={quality['phase_noise']:.4f} "
                            f"{'-> ML' if sent else ''}")
            time.sleep(0.25)

    except KeyboardInterrupt:
        logger.info(f"Stopped after {captures} captures.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
