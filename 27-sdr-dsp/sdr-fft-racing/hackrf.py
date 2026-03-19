#!/usr/bin/env python3
"""
SDR FFT Racing
Benchmarks different FFT implementations and sizes on real SDR data.
Compares numpy.fft, scipy.fftpack, and various windowing strategies.
"""

import numpy as np
import scipy.signal as signal
import scipy.fft as sp_fft
from rtlsdr import RtlSdr
import time, json

CENTER_FREQ = 100e6
SAMPLE_RATE = 2.4e6
GAIN = 40
FFT_SIZES = [256, 512, 1024, 2048, 4096, 8192, 16384, 32768]
ITERATIONS = 100

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    return sdr

def bench_numpy_fft(data, fft_size, iters):
    start = time.perf_counter()
    for _ in range(iters):
        np.fft.fft(data[:fft_size])
    return (time.perf_counter() - start) / iters

def bench_scipy_fft(data, fft_size, iters):
    start = time.perf_counter()
    for _ in range(iters):
        sp_fft.fft(data[:fft_size])
    return (time.perf_counter() - start) / iters

def bench_windowed_fft(data, fft_size, iters, window_func):
    win = window_func(fft_size)
    start = time.perf_counter()
    for _ in range(iters):
        np.fft.fft(data[:fft_size] * win)
    return (time.perf_counter() - start) / iters

def main():
    print("=== SDR FFT Racing ===")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(max(FFT_SIZES) * 2)
        print(f"[fft] Benchmarking with {ITERATIONS} iterations each\n")
        results = []
        for fft_size in FFT_SIZES:
            t_np = bench_numpy_fft(iq, fft_size, ITERATIONS)
            t_sp = bench_scipy_fft(iq, fft_size, ITERATIONS)
            t_hann = bench_windowed_fft(iq, fft_size, ITERATIONS, np.hanning)
            t_bh = bench_windowed_fft(iq, fft_size, ITERATIONS, signal.blackmanharris)
            throughput = fft_size / t_np / 1e6
            print(f"  FFT {fft_size:6d}: numpy={t_np*1e6:.0f}us scipy={t_sp*1e6:.0f}us "
                  f"hann={t_hann*1e6:.0f}us bh={t_bh*1e6:.0f}us | {throughput:.1f} Msamples/s")
            results.append({"fft_size": fft_size, "numpy_us": round(t_np*1e6, 1),
                           "scipy_us": round(t_sp*1e6, 1), "throughput_msps": round(throughput, 1)})
        with open("fft_benchmark.json", "w") as f:
            json.dump(results, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
