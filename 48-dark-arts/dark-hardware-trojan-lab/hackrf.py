#!/usr/bin/env python3
"""Hardware Trojan Lab - SDR Companion
Detects hardware trojans via EM side-channel analysis, comparing
IC electromagnetic signatures against golden reference models.
FOR AUTHORIZED SECURITY TESTING ONLY.
"""

import numpy as np
from scipy import signal, stats
from scipy.fft import fft, fftfreq
import time
import argparse

CENTER_FREQ = 100e6
SAMPLE_RATE = 2.4e6
GAIN = 45
NUM_SAMPLES = 256 * 1024

class HardwareTrojanDetector:
    """Detects hardware trojans via EM fingerprinting."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.golden_signature = None

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
        # Simulate IC EM emissions
        clock_harmonics = [16e6, 32e6, 48e6, 64e6]
        sig = np.zeros(NUM_SAMPLES, dtype=complex)
        for i, f in enumerate(clock_harmonics):
            f_alias = f % self.sample_rate
            amp = 1.0 / (i + 1)
            sig += amp * np.exp(2j * np.pi * f_alias * t)
        # Add trojan signature (occasional extra harmonic)
        if np.random.random() > 0.5:
            trojan_f = 22e6 % self.sample_rate
            sig += 0.05 * np.exp(2j * np.pi * trojan_f * t)
        sig += 0.1 * (np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES))
        return sig

    def extract_signature(self, samples, n_avg=10):
        """Extract EM signature (spectral fingerprint)."""
        accumulated = np.zeros(NUM_SAMPLES // 2)
        for _ in range(n_avg):
            s = self.capture() if n_avg > 1 else samples
            window = signal.windows.blackmanharris(len(s))
            spec = np.abs(fft(s * window))[:NUM_SAMPLES // 2]
            accumulated += spec
        return accumulated / n_avg

    def capture_golden_reference(self, n_avg=20):
        """Capture golden (trojan-free) reference signature."""
        print(f"[GOLDEN] Capturing reference signature ({n_avg} averages)...")
        samples = self.capture()
        self.golden_signature = self.extract_signature(samples, n_avg)
        print(f"[GOLDEN] Reference captured")

    def compare_signatures(self, test_sig):
        """Compare test signature against golden reference."""
        if self.golden_signature is None:
            return None
        # Normalize both
        g = self.golden_signature / np.max(self.golden_signature)
        t = test_sig / np.max(test_sig)
        # Correlation
        correlation = np.corrcoef(g, t)[0, 1]
        # Spectral difference
        diff = np.abs(t - g)
        max_diff = np.max(diff)
        mean_diff = np.mean(diff)
        # Anomalous peaks
        threshold = np.mean(diff) + 5 * np.std(diff)
        anomalies = np.where(diff > threshold)[0]
        freqs = fftfreq(NUM_SAMPLES, 1 / self.sample_rate)[:NUM_SAMPLES // 2]
        anomaly_freqs = freqs[anomalies] if len(anomalies) > 0 else []
        return {
            'correlation': correlation,
            'max_deviation': max_diff,
            'mean_deviation': mean_diff,
            'anomaly_count': len(anomalies),
            'anomaly_freqs': anomaly_freqs,
            'trojan_likely': correlation < 0.95 or len(anomalies) > 3
        }

    def frequency_sweep_test(self, freq_range=None):
        """Sweep center frequency for comprehensive EM analysis."""
        if freq_range is None:
            freq_range = np.arange(50e6, 500e6, 50e6)
        results = []
        for freq in freq_range:
            self.center_freq = freq
            if self.sdr:
                self.sdr.center_freq = freq
            samples = self.capture()
            power = np.mean(np.abs(samples) ** 2)
            spectrum = np.abs(fft(samples))[:len(samples)//2]
            peak_count = len(signal.find_peaks(spectrum, height=np.max(spectrum)*0.1)[0])
            results.append({
                'freq_MHz': freq / 1e6,
                'power': 10 * np.log10(power + 1e-12),
                'spectral_peaks': peak_count
            })
        return results

    def run_detection(self):
        self.init_sdr()
        print(f"[TROJAN] Hardware Trojan EM Detection")

        self.capture_golden_reference()

        # Test device
        print(f"\n--- Testing Device Under Test ---")
        for trial in range(5):
            samples = self.capture()
            test_sig = self.extract_signature(samples, 5)
            result = self.compare_signatures(test_sig)
            if result:
                status = "TROJAN LIKELY" if result['trojan_likely'] else "CLEAN"
                print(f"  Trial {trial+1}: corr={result['correlation']:.4f} "
                      f"anomalies={result['anomaly_count']} [{status}]")
                if result['anomaly_freqs'] is not None and len(result['anomaly_freqs']) > 0:
                    for af in result['anomaly_freqs'][:3]:
                        print(f"    Anomaly at {af/1e6:.3f} MHz")

        # Frequency sweep
        print(f"\n--- Frequency Sweep ---")
        sweep = self.frequency_sweep_test()
        for r in sweep:
            print(f"  {r['freq_MHz']:.0f} MHz: power={r['power']:.1f} dB, "
                  f"peaks={r['spectral_peaks']}")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Hardware Trojan Detector SDR')
    parser.add_argument('-f', '--freq', type=float, default=100e6)
    args = parser.parse_args()

    det = HardwareTrojanDetector(args.freq)
    try:
        det.run_detection()
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        det.close()

if __name__ == '__main__':
    main()
