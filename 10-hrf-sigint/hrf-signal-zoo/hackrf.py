#!/usr/bin/env python3
"""
HackRF Signal Zoo
Captures and catalogs various signal types across the RF spectrum.
Automatically classifies signals by modulation type (AM, FM, FSK, PSK, OFDM)
using statistical and spectral features.
"""

import numpy as np
import scipy.signal as signal
from scipy.stats import kurtosis
from rtlsdr import RtlSdr
import json
import time

# --- Configuration ---
SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048
GAIN = 40
# Frequencies to catalog
ZOO_TARGETS = [
    {"name": "FM_Broadcast", "freq": 98.5e6},
    {"name": "Aviation_VHF", "freq": 121.5e6},
    {"name": "Marine_VHF", "freq": 156.8e6},
    {"name": "ISM_433", "freq": 433.92e6},
    {"name": "PMR446", "freq": 446.0e6},
    {"name": "ISM_868", "freq": 868e6},
]

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def extract_modulation_features(iq_samples, sample_rate, fft_size):
    """Extract features used for modulation classification."""
    # Amplitude statistics
    envelope = np.abs(iq_samples[:fft_size * 4])
    env_std = np.std(envelope) / (np.mean(envelope) + 1e-12)
    env_kurtosis = float(kurtosis(envelope))

    # Phase statistics
    phase = np.angle(iq_samples[:fft_size * 4])
    phase_diff = np.diff(np.unwrap(phase))
    phase_std = np.std(phase_diff)

    # Spectral features
    window = signal.blackmanharris(fft_size)
    spec = np.fft.fftshift(np.fft.fft(iq_samples[:fft_size] * window))
    psd = np.abs(spec) ** 2
    psd_norm = psd / (np.sum(psd) + 1e-12)

    # Spectral flatness
    geo_mean = np.exp(np.mean(np.log(psd + 1e-12)))
    arith_mean = np.mean(psd)
    flatness = geo_mean / (arith_mean + 1e-12)

    # Bandwidth occupancy (fraction of bins above -20 dB from peak)
    psd_db = 10 * np.log10(psd + 1e-12)
    peak = np.max(psd_db)
    bw_frac = np.sum(psd_db > peak - 20) / fft_size

    return {
        "env_std": round(float(env_std), 4),
        "env_kurtosis": round(env_kurtosis, 4),
        "phase_std": round(float(phase_std), 4),
        "spectral_flatness": round(float(flatness), 6),
        "bw_occupancy": round(float(bw_frac), 4),
    }

def classify_modulation(features):
    """Rule-based modulation classifier."""
    if features["env_std"] < 0.15 and features["phase_std"] > 0.5:
        return "FM"
    elif features["env_std"] > 0.4 and features["phase_std"] < 0.3:
        return "AM"
    elif features["spectral_flatness"] > 0.3:
        return "OFDM/wideband_digital"
    elif features["phase_std"] < 0.2 and features["bw_occupancy"] < 0.1:
        return "CW/carrier"
    elif features["env_kurtosis"] > 3:
        return "FSK"
    else:
        return "PSK/QAM"

def catalog_signals(sdr, targets):
    """Capture and classify each target frequency."""
    catalog = []
    for target in targets:
        sdr.center_freq = target["freq"]
        time.sleep(0.05)
        iq = sdr.read_samples(FFT_SIZE * 8)
        features = extract_modulation_features(iq, SAMPLE_RATE, FFT_SIZE)
        mod_type = classify_modulation(features)
        power = 10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12)
        entry = {
            "name": target["name"],
            "freq_mhz": target["freq"] / 1e6,
            "power_db": round(float(power), 1),
            "modulation": mod_type,
            "features": features,
        }
        catalog.append(entry)
        print(f"  {target['name']:20s} | {target['freq']/1e6:8.2f} MHz | "
              f"{power:6.1f} dB | {mod_type}")
    return catalog

def main():
    print("=== HackRF Signal Zoo ===")
    sdr = configure_sdr()
    try:
        catalog = catalog_signals(sdr, ZOO_TARGETS)
        with open("signal_zoo_catalog.json", "w") as f:
            json.dump(catalog, f, indent=2)
        print(f"\n[zoo] Cataloged {len(catalog)} signals -> signal_zoo_catalog.json")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
