#!/usr/bin/env python3
"""SDR Farm - Multi-dongle SDR management for simultaneous multi-band monitoring."""
import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

FARM_CONFIG = [
    {"name": "vhf_monitor", "freq": 144.39e6, "gain": 40},
    {"name": "uhf_monitor", "freq": 433.92e6, "gain": 42},
    {"name": "fm_broadcast", "freq": 100e6, "gain": 38},
]
SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048

def scan_available_dongles():
    """Detect available RTL-SDR dongles."""
    available = []
    for idx in range(4):
        try:
            sdr = RtlSdr(device_index=idx)
            available.append({"index": idx, "serial": sdr.get_device_serial_addresses()})
            sdr.close()
        except Exception:
            break
    return available

def monitor_single_dongle(device_index, config, duration_sec=5):
    """Monitor a single frequency with one dongle."""
    try:
        sdr = RtlSdr(device_index=device_index)
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = config["freq"]
        sdr.gain = config["gain"]
        iq = sdr.read_samples(int(duration_sec * SAMPLE_RATE))
        power_db = 10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12)
        window = signal.hann(FFT_SIZE)
        spec = np.abs(np.fft.fftshift(np.fft.fft(iq[:FFT_SIZE] * window)))
        peak_snr = 10 * np.log10(np.max(spec) ** 2 / (np.median(spec) ** 2 + 1e-12))
        sdr.close()
        return {"name": config["name"], "freq_mhz": config["freq"] / 1e6,
                "power_db": round(float(power_db), 1), "snr_db": round(float(peak_snr), 1)}
    except Exception as e:
        return {"name": config["name"], "error": str(e)}

def main():
    print("=== SDR Farm ===")
    dongles = scan_available_dongles()
    print(f"[farm] Available dongles: {len(dongles)}")
    if not dongles:
        # Fall back to single dongle mode
        print("[farm] Single dongle mode - sequential scanning")
        sdr = RtlSdr()
        results = []
        for cfg in FARM_CONFIG:
            sdr.center_freq = cfg["freq"]
            sdr.gain = cfg["gain"]
            sdr.sample_rate = SAMPLE_RATE
            time.sleep(0.05)
            iq = sdr.read_samples(FFT_SIZE * 4)
            power = 10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12)
            results.append({"name": cfg["name"], "power_db": round(float(power), 1)})
            print(f"  {cfg['name']:15s} {cfg['freq']/1e6:.3f} MHz: {power:.1f} dB")
        sdr.close()
    else:
        results = []
        for i, cfg in enumerate(FARM_CONFIG[:len(dongles)]):
            r = monitor_single_dongle(i, cfg)
            results.append(r)
            print(f"  Dongle {i}: {r}")
    with open("sdr_farm_status.json", "w") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    main()
