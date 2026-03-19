#!/usr/bin/env python3
"""Cable Tap Detector - SDR Companion
Detects cable tapping by monitoring for RF leakage from network cables
and unauthorized wireless bridges on wired network segments.
FOR AUTHORIZED SECURITY TESTING ONLY.
"""

import numpy as np
from scipy import signal
from scipy.fft import fft, fftfreq
import time
import argparse

CENTER_FREQ = 100e6
SAMPLE_RATE = 2.4e6
GAIN = 45
NUM_SAMPLES = 256 * 1024

class CableTapSDR:
    """Detects cable taps via RF leakage monitoring."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.baseline_spectrum = None

    def init_sdr(self):
        try:
            import rtlsdr
            self.sdr = rtlsdr.RtlSdr()
            self.sdr.center_freq = self.center_freq
            self.sdr.sample_rate = self.sample_rate
            self.sdr.gain = GAIN
            print(f"[SDR] Initialized at {self.center_freq/1e6:.1f} MHz")
        except (ImportError, Exception) as e:
            print(f"[SIM] Simulated mode: {e}")
            self.sdr = None

    def capture(self):
        if self.sdr:
            return self.sdr.read_samples(NUM_SAMPLES)
        t = np.arange(NUM_SAMPLES) / self.sample_rate
        sig = 0.01 * (np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES))
        # Simulate Ethernet cable EM leakage
        eth_harmonics = [25e6, 62.5e6, 125e6]
        for f in eth_harmonics:
            f_alias = f % self.sample_rate
            sig += 0.05 * np.exp(2j * np.pi * f_alias * t)
        # Simulate tap leakage (extra emissions)
        if np.random.random() > 0.6:
            tap_freq = 80e6 % self.sample_rate
            sig += 0.15 * np.exp(2j * np.pi * tap_freq * t)
        return sig

    def compute_spectrum(self, samples):
        window = signal.windows.blackmanharris(len(samples))
        spec = fft(samples * window)
        freqs = fftfreq(len(samples), 1 / self.sample_rate)
        psd = 20 * np.log10(np.abs(spec) + 1e-12)
        return freqs, psd

    def capture_baseline(self, n_avg=10):
        print(f"[BASELINE] Capturing reference ({n_avg} averages)...")
        accumulated = np.zeros(NUM_SAMPLES)
        for _ in range(n_avg):
            samples = self.capture()
            _, psd = self.compute_spectrum(samples)
            accumulated += psd
        self.baseline_spectrum = accumulated / n_avg
        print("[BASELINE] Done")

    def detect_new_emissions(self, threshold_dB=8):
        samples = self.capture()
        freqs, psd = self.compute_spectrum(samples)
        if self.baseline_spectrum is None:
            return freqs, psd, []
        diff = psd - self.baseline_spectrum
        anomalies = []
        # Group adjacent anomaly bins
        above = diff > threshold_dB
        in_region = False
        start = 0
        for i in range(len(above)):
            if above[i] and not in_region:
                start = i; in_region = True
            elif not above[i] and in_region:
                peak_idx = start + np.argmax(diff[start:i])
                anomalies.append({
                    'freq': freqs[peak_idx],
                    'excess_dB': diff[peak_idx],
                    'bandwidth': (i - start) * self.sample_rate / len(freqs)
                })
                in_region = False
        return freqs, diff, anomalies

    def frequency_sweep(self, freq_list=None):
        """Sweep multiple frequencies for comprehensive monitoring."""
        if freq_list is None:
            freq_list = [50e6, 100e6, 200e6, 500e6, 1e9]
        results = []
        for freq in freq_list:
            self.center_freq = freq
            if self.sdr:
                self.sdr.center_freq = freq
            samples = self.capture()
            power = 10 * np.log10(np.mean(np.abs(samples)**2) + 1e-12)
            _, psd = self.compute_spectrum(samples)
            peak_power = np.max(psd)
            results.append({
                'freq_MHz': freq / 1e6,
                'mean_power': power,
                'peak_power': peak_power
            })
        return results

    def run_detection(self, duration=20):
        self.init_sdr()
        print(f"[TAP] Cable Tap Detector - SDR Mode")

        # Frequency sweep
        print(f"\n--- Frequency Sweep ---")
        sweep = self.frequency_sweep()
        for r in sweep:
            print(f"  {r['freq_MHz']:7.1f} MHz: mean={r['mean_power']:.1f} dB  "
                  f"peak={r['peak_power']:.1f} dB")

        # Continuous monitoring at primary freq
        self.center_freq = CENTER_FREQ
        if self.sdr:
            self.sdr.center_freq = CENTER_FREQ
        self.capture_baseline()

        print(f"\n--- Continuous Monitoring ({duration}s) ---")
        start = time.time()
        alert_count = 0
        while time.time() - start < duration:
            freqs, diff, anomalies = self.detect_new_emissions()
            if anomalies:
                alert_count += len(anomalies)
                for a in anomalies:
                    print(f"  [TAP?] New emission at {a['freq']/1e6:.3f} MHz, "
                          f"+{a['excess_dB']:.1f} dB, BW={a['bandwidth']/1e3:.1f} kHz")
            time.sleep(0.5)

        print(f"\n[RESULT] {alert_count} anomalous emissions in {duration}s")
        if alert_count > 5:
            print("[WARN] Possible cable tap or unauthorized wireless bridge!")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Cable Tap Detector SDR')
    parser.add_argument('-f', '--freq', type=float, default=100e6)
    parser.add_argument('-d', '--duration', type=int, default=20)
    args = parser.parse_args()

    det = CableTapSDR(args.freq)
    try:
        det.run_detection(args.duration)
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        det.close()

if __name__ == '__main__':
    main()
