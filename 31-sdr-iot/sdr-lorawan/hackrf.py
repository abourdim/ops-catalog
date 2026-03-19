#!/usr/bin/env python3
"""SDR LoRaWAN Receiver - Monitors LoRa IoT transmissions on ISM bands."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

LORA_FREQS = [868.1e6, 868.3e6, 868.5e6, 867.1e6, 867.3e6, 867.5e6, 867.7e6, 867.9e6]
SAMPLE_RATE = 250e3
FFT_SIZE = 2048
GAIN = 44
MONITOR_SEC = 30

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def detect_lora_chirps(sdr, freq, duration_sec):
    sdr.center_freq = freq
    time.sleep(0.03)
    iq = sdr.read_samples(int(duration_sec * SAMPLE_RATE))
    # LoRa uses chirp spread spectrum - detect broadband energy bursts
    chunk = int(SAMPLE_RATE * 0.05)
    powers = [10 * np.log10(np.mean(np.abs(iq[i:i+chunk]) ** 2) + 1e-12)
              for i in range(0, len(iq) - chunk, chunk)]
    powers = np.array(powers)
    noise = np.median(powers)
    chirps = np.sum(powers > noise + 6)
    return {"freq_mhz": round(freq / 1e6, 1), "chirp_events": int(chirps),
            "noise_db": round(float(noise), 1)}

def main():
    print("=== SDR LoRaWAN Receiver ===")
    sdr = configure_sdr()
    results = []
    try:
        for freq in LORA_FREQS:
            r = detect_lora_chirps(sdr, freq, MONITOR_SEC / len(LORA_FREQS))
            results.append(r)
            status = f"{r['chirp_events']} chirps" if r["chirp_events"] > 0 else "quiet"
            print(f"  {r['freq_mhz']:.1f} MHz: {status}")
        total = sum(r["chirp_events"] for r in results)
        print(f"\n[lora] Total LoRa events: {total}")
        with open("lorawan_scan.json", "w") as f:
            json.dump(results, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
