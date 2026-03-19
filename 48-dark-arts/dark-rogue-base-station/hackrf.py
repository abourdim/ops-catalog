#!/usr/bin/env python3
"""Rogue Base Station - SDR Companion
Detects rogue base stations and IMSI catchers by scanning cellular bands
and analyzing cell tower broadcast characteristics for anomalies.
FOR AUTHORIZED SECURITY TESTING ONLY.
"""

import numpy as np
from scipy import signal
from scipy.fft import fft, fftfreq
import time
import argparse

CENTER_FREQ = 935e6   # GSM 900 downlink
SAMPLE_RATE = 2e6
GAIN = 40
NUM_SAMPLES = 256 * 1024

class RogueBaseStationDetector:
    """Detects rogue cellular base stations via SDR."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.known_towers = {}

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
        # Simulate GSM BCCH carriers
        for arfcn_offset in [-600e3, -400e3, 0, 200e3, 800e3]:
            power = np.random.uniform(0.1, 0.8)
            sig += power * np.exp(2j * np.pi * arfcn_offset * t)
        # Simulate rogue station (unusual power/frequency)
        if np.random.random() > 0.5:
            sig += 1.5 * np.exp(2j * np.pi * 100e3 * t)
        return sig

    def scan_carriers(self, samples):
        """Detect active carriers in the band."""
        freqs, psd = self.compute_spectrum(samples)
        noise_floor = np.median(psd)
        peaks = signal.find_peaks(psd[:len(psd)//2], height=noise_floor + 10,
                                  distance=50)[0]
        carriers = []
        for p in peaks:
            carriers.append({
                'freq_offset': freqs[p],
                'freq_abs': self.center_freq + freqs[p],
                'power': psd[p],
                'snr': psd[p] - noise_floor
            })
        return carriers, noise_floor

    def compute_spectrum(self, samples):
        window = signal.windows.blackmanharris(len(samples))
        spec = fft(samples * window)
        freqs = fftfreq(len(samples), 1 / self.sample_rate)
        psd = 20 * np.log10(np.abs(spec) + 1e-12)
        return freqs, psd

    def classify_carrier(self, carrier):
        """Classify carrier as legitimate or suspicious."""
        suspicious_reasons = []
        # Check 1: Unusually high power (IMSI catcher often overpowers)
        if carrier['snr'] > 40:
            suspicious_reasons.append(f"Very high SNR ({carrier['snr']:.0f} dB)")
        # Check 2: Non-standard frequency offset
        gsm_spacing = 200e3
        nearest_arfcn = round(carrier['freq_offset'] / gsm_spacing) * gsm_spacing
        freq_error = abs(carrier['freq_offset'] - nearest_arfcn)
        if freq_error > 10e3:
            suspicious_reasons.append(f"Freq error {freq_error/1e3:.1f} kHz")
        return suspicious_reasons

    def track_tower(self, carrier):
        """Track tower over time for behavior analysis."""
        key = f"{carrier['freq_offset']/1e3:.0f}kHz"
        if key not in self.known_towers:
            self.known_towers[key] = {
                'first_seen': time.time(),
                'power_history': [],
                'freq_history': []
            }
        self.known_towers[key]['power_history'].append(carrier['power'])
        self.known_towers[key]['freq_history'].append(carrier['freq_offset'])

    def analyze_tower_behavior(self):
        """Detect anomalous tower behavior over time."""
        anomalies = []
        for key, tower in self.known_towers.items():
            if len(tower['power_history']) < 3:
                continue
            powers = np.array(tower['power_history'])
            power_var = np.std(powers)
            freq_var = np.std(tower['freq_history'])
            # Rapid power changes suggest portable device
            if power_var > 5:
                anomalies.append(f"{key}: Power variance {power_var:.1f} dB (mobile?)")
            # Frequency drift suggests cheap oscillator
            if freq_var > 5e3:
                anomalies.append(f"{key}: Freq drift {freq_var/1e3:.1f} kHz (cheap HW?)")
        return anomalies

    def band_sweep(self, bands=None):
        """Sweep cellular bands for comprehensive detection."""
        if bands is None:
            bands = {
                'GSM900-DL': 935e6, 'GSM1800-DL': 1805e6,
                'UMTS-DL': 2110e6, 'LTE-B7-DL': 2620e6
            }
        results = {}
        for name, freq in bands.items():
            self.center_freq = freq
            if self.sdr:
                self.sdr.center_freq = freq
            samples = self.capture()
            carriers, noise = self.scan_carriers(samples)
            suspicious = sum(1 for c in carriers if self.classify_carrier(c))
            results[name] = {
                'freq': freq, 'carriers': len(carriers),
                'suspicious': suspicious, 'noise_floor': noise
            }
        return results

    def run_detection(self, duration=20):
        self.init_sdr()
        print(f"[ROGUE] Rogue Base Station Detector - SDR Mode")

        # Band sweep
        print(f"\n--- Cellular Band Sweep ---")
        bands = self.band_sweep()
        for name, r in bands.items():
            status = f" [!{r['suspicious']} SUSPICIOUS]" if r['suspicious'] > 0 else ""
            print(f"  {name:15s}: {r['carriers']} carriers, "
                  f"noise={r['noise_floor']:.0f} dB{status}")

        # Continuous monitoring
        self.center_freq = CENTER_FREQ
        if self.sdr:
            self.sdr.center_freq = CENTER_FREQ
        print(f"\n--- Monitoring {self.center_freq/1e6:.1f} MHz ({duration}s) ---")
        start = time.time()
        while time.time() - start < duration:
            samples = self.capture()
            carriers, _ = self.scan_carriers(samples)
            for c in carriers:
                reasons = self.classify_carrier(c)
                self.track_tower(c)
                if reasons:
                    print(f"  [SUSPECT] {c['freq_offset']/1e3:+.0f} kHz "
                          f"power={c['power']:.0f} dB: {', '.join(reasons)}")
            anomalies = self.analyze_tower_behavior()
            for a in anomalies:
                print(f"  [ANOMALY] {a}")
            time.sleep(1)

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Rogue Base Station Detector SDR')
    parser.add_argument('-f', '--freq', type=float, default=935e6)
    parser.add_argument('-d', '--duration', type=int, default=20)
    args = parser.parse_args()

    det = RogueBaseStationDetector(args.freq)
    try:
        det.run_detection(args.duration)
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        det.close()

if __name__ == '__main__':
    main()
