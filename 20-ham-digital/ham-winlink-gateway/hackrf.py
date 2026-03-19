#!/usr/bin/env python3
"""
Ham Winlink Gateway Monitor
Monitors Winlink RMS gateway frequencies for packet activity.
Winlink provides email over radio for emergency communications.
Detects VARA, ARDOP, and packet connections on VHF/UHF.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

WINLINK_FREQS = [
    {"name": "VHF_packet", "freq": 145.07e6, "mode": "packet_1200"},
    {"name": "VHF_vara", "freq": 145.09e6, "mode": "vara_fm"},
]
SAMPLE_RATE = 250e3
AUDIO_RATE = 12000
GAIN = 40
MONITOR_SECONDS = 60

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def monitor_winlink_freq(sdr, freq, duration_sec):
    """Monitor a Winlink frequency for data activity."""
    sdr.center_freq = freq
    time.sleep(0.03)
    chunk_sec = 2
    chunks = int(duration_sec / chunk_sec)
    activity_log = []
    for i in range(chunks):
        iq = sdr.read_samples(int(chunk_sec * SAMPLE_RATE))
        power_db = 10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12)
        # Check for data tones (AFSK or VARA)
        demod = np.angle(iq[1:] * np.conj(iq[:-1]))
        dec = int(SAMPLE_RATE / AUDIO_RATE)
        audio = signal.decimate(demod, dec, zero_phase=True)
        spec = np.abs(np.fft.fft(audio[:2048]))[:1024]
        freq_axis = np.arange(1024) * AUDIO_RATE / 2048
        # Look for data tone energy (>500 Hz)
        data_band = spec[int(500 * 2048 / AUDIO_RATE):int(2500 * 2048 / AUDIO_RATE)]
        data_power = np.mean(data_band)
        noise = np.median(spec[:int(300 * 2048 / AUDIO_RATE)])
        has_data = data_power > noise * 4
        activity_log.append({
            "time_offset": round(i * chunk_sec, 1),
            "power_db": round(float(power_db), 1),
            "data_activity": has_data,
        })
        if has_data:
            print(f"  [{i * chunk_sec:5.1f}s] DATA ACTIVITY | Power: {power_db:.1f} dB")

    return activity_log

def main():
    print("=== Ham Winlink Gateway Monitor ===")
    sdr = configure_sdr()
    results = {}
    try:
        for wl in WINLINK_FREQS:
            print(f"\n[winlink] Monitoring {wl['name']} ({wl['freq']/1e6:.3f} MHz, {wl['mode']})")
            log = monitor_winlink_freq(sdr, wl["freq"], MONITOR_SECONDS // len(WINLINK_FREQS))
            active = sum(1 for l in log if l["data_activity"])
            results[wl["name"]] = {"total_chunks": len(log), "active_chunks": active}
            print(f"  Activity: {active}/{len(log)} chunks")
        with open("winlink_monitor.json", "w") as f:
            json.dump(results, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
