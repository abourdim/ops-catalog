#!/usr/bin/env python3
"""Evil Firmware Flasher - SDR Companion
Monitors RF emissions during firmware flashing to detect tampering,
unauthorized wireless bootloaders, and covert firmware update channels.
FOR AUTHORIZED SECURITY TESTING ONLY.
"""

import numpy as np
from scipy import signal
from scipy.fft import fft, fftfreq
import time
import argparse

CENTER_FREQ = 2.4e9
SAMPLE_RATE = 2e6
GAIN = 40
NUM_SAMPLES = 256 * 1024

class FirmwareFlashMonitor:
    """Monitors RF during firmware operations for security anomalies."""

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
            print(f"[SDR] Initialized at {self.center_freq/1e9:.2f} GHz")
        except (ImportError, Exception) as e:
            print(f"[SIM] Simulated mode: {e}")
            self.sdr = None

    def capture(self):
        if self.sdr:
            return self.sdr.read_samples(NUM_SAMPLES)
        t = np.arange(NUM_SAMPLES) / self.sample_rate
        sig = 0.01 * (np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES))
        # Simulate occasional burst (wireless bootloader)
        if np.random.random() > 0.7:
            burst_start = np.random.randint(0, NUM_SAMPLES - 10000)
            burst_freq = np.random.uniform(-0.5e6, 0.5e6)
            sig[burst_start:burst_start+10000] += 0.5 * np.exp(
                2j * np.pi * burst_freq * t[burst_start:burst_start+10000])
        return sig

    def compute_spectrum(self, samples):
        window = signal.windows.blackmanharris(len(samples))
        spec = fft(samples * window)
        freqs = fftfreq(len(samples), 1 / self.sample_rate)
        psd = 20 * np.log10(np.abs(spec) + 1e-12)
        return freqs, psd

    def capture_baseline(self):
        print("[BASELINE] Capturing RF baseline (device idle)...")
        samples = self.capture()
        _, self.baseline_spectrum = self.compute_spectrum(samples)
        print("[BASELINE] Done")

    def detect_anomalies(self, threshold_dB=10):
        samples = self.capture()
        freqs, current_psd = self.compute_spectrum(samples)
        if self.baseline_spectrum is None:
            return freqs, current_psd, []
        diff = current_psd - self.baseline_spectrum
        anomalies = []
        for i in range(len(diff)):
            if diff[i] > threshold_dB:
                anomalies.append({
                    'freq_offset': freqs[i],
                    'power_above_baseline': diff[i],
                    'absolute_power': current_psd[i]
                })
        return freqs, diff, anomalies

    def detect_wireless_bootloader(self, samples):
        """Detect patterns consistent with OTA firmware update protocols."""
        analytic = signal.hilbert(np.real(samples))
        envelope = np.abs(analytic)
        # Look for periodic bursts (typical of packet-based OTA)
        autocorr = np.correlate(envelope[:10000], envelope[:10000], mode='full')
        autocorr = autocorr[len(autocorr)//2:]
        peaks = signal.find_peaks(autocorr, height=np.max(autocorr)*0.3, distance=100)[0]
        if len(peaks) > 2:
            period = np.mean(np.diff(peaks)) / self.sample_rate * 1e3
            return True, period
        return False, 0

    def monitor_flash_session(self, duration=30):
        """Monitor RF during a firmware flash session."""
        self.init_sdr()
        self.capture_baseline()
        print(f"\n[MONITOR] Watching for RF anomalies during flash ({duration}s)...")

        start = time.time()
        alert_count = 0
        while time.time() - start < duration:
            freqs, diff, anomalies = self.detect_anomalies()
            samples = self.capture()
            bootloader, period = self.detect_wireless_bootloader(samples)

            if anomalies:
                alert_count += len(anomalies)
                for a in anomalies[:3]:
                    print(f"  [!] Emission at {a['freq_offset']/1e3:+.0f} kHz, "
                          f"{a['power_above_baseline']:.1f} dB above baseline")
            if bootloader:
                print(f"  [!!] Wireless bootloader pattern detected! Period: {period:.1f} ms")
                alert_count += 5

            time.sleep(0.5)

        print(f"\n[RESULT] Session complete: {alert_count} alerts in {duration}s")
        if alert_count > 10:
            print("[WARN] Significant RF activity during flash - investigate!")
        else:
            print("[OK] No suspicious RF activity detected")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Firmware Flash RF Monitor')
    parser.add_argument('-f', '--freq', type=float, default=2.4e9)
    parser.add_argument('-d', '--duration', type=int, default=30)
    args = parser.parse_args()

    mon = FirmwareFlashMonitor(args.freq)
    try:
        mon.monitor_flash_session(args.duration)
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        mon.close()

if __name__ == '__main__':
    main()
