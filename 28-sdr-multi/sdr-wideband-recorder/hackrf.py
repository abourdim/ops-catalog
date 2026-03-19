#!/usr/bin/env python3
"""SDR Wideband Recorder - Records full SDR bandwidth to disk for offline analysis."""
import numpy as np
from rtlsdr import RtlSdr
import time, os, json

CENTER_FREQ = 100e6
SAMPLE_RATE = 2.4e6
GAIN = 40
RECORD_SECONDS = 30
OUTPUT_DIR = "wideband_recordings"

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    return sdr

def record_wideband(sdr, duration_sec, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    total_samples = int(duration_sec * SAMPLE_RATE)
    chunk_size = 262144
    timestamp = time.strftime("%Y%m%d_%H%M%S")
    filename = os.path.join(output_dir, f"wideband_{timestamp}.iq")
    meta_file = os.path.join(output_dir, f"wideband_{timestamp}.json")
    print(f"[rec] Recording {duration_sec}s -> {filename}")
    written = 0
    with open(filename, 'wb') as f:
        while written < total_samples:
            n = min(chunk_size, total_samples - written)
            iq = sdr.read_samples(n)
            iq.astype(np.complex64).tofile(f)
            written += len(iq)
            if written % (SAMPLE_RATE * 5) < chunk_size:
                print(f"  {written / SAMPLE_RATE:.0f}s / {duration_sec}s")
    file_size = os.path.getsize(filename)
    meta = {"center_freq": CENTER_FREQ, "sample_rate": SAMPLE_RATE, "gain": GAIN,
            "duration": duration_sec, "samples": written, "file_size": file_size,
            "format": "complex64", "timestamp": timestamp}
    with open(meta_file, 'w') as f:
        json.dump(meta, f, indent=2)
    print(f"[rec] Done: {file_size / 1e6:.1f} MB, {written} samples")
    return filename

def main():
    print("=== SDR Wideband Recorder ===")
    sdr = configure_sdr()
    try:
        record_wideband(sdr, RECORD_SECONDS, OUTPUT_DIR)
    except KeyboardInterrupt:
        print("\n[rec] Recording stopped.")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
