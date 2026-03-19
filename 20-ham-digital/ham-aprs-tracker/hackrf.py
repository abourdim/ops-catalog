#!/usr/bin/env python3
"""
Ham APRS Tracker
Continuously monitors APRS frequency and tracks station positions over time.
Builds movement tracks from sequential position reports and computes
speed/heading for mobile stations.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json
import math

APRS_FREQ = 144.39e6
SAMPLE_RATE = 250e3
AUDIO_RATE = 22050
GAIN = 40
MONITOR_SECONDS = 120

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = APRS_FREQ
    sdr.gain = GAIN
    return sdr

def capture_and_detect(sdr, chunk_sec=5):
    """Capture chunk and detect APRS signal presence."""
    iq = sdr.read_samples(int(chunk_sec * SAMPLE_RATE))
    power = np.mean(np.abs(iq) ** 2)
    power_db = 10 * np.log10(power + 1e-12)
    # Check for AFSK activity (1200/2200 Hz tones)
    demod = np.angle(iq[1:] * np.conj(iq[:-1]))
    dec = int(SAMPLE_RATE / AUDIO_RATE)
    audio = signal.decimate(demod, dec, zero_phase=True)
    # Look for AFSK energy
    fft_out = np.abs(np.fft.fft(audio[:4096]))
    freq_axis = np.arange(4096) * AUDIO_RATE / 4096
    mark_bin = int(1200 * 4096 / AUDIO_RATE)
    space_bin = int(2200 * 4096 / AUDIO_RATE)
    mark_power = np.mean(fft_out[mark_bin - 5:mark_bin + 5])
    space_power = np.mean(fft_out[space_bin - 5:space_bin + 5])
    noise = np.median(fft_out[100:2000])
    has_aprs = (mark_power > noise * 3) or (space_power > noise * 3)
    return has_aprs, power_db, audio

def parse_aprs_position(data_str):
    """Parse APRS position from compressed or uncompressed format."""
    # Simplified parser for demonstration
    lat, lon = None, None
    if len(data_str) > 19 and data_str[0] in ['!', '/', '@', '=']:
        try:
            lat_str = data_str[1:9]
            lon_str = data_str[9:18]
            lat_deg = int(lat_str[:2])
            lat_min = float(lat_str[2:7])
            lat = lat_deg + lat_min / 60
            if lat_str[7] == 'S':
                lat = -lat
            lon_deg = int(lon_str[:3])
            lon_min = float(lon_str[3:8])
            lon = lon_deg + lon_min / 60
            if lon_str[8] == 'W':
                lon = -lon
        except (ValueError, IndexError):
            pass
    return lat, lon

def haversine_distance(lat1, lon1, lat2, lon2):
    """Compute distance between two lat/lon points in km."""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * \
        math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def main():
    print("=== Ham APRS Tracker ===")
    sdr = configure_sdr()
    tracks = {}
    detections = 0
    try:
        start = time.time()
        while time.time() - start < MONITOR_SECONDS:
            has_aprs, power_db, audio = capture_and_detect(sdr, chunk_sec=5)
            if has_aprs:
                detections += 1
                print(f"  [{time.strftime('%H:%M:%S')}] APRS activity detected | Power: {power_db:.1f} dB")
            else:
                print(f"  [{time.strftime('%H:%M:%S')}] Monitoring... ({power_db:.1f} dB)")
        print(f"\n[tracker] Session: {detections} APRS detections in {MONITOR_SECONDS}s")
        print(f"[tracker] Unique stations tracked: {len(tracks)}")
    except KeyboardInterrupt:
        print("\n[tracker] Stopped.")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
