#!/usr/bin/env python3
"""SDR Radio Spectrometer - Precision spectral measurement for radio astronomy."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

CENTER_FREQ = 1420.405e6
SAMPLE_RATE = 2.4e6
FFT_SIZE = 16384
GAIN = 49.6
INTEGRATION_SEC = 300

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    return sdr

def integrated_spectrum(sdr, fft_size, duration_sec):
    window = signal.blackmanharris(fft_size)
    accumulated = np.zeros(fft_size, dtype=np.float64)
    count = 0
    start = time.time()
    while time.time() - start < duration_sec:
        iq = sdr.read_samples(fft_size)
        spec = np.fft.fftshift(np.fft.fft(iq * window))
        accumulated += np.abs(spec) ** 2
        count += 1
    psd_db = 10 * np.log10(accumulated / count + 1e-20)
    freq_axis = np.linspace(CENTER_FREQ - SAMPLE_RATE / 2, CENTER_FREQ + SAMPLE_RATE / 2, fft_size)
    return psd_db, freq_axis, count

def main():
    print("=== SDR Radio Spectrometer ===")
    sdr = configure_sdr()
    try:
        psd_db, freqs, count = integrated_spectrum(sdr, FFT_SIZE, min(INTEGRATION_SEC, 60))
        print(f"[spec] Integrated {count} spectra")
        print(f"[spec] Dynamic range: {np.max(psd_db) - np.min(psd_db):.1f} dB")
        np.savez("spectrometer_data.npz", psd_db=psd_db, freqs=freqs)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
