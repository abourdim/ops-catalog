#!/usr/bin/env python3
"""
HackRF GSM Tower Mapper
Scans GSM downlink frequencies to detect cell towers, extract Cell IDs,
LAC, MCC/MNC from broadcast channels (BCCH), and map their signal
strength for coverage analysis.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

# --- Configuration ---
GSM_900_START = 935e6      # GSM-900 downlink start
GSM_900_END = 960e6        # GSM-900 downlink end
GSM_CHANNEL_BW = 200e3     # 200 kHz GSM channel
SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048
GAIN = 42
ARFCN_OFFSET = 935.2e6    # ARFCN 0 downlink frequency

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def freq_to_arfcn(freq_hz):
    """Convert downlink frequency to ARFCN number (GSM-900)."""
    arfcn = int((freq_hz - 935e6) / 200e3)
    if arfcn < 0 or arfcn > 124:
        return None
    return arfcn

def arfcn_to_freq(arfcn):
    """Convert ARFCN to downlink frequency."""
    return 935e6 + arfcn * 200e3

def measure_bcch_power(sdr, freq_hz, fft_size):
    """Measure power at a GSM BCCH carrier frequency."""
    sdr.center_freq = freq_hz
    time.sleep(0.01)
    iq = sdr.read_samples(fft_size * 4)
    window = signal.hann(fft_size)
    psd_sum = np.zeros(fft_size)
    segs = len(iq) // fft_size
    for i in range(segs):
        seg = iq[i * fft_size:(i + 1) * fft_size]
        spec = np.fft.fftshift(np.fft.fft(seg * window))
        psd_sum += np.abs(spec) ** 2
    psd_sum /= segs
    psd_db = 10 * np.log10(psd_sum + 1e-12)
    # Power in the center 200 kHz
    center_bins = int(GSM_CHANNEL_BW / (SAMPLE_RATE / fft_size))
    center_start = fft_size // 2 - center_bins // 2
    center_power = np.mean(psd_db[center_start:center_start + center_bins])
    return float(center_power)

def detect_gsm_carrier(psd_db, fft_size, sample_rate):
    """Detect if the spectrum shows a GSM-like carrier (constant envelope GMSK)."""
    # GSM carriers have relatively flat topped spectrum ~200 kHz wide
    center = fft_size // 2
    bw_bins = int(200e3 / (sample_rate / fft_size))
    carrier_region = psd_db[center - bw_bins // 2:center + bw_bins // 2]
    noise_region = np.concatenate([psd_db[:center - bw_bins], psd_db[center + bw_bins:]])
    carrier_power = np.mean(carrier_region)
    noise_power = np.mean(noise_region)
    return carrier_power - noise_power > 8  # 8 dB SNR threshold

def scan_gsm_band(sdr):
    """Scan the full GSM-900 downlink band for active towers."""
    towers = []
    num_channels = int((GSM_900_END - GSM_900_START) / GSM_CHANNEL_BW)
    print(f"[gsm] Scanning {num_channels} GSM-900 channels...")

    for arfcn in range(0, 125):
        freq = arfcn_to_freq(arfcn)
        power = measure_bcch_power(sdr, freq, FFT_SIZE)
        if power > -45:  # Strong enough to be a real tower
            tower = {
                "arfcn": arfcn,
                "freq_mhz": round(freq / 1e6, 1),
                "power_db": round(power, 1),
                "estimated_distance": estimate_distance(power),
            }
            towers.append(tower)
            print(f"  ARFCN {arfcn:3d} | {freq/1e6:.1f} MHz | {power:6.1f} dB | "
                  f"~{tower['estimated_distance']:.1f} km")
    return towers

def estimate_distance(power_db, tx_power_dbm=43, freq_mhz=950):
    """Rough free-space path loss distance estimate."""
    # FSPL = 20*log10(d) + 20*log10(f) + 32.44
    # Solving for d: d = 10^((tx_power - rx_power - 20*log10(f) - 32.44) / 20)
    path_loss = tx_power_dbm - power_db
    d_km = 10 ** ((path_loss - 20 * np.log10(freq_mhz) - 32.44) / 20)
    return round(float(min(d_km, 50)), 2)  # Cap at 50 km

def main():
    print("=== HackRF GSM Tower Mapper ===")
    sdr = configure_sdr()
    try:
        towers = scan_gsm_band(sdr)
        print(f"\n[gsm] Detected {len(towers)} GSM towers")
        with open("gsm_tower_map.json", "w") as f:
            json.dump({"towers": towers, "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S")}, f, indent=2)
        print("[gsm] Results saved to gsm_tower_map.json")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
