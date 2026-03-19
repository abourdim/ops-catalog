#!/usr/bin/env python3
"""SDR OS - Complete SDR operating system with multi-receiver, multi-mode capability."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

SAMPLE_RATE = 2.4e6
GAIN = 40

class SDRReceiver:
    """Virtual receiver channel within the SDR OS."""
    def __init__(self, name, freq, mode, bandwidth):
        self.name = name
        self.freq = freq
        self.mode = mode
        self.bandwidth = bandwidth
        self.active = True

    def to_dict(self):
        return {"name": self.name, "freq_mhz": self.freq / 1e6,
                "mode": self.mode, "bandwidth_hz": self.bandwidth}

class SDROS:
    def __init__(self):
        self.sdr = RtlSdr()
        self.sdr.sample_rate = SAMPLE_RATE
        self.sdr.gain = GAIN
        self.receivers = []

    def add_receiver(self, name, freq, mode="FM", bw=15000):
        rx = SDRReceiver(name, freq, mode, bw)
        self.receivers.append(rx)
        return rx

    def process_receiver(self, rx):
        self.sdr.center_freq = rx.freq
        time.sleep(0.02)
        iq = sdr_read(self.sdr, 4096 * 4)
        power = 10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12)
        if rx.mode == "FM":
            audio = np.angle(iq[1:] * np.conj(iq[:-1]))
        elif rx.mode == "AM":
            audio = np.abs(iq) - np.mean(np.abs(iq))
        else:
            audio = np.real(iq)
        return {"name": rx.name, "power_db": round(float(power), 1),
                "audio_rms": round(float(np.std(audio)), 4)}

    def scan_all(self):
        results = []
        for rx in self.receivers:
            if rx.active:
                results.append(self.process_receiver(rx))
        return results

    def close(self):
        self.sdr.close()

def sdr_read(sdr, n):
    return sdr.read_samples(n)

def main():
    print("=== SDR OS ===")
    os_instance = SDROS()
    os_instance.add_receiver("APRS", 144.39e6, "FM", 12000)
    os_instance.add_receiver("WX", 162.4e6, "FM", 15000)
    os_instance.add_receiver("Airband", 121.5e6, "AM", 8000)
    os_instance.add_receiver("ISM", 433.92e6, "FM", 25000)
    try:
        print(f"[os] {len(os_instance.receivers)} virtual receivers configured")
        for cycle in range(5):
            results = os_instance.scan_all()
            print(f"\n[os] Cycle {cycle + 1}:")
            for r in results:
                print(f"  {r['name']:10s} | Power: {r['power_db']:6.1f} dB | Audio RMS: {r['audio_rms']:.4f}")
            time.sleep(2)
    finally:
        os_instance.close()

if __name__ == "__main__":
    main()
