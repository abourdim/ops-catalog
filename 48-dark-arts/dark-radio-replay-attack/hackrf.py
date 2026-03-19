#!/usr/bin/env python3
"""Radio Replay Attack - SDR Companion
Captures, analyzes, and replays RF signals for security testing of
wireless remotes, key fobs, and IoT devices.
FOR AUTHORIZED SECURITY TESTING ONLY.
"""

import numpy as np
from scipy import signal
from scipy.fft import fft, fftfreq
import time
import argparse

CENTER_FREQ = 433.92e6  # 433 MHz ISM band
SAMPLE_RATE = 2e6
GAIN = 40
NUM_SAMPLES = 512 * 1024

class RadioReplaySDR:
    """Captures and analyzes RF signals for replay attack testing."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.captured_signals = []

    def init_sdr(self):
        try:
            import rtlsdr
            self.sdr = rtlsdr.RtlSdr()
            self.sdr.center_freq = self.center_freq
            self.sdr.sample_rate = self.sample_rate
            self.sdr.gain = GAIN
            print(f"[SDR] Initialized at {self.center_freq/1e6:.2f} MHz")
        except (ImportError, Exception) as e:
            print(f"[SIM] Simulated mode: {e}")
            self.sdr = None

    def capture(self):
        if self.sdr:
            return self.sdr.read_samples(NUM_SAMPLES)
        t = np.arange(NUM_SAMPLES) / self.sample_rate
        sig = 0.01 * (np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES))
        # Simulate OOK remote control signal
        if np.random.random() > 0.3:
            start = np.random.randint(0, NUM_SAMPLES - 50000)
            # Generate OOK pattern
            code = np.random.randint(0, 2, 24)
            short_pulse = int(0.5e-3 * self.sample_rate)
            long_pulse = int(1.5e-3 * self.sample_rate)
            pos = start
            for bit in code:
                pulse_len = long_pulse if bit else short_pulse
                gap_len = short_pulse if bit else long_pulse
                if pos + pulse_len + gap_len < NUM_SAMPLES:
                    sig[pos:pos+pulse_len] += 0.8
                    pos += pulse_len + gap_len
        return sig

    def detect_signals(self, samples):
        """Detect RF signal bursts."""
        envelope = np.abs(samples)
        threshold = np.mean(envelope) + 5 * np.std(envelope)
        bursts = []
        in_burst = False
        start = 0
        for i in range(len(envelope)):
            if envelope[i] > threshold and not in_burst:
                start = i; in_burst = True
            elif envelope[i] < threshold and in_burst:
                if i - start > 100:
                    bursts.append({
                        'start': start, 'end': i,
                        'duration_ms': (i - start) / self.sample_rate * 1e3,
                        'power': 20 * np.log10(np.max(envelope[start:i]) + 1e-12),
                        'samples': samples[start:i]
                    })
                in_burst = False
        return bursts

    def demodulate_ook(self, burst_samples):
        """Demodulate OOK (On-Off Keying) signal."""
        envelope = np.abs(burst_samples)
        threshold = np.mean(envelope) * 0.5
        binary = (envelope > threshold).astype(int)
        # Find pulse widths
        changes = np.diff(binary)
        rises = np.where(changes == 1)[0]
        falls = np.where(changes == -1)[0]
        pulses = []
        for r in rises:
            next_falls = falls[falls > r]
            if len(next_falls) > 0:
                width = (next_falls[0] - r) / self.sample_rate * 1e3
                pulses.append(width)
        return pulses, binary

    def analyze_protocol(self, pulses):
        """Analyze pulse timing to identify protocol."""
        if len(pulses) < 4:
            return "Unknown", {}
        short_pulse = np.min(pulses)
        long_pulse = np.max(pulses)
        ratio = long_pulse / (short_pulse + 1e-6)
        mean_pulse = np.mean(pulses)
        if 2.5 < ratio < 3.5 and mean_pulse < 2:
            return "PT2262/EV1527", {'ratio': ratio, 'baud': 1/mean_pulse*1e3}
        elif ratio < 2 and mean_pulse < 1:
            return "Manchester", {'bit_rate': 1/mean_pulse*1e3}
        elif ratio > 3:
            return "PWM", {'ratio': ratio}
        return "Unknown OOK", {'ratio': ratio, 'mean_ms': mean_pulse}

    def extract_code(self, pulses):
        """Extract digital code from pulse widths."""
        if len(pulses) < 2:
            return ""
        threshold = (np.min(pulses) + np.max(pulses)) / 2
        bits = ['1' if p > threshold else '0' for p in pulses]
        return ''.join(bits)

    def check_rolling_code(self, codes):
        """Check if signal uses rolling code (replay protection)."""
        if len(codes) < 2:
            return False, "Need multiple captures"
        unique = len(set(codes))
        if unique == len(codes):
            return True, f"All {len(codes)} codes unique - rolling code likely"
        return False, f"{unique}/{len(codes)} unique - fixed code"

    def run_analysis(self, duration=15):
        self.init_sdr()
        print(f"[REPLAY] Radio Replay Attack Tester")
        print(f"  Frequency: {self.center_freq/1e6:.2f} MHz")

        codes = []
        start = time.time()
        while time.time() - start < duration:
            samples = self.capture()
            bursts = self.detect_signals(samples)
            for burst in bursts:
                pulses, binary = self.demodulate_ook(burst['samples'])
                protocol, info = self.analyze_protocol(pulses)
                code = self.extract_code(pulses)
                if code:
                    codes.append(code)
                    self.captured_signals.append({
                        'code': code, 'protocol': protocol,
                        'power': burst['power'], 'duration': burst['duration_ms']
                    })
                    print(f"\n  [CAPTURE] {protocol}")
                    print(f"    Code: {code[:32]}{'...' if len(code) > 32 else ''}")
                    print(f"    Power: {burst['power']:.1f} dBm, Duration: {burst['duration_ms']:.1f} ms")
                    print(f"    Info: {info}")
            time.sleep(0.3)

        # Rolling code check
        print(f"\n--- Rolling Code Analysis ---")
        rolling, msg = self.check_rolling_code(codes)
        print(f"  {msg}")
        if not rolling and codes:
            print(f"  [VULN] Device may be vulnerable to replay attack!")
        elif rolling:
            print(f"  [SAFE] Rolling code detected - replay protected")

        print(f"\n  Total signals captured: {len(self.captured_signals)}")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Radio Replay SDR')
    parser.add_argument('-f', '--freq', type=float, default=433.92e6)
    parser.add_argument('-d', '--duration', type=int, default=15)
    args = parser.parse_args()

    replay = RadioReplaySDR(args.freq)
    try:
        replay.run_analysis(args.duration)
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        replay.close()

if __name__ == '__main__':
    main()
