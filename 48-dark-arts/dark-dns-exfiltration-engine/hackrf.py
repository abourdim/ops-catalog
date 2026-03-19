#!/usr/bin/env python3
"""DNS Exfiltration Engine - SDR Companion
Detects DNS exfiltration over RF by monitoring ISM band traffic
for patterns consistent with encoded data in DNS-over-radio tunnels.
FOR AUTHORIZED SECURITY TESTING ONLY.
"""

import numpy as np
from scipy import signal, stats
from scipy.fft import fft, fftfreq
import time
import argparse

CENTER_FREQ = 915e6  # ISM band
SAMPLE_RATE = 2.4e6
GAIN = 40
NUM_SAMPLES = 256 * 1024

class DNSExfilDetector:
    """Detects DNS exfiltration patterns in RF spectrum."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.baseline_entropy = 0

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
        sig = 0.02 * (np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES))
        # Simulate bursty data exfil pattern
        if np.random.random() > 0.5:
            for i in range(5):
                start = np.random.randint(0, NUM_SAMPLES - 5000)
                burst_data = np.random.bytes(100)
                bits = np.unpackbits(np.frombuffer(burst_data, dtype=np.uint8))
                symbols = 2.0 * bits[:min(len(bits), 5000)] - 1
                freq = np.random.uniform(-0.3e6, 0.3e6)
                sig[start:start+len(symbols)] += 0.3 * symbols * np.exp(
                    2j * np.pi * freq * t[start:start+len(symbols)])
        return sig

    def compute_entropy(self, data):
        """Compute Shannon entropy of data block."""
        hist, _ = np.histogram(data, bins=256, density=True)
        hist = hist[hist > 0]
        return -np.sum(hist * np.log2(hist + 1e-12))

    def detect_bursts(self, samples, threshold=3.0):
        """Detect data bursts in RF signal."""
        envelope = np.abs(samples)
        # Sliding window energy detection
        window_size = 1000
        energy = np.convolve(envelope**2, np.ones(window_size)/window_size, mode='same')
        mean_energy = np.mean(energy)
        std_energy = np.std(energy)
        burst_mask = energy > mean_energy + threshold * std_energy
        # Find burst regions
        bursts = []
        in_burst = False
        start = 0
        for i in range(len(burst_mask)):
            if burst_mask[i] and not in_burst:
                start = i
                in_burst = True
            elif not burst_mask[i] and in_burst:
                if i - start > 100:
                    bursts.append({
                        'start': start,
                        'end': i,
                        'duration_us': (i - start) / self.sample_rate * 1e6,
                        'energy': np.mean(energy[start:i])
                    })
                in_burst = False
        return bursts

    def analyze_burst_pattern(self, bursts):
        """Analyze burst timing for exfiltration signatures."""
        if len(bursts) < 2:
            return {'periodic': False, 'suspicious': False}
        intervals = [bursts[i+1]['start'] - bursts[i]['end'] for i in range(len(bursts)-1)]
        intervals = np.array(intervals) / self.sample_rate * 1e3  # ms
        mean_interval = np.mean(intervals)
        cv = np.std(intervals) / (mean_interval + 1e-10)
        # Regular intervals suggest automated exfiltration
        periodic = cv < 0.3 and len(bursts) > 3
        # High entropy bursts suggest encoded data
        return {
            'periodic': periodic,
            'mean_interval_ms': mean_interval,
            'cv': cv,
            'burst_count': len(bursts),
            'suspicious': periodic and len(bursts) > 5
        }

    def spectral_entropy(self, samples):
        """Compute spectral entropy as randomness indicator."""
        freqs, psd = self.compute_spectrum(samples)
        psd_linear = 10 ** (psd / 10)
        psd_norm = psd_linear / np.sum(psd_linear)
        psd_norm = psd_norm[psd_norm > 0]
        return -np.sum(psd_norm * np.log2(psd_norm))

    def compute_spectrum(self, samples):
        window = signal.windows.hann(len(samples))
        spec = fft(samples * window)
        freqs = fftfreq(len(samples), 1 / self.sample_rate)
        psd = 20 * np.log10(np.abs(spec) + 1e-12)
        return freqs, psd

    def run_detection(self, duration=30):
        """Run DNS exfiltration detection."""
        self.init_sdr()
        print(f"[EXFIL] DNS Exfiltration RF Detector")
        print(f"  Frequency: {self.center_freq/1e6:.1f} MHz")
        print(f"  Duration:  {duration}s")

        alert_count = 0
        scan_count = 0
        start = time.time()

        while time.time() - start < duration:
            samples = self.capture()
            bursts = self.detect_bursts(samples)
            analysis = self.analyze_burst_pattern(bursts)
            spec_ent = self.spectral_entropy(samples)
            scan_count += 1

            if analysis['suspicious']:
                alert_count += 1
                print(f"\n  [ALERT #{alert_count}] Exfiltration pattern detected!")
                print(f"    Bursts: {analysis['burst_count']} "
                      f"interval: {analysis['mean_interval_ms']:.1f} ms "
                      f"CV: {analysis['cv']:.3f}")
                print(f"    Spectral entropy: {spec_ent:.2f}")
            elif bursts:
                print(f"  Scan {scan_count}: {len(bursts)} bursts (non-periodic)")

            time.sleep(0.5)

        print(f"\n[RESULT] {scan_count} scans, {alert_count} alerts")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='DNS Exfil RF Detector')
    parser.add_argument('-f', '--freq', type=float, default=915e6)
    parser.add_argument('-d', '--duration', type=int, default=30)
    args = parser.parse_args()

    det = DNSExfilDetector(args.freq)
    try:
        det.run_detection(args.duration)
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        det.close()

if __name__ == '__main__':
    main()
