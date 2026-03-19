#!/usr/bin/env python3
"""AI Signal Identifier — RTL-SDR Capture & Signal Processing
Captures wideband IQ data, detects active signals, and feeds them
to the ML classification pipeline via named pipe.
"""

import numpy as np
import time
import os
import struct
import logging
from scipy import signal as scipy_signal
from scipy.fft import fft, fftshift

logging.basicConfig(level=logging.INFO, format='%(asctime)s [SDR] %(message)s')
logger = logging.getLogger(__name__)

CENTER_FREQ = 433.92e6
SAMPLE_RATE = 2.4e6
GAIN = 40
FFT_SIZE = 1024
SCAN_BANDWIDTH = 20e6
PIPE_PATH = "/tmp/sdr_iq_pipe"
NOISE_FLOOR_MARGIN_DB = 10


def init_sdr():
    """Initialize RTL-SDR device."""
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        sdr.set_bandwidth(SAMPLE_RATE)
        logger.info(f"RTL-SDR initialized: {CENTER_FREQ/1e6:.3f} MHz, "
                    f"{SAMPLE_RATE/1e6:.1f} MS/s, gain={GAIN}dB")
        return sdr
    except Exception as e:
        logger.warning(f"RTL-SDR not available: {e}. Using simulated data.")
        return None


def capture_samples(sdr, num_samples=256 * 1024):
    """Capture IQ samples from SDR or generate simulated signals."""
    if sdr is not None:
        return sdr.read_samples(num_samples)

    t = np.arange(num_samples) / SAMPLE_RATE
    noise = (np.random.randn(num_samples) + 1j * np.random.randn(num_samples)) * 0.01
    sig_type = np.random.choice(["am", "fm", "fsk", "ofdm"])
    if sig_type == "am":
        carrier = np.exp(2j * np.pi * 50e3 * t)
        mod = 1.0 + 0.5 * np.sin(2 * np.pi * 1e3 * t)
        samples = carrier * mod + noise
    elif sig_type == "fm":
        phase = 2 * np.pi * 75e3 * np.cumsum(np.sin(2 * np.pi * 1e3 * t)) / SAMPLE_RATE
        samples = np.exp(1j * (2 * np.pi * 100e3 * t + phase)) + noise
    elif sig_type == "fsk":
        bits = np.repeat(np.random.randint(0, 2, num_samples // 100), 100)[:num_samples]
        freq = 50e3 + bits * 25e3
        phase = 2 * np.pi * np.cumsum(freq) / SAMPLE_RATE
        samples = np.exp(1j * phase) + noise
    else:
        num_carriers = 64
        symbols = np.random.choice([-1, 1], (num_samples // num_carriers, num_carriers))
        samples = np.zeros(num_samples, dtype=np.complex64)
        for i in range(num_samples // num_carriers):
            block = np.fft.ifft(symbols[i])
            samples[i * num_carriers:(i + 1) * num_carriers] = block
        samples += noise
    return samples.astype(np.complex64)


def compute_power_spectrum(iq_samples, fft_size=FFT_SIZE):
    """Compute power spectral density in dB."""
    num_segments = len(iq_samples) // fft_size
    if num_segments == 0:
        return np.zeros(fft_size)
    psd = np.zeros(fft_size)
    window = np.hanning(fft_size)
    for i in range(num_segments):
        segment = iq_samples[i * fft_size:(i + 1) * fft_size]
        spectrum = fftshift(fft(segment * window))
        psd += np.abs(spectrum) ** 2
    psd /= num_segments
    return 10 * np.log10(psd + 1e-12)


def detect_signals(psd_db, sample_rate=SAMPLE_RATE, fft_size=FFT_SIZE):
    """Detect active signals above noise floor."""
    noise_floor = np.median(psd_db)
    threshold = noise_floor + NOISE_FLOOR_MARGIN_DB
    active_bins = np.where(psd_db > threshold)[0]
    if len(active_bins) == 0:
        return []

    signals = []
    freq_axis = np.linspace(-sample_rate / 2, sample_rate / 2, fft_size)
    groups = np.split(active_bins, np.where(np.diff(active_bins) > 3)[0] + 1)
    for group in groups:
        if len(group) < 2:
            continue
        center_bin = group[len(group) // 2]
        bandwidth = (group[-1] - group[0]) * sample_rate / fft_size
        peak_power = float(np.max(psd_db[group]))
        signals.append({
            "center_freq_offset": float(freq_axis[center_bin]),
            "bandwidth_hz": float(bandwidth),
            "peak_power_db": peak_power,
            "snr_db": float(peak_power - noise_floor),
            "num_bins": len(group),
        })
    return signals


def extract_signal_iq(iq_samples, freq_offset, bandwidth, sample_rate=SAMPLE_RATE):
    """Extract and downconvert a detected signal for ML processing."""
    t = np.arange(len(iq_samples)) / sample_rate
    shifted = iq_samples * np.exp(-2j * np.pi * freq_offset * t)
    decimation = max(1, int(sample_rate / (bandwidth * 2)))
    if decimation > 1:
        filtered = scipy_signal.decimate(shifted, decimation, zero_phase=True)
    else:
        filtered = shifted
    return filtered.astype(np.complex64)


def setup_pipe(pipe_path=PIPE_PATH):
    """Create named pipe for IPC with main.py."""
    if os.path.exists(pipe_path):
        os.remove(pipe_path)
    os.mkfifo(pipe_path)
    logger.info(f"IPC pipe created: {pipe_path}")


def send_to_pipe(iq_data, pipe_path=PIPE_PATH):
    """Send IQ samples through named pipe to ML engine."""
    try:
        fd = os.open(pipe_path, os.O_WRONLY | os.O_NONBLOCK)
        os.write(fd, iq_data.astype(np.complex64).tobytes())
        os.close(fd)
        return True
    except OSError:
        return False


def main():
    logger.info("=== AI Signal Identifier — SDR Capture Engine ===")
    sdr = init_sdr()
    setup_pipe()

    scan_freqs = np.arange(CENTER_FREQ - SCAN_BANDWIDTH / 2,
                           CENTER_FREQ + SCAN_BANDWIDTH / 2,
                           SAMPLE_RATE)
    freq_idx = 0

    try:
        while True:
            if sdr and len(scan_freqs) > 1:
                sdr.center_freq = scan_freqs[freq_idx % len(scan_freqs)]
                freq_idx += 1

            iq_samples = capture_samples(sdr)
            psd = compute_power_spectrum(iq_samples)
            signals = detect_signals(psd)

            current_freq = scan_freqs[freq_idx % len(scan_freqs)] if len(scan_freqs) > 1 else CENTER_FREQ
            logger.info(f"Freq={current_freq/1e6:.3f}MHz | "
                        f"Detected {len(signals)} signals | "
                        f"Floor={np.median(psd):.1f}dB")

            for sig in signals:
                extracted = extract_signal_iq(iq_samples, sig["center_freq_offset"], sig["bandwidth_hz"])
                sent = send_to_pipe(extracted)
                logger.info(f"  Signal: offset={sig['center_freq_offset']/1e3:.1f}kHz "
                            f"BW={sig['bandwidth_hz']/1e3:.1f}kHz "
                            f"SNR={sig['snr_db']:.1f}dB {'-> ML' if sent else '(pipe busy)'}")

            time.sleep(0.2)

    except KeyboardInterrupt:
        logger.info("SDR capture stopped.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
