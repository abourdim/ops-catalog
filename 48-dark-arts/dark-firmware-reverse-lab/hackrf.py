#!/usr/bin/env python3
"""Firmware Reverse Lab - SDR Companion
Captures EM emissions during firmware execution to identify
code sections, function boundaries, and cryptographic operations.
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
NUM_SAMPLES = 512 * 1024

class FirmwareReverseSDR:
    """Reverse-engineers firmware behavior via EM side-channel."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None

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
        # Simulate firmware execution phases
        phases = [
            (0, 0.2, 16e6, 0.5, "boot"),
            (0.2, 0.4, 48e6, 0.3, "init"),
            (0.4, 0.7, 32e6, 0.8, "crypto"),
            (0.7, 0.9, 16e6, 0.2, "idle"),
            (0.9, 1.0, 64e6, 0.6, "comm")
        ]
        for start_frac, end_frac, freq, amp, _ in phases:
            s = int(start_frac * NUM_SAMPLES)
            e = int(end_frac * NUM_SAMPLES)
            f_alias = freq % self.sample_rate
            sig[s:e] += amp * np.exp(2j * np.pi * f_alias * t[s:e])
        sig += 0.05 * (np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES))
        return sig

    def segment_execution(self, samples):
        """Segment firmware execution into distinct phases."""
        envelope = np.abs(samples)
        # Compute short-time energy
        window_size = 10000
        energy = np.convolve(envelope**2, np.ones(window_size)/window_size, mode='same')
        # Detect change points
        diff_energy = np.abs(np.diff(energy))
        threshold = np.mean(diff_energy) + 3 * np.std(diff_energy)
        changes = signal.find_peaks(diff_energy, height=threshold, distance=window_size)[0]
        # Build segments
        segments = []
        boundaries = [0] + list(changes) + [len(samples)]
        for i in range(len(boundaries) - 1):
            s, e = boundaries[i], boundaries[i+1]
            seg_samples = samples[s:e]
            spec = np.abs(fft(seg_samples))
            dominant_freq = fftfreq(len(seg_samples), 1/self.sample_rate)[np.argmax(spec[:len(spec)//2])]
            segments.append({
                'start_us': s / self.sample_rate * 1e6,
                'end_us': e / self.sample_rate * 1e6,
                'duration_us': (e - s) / self.sample_rate * 1e6,
                'mean_power': np.mean(np.abs(seg_samples)**2),
                'dominant_freq': dominant_freq,
                'spectral_entropy': self.spectral_entropy(seg_samples)
            })
        return segments

    def spectral_entropy(self, samples):
        """Compute spectral entropy of a segment."""
        spec = np.abs(fft(samples))[:len(samples)//2]
        spec_norm = spec / (np.sum(spec) + 1e-12)
        spec_norm = spec_norm[spec_norm > 0]
        return -np.sum(spec_norm * np.log2(spec_norm + 1e-12))

    def identify_crypto(self, segments):
        """Identify segments likely performing cryptographic operations."""
        crypto_segments = []
        for seg in segments:
            # High spectral entropy + moderate power = likely crypto
            if seg['spectral_entropy'] > 8 and seg['mean_power'] > 0.1:
                crypto_segments.append(seg)
        return crypto_segments

    def function_boundary_detection(self, samples):
        """Detect function call/return boundaries from EM patterns."""
        envelope = np.abs(samples)
        # Look for sharp transitions (function entry/exit)
        diff = np.abs(np.diff(envelope))
        smooth_diff = np.convolve(diff, np.ones(100)/100, mode='same')
        peaks = signal.find_peaks(smooth_diff, height=np.mean(smooth_diff)*3, distance=5000)[0]
        boundaries = []
        for p in peaks:
            boundaries.append({
                'position_us': p / self.sample_rate * 1e6,
                'transition_strength': smooth_diff[p]
            })
        return boundaries

    def run_analysis(self):
        self.init_sdr()
        print(f"[FW-REV] Firmware EM Reverse Analysis")

        samples = self.capture()

        # Execution segmentation
        print(f"\n--- Execution Phase Segmentation ---")
        segments = self.segment_execution(samples)
        for i, seg in enumerate(segments):
            print(f"  Phase {i}: {seg['start_us']:.0f}-{seg['end_us']:.0f} us "
                  f"({seg['duration_us']:.0f} us) "
                  f"freq={seg['dominant_freq']/1e6:.1f} MHz "
                  f"entropy={seg['spectral_entropy']:.2f}")

        # Crypto detection
        print(f"\n--- Cryptographic Operation Detection ---")
        crypto = self.identify_crypto(segments)
        if crypto:
            for c in crypto:
                print(f"  [CRYPTO] {c['start_us']:.0f}-{c['end_us']:.0f} us "
                      f"entropy={c['spectral_entropy']:.2f}")
        else:
            print("  No cryptographic operations detected")

        # Function boundaries
        print(f"\n--- Function Boundaries ---")
        boundaries = self.function_boundary_detection(samples)
        for b in boundaries[:10]:
            print(f"  {b['position_us']:.0f} us (strength={b['transition_strength']:.4f})")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Firmware Reverse SDR')
    parser.add_argument('-f', '--freq', type=float, default=100e6)
    args = parser.parse_args()

    rev = FirmwareReverseSDR(args.freq)
    try:
        rev.run_analysis()
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        rev.close()

if __name__ == '__main__':
    main()
