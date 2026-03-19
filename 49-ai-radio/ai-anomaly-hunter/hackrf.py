#!/usr/bin/env python3
"""Anomaly Hunter — RTL-SDR Wideband Spectrum Monitor
Continuously scans spectrum bands, computes power spectral density,
and feeds data to anomaly detection ML pipeline.
"""

import numpy as np
import time
import os
import logging
from scipy import signal as scipy_signal
from scipy.fft import fft, fftshift

logging.basicConfig(level=logging.INFO, format='%(asctime)s [SDR] %(message)s')
logger = logging.getLogger(__name__)

SCAN_BANDS = [
    {"name": "ISM_433", "start": 430e6, "end": 440e6},
    {"name": "ISM_868", "start": 863e6, "end": 870e6},
    {"name": "ISM_915", "start": 902e6, "end": 928e6},
    {"name": "VHF_AIR", "start": 118e6, "end": 137e6},
    {"name": "2M_HAM", "start": 144e6, "end": 148e6},
]
SAMPLE_RATE = 2.4e6
GAIN = 40
FFT_SIZE = 1024
PIPE_PATH = "/tmp/sdr_anomaly_pipe"
NUM_SAMPLES = 256 * 1024


def init_sdr():
    """Initialize RTL-SDR."""
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.gain = GAIN
        logger.info(f"SDR ready: {SAMPLE_RATE/1e6:.1f}MS/s, gain={GAIN}dB")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_samples(sdr, center_freq, num_samples=NUM_SAMPLES):
    """Capture IQ at specified frequency."""
    if sdr is not None:
        sdr.center_freq = center_freq
        time.sleep(0.01)
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    noise = 0.01 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    num_signals = np.random.randint(0, 4)
    for _ in range(num_signals):
        f_off = np.random.uniform(-SAMPLE_RATE / 3, SAMPLE_RATE / 3)
        amp = np.random.uniform(0.05, 0.5)
        bw = np.random.uniform(5e3, 200e3)
        mod = np.random.randn(num_samples) * bw / SAMPLE_RATE
        phase = 2 * np.pi * np.cumsum(f_off / SAMPLE_RATE + mod)
        noise += amp * np.exp(1j * phase)
    return noise.astype(np.complex64)


def compute_waterfall_row(iq_samples, fft_size=FFT_SIZE):
    """Compute averaged PSD for waterfall display."""
    num_avg = len(iq_samples) // fft_size
    psd = np.zeros(fft_size)
    window = np.blackman(fft_size)
    for i in range(min(num_avg, 64)):
        seg = iq_samples[i * fft_size:(i + 1) * fft_size]
        spec = fftshift(fft(seg * window))
        psd += np.abs(spec) ** 2
    psd /= max(1, min(num_avg, 64))
    return 10 * np.log10(psd + 1e-12)


def detect_energy_spikes(psd_db, threshold_db=15):
    """Quick energy spike detection before ML analysis."""
    noise_floor = np.percentile(psd_db, 25)
    threshold = noise_floor + threshold_db
    spikes = []
    above = psd_db > threshold
    regions = np.where(np.diff(above.astype(int)))[0]
    if len(regions) >= 2:
        for i in range(0, len(regions) - 1, 2):
            start, end = regions[i], regions[i + 1]
            peak_db = float(np.max(psd_db[start:end + 1]))
            spikes.append({
                "bin_start": int(start),
                "bin_end": int(end),
                "peak_db": peak_db,
                "snr_db": float(peak_db - noise_floor),
            })
    return spikes, float(noise_floor)


def compute_spectral_entropy(psd_db):
    """Compute spectral entropy as anomaly metric."""
    psd_linear = 10 ** (psd_db / 10)
    psd_norm = psd_linear / np.sum(psd_linear)
    entropy = -np.sum(psd_norm * np.log2(psd_norm + 1e-12))
    max_entropy = np.log2(len(psd_db))
    return float(entropy / max_entropy)


def setup_pipe():
    """Create IPC pipe."""
    if os.path.exists(PIPE_PATH):
        os.remove(PIPE_PATH)
    os.mkfifo(PIPE_PATH)
    logger.info(f"Pipe: {PIPE_PATH}")


def send_to_pipe(iq_data):
    """Send IQ data to ML engine."""
    try:
        fd = os.open(PIPE_PATH, os.O_WRONLY | os.O_NONBLOCK)
        os.write(fd, iq_data.astype(np.complex64).tobytes())
        os.close(fd)
        return True
    except OSError:
        return False


def scan_band(sdr, band):
    """Scan an entire frequency band."""
    results = []
    freq = band["start"]
    while freq < band["end"]:
        iq = capture_samples(sdr, freq)
        psd = compute_waterfall_row(iq)
        spikes, noise_floor = detect_energy_spikes(psd)
        entropy = compute_spectral_entropy(psd)
        results.append({
            "freq": freq,
            "psd": psd,
            "iq": iq,
            "spikes": spikes,
            "noise_floor": noise_floor,
            "entropy": entropy,
        })
        freq += SAMPLE_RATE * 0.8
    return results


def main():
    logger.info("=== Anomaly Hunter — SDR Spectrum Scanner ===")
    sdr = init_sdr()
    setup_pipe()

    try:
        while True:
            for band in SCAN_BANDS:
                results = scan_band(sdr, band)
                total_spikes = sum(len(r["spikes"]) for r in results)
                avg_entropy = np.mean([r["entropy"] for r in results])

                logger.info(f"Band {band['name']}: {len(results)} steps | "
                            f"{total_spikes} spikes | entropy={avg_entropy:.3f}")

                for r in results:
                    if len(r["spikes"]) > 0 or r["entropy"] < 0.5:
                        sent = send_to_pipe(r["iq"])
                        if sent:
                            logger.info(f"  {r['freq']/1e6:.3f}MHz: "
                                        f"{len(r['spikes'])} spikes -> ML")

            time.sleep(1.0)

    except KeyboardInterrupt:
        logger.info("Scanner stopped.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
