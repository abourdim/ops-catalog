#!/usr/bin/env python3
"""
HackRF RF Time Machine
Continuously records wideband IQ data with timestamps, creating a
searchable RF history. Supports time-based playback, frequency extraction
from recorded data, and retroactive signal analysis.
"""

import numpy as np
from rtlsdr import RtlSdr
import time
import os
import struct
import json

# --- Configuration ---
CENTER_FREQ = 162.4e6     # NOAA Weather Radio
SAMPLE_RATE = 2.4e6
GAIN = 38
RECORD_CHUNK_SEC = 1.0    # Record in 1-second chunks
MAX_CHUNKS = 300           # 5 minutes of recording
OUTPUT_DIR = "rf_timeline"

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    return sdr

def record_timeline(sdr, max_chunks, chunk_sec):
    """Record IQ data as timestamped chunks for later playback."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    chunk_samples = int(chunk_sec * SAMPLE_RATE)
    manifest = []
    print(f"[timemachine] Recording {max_chunks} chunks ({max_chunks * chunk_sec:.0f}s total)")
    print(f"[timemachine] Freq: {CENTER_FREQ/1e6:.3f} MHz | Rate: {SAMPLE_RATE/1e6:.1f} MSPS")

    for i in range(max_chunks):
        timestamp = time.time()
        iq = sdr.read_samples(chunk_samples)
        iq_f32 = iq.astype(np.complex64)
        filename = f"chunk_{i:06d}.iq"
        filepath = os.path.join(OUTPUT_DIR, filename)
        iq_f32.tofile(filepath)
        power_db = 10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12)
        peak_db = 10 * np.log10(np.max(np.abs(iq) ** 2) + 1e-12)
        entry = {
            "chunk_id": i,
            "filename": filename,
            "timestamp": timestamp,
            "iso_time": time.strftime("%Y-%m-%dT%H:%M:%S", time.localtime(timestamp)),
            "samples": len(iq),
            "avg_power_db": round(float(power_db), 2),
            "peak_power_db": round(float(peak_db), 2),
        }
        manifest.append(entry)
        if i % 30 == 0:
            print(f"  Chunk {i:4d}/{max_chunks} | {entry['iso_time']} | "
                  f"Avg: {power_db:.1f} dB | Peak: {peak_db:.1f} dB")

    return manifest

def search_timeline(manifest, start_time, end_time):
    """Find chunks within a time window for playback."""
    results = [e for e in manifest if start_time <= e["timestamp"] <= end_time]
    return results

def extract_frequency_history(manifest_entries, target_offset_hz, bandwidth_hz):
    """Extract power history at a specific frequency offset across time."""
    fft_size = 1024
    history = []
    for entry in manifest_entries:
        filepath = os.path.join(OUTPUT_DIR, entry["filename"])
        iq = np.fromfile(filepath, dtype=np.complex64, count=fft_size)
        if len(iq) < fft_size:
            continue
        spec = np.fft.fftshift(np.fft.fft(iq, fft_size))
        psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
        bin_idx = int(fft_size / 2 + target_offset_hz / (SAMPLE_RATE / fft_size))
        bin_range = max(1, int(bandwidth_hz / (SAMPLE_RATE / fft_size) / 2))
        power = np.mean(psd_db[max(0, bin_idx - bin_range):bin_idx + bin_range + 1])
        history.append({"time": entry["timestamp"], "power_db": round(float(power), 2)})
    return history

def save_manifest(manifest):
    """Save the recording manifest for later queries."""
    manifest_path = os.path.join(OUTPUT_DIR, "manifest.json")
    with open(manifest_path, "w") as f:
        json.dump({"center_freq": CENTER_FREQ, "sample_rate": SAMPLE_RATE,
                    "chunks": manifest}, f, indent=2)
    print(f"[timemachine] Manifest saved: {manifest_path}")

def main():
    print("=== HackRF RF Time Machine ===")
    sdr = configure_sdr()
    try:
        manifest = record_timeline(sdr, MAX_CHUNKS, RECORD_CHUNK_SEC)
        save_manifest(manifest)
        print(f"\n[timemachine] Recorded {len(manifest)} chunks to {OUTPUT_DIR}/")
        # Demo: extract frequency history at center
        if len(manifest) > 5:
            history = extract_frequency_history(manifest[:5], 0, 10e3)
            print(f"[timemachine] Sample history (center freq): {history}")
    except KeyboardInterrupt:
        print("\n[timemachine] Recording stopped.")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
