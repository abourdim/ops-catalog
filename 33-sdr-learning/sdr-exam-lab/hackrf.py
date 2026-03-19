#!/usr/bin/env python3
"""SDR Exam Lab - Practical exercises for radio license examinations."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

SAMPLE_RATE = 2.4e6
GAIN = 40

def exercise_measure_frequency():
    """Exercise: Accurately measure a signal's frequency."""
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = 100e6
    sdr.gain = GAIN
    iq = sdr.read_samples(8192)
    spec = np.abs(np.fft.fftshift(np.fft.fft(iq)))
    peak_bin = np.argmax(spec)
    freq_offset = (peak_bin - len(spec) / 2) * SAMPLE_RATE / len(spec)
    measured_freq = sdr.center_freq + freq_offset
    sdr.close()
    return {"measured_mhz": round(measured_freq / 1e6, 4)}

def exercise_measure_bandwidth():
    """Exercise: Measure -3dB and -20dB signal bandwidth."""
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = 100e6
    sdr.gain = GAIN
    iq = sdr.read_samples(4096)
    window = signal.blackmanharris(len(iq))
    spec = np.abs(np.fft.fftshift(np.fft.fft(iq * window)))
    psd_db = 20 * np.log10(spec + 1e-12)
    peak = np.max(psd_db)
    bw3 = np.sum(psd_db > peak - 3) * SAMPLE_RATE / len(iq)
    bw20 = np.sum(psd_db > peak - 20) * SAMPLE_RATE / len(iq)
    sdr.close()
    return {"bw_3db_khz": round(bw3 / 1e3, 1), "bw_20db_khz": round(bw20 / 1e3, 1)}

def exercise_identify_modulation():
    """Exercise: Identify modulation type of unknown signal."""
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = 144.39e6
    sdr.gain = GAIN
    iq = sdr.read_samples(8192)
    env_var = np.var(np.abs(iq)) / (np.mean(np.abs(iq)) ** 2 + 1e-12)
    phase_var = np.var(np.diff(np.unwrap(np.angle(iq))))
    sdr.close()
    mod = "FM" if phase_var > env_var else "AM"
    return {"envelope_var": round(float(env_var), 4), "phase_var": round(float(phase_var), 4),
            "modulation": mod}

def main():
    print("=== SDR Exam Lab ===\n")
    print("[ex1] Frequency Measurement:")
    r1 = exercise_measure_frequency()
    print(f"  Result: {r1}\n")
    print("[ex2] Bandwidth Measurement:")
    r2 = exercise_measure_bandwidth()
    print(f"  Result: {r2}\n")
    print("[ex3] Modulation ID:")
    r3 = exercise_identify_modulation()
    print(f"  Result: {r3}")

if __name__ == "__main__":
    main()
