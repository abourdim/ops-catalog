#!/usr/bin/env python3
"""Supply Chain Auditor - SDR Companion
Verifies hardware supply chain integrity by comparing EM signatures
of ICs against known-good reference fingerprints via SDR.
FOR AUTHORIZED SECURITY TESTING ONLY.
"""

import numpy as np
from scipy import signal, stats
from scipy.fft import fft, fftfreq
import hashlib
import time
import argparse

CENTER_FREQ = 100e6
SAMPLE_RATE = 2.4e6
GAIN = 45
NUM_SAMPLES = 256 * 1024

class SupplyChainSDR:
    """IC authenticity verification via EM fingerprinting."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.reference_db = {}

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
        sig = np.zeros(NUM_SAMPLES, dtype=complex)
        # Simulate IC EM fingerprint
        harmonics = [8e6, 16e6, 24e6, 32e6, 48e6]
        for i, f in enumerate(harmonics):
            f_alias = f % self.sample_rate
            amp = 0.5 / (i + 1) + np.random.normal(0, 0.01)
            phase = np.random.uniform(0, 2 * np.pi)
            sig += amp * np.exp(2j * np.pi * f_alias * t + 1j * phase)
        sig += 0.05 * (np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES))
        return sig

    def extract_fingerprint(self, n_avg=10):
        """Extract EM fingerprint with averaging."""
        spectra = []
        for _ in range(n_avg):
            samples = self.capture()
            window = signal.windows.blackmanharris(len(samples))
            spec = np.abs(fft(samples * window))[:len(samples)//2]
            spectra.append(spec)
        avg_spectrum = np.mean(spectra, axis=0)
        # Extract feature vector
        freqs = fftfreq(NUM_SAMPLES, 1/self.sample_rate)[:NUM_SAMPLES//2]
        peaks = signal.find_peaks(avg_spectrum, height=np.max(avg_spectrum)*0.05,
                                  distance=100)[0]
        features = {
            'peak_freqs': freqs[peaks].tolist(),
            'peak_amps': avg_spectrum[peaks].tolist(),
            'spectral_centroid': np.average(freqs, weights=avg_spectrum + 1e-12),
            'spectral_spread': np.sqrt(np.average((freqs - np.average(freqs, weights=avg_spectrum+1e-12))**2,
                                                   weights=avg_spectrum+1e-12)),
            'total_power': np.sum(avg_spectrum**2),
            'peak_count': len(peaks)
        }
        # Generate fingerprint hash
        fp_data = str(sorted(features.items())).encode()
        features['hash'] = hashlib.sha256(fp_data).hexdigest()[:16]
        return features, avg_spectrum

    def register_reference(self, name, n_avg=20):
        """Register a known-good IC as reference."""
        print(f"[REF] Registering reference: {name} ({n_avg} averages)")
        features, spectrum = self.extract_fingerprint(n_avg)
        self.reference_db[name] = {'features': features, 'spectrum': spectrum}
        print(f"  Hash: {features['hash']}")
        print(f"  Peaks: {features['peak_count']}")
        print(f"  Centroid: {features['spectral_centroid']/1e6:.3f} MHz")
        return features

    def verify_ic(self, reference_name, n_avg=10):
        """Verify IC against registered reference."""
        if reference_name not in self.reference_db:
            print(f"[ERROR] No reference '{reference_name}'")
            return None
        ref = self.reference_db[reference_name]
        test_features, test_spectrum = self.extract_fingerprint(n_avg)
        # Compare spectra
        ref_norm = ref['spectrum'] / np.max(ref['spectrum'])
        test_norm = test_spectrum / np.max(test_spectrum)
        correlation = np.corrcoef(ref_norm, test_norm)[0, 1]
        # Compare features
        freq_match = len(set(
            [round(f/1e3) for f in ref['features']['peak_freqs']]) &
            set([round(f/1e3) for f in test_features['peak_freqs']]))
        total_peaks = max(ref['features']['peak_count'], test_features['peak_count'])
        peak_ratio = freq_match / max(total_peaks, 1)
        # Power deviation
        power_dev = abs(test_features['total_power'] - ref['features']['total_power']) / \
                   ref['features']['total_power']
        # Verdict
        genuine = correlation > 0.90 and peak_ratio > 0.7 and power_dev < 0.3
        return {
            'correlation': correlation,
            'peak_match_ratio': peak_ratio,
            'power_deviation': power_dev,
            'test_hash': test_features['hash'],
            'ref_hash': ref['features']['hash'],
            'genuine': genuine
        }

    def run_audit(self):
        self.init_sdr()
        print(f"[AUDIT] Supply Chain IC Verification")

        # Register reference
        ref_features = self.register_reference("golden_sample")

        # Verify test samples
        print(f"\n--- Verification Tests ---")
        for trial in range(5):
            result = self.verify_ic("golden_sample")
            if result:
                status = "GENUINE" if result['genuine'] else "COUNTERFEIT"
                print(f"  Test {trial+1}: corr={result['correlation']:.4f} "
                      f"peaks={result['peak_match_ratio']:.2f} "
                      f"power_dev={result['power_deviation']:.3f} [{status}]")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Supply Chain Auditor SDR')
    parser.add_argument('-f', '--freq', type=float, default=100e6)
    args = parser.parse_args()

    auditor = SupplyChainSDR(args.freq)
    try:
        auditor.run_audit()
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        auditor.close()

if __name__ == '__main__':
    main()
