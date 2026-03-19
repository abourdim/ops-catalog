#!/usr/bin/env python3
"""
HackRF Replay Lab
Records IQ samples from a target frequency, stores them for analysis,
and provides replay capability for signal research. Supports configurable
capture duration, sample format, and metadata logging.
"""

import numpy as np
from rtlsdr import RtlSdr
import struct
import time
import os
import json

# --- Configuration ---
CENTER_FREQ = 315e6       # Common garage door / keyfob frequency
SAMPLE_RATE = 2.0e6       # 2 MSPS
GAIN = 40
CAPTURE_DURATION = 5.0    # Seconds to record
OUTPUT_DIR = "captures"

def configure_sdr():
    """Initialize RTL-SDR for IQ capture."""
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    return sdr

def record_iq_samples(sdr, duration_sec):
    """Record IQ samples for the specified duration."""
    total_samples = int(duration_sec * SAMPLE_RATE)
    chunk_size = 262144  # Read in 256K chunks
    all_samples = np.array([], dtype=np.complex64)

    print(f"[replay] Recording {duration_sec:.1f}s at {CENTER_FREQ/1e6:.3f} MHz...")
    start_time = time.time()

    while len(all_samples) < total_samples:
        remaining = total_samples - len(all_samples)
        n = min(chunk_size, remaining)
        iq = sdr.read_samples(n)
        all_samples = np.concatenate([all_samples, iq.astype(np.complex64)])

    elapsed = time.time() - start_time
    print(f"[replay] Captured {len(all_samples)} samples in {elapsed:.2f}s")
    return all_samples

def save_iq_file(samples, filename):
    """Save IQ samples in raw interleaved float32 format (I,Q,I,Q,...)."""
    interleaved = np.empty(len(samples) * 2, dtype=np.float32)
    interleaved[0::2] = np.real(samples)
    interleaved[1::2] = np.imag(samples)
    interleaved.tofile(filename)
    file_size = os.path.getsize(filename)
    print(f"[replay] Saved {filename} ({file_size / 1024:.1f} KB)")

def save_metadata(filename, center_freq, sample_rate, gain, duration, num_samples):
    """Save capture metadata as JSON sidecar."""
    meta = {
        "center_freq_hz": center_freq,
        "sample_rate_hz": sample_rate,
        "gain_db": gain,
        "duration_sec": duration,
        "num_samples": num_samples,
        "format": "complex64_interleaved_float32",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
    }
    meta_file = filename.replace(".iq", ".json")
    with open(meta_file, "w") as f:
        json.dump(meta, f, indent=2)
    print(f"[replay] Metadata saved to {meta_file}")

def analyze_capture(samples, sample_rate):
    """Quick analysis of captured signal: power, peak detection."""
    power = np.mean(np.abs(samples) ** 2)
    power_db = 10 * np.log10(power + 1e-12)
    peak_amplitude = np.max(np.abs(samples))
    # Check for signal bursts (envelope threshold crossings)
    envelope = np.abs(samples)
    threshold = np.mean(envelope) + 3 * np.std(envelope)
    burst_mask = envelope > threshold
    burst_count = np.sum(np.diff(burst_mask.astype(int)) == 1)
    print(f"[replay] Avg power: {power_db:.1f} dB | Peak amp: {peak_amplitude:.4f}")
    print(f"[replay] Detected {burst_count} signal bursts above threshold")
    return {"power_db": round(power_db, 2), "peak_amp": round(float(peak_amplitude), 4),
            "burst_count": int(burst_count)}

def main():
    print("=== HackRF Replay Lab ===")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    sdr = configure_sdr()
    try:
        samples = record_iq_samples(sdr, CAPTURE_DURATION)
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        iq_file = os.path.join(OUTPUT_DIR, f"capture_{timestamp}.iq")
        save_iq_file(samples, iq_file)
        save_metadata(iq_file, CENTER_FREQ, SAMPLE_RATE, GAIN, CAPTURE_DURATION, len(samples))
        stats = analyze_capture(samples, SAMPLE_RATE)
        print(f"\n[replay] Capture complete. Stats: {stats}")
    except KeyboardInterrupt:
        print("\n[replay] Recording interrupted.")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
