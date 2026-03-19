#!/usr/bin/env python3
"""
HackRF Radio Telescope
Uses RTL-SDR/HackRF to observe radio emissions from astronomical sources.
Targets the hydrogen 21cm line at 1420.405 MHz. Performs long integration,
spectral averaging, and baseline subtraction for weak signal detection.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time

# --- Configuration ---
HYDROGEN_LINE = 1420.405e6  # 21cm hydrogen line
SAMPLE_RATE = 2.4e6
FFT_SIZE = 8192             # High resolution for spectral line work
GAIN = 49.6
INTEGRATION_TIME = 120      # Seconds of integration
AVERAGES_PER_SECOND = 10

def configure_sdr():
    """Initialize RTL-SDR for radio astronomy observation."""
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = HYDROGEN_LINE
    sdr.gain = GAIN
    sdr.freq_correction = 0
    return sdr

def compute_averaged_spectrum(sdr, fft_size, num_averages):
    """Capture and average multiple FFT frames to reduce noise."""
    window = signal.blackmanharris(fft_size)
    accumulated = np.zeros(fft_size, dtype=np.float64)
    count = 0
    for _ in range(num_averages):
        iq = sdr.read_samples(fft_size)
        spectrum = np.fft.fftshift(np.fft.fft(iq * window, fft_size))
        accumulated += np.abs(spectrum) ** 2
        count += 1
    return accumulated / count

def subtract_baseline(spectrum_db, poly_order=4):
    """Fit and subtract polynomial baseline to isolate spectral features."""
    x = np.arange(len(spectrum_db))
    # Fit polynomial to the spectrum (rough baseline)
    coeffs = np.polyfit(x, spectrum_db, poly_order)
    baseline = np.polyval(coeffs, x)
    return spectrum_db - baseline, baseline

def detect_spectral_line(spectrum_corrected, freq_axis, threshold_sigma=3.0):
    """Detect spectral line features above noise threshold."""
    noise_std = np.std(spectrum_corrected)
    noise_mean = np.mean(spectrum_corrected)
    threshold = noise_mean + threshold_sigma * noise_std
    peaks, props = signal.find_peaks(spectrum_corrected, height=threshold, prominence=noise_std)
    detections = []
    for p in peaks:
        det = {
            "freq_mhz": round(float(freq_axis[p] / 1e6), 6),
            "offset_khz": round(float((freq_axis[p] - HYDROGEN_LINE) / 1e3), 2),
            "power_above_baseline_db": round(float(spectrum_corrected[p]), 2),
            "snr_sigma": round(float((spectrum_corrected[p] - noise_mean) / noise_std), 1),
        }
        detections.append(det)
    return detections

def compute_velocity(freq_offset_hz, rest_freq):
    """Convert frequency offset to radial velocity (km/s) using Doppler."""
    c = 299792.458  # km/s
    return -freq_offset_hz / rest_freq * c

def run_observation(sdr, integration_time, fft_size):
    """Perform integrated radio telescope observation."""
    total_averages = int(integration_time * AVERAGES_PER_SECOND)
    print(f"[telescope] Observing 21cm H-line at {HYDROGEN_LINE/1e6:.3f} MHz")
    print(f"[telescope] Integration: {integration_time}s ({total_averages} averages)")

    # Long integration
    start = time.time()
    grand_avg = np.zeros(fft_size, dtype=np.float64)
    batch_size = AVERAGES_PER_SECOND
    batches_done = 0
    while batches_done * batch_size < total_averages:
        batch = compute_averaged_spectrum(sdr, fft_size, batch_size)
        grand_avg += batch
        batches_done += 1
        if batches_done % 10 == 0:
            elapsed = time.time() - start
            print(f"  {batches_done * batch_size}/{total_averages} averages ({elapsed:.0f}s)")
    grand_avg /= batches_done

    # Convert to dB
    psd_db = 10 * np.log10(grand_avg + 1e-20)
    freq_axis = np.linspace(HYDROGEN_LINE - SAMPLE_RATE / 2,
                            HYDROGEN_LINE + SAMPLE_RATE / 2, fft_size)

    # Baseline subtraction
    corrected, baseline = subtract_baseline(psd_db)
    # Detect spectral lines
    detections = detect_spectral_line(corrected, freq_axis)
    return psd_db, corrected, freq_axis, detections

def main():
    print("=== HackRF Radio Telescope ===")
    sdr = configure_sdr()
    try:
        psd_db, corrected, freq_axis, detections = run_observation(sdr, INTEGRATION_TIME, FFT_SIZE)
        print(f"\n[telescope] Spectral line detections: {len(detections)}")
        for d in detections:
            velocity = compute_velocity(d["offset_khz"] * 1e3, HYDROGEN_LINE)
            print(f"  {d['freq_mhz']:.6f} MHz | offset {d['offset_khz']:+.2f} kHz | "
                  f"v_rad={velocity:+.1f} km/s | {d['snr_sigma']:.1f} sigma")
        np.savez("radio_telescope_data.npz", psd_db=psd_db, corrected=corrected,
                 freq_axis=freq_axis)
        print("[telescope] Data saved to radio_telescope_data.npz")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
