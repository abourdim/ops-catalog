#!/usr/bin/env python3
"""SDR Oscilloscope - Time-domain IQ signal visualization and measurement."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

CENTER_FREQ = 100e6
SAMPLE_RATE = 2.4e6
GAIN = 40
CAPTURE_SAMPLES = 10000

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    return sdr

def measure_time_domain(iq):
    i_data, q_data = np.real(iq), np.imag(iq)
    envelope = np.abs(iq)
    # Frequency measurement via zero crossings
    zero_crossings = np.where(np.diff(np.sign(i_data)))[0]
    if len(zero_crossings) > 2:
        avg_period = np.mean(np.diff(zero_crossings)) / SAMPLE_RATE * 2
        freq_est = 1.0 / (avg_period + 1e-12)
    else:
        freq_est = 0
    # Peak-to-peak
    pp_i = float(np.max(i_data) - np.min(i_data))
    pp_q = float(np.max(q_data) - np.min(q_data))
    # RMS
    rms = float(np.sqrt(np.mean(np.abs(iq) ** 2)))
    # Crest factor
    crest = float(np.max(envelope) / (rms + 1e-12))
    return {"freq_est_hz": round(freq_est, 1), "peak_to_peak_i": round(pp_i, 4),
            "peak_to_peak_q": round(pp_q, 4), "rms": round(rms, 4),
            "crest_factor": round(crest, 2), "samples": len(iq)}

def main():
    print("=== SDR Oscilloscope ===")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(CAPTURE_SAMPLES)
        measurements = measure_time_domain(iq)
        print(f"[scope] Measurements: {json.dumps(measurements, indent=2)}")
        np.savez("oscilloscope_data.npz", i=np.real(iq[:1000]), q=np.imag(iq[:1000]))
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
