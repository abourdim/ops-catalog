#!/usr/bin/env python3
"""
HackRF Signal Hunter
Automated wideband signal detection tool. Sweeps a configurable frequency range,
identifies signals above the noise floor, classifies them by bandwidth and
modulation characteristics, and logs findings.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

# --- Configuration ---
SCAN_START = 24e6         # Start frequency (24 MHz)
SCAN_END = 1700e6         # End frequency (1.7 GHz)
SAMPLE_RATE = 2.4e6       # 2.4 MSPS per step
FFT_SIZE = 4096
GAIN = 42
DWELL_TIME = 0.05         # Seconds to dwell per step
DETECTION_MARGIN = 10.0   # dB above noise floor to flag a signal

def configure_sdr():
    """Initialize RTL-SDR for wideband sweeping."""
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def estimate_noise_floor(psd_db):
    """Estimate noise floor as the median of the power spectrum."""
    return np.median(psd_db)

def detect_signals_in_span(iq_samples, center_freq, sample_rate, fft_size):
    """Analyze IQ samples for signals above the noise floor."""
    window = signal.blackmanharris(fft_size)
    num_segs = max(1, len(iq_samples) // fft_size)
    psd = np.zeros(fft_size)
    for i in range(num_segs):
        seg = iq_samples[i * fft_size : (i + 1) * fft_size]
        if len(seg) < fft_size:
            break
        spectrum = np.fft.fftshift(np.fft.fft(seg * window))
        psd += np.abs(spectrum) ** 2
    psd /= num_segs
    psd_db = 10.0 * np.log10(psd + 1e-12)

    noise_floor = estimate_noise_floor(psd_db)
    freq_axis = np.linspace(center_freq - sample_rate / 2, center_freq + sample_rate / 2, fft_size)

    # Find peaks above noise floor + margin
    threshold = noise_floor + DETECTION_MARGIN
    peaks, properties = signal.find_peaks(psd_db, height=threshold, distance=10, prominence=5)

    detections = []
    for peak_idx in peaks:
        det = {
            "frequency_hz": float(freq_axis[peak_idx]),
            "frequency_mhz": round(freq_axis[peak_idx] / 1e6, 4),
            "power_db": round(float(psd_db[peak_idx]), 1),
            "snr_db": round(float(psd_db[peak_idx] - noise_floor), 1),
        }
        # Estimate signal bandwidth at -3dB
        half_power = psd_db[peak_idx] - 3.0
        bw_bins = np.sum(psd_db[max(0, peak_idx - 50):peak_idx + 50] > half_power)
        det["est_bandwidth_khz"] = round(bw_bins * (sample_rate / fft_size) / 1e3, 1)
        detections.append(det)
    return detections, noise_floor

def classify_signal(bandwidth_khz):
    """Simple signal classification by bandwidth."""
    if bandwidth_khz < 5:
        return "narrowband (CW/beacon)"
    elif bandwidth_khz < 16:
        return "voice (NFM/SSB)"
    elif bandwidth_khz < 100:
        return "wideband FM"
    elif bandwidth_khz < 500:
        return "digital/data"
    else:
        return "ultra-wideband"

def sweep_and_hunt(sdr):
    """Perform a full frequency sweep, detecting all signals."""
    all_detections = []
    freq = SCAN_START
    step = 0
    total_steps = int((SCAN_END - SCAN_START) / SAMPLE_RATE) + 1
    print(f"[hunter] Sweeping {SCAN_START/1e6:.0f} - {SCAN_END/1e6:.0f} MHz in {total_steps} steps")

    while freq < SCAN_END:
        sdr.center_freq = freq
        time.sleep(DWELL_TIME)
        iq = sdr.read_samples(FFT_SIZE * 4)
        detections, nf = detect_signals_in_span(iq, freq, SAMPLE_RATE, FFT_SIZE)
        for d in detections:
            d["classification"] = classify_signal(d["est_bandwidth_khz"])
            all_detections.append(d)
            print(f"  SIGNAL @ {d['frequency_mhz']:10.4f} MHz | {d['power_db']:6.1f} dB | "
                  f"SNR {d['snr_db']:5.1f} dB | BW {d['est_bandwidth_khz']:6.1f} kHz | {d['classification']}")
        freq += SAMPLE_RATE
        step += 1
        if step % 100 == 0:
            print(f"  ... step {step}/{total_steps} ({freq/1e6:.0f} MHz), {len(all_detections)} signals found")

    return all_detections

def main():
    print("=== HackRF Signal Hunter ===")
    sdr = configure_sdr()
    try:
        detections = sweep_and_hunt(sdr)
        print(f"\n[hunter] Total signals detected: {len(detections)}")
        with open("signal_hunt_results.json", "w") as f:
            json.dump(detections, f, indent=2)
        print("[hunter] Results saved to signal_hunt_results.json")
    except KeyboardInterrupt:
        print("\n[hunter] Hunt aborted.")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
