#!/usr/bin/env python3
"""
Ham Skywarn Weather Net Monitor
Monitors Skywarn severe weather spotter networks on ham radio.
Listens to designated Skywarn frequencies, detects net activations,
and logs weather-related traffic for coordination support.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

SKYWARN_FREQS = [
    {"name": "Skywarn_2m", "freq": 146.67e6, "offset": -0.6e6},
    {"name": "Skywarn_70cm", "freq": 443.4e6, "offset": +5e6},
    {"name": "WX_simplex", "freq": 146.55e6, "offset": 0},
]
NOAA_WX_FREQS = [162.4e6, 162.425e6, 162.45e6, 162.475e6, 162.5e6, 162.525e6, 162.55e6]
SAMPLE_RATE = 250e3
GAIN = 40
SCAN_DURATION = 120

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def check_noaa_weather_radio(sdr):
    """Scan NOAA weather radio for active transmitters and alert tones."""
    active = []
    for freq in NOAA_WX_FREQS:
        sdr.center_freq = freq
        time.sleep(0.02)
        iq = sdr.read_samples(int(0.5 * SAMPLE_RATE))
        power = 10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12)
        if power > -45:
            # Check for 1050 Hz alert tone (SAME/EAS)
            demod = np.angle(iq[1:] * np.conj(iq[:-1]))
            dec = int(SAMPLE_RATE / 8000)
            audio = signal.decimate(demod, dec, zero_phase=True)
            spec = np.abs(np.fft.fft(audio[:2048]))
            tone_bin = int(1050 * 2048 / 8000)
            tone_power = spec[tone_bin]
            noise = np.median(spec[100:500])
            has_alert = tone_power > noise * 10
            active.append({
                "freq_mhz": round(freq / 1e6, 3),
                "power_db": round(float(power), 1),
                "alert_tone": has_alert,
            })
    return active

def monitor_skywarn_nets(sdr, duration_sec):
    """Monitor Skywarn frequencies for net activity."""
    results = []
    chunk_sec = 5
    cycles = int(duration_sec / (chunk_sec * len(SKYWARN_FREQS)))
    for cycle in range(cycles):
        for sw in SKYWARN_FREQS:
            sdr.center_freq = sw["freq"]
            time.sleep(0.02)
            iq = sdr.read_samples(int(chunk_sec * SAMPLE_RATE))
            power = 10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12)
            is_active = power > -42
            if is_active:
                results.append({
                    "name": sw["name"], "time": time.strftime("%H:%M:%S"),
                    "power_db": round(float(power), 1),
                })
                print(f"  [{time.strftime('%H:%M:%S')}] {sw['name']:15s} ACTIVE | {power:.1f} dB")
    return results

def main():
    print("=== Ham Skywarn Weather Net Monitor ===")
    sdr = configure_sdr()
    try:
        print("[skywarn] Checking NOAA Weather Radio...")
        noaa = check_noaa_weather_radio(sdr)
        for n in noaa:
            alert = " ** ALERT TONE **" if n["alert_tone"] else ""
            print(f"  {n['freq_mhz']:.3f} MHz | {n['power_db']:.1f} dB{alert}")
        print(f"\n[skywarn] Monitoring Skywarn nets for {SCAN_DURATION}s...")
        activity = monitor_skywarn_nets(sdr, SCAN_DURATION)
        print(f"\n[skywarn] {len(activity)} active transmissions logged")
        with open("skywarn_log.json", "w") as f:
            json.dump({"noaa": noaa, "skywarn": activity}, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
