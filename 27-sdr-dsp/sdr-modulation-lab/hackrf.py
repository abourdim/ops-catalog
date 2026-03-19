#!/usr/bin/env python3
"""
SDR Modulation Lab
Analyzes and identifies modulation types from live SDR captures.
Computes AM/FM/PM indices, constellation diagrams, and eye diagrams.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

CENTER_FREQ = 100e6
SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048
GAIN = 40

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    return sdr

def analyze_am(iq):
    envelope = np.abs(iq)
    dc = np.mean(envelope)
    mod_index = (np.max(envelope) - np.min(envelope)) / (2 * dc + 1e-12)
    return {"am_mod_index": round(float(mod_index), 4), "am_dc": round(float(dc), 4)}

def analyze_fm(iq, sr):
    inst_freq = np.diff(np.unwrap(np.angle(iq))) / (2 * np.pi) * sr
    max_dev = np.max(np.abs(inst_freq - np.mean(inst_freq)))
    return {"fm_max_dev_hz": round(float(max_dev), 1),
            "fm_rms_dev_hz": round(float(np.std(inst_freq)), 1)}

def analyze_phase(iq):
    phase = np.unwrap(np.angle(iq))
    phase_dev = phase - np.mean(phase)
    return {"pm_max_dev_rad": round(float(np.max(np.abs(phase_dev))), 3),
            "pm_rms_dev_rad": round(float(np.std(phase_dev)), 3)}

def compute_eye_diagram(iq, samples_per_symbol, num_traces=50):
    trace_len = samples_per_symbol * 2
    traces = []
    for i in range(num_traces):
        start = i * samples_per_symbol
        if start + trace_len <= len(iq):
            traces.append(np.real(iq[start:start + trace_len]))
    return np.array(traces) if traces else np.array([])

def auto_classify(am, fm, pm):
    if am["am_mod_index"] > 0.3 and fm["fm_max_dev_hz"] < 1000:
        return "AM"
    elif fm["fm_max_dev_hz"] > 5000:
        return "FM"
    elif pm["pm_max_dev_rad"] > 0.5 and fm["fm_max_dev_hz"] < 5000:
        return "PM/PSK"
    return "unknown"

def main():
    print("=== SDR Modulation Lab ===")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(FFT_SIZE * 16)
        am = analyze_am(iq)
        fm = analyze_fm(iq, SAMPLE_RATE)
        pm = analyze_phase(iq)
        mod_type = auto_classify(am, fm, pm)
        print(f"[mod] AM analysis: {am}")
        print(f"[mod] FM analysis: {fm}")
        print(f"[mod] PM analysis: {pm}")
        print(f"[mod] Detected modulation: {mod_type}")
        result = {"modulation": mod_type, "am": am, "fm": fm, "pm": pm}
        with open("modulation_analysis.json", "w") as f:
            json.dump(result, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
