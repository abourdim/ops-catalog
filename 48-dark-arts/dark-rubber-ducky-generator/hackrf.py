#!/usr/bin/env python3
"""Rubber Ducky Generator - SDR Companion
Detects unauthorized USB HID keystroke injection devices (BadUSB/Rubber Ducky)
by monitoring RF emissions characteristic of USB data transfer patterns.
FOR AUTHORIZED SECURITY TESTING ONLY.
"""

import numpy as np
from scipy import signal
from scipy.fft import fft, fftfreq
import time
import argparse

CENTER_FREQ = 480e6    # USB 2.0 harmonic region (480 MHz)
SAMPLE_RATE = 2.4e6
GAIN = 40
NUM_SAMPLES = 256 * 1024

class RubberDuckyDetector:
    """Detects BadUSB/HID injection devices via USB EM emissions."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.baseline_usb_signature = None

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
        # Simulate USB EM emissions
        usb_harmonics = [12e6, 480e6]  # USB FS and HS
        for f in usb_harmonics:
            f_alias = f % self.sample_rate
            sig += 0.1 * np.exp(2j * np.pi * f_alias * t)
        # Simulate HID keystroke bursts (regular, fast typing pattern)
        if np.random.random() > 0.4:
            # BadUSB: very regular keystroke timing (inhuman)
            for i in range(20):
                pos = 10000 + i * 8000  # Very regular spacing
                if pos + 2000 < NUM_SAMPLES:
                    sig[pos:pos+2000] += 0.3 * np.exp(2j * np.pi * 0.5e6 * t[pos:pos+2000])
        return sig

    def compute_spectrum(self, samples):
        window = signal.windows.blackmanharris(len(samples))
        spec = fft(samples * window)
        freqs = fftfreq(len(samples), 1 / self.sample_rate)
        psd = 20 * np.log10(np.abs(spec) + 1e-12)
        return freqs, psd

    def detect_usb_activity(self, samples):
        """Detect USB data transfer activity from EM emissions."""
        envelope = np.abs(samples)
        threshold = np.mean(envelope) + 3 * np.std(envelope)
        active = envelope > threshold
        # Find activity bursts
        bursts = []
        in_burst = False
        start = 0
        for i in range(len(active)):
            if active[i] and not in_burst:
                start = i; in_burst = True
            elif not active[i] and in_burst:
                if i - start > 50:
                    bursts.append({
                        'start': start, 'end': i,
                        'duration_us': (i - start) / self.sample_rate * 1e6
                    })
                in_burst = False
        return bursts

    def analyze_keystroke_pattern(self, bursts):
        """Analyze USB HID keystroke timing pattern."""
        if len(bursts) < 3:
            return {'is_injection': False, 'reason': 'Too few events'}
        # Measure inter-keystroke timing
        intervals = []
        for i in range(1, len(bursts)):
            interval = (bursts[i]['start'] - bursts[i-1]['end']) / self.sample_rate * 1e3
            intervals.append(interval)
        if not intervals:
            return {'is_injection': False, 'reason': 'No intervals'}
        intervals = np.array(intervals)
        mean_interval = np.mean(intervals)
        std_interval = np.std(intervals)
        cv = std_interval / (mean_interval + 1e-10)
        # Human typing has high variance (CV > 0.3)
        # BadUSB has very low variance (CV < 0.1)
        is_injection = cv < 0.15 and mean_interval < 50
        return {
            'is_injection': is_injection,
            'mean_interval_ms': mean_interval,
            'std_interval_ms': std_interval,
            'cv': cv,
            'keystroke_rate': 1000 / mean_interval if mean_interval > 0 else 0,
            'burst_count': len(bursts),
            'reason': 'Inhuman regularity' if is_injection else 'Normal typing pattern'
        }

    def capture_baseline(self, n_avg=10):
        """Capture USB EM baseline (no HID device)."""
        print("[BASELINE] Capturing USB EM baseline...")
        spectra = []
        for _ in range(n_avg):
            samples = self.capture()
            _, psd = self.compute_spectrum(samples)
            spectra.append(psd)
        self.baseline_usb_signature = np.mean(spectra, axis=0)
        print("[BASELINE] Done")

    def detect_new_usb_device(self, samples):
        """Detect new USB device attachment from EM change."""
        if self.baseline_usb_signature is None:
            return False, 0
        _, psd = self.compute_spectrum(samples)
        diff = psd - self.baseline_usb_signature
        excess = np.sum(diff[diff > 5])
        return excess > 100, excess

    def run_detection(self, duration=20):
        self.init_sdr()
        print(f"[DUCKY] Rubber Ducky / BadUSB Detector")
        print(f"  Monitoring USB EM emissions at {self.center_freq/1e6:.1f} MHz")

        self.capture_baseline()

        print(f"\n--- Monitoring for HID Injection ({duration}s) ---")
        start = time.time()
        alerts = 0
        while time.time() - start < duration:
            samples = self.capture()
            # Check for new device
            new_device, excess = self.detect_new_usb_device(samples)
            if new_device:
                print(f"  [!] New USB device detected (EM excess={excess:.0f})")
            # Analyze keystroke pattern
            bursts = self.detect_usb_activity(samples)
            analysis = self.analyze_keystroke_pattern(bursts)
            if analysis['is_injection']:
                alerts += 1
                print(f"  [ALERT] HID INJECTION DETECTED!")
                print(f"    Rate: {analysis['keystroke_rate']:.0f} keys/sec")
                print(f"    CV: {analysis['cv']:.4f} (inhuman regularity)")
                print(f"    Bursts: {analysis['burst_count']}")
            elif bursts:
                print(f"  Normal USB: {len(bursts)} events, "
                      f"CV={analysis['cv']:.3f}")
            time.sleep(0.5)

        print(f"\n[RESULT] {alerts} injection alerts in {duration}s")
        if alerts > 0:
            print("[WARN] BadUSB/Rubber Ducky device may be active!")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Rubber Ducky Detector SDR')
    parser.add_argument('-f', '--freq', type=float, default=480e6)
    parser.add_argument('-d', '--duration', type=int, default=20)
    args = parser.parse_args()

    det = RubberDuckyDetector(args.freq)
    try:
        det.run_detection(args.duration)
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        det.close()

if __name__ == '__main__':
    main()
