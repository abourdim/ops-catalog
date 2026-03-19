#!/usr/bin/env python3
"""SDR Propagation Beacon Monitor - Tracks beacon signals for propagation studies."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

BEACONS = [
    {"name": "NCDXF_50", "freq": 50.0e6}, {"name": "local_6m", "freq": 50.06e6},
    {"name": "local_2m", "freq": 144.285e6}, {"name": "local_70cm", "freq": 432.3e6},
]
SAMPLE_RATE = 250e3
FFT_SIZE = 16384
GAIN = 49
INTERVAL_SEC = 60

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def measure_beacon(sdr, freq, fft_size):
    sdr.center_freq = freq
    time.sleep(0.05)
    iq = sdr.read_samples(fft_size * 4)
    window = signal.blackmanharris(fft_size)
    psd = np.zeros(fft_size)
    for i in range(4):
        seg = iq[i * fft_size:(i + 1) * fft_size]
        psd += np.abs(np.fft.fftshift(np.fft.fft(seg * window))) ** 2
    psd_db = 10 * np.log10(psd / 4 + 1e-12)
    noise = np.median(psd_db)
    return {"snr_db": round(float(np.max(psd_db) - noise), 1), "detected": (np.max(psd_db) - noise) > 5}

def main():
    print("=== SDR Propagation Beacon Monitor ===")
    sdr = configure_sdr()
    log = []
    try:
        for cycle in range(10):
            entry = {"time": time.strftime("%H:%M:%S"), "beacons": []}
            for b in BEACONS:
                r = measure_beacon(sdr, b["freq"], FFT_SIZE)
                r["name"] = b["name"]
                entry["beacons"].append(r)
                status = "HEARD" if r["detected"] else "---"
                print(f"  {b['name']:15s} SNR {r['snr_db']:5.1f} dB {status}")
            log.append(entry)
            print()
            time.sleep(INTERVAL_SEC)
    except KeyboardInterrupt:
        pass
    finally:
        with open("propagation_log.json", "w") as f:
            json.dump(log, f, indent=2)
        sdr.close()

if __name__ == "__main__":
    main()
