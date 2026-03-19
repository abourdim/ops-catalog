#!/usr/bin/env python3
"""SDR Doppler Tracker - Tracks frequency drift/Doppler shift of moving transmitters."""
import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

TARGET_FREQ = 137.9e6  # Satellite frequency
SAMPLE_RATE = 250e3
FFT_SIZE = 8192
GAIN = 49
TRACK_SECONDS = 120
MEASUREMENT_INTERVAL = 1.0

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = TARGET_FREQ
    sdr.gain = GAIN
    return sdr

def measure_carrier_frequency(sdr, fft_size):
    iq = sdr.read_samples(fft_size * 4)
    window = signal.blackmanharris(fft_size)
    psd = np.zeros(fft_size)
    for i in range(min(4, len(iq) // fft_size)):
        seg = iq[i * fft_size:(i + 1) * fft_size]
        psd += np.abs(np.fft.fftshift(np.fft.fft(seg * window))) ** 2
    psd_db = 10 * np.log10(psd / 4 + 1e-12)
    peak_idx = np.argmax(psd_db)
    freq_offset = (peak_idx - fft_size / 2) * SAMPLE_RATE / fft_size
    return float(freq_offset), float(psd_db[peak_idx])

def track_doppler(sdr, duration_sec, interval_sec):
    measurements = []
    num = int(duration_sec / interval_sec)
    start = time.time()
    for i in range(num):
        offset, power = measure_carrier_frequency(sdr, FFT_SIZE)
        elapsed = time.time() - start
        measurements.append({"time_sec": round(elapsed, 2), "offset_hz": round(offset, 1),
                            "power_db": round(power, 1)})
        if i % 10 == 0:
            print(f"  [{elapsed:6.1f}s] Doppler: {offset:+8.1f} Hz | Power: {power:.1f} dB")
        time.sleep(interval_sec)
    return measurements

def estimate_velocity(measurements, freq_hz):
    offsets = [m["offset_hz"] for m in measurements]
    max_doppler = max(abs(min(offsets)), abs(max(offsets)))
    c = 3e8
    velocity = max_doppler * c / freq_hz
    return round(float(velocity), 1)

def main():
    print("=== SDR Doppler Tracker ===")
    sdr = configure_sdr()
    try:
        measurements = track_doppler(sdr, TRACK_SECONDS, MEASUREMENT_INTERVAL)
        velocity = estimate_velocity(measurements, TARGET_FREQ)
        print(f"\n[doppler] Estimated max velocity: {velocity} m/s")
        with open("doppler_track.json", "w") as f:
            json.dump({"measurements": measurements, "velocity_ms": velocity}, f, indent=2)
    except KeyboardInterrupt:
        print("\n[doppler] Tracking stopped.")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
