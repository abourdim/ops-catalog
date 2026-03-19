#!/usr/bin/env python3
"""Side Channel Arsenal - SDR Companion
Multi-vector EM side-channel analysis using SDR to capture
electromagnetic leakage from cryptographic implementations.
FOR AUTHORIZED SECURITY TESTING ONLY.
"""

import numpy as np
from scipy import signal, stats
from scipy.fft import fft, fftfreq
import time
import argparse

CENTER_FREQ = 200e6
SAMPLE_RATE = 2.4e6
GAIN = 45
NUM_SAMPLES = 128 * 1024

class SideChannelSDR:
    """Multi-vector EM side-channel analysis via SDR."""

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

    def capture(self):
        if self.sdr:
            return self.sdr.read_samples(NUM_SAMPLES)
        t = np.arange(NUM_SAMPLES) / self.sample_rate
        # Simulate clock + data-dependent EM
        clock = 0.5 * np.sin(2 * np.pi * 16e6 * t)
        data = 0.02 * np.random.choice([-1, 1], NUM_SAMPLES) * np.sin(2 * np.pi * 32e6 * t)
        noise = 0.1 * np.random.randn(NUM_SAMPLES)
        return (clock + data + noise) + 1j * 0.01 * np.random.randn(NUM_SAMPLES)

    def timing_attack(self, num_traces=50):
        """Timing side-channel via EM operation duration."""
        print(f"\n[TIMING] EM Timing Analysis ({num_traces} traces)")
        timings = []
        for i in range(num_traces):
            samples = self.capture()
            envelope = np.abs(samples)
            threshold = np.mean(envelope) + 2 * np.std(envelope)
            active = envelope > threshold
            # Measure active duration
            regions = np.diff(active.astype(int))
            starts = np.where(regions == 1)[0]
            ends = np.where(regions == -1)[0]
            if len(starts) > 0 and len(ends) > 0:
                duration = (ends[0] - starts[0]) / self.sample_rate * 1e6
                timings.append(duration)
        if timings:
            print(f"  Mean: {np.mean(timings):.1f} us, Std: {np.std(timings):.1f} us")
            print(f"  Range: {np.min(timings):.1f} - {np.max(timings):.1f} us")
            print(f"  CV: {np.std(timings)/np.mean(timings):.4f}")
            if np.std(timings) / np.mean(timings) > 0.05:
                print(f"  [!] Significant timing variation detected - possible leak")

    def simple_power_analysis(self, num_traces=20):
        """Simple Power Analysis (SPA) via EM traces."""
        print(f"\n[SPA] Simple EM Analysis ({num_traces} traces)")
        traces = []
        for i in range(num_traces):
            samples = self.capture()
            power = np.abs(samples[:1000]) ** 2
            traces.append(power)
        traces = np.array(traces)
        mean_trace = np.mean(traces, axis=0)
        # Look for distinct operation patterns
        peaks = signal.find_peaks(mean_trace, height=np.mean(mean_trace) * 1.5)[0]
        print(f"  Operation peaks detected: {len(peaks)}")
        print(f"  Mean power: {np.mean(mean_trace):.4f}")
        print(f"  Peak power: {np.max(mean_trace):.4f}")
        return traces

    def differential_em_analysis(self, traces, num_keys=16):
        """Differential EM Analysis (DEMA)."""
        print(f"\n[DEMA] Differential EM Analysis")
        if len(traces) < 10:
            print("  Need more traces")
            return
        key_guesses = []
        for byte_idx in range(min(num_keys, 4)):
            best_corr = 0
            best_key = 0
            for guess in range(256):
                hw = np.array([bin(guess ^ i).count('1') for i in range(len(traces))])
                for t_idx in range(0, min(traces.shape[1], 500), 5):
                    r = abs(np.corrcoef(hw, traces[:, t_idx])[0, 1])
                    if r > best_corr:
                        best_corr = r
                        best_key = guess
            key_guesses.append(best_key)
            print(f"  Byte {byte_idx}: 0x{best_key:02X} (r={best_corr:.4f})")
        return key_guesses

    def frequency_analysis(self):
        """Analyze EM leakage frequency spectrum."""
        print(f"\n[FREQ] Frequency Leakage Analysis")
        samples = self.capture()
        freqs = fftfreq(len(samples), 1 / self.sample_rate)
        spectrum = 20 * np.log10(np.abs(fft(np.real(samples))) + 1e-12)
        noise_floor = np.median(spectrum)
        peaks = signal.find_peaks(spectrum[:len(spectrum)//2],
                                  height=noise_floor + 20, distance=50)[0]
        print(f"  Noise floor: {noise_floor:.1f} dB")
        print(f"  Leakage frequencies ({len(peaks)}):")
        for p in peaks[:8]:
            snr = spectrum[p] - noise_floor
            print(f"    {freqs[p]/1e6:.3f} MHz: SNR={snr:.1f} dB")

    def mutual_information(self, traces):
        """Estimate mutual information between traces and hypothetical model."""
        print(f"\n[MI] Mutual Information Estimation")
        if len(traces) < 10:
            return
        # Discretize
        n_bins = 16
        for t_idx in [0, 100, 200, 500]:
            if t_idx >= traces.shape[1]:
                break
            col = traces[:, t_idx]
            hist_xy, _, _ = np.histogram2d(
                np.arange(len(col)), col, bins=n_bins)
            pxy = hist_xy / np.sum(hist_xy)
            px = np.sum(pxy, axis=1)
            py = np.sum(pxy, axis=0)
            mi = 0
            for i in range(n_bins):
                for j in range(n_bins):
                    if pxy[i, j] > 0 and px[i] > 0 and py[j] > 0:
                        mi += pxy[i, j] * np.log2(pxy[i, j] / (px[i] * py[j]))
            print(f"  Sample {t_idx}: MI = {mi:.4f} bits")

    def run_arsenal(self, num_traces=50):
        self.init_sdr()
        print(f"[SCA] Side-Channel Arsenal - SDR Mode")
        self.frequency_analysis()
        self.timing_attack(num_traces)
        traces = self.simple_power_analysis(num_traces)
        self.differential_em_analysis(traces)
        self.mutual_information(traces)

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Side-Channel Arsenal SDR')
    parser.add_argument('-n', '--traces', type=int, default=50)
    parser.add_argument('-f', '--freq', type=float, default=200e6)
    args = parser.parse_args()

    sca = SideChannelSDR(args.freq)
    try:
        sca.run_arsenal(args.traces)
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        sca.close()

if __name__ == '__main__':
    main()
