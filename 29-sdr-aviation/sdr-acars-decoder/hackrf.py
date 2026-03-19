#!/usr/bin/env python3
"""SDR ACARS Decoder - Receives Aircraft Communications Addressing and Reporting System."""
import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

ACARS_FREQS = [129.125e6, 130.025e6, 130.425e6, 130.450e6, 131.125e6, 131.55e6]
SAMPLE_RATE = 250e3
AUDIO_RATE = 12500
GAIN = 42
ACARS_BAUD = 2400

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def scan_acars_frequencies(sdr):
    active = []
    for freq in ACARS_FREQS:
        sdr.center_freq = freq
        time.sleep(0.03)
        iq = sdr.read_samples(int(2 * SAMPLE_RATE))
        power = 10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12)
        # AM demod and check for 2400 Hz data tones
        envelope = np.abs(iq)
        dec = int(SAMPLE_RATE / AUDIO_RATE)
        audio = signal.decimate(envelope - np.mean(envelope), dec, zero_phase=True)
        spec = np.abs(np.fft.fft(audio[:2048]))
        tone_bin = int(2400 * 2048 / AUDIO_RATE)
        tone_power = spec[tone_bin]
        noise = np.median(spec[100:500])
        has_data = tone_power > noise * 5
        active.append({"freq_mhz": round(freq / 1e6, 3), "power_db": round(float(power), 1),
                       "data_detected": has_data})
        status = "DATA" if has_data else "---"
        print(f"  {freq/1e6:.3f} MHz | {power:.1f} dB | {status}")
    return active

def main():
    print("=== SDR ACARS Decoder ===")
    sdr = configure_sdr()
    try:
        results = scan_acars_frequencies(sdr)
        active = [r for r in results if r["data_detected"]]
        print(f"\n[acars] Active ACARS channels: {len(active)}/{len(results)}")
        with open("acars_scan.json", "w") as f:
            json.dump(results, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
