#!/usr/bin/env python3
"""SDR Benchmark - Performance testing for SDR hardware and processing pipeline."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

SAMPLE_RATE = 2.4e6
CENTER_FREQ = 100e6
GAIN = 40

def benchmark_capture_rate():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    sizes = [65536, 131072, 262144, 524288, 1048576]
    results = []
    for size in sizes:
        start = time.perf_counter()
        for _ in range(10):
            sdr.read_samples(size)
        elapsed = time.perf_counter() - start
        rate = (size * 10) / elapsed / 1e6
        results.append({"chunk_size": size, "rate_msps": round(rate, 2), "time_sec": round(elapsed, 3)})
        print(f"  Chunk {size:8d}: {rate:.2f} MSPS ({elapsed:.3f}s)")
    sdr.close()
    return results

def benchmark_processing():
    data = (np.random.randn(1048576) + 1j * np.random.randn(1048576)).astype(np.complex64)
    results = {}
    # FFT benchmark
    start = time.perf_counter()
    for _ in range(100):
        np.fft.fft(data[:4096])
    results["fft_4096_us"] = round((time.perf_counter() - start) / 100 * 1e6, 1)
    # Filter benchmark
    b, a = signal.butter(6, 0.3)
    start = time.perf_counter()
    for _ in range(10):
        signal.filtfilt(b, a, np.real(data[:65536]))
    results["filter_65k_us"] = round((time.perf_counter() - start) / 10 * 1e6, 1)
    # FM demod benchmark
    start = time.perf_counter()
    for _ in range(100):
        np.angle(data[1:4097] * np.conj(data[:4096]))
    results["fm_demod_4096_us"] = round((time.perf_counter() - start) / 100 * 1e6, 1)
    return results

def main():
    print("=== SDR Benchmark ===")
    print("\n[bench] Capture rate benchmark:")
    capture = benchmark_capture_rate()
    print("\n[bench] Processing benchmark:")
    proc = benchmark_processing()
    for k, v in proc.items():
        print(f"  {k}: {v} us")
    with open("sdr_benchmark.json", "w") as f:
        json.dump({"capture": capture, "processing": proc}, f, indent=2)

if __name__ == "__main__":
    main()
