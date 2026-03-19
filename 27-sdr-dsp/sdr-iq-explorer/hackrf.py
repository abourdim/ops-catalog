#!/usr/bin/env python3
"""
SDR IQ Explorer
Explores IQ data characteristics: constellation plots, histograms,
phase/amplitude distributions, and DC offset measurement.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

CENTER_FREQ = 144.0e6
SAMPLE_RATE = 2.4e6
GAIN = 40

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    return sdr

def analyze_iq_quality(iq):
    i_data, q_data = np.real(iq), np.imag(iq)
    dc_offset_i = float(np.mean(i_data))
    dc_offset_q = float(np.mean(q_data))
    iq_imbalance = abs(np.std(i_data) - np.std(q_data)) / (np.std(i_data) + 1e-12)
    phase_offset = float(np.mean(np.angle(iq)))
    return {
        "dc_offset_i": round(dc_offset_i, 6), "dc_offset_q": round(dc_offset_q, 6),
        "iq_imbalance_pct": round(float(iq_imbalance * 100), 2),
        "phase_offset_deg": round(float(np.degrees(phase_offset)), 2),
        "i_rms": round(float(np.sqrt(np.mean(i_data ** 2))), 4),
        "q_rms": round(float(np.sqrt(np.mean(q_data ** 2))), 4),
    }

def amplitude_histogram(iq, bins=100):
    amp = np.abs(iq)
    hist, edges = np.histogram(amp, bins=bins)
    return {"min": round(float(np.min(amp)), 4), "max": round(float(np.max(amp)), 4),
            "mean": round(float(np.mean(amp)), 4), "std": round(float(np.std(amp)), 4)}

def phase_distribution(iq, bins=72):
    phase = np.angle(iq)
    hist, edges = np.histogram(phase, bins=bins, range=(-np.pi, np.pi))
    uniformity = np.std(hist) / (np.mean(hist) + 1e-12)
    return {"uniformity": round(float(uniformity), 4),
            "is_uniform": uniformity < 0.3}

def check_clipping(iq, threshold=0.95):
    amp = np.abs(iq)
    max_amp = np.max(amp)
    clipped = np.sum(amp > threshold * max_amp) / len(amp) * 100
    return {"max_amplitude": round(float(max_amp), 4),
            "clipped_pct": round(float(clipped), 3)}

def main():
    print("=== SDR IQ Explorer ===")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(256 * 1024)
        quality = analyze_iq_quality(iq)
        amp_stats = amplitude_histogram(iq)
        phase_stats = phase_distribution(iq)
        clip_stats = check_clipping(iq)
        print(f"[iq] Quality: {quality}")
        print(f"[iq] Amplitude: {amp_stats}")
        print(f"[iq] Phase: {phase_stats}")
        print(f"[iq] Clipping: {clip_stats}")
        result = {"quality": quality, "amplitude": amp_stats,
                  "phase": phase_stats, "clipping": clip_stats}
        with open("iq_analysis.json", "w") as f:
            json.dump(result, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
