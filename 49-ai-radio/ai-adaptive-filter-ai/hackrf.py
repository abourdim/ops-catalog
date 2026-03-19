#!/usr/bin/env python3
"""Adaptive Filter AI — RTL-SDR Dual-Channel Capture
Captures primary and reference signals for adaptive noise cancellation.
Provides raw IQ data with interference characterization.
"""

import numpy as np
import time
import os
import logging
from scipy import signal as scipy_signal
from scipy.fft import fft, fftshift

logging.basicConfig(level=logging.INFO, format='%(asctime)s [SDR] %(message)s')
logger = logging.getLogger(__name__)

CENTER_FREQ = 144.39e6
SAMPLE_RATE = 2.4e6
GAIN = 35
NUM_SAMPLES = 256 * 1024
PIPE_PATH = "/tmp/sdr_filter_pipe"
FFT_SIZE = 1024


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        logger.info(f"SDR: {CENTER_FREQ/1e6:.3f}MHz")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_samples(sdr, num_samples=NUM_SAMPLES):
    if sdr is not None:
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    desired = 0.2 * np.exp(2j * np.pi * 30e3 * t)
    desired *= (1.0 + 0.3 * np.sin(2 * np.pi * 1e3 * t))
    interf_freqs = [100e3, 250e3, -180e3]
    interference = sum(
        np.random.uniform(0.1, 0.8) * np.exp(2j * np.pi * f * t)
        for f in interf_freqs
    )
    noise = 0.03 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    return (desired + interference + noise).astype(np.complex64)


def characterize_interference(iq_samples, fft_size=FFT_SIZE):
    """Identify interference sources in spectrum."""
    num_avg = len(iq_samples) // fft_size
    psd = np.zeros(fft_size)
    window = np.hanning(fft_size)
    for i in range(min(num_avg, 32)):
        seg = iq_samples[i * fft_size:(i + 1) * fft_size]
        spec = fftshift(fft(seg * window))
        psd += np.abs(spec) ** 2
    psd /= min(num_avg, 32)
    psd_db = 10 * np.log10(psd + 1e-12)
    noise_floor = np.percentile(psd_db, 30)
    threshold = noise_floor + 12
    freq_axis = np.linspace(-SAMPLE_RATE / 2, SAMPLE_RATE / 2, fft_size)
    interferers = []
    above = psd_db > threshold
    regions = np.where(np.diff(above.astype(int)))[0]
    for i in range(0, len(regions) - 1, 2):
        s, e = regions[i], regions[i + 1]
        peak_bin = s + np.argmax(psd_db[s:e + 1])
        interferers.append({
            "freq_offset": float(freq_axis[peak_bin]),
            "power_db": float(psd_db[peak_bin]),
            "bandwidth": float((e - s) * SAMPLE_RATE / fft_size),
            "inr_db": float(psd_db[peak_bin] - noise_floor),
        })
    return interferers, float(noise_floor)


def notch_filter(iq_samples, freq_offset, notch_bw=5e3):
    """Apply notch filter at interference frequency."""
    w0 = freq_offset / (SAMPLE_RATE / 2)
    if abs(w0) >= 1.0:
        return iq_samples
    Q = freq_offset / (notch_bw + 1e-6)
    Q = max(1, min(100, abs(Q)))
    b, a = scipy_signal.iirnotch(abs(w0), Q)
    return scipy_signal.lfilter(b, a, iq_samples)


def measure_sinr(iq_samples, signal_bw=20e3):
    """Estimate SINR from raw samples."""
    spectrum = np.abs(fftshift(fft(iq_samples[:FFT_SIZE]))) ** 2
    center = FFT_SIZE // 2
    sig_bins = int(signal_bw / (SAMPLE_RATE / FFT_SIZE))
    signal_power = np.mean(spectrum[center - sig_bins:center + sig_bins])
    noise_power = np.mean(np.concatenate([
        spectrum[:center - sig_bins * 2],
        spectrum[center + sig_bins * 2:]
    ])) + 1e-12
    return float(10 * np.log10(signal_power / noise_power))


def agc(iq_samples, target=1.0):
    """Automatic gain control."""
    power = np.mean(np.abs(iq_samples) ** 2)
    if power > 0:
        return iq_samples * np.sqrt(target / power)
    return iq_samples


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
    logger.info("=== Adaptive Filter AI — SDR Capture Engine ===")
    sdr = init_sdr()
    setup_pipe()

    try:
        while True:
            iq = capture_samples(sdr)
            iq = agc(iq)
            interferers, noise_floor = characterize_interference(iq)
            sinr_before = measure_sinr(iq)
            pre_filtered = iq.copy()
            for interf in interferers:
                if interf["inr_db"] > 15:
                    pre_filtered = notch_filter(pre_filtered, interf["freq_offset"])
            sinr_after = measure_sinr(pre_filtered)
            sent = send_to_pipe(pre_filtered)
            logger.info(f"Interferers: {len(interferers)} | "
                        f"SINR: {sinr_before:.1f}->{sinr_after:.1f}dB | "
                        f"Floor={noise_floor:.1f}dB {'-> ML' if sent else ''}")
            time.sleep(0.1)

    except KeyboardInterrupt:
        logger.info("Stopped.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
