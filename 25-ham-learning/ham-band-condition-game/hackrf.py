#!/usr/bin/env python3
"""
Ham Band Condition Game
Interactive learning tool that measures real-time band conditions on VHF/UHF
and presents propagation data as a gamified experience. Score points by
correctly predicting which bands are open based on beacon monitoring.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

BAND_BEACONS = [
    {"band": "6m", "freq": 50.06e6, "points": 50},
    {"band": "2m", "freq": 144.285e6, "points": 20},
    {"band": "1.25m", "freq": 222.06e6, "points": 30},
    {"band": "70cm", "freq": 432.3e6, "points": 10},
]
SAMPLE_RATE = 250e3
FFT_SIZE = 8192
GAIN = 49

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def check_beacon(sdr, freq, fft_size):
    sdr.center_freq = freq
    time.sleep(0.05)
    iq = sdr.read_samples(fft_size * 8)
    window = signal.blackmanharris(fft_size)
    psd = np.zeros(fft_size)
    for i in range(min(8, len(iq) // fft_size)):
        seg = iq[i * fft_size:(i + 1) * fft_size]
        psd += np.abs(np.fft.fftshift(np.fft.fft(seg * window))) ** 2
    psd_db = 10 * np.log10(psd / 8 + 1e-12)
    noise = np.median(psd_db)
    snr = np.max(psd_db) - noise
    return {"detected": snr > 6, "snr_db": round(float(snr), 1), "noise_db": round(float(noise), 1)}

def play_round(sdr, round_num):
    """Play one round: check all bands, score points."""
    print(f"\n--- Round {round_num} ---")
    score = 0
    for beacon in BAND_BEACONS:
        result = check_beacon(sdr, beacon["freq"], FFT_SIZE)
        if result["detected"]:
            score += beacon["points"]
            print(f"  {beacon['band']:6s} OPEN! SNR: {result['snr_db']:5.1f} dB (+{beacon['points']} pts)")
        else:
            print(f"  {beacon['band']:6s} closed  SNR: {result['snr_db']:5.1f} dB")
    return score

def main():
    print("=== Ham Band Condition Game ===")
    sdr = configure_sdr()
    total_score = 0
    rounds = 5
    try:
        for r in range(1, rounds + 1):
            score = play_round(sdr, r)
            total_score += score
            print(f"  Round score: {score} | Total: {total_score}")
            if r < rounds:
                time.sleep(30)
        print(f"\n[game] Final score: {total_score} points over {rounds} rounds")
    except KeyboardInterrupt:
        print(f"\n[game] Game ended. Score: {total_score}")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
