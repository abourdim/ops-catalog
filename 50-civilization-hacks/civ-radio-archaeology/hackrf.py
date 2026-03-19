#!/usr/bin/env python3
"""Radio Archaeology — RTL-SDR GPR Signal Capture
Captures ground-penetrating radar reflections using SDR,
applies time-domain processing for subsurface imaging.
"""

import numpy as np
import time
import os
import logging
from scipy import signal as scipy_signal
from scipy.fft import fft, fftshift

logging.basicConfig(level=logging.INFO, format='%(asctime)s [SDR] %(message)s')
logger = logging.getLogger(__name__)

CENTER_FREQ = 400e6
SAMPLE_RATE = 2.4e6
GAIN = 45
NUM_SAMPLES = 64 * 1024
PIPE_PATH = "/tmp/sdr_archaeology_pipe"


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        logger.info(f"SDR GPR: {CENTER_FREQ/1e6:.0f}MHz")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_samples(sdr, num_samples=NUM_SAMPLES):
    if sdr is not None:
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    direct = 0.8 * np.exp(-t * 1e6) * np.cos(2 * np.pi * 200e3 * t)
    reflections = np.zeros(num_samples)
    for delay_us, amp in [(0.5, 0.3), (1.2, 0.15), (2.0, 0.08), (3.5, 0.04)]:
        delay_samp = int(delay_us * 1e-6 * SAMPLE_RATE)
        if delay_samp < num_samples - 100:
            reflections[delay_samp:delay_samp + 100] += amp * np.exp(-np.arange(100) / 50) * \
                np.cos(2 * np.pi * 200e3 * t[:100])
    noise = 0.02 * np.random.randn(num_samples)
    return ((direct + reflections + noise) + 1j * 0.01 * np.random.randn(num_samples)).astype(np.complex64)


def time_gain_compensation(trace, alpha=2.0):
    """Apply time-varying gain to compensate for depth attenuation."""
    gain = np.exp(alpha * np.arange(len(trace)) / len(trace))
    return trace * gain


def background_removal(traces, current_trace):
    """Remove average background from current trace."""
    if len(traces) < 3:
        return current_trace
    bg = np.mean(traces[-10:], axis=0)
    min_len = min(len(bg), len(current_trace))
    result = current_trace.copy()
    result[:min_len] -= bg[:min_len]
    return result


def bandpass_filter(iq_samples, low_mhz=100, high_mhz=800):
    """Bandpass filter for GPR frequency range."""
    nyq = SAMPLE_RATE / 2
    low = low_mhz * 1e6 / nyq
    high = min(high_mhz * 1e6 / nyq, 0.99)
    if low >= high:
        return iq_samples
    b, a = scipy_signal.butter(4, [low, high], btype='band')
    return scipy_signal.lfilter(b, a, iq_samples)


def compute_depth_profile(iq_samples, velocity=0.1):
    """Convert time-domain trace to depth profile."""
    envelope = np.abs(scipy_signal.hilbert(np.real(iq_samples)))
    t_ns = np.arange(len(envelope)) / SAMPLE_RATE * 1e9
    depth_m = t_ns * velocity / 2
    return envelope, depth_m


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
    logger.info("=== Radio Archaeology — SDR GPR Capture ===")
    sdr = init_sdr()
    setup_pipe()
    traces = []
    trace_num = 0

    try:
        while True:
            iq = capture_samples(sdr)
            filtered = bandpass_filter(iq)
            trace = np.real(filtered)
            trace = time_gain_compensation(trace)
            trace = background_removal(traces, trace)
            traces.append(trace[:2048])
            if len(traces) > 100:
                traces.pop(0)
            envelope, depths = compute_depth_profile(filtered)
            sent = send_to_pipe(filtered)
            trace_num += 1
            max_depth = depths[np.argmax(envelope)] if len(depths) > 0 else 0
            logger.info(f"Trace {trace_num}: max_refl_depth={max_depth:.2f}m | "
                        f"peak={np.max(envelope):.3f} {'-> RPi' if sent else ''}")
            time.sleep(0.2)

    except KeyboardInterrupt:
        logger.info(f"Stopped after {trace_num} traces.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
