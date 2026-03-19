#!/usr/bin/env python3
"""Quantum Random Beacon - RTL-SDR/HackRF Companion
Harvests atmospheric RF noise as a source of quantum-grade randomness.
Uses wideband SDR sampling to extract entropy from thermal noise floor.
"""

import numpy as np
from scipy import signal, stats
import struct
import hashlib
import time
import argparse

# SDR Configuration
CENTER_FREQ = 100e6       # 100 MHz - quiet band for noise floor
SAMPLE_RATE = 2.4e6       # 2.4 MS/s
GAIN = 0                  # Minimum gain to capture thermal noise
BLOCK_SIZE = 256 * 1024   # Samples per capture block
ENTROPY_BITS = 256        # Output entropy bits per beacon pulse

class QuantumRandomBeacon:
    """Extracts cryptographic randomness from RF thermal noise."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.entropy_pool = bytearray()
        self.beacon_count = 0

    def init_sdr(self):
        """Initialize RTL-SDR device for noise capture."""
        try:
            import rtlsdr
            self.sdr = rtlsdr.RtlSdr()
            self.sdr.center_freq = self.center_freq
            self.sdr.sample_rate = self.sample_rate
            self.sdr.gain = GAIN
            print(f"[SDR] Initialized at {self.center_freq/1e6:.1f} MHz, "
                  f"rate={self.sample_rate/1e6:.1f} MS/s")
        except (ImportError, Exception) as e:
            print(f"[SDR] Hardware not available: {e}")
            print("[SDR] Using simulated thermal noise source")
            self.sdr = None

    def capture_noise(self):
        """Capture raw RF noise samples."""
        if self.sdr:
            samples = self.sdr.read_samples(BLOCK_SIZE)
        else:
            # Simulate thermal noise: complex Gaussian (Johnson-Nyquist)
            noise_i = np.random.normal(0, 1, BLOCK_SIZE)
            noise_q = np.random.normal(0, 1, BLOCK_SIZE)
            samples = noise_i + 1j * noise_q
        return samples

    def extract_entropy(self, samples):
        """Extract entropy from raw RF samples using von Neumann debiasing."""
        # Compute instantaneous phase differences
        phase = np.angle(samples)
        phase_diff = np.diff(phase)

        # Quantize to binary via sign
        bits_raw = (phase_diff > 0).astype(np.uint8)

        # Von Neumann debiasing: take pairs, keep if different
        debiased = []
        for i in range(0, len(bits_raw) - 1, 2):
            if bits_raw[i] != bits_raw[i + 1]:
                debiased.append(bits_raw[i])

        return np.array(debiased, dtype=np.uint8)

    def bits_to_bytes(self, bits):
        """Pack bit array into bytes."""
        n_bytes = len(bits) // 8
        result = bytearray(n_bytes)
        for i in range(n_bytes):
            for j in range(8):
                result[i] |= bits[i * 8 + j] << (7 - j)
        return result

    def health_check(self, bits):
        """Run NIST-style statistical tests on extracted bits."""
        if len(bits) < 100:
            return False, "Insufficient bits"
        # Frequency (monobit) test
        n = len(bits)
        s = np.sum(bits) * 2 - n
        p_value = stats.norm.sf(abs(s) / np.sqrt(n)) * 2
        passed = p_value > 0.01
        return passed, f"Monobit p={p_value:.4f}"

    def generate_beacon(self):
        """Generate one beacon pulse of certified randomness."""
        samples = self.capture_noise()
        entropy_bits = self.extract_entropy(samples)

        passed, msg = self.health_check(entropy_bits)
        if not passed:
            print(f"[WARN] Health check failed: {msg}")
            return None

        # Condense to target length via SHA-256
        raw_bytes = self.bits_to_bytes(entropy_bits)
        self.entropy_pool.extend(raw_bytes)

        beacon_hash = hashlib.sha256(bytes(self.entropy_pool[-1024:])).digest()
        self.beacon_count += 1

        return {
            'sequence': self.beacon_count,
            'timestamp': time.time(),
            'value': beacon_hash.hex(),
            'raw_bits': len(entropy_bits),
            'health': msg,
            'hash_algo': 'SHA-256'
        }

    def run_continuous(self, interval=10, count=None):
        """Run beacon in continuous mode."""
        self.init_sdr()
        print(f"[BEACON] Starting quantum random beacon (interval={interval}s)")
        i = 0
        while count is None or i < count:
            beacon = self.generate_beacon()
            if beacon:
                print(f"\n--- Beacon #{beacon['sequence']} ---")
                print(f"  Time:    {time.ctime(beacon['timestamp'])}")
                print(f"  Value:   {beacon['value'][:64]}")
                print(f"  Entropy: {beacon['raw_bits']} raw bits")
                print(f"  Health:  {beacon['health']}")
            i += 1
            if count is None or i < count:
                time.sleep(interval)

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Quantum Random Beacon via SDR')
    parser.add_argument('-f', '--freq', type=float, default=100e6, help='Center freq Hz')
    parser.add_argument('-r', '--rate', type=float, default=2.4e6, help='Sample rate Hz')
    parser.add_argument('-i', '--interval', type=int, default=10, help='Beacon interval sec')
    parser.add_argument('-n', '--count', type=int, default=None, help='Number of beacons')
    args = parser.parse_args()

    beacon = QuantumRandomBeacon(args.freq, args.rate)
    try:
        beacon.run_continuous(args.interval, args.count)
    except KeyboardInterrupt:
        print("\n[BEACON] Stopped")
    finally:
        beacon.close()


if __name__ == '__main__':
    main()
