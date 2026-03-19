#!/usr/bin/env python3
"""Material Identifier RF — RTL-SDR Multi-Frequency Scanner
Performs multi-frequency RF transmission/reflection measurements
for material identification. Scans ISM bands and measures S-parameters.
"""

import numpy as np
import time
import os
import logging
from scipy import signal as scipy_signal
from scipy.fft import fft, fftshift

logging.basicConfig(level=logging.INFO, format='%(asctime)s [SDR] %(message)s')
logger = logging.getLogger(__name__)

SCAN_FREQS = [433.92e6, 868e6, 915e6, 1.2e9, 1.8e9, 2.4e9]
SAMPLE_RATE = 2.4e6
GAIN = 35
NUM_SAMPLES = 32 * 1024
PIPE_PATH = "/tmp/sdr_material_pipe"


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.gain = GAIN
        logger.info(f"SDR ready, {len(SCAN_FREQS)} freq points")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_at_freq(sdr, freq, num_samples=NUM_SAMPLES):
    """Capture IQ at specified frequency."""
    if sdr is not None:
        sdr.center_freq = freq
        time.sleep(0.02)
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    material_response = np.random.uniform(0.05, 0.95)
    phase_response = np.random.uniform(0, 2 * np.pi)
    freq_dependent = material_response * (1 + 0.3 * np.sin(freq / 1e9))
    tx_signal = np.exp(2j * np.pi * 50e3 * t)
    rx_signal = tx_signal * freq_dependent * np.exp(1j * phase_response)
    noise = 0.02 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    return (rx_signal + noise).astype(np.complex64)


def measure_s_parameters(iq_samples, reference_power=1.0):
    """Estimate S-parameter-like measurements from IQ data."""
    power = np.mean(np.abs(iq_samples) ** 2)
    s21_mag = np.sqrt(power / (reference_power + 1e-12))
    s21_phase = np.mean(np.angle(iq_samples))
    s11_est = 1 - s21_mag
    return {
        "s21_mag": float(s21_mag),
        "s21_db": float(20 * np.log10(s21_mag + 1e-12)),
        "s21_phase": float(s21_phase),
        "s11_est": float(s11_est),
        "return_loss_db": float(-20 * np.log10(s11_est + 1e-12)),
    }


def compute_dielectric_estimate(s_params_multi_freq):
    """Estimate dielectric constant from multi-frequency S-parameters."""
    if len(s_params_multi_freq) < 2:
        return None
    phases = [s["s21_phase"] for s in s_params_multi_freq]
    freqs = SCAN_FREQS[:len(phases)]
    phase_slope = np.polyfit(freqs, phases, 1)[0]
    c = 3e8
    thickness_est = 0.01
    epsilon_r_est = (phase_slope * c / (2 * np.pi * thickness_est)) ** 2
    return float(np.clip(abs(epsilon_r_est), 1, 100))


def sweep_frequencies(sdr):
    """Perform full frequency sweep for material characterization."""
    results = []
    for freq in SCAN_FREQS:
        iq = capture_at_freq(sdr, freq)
        s_params = measure_s_parameters(iq)
        s_params["freq_hz"] = freq
        results.append(s_params)
    return results


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
    logger.info("=== Material Identifier RF — SDR Multi-Freq Scanner ===")
    sdr = init_sdr()
    setup_pipe()
    sweeps = 0

    try:
        while True:
            sweep_data = sweep_frequencies(sdr)
            epsilon = compute_dielectric_estimate(sweep_data)
            sweeps += 1
            for s in sweep_data:
                iq = capture_at_freq(sdr, s["freq_hz"])
                send_to_pipe(iq)

            avg_s21 = np.mean([s["s21_db"] for s in sweep_data])
            logger.info(f"Sweep #{sweeps}: avg_S21={avg_s21:.1f}dB | "
                        f"epsilon_r={epsilon:.1f} | {len(SCAN_FREQS)} freqs")
            time.sleep(1.0)

    except KeyboardInterrupt:
        logger.info(f"Stopped after {sweeps} sweeps.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
