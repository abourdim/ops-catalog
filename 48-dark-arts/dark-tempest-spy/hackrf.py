#!/usr/bin/env python3
"""TEMPEST Spy - SDR Companion
Captures and reconstructs electromagnetic emanations from displays
and cables using SDR (Van Eck phreaking / TEMPEST attack simulation).
FOR AUTHORIZED SECURITY TESTING ONLY.
"""

import numpy as np
from scipy import signal
from scipy.fft import fft, fftfreq
import time
import argparse

CENTER_FREQ = 400e6   # VGA/HDMI harmonic region
SAMPLE_RATE = 2.4e6
GAIN = 49
NUM_SAMPLES = 512 * 1024

class TEMPESTReceiver:
    """Captures and analyzes EM emanations from display equipment."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.pixel_clock = 25.175e6  # VGA 640x480 pixel clock
        self.h_pixels = 640
        self.v_lines = 480

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
        # Simulate display EM leakage
        h_rate = self.pixel_clock / 800  # Horizontal scan rate
        v_rate = h_rate / 525  # Vertical scan rate
        sig = 0.3 * np.sin(2 * np.pi * h_rate * t)  # Horizontal sync harmonic
        sig += 0.1 * np.sin(2 * np.pi * v_rate * t)  # Vertical sync
        # Add pixel data modulation
        pixel_pattern = np.random.choice([0, 0.5, 1.0], size=NUM_SAMPLES // 10)
        pixel_up = np.repeat(pixel_pattern, 10)[:NUM_SAMPLES]
        sig += 0.05 * pixel_up * np.sin(2 * np.pi * self.pixel_clock / 10 * t)
        sig += 0.02 * np.random.randn(NUM_SAMPLES)
        return sig + 1j * 0.01 * np.random.randn(NUM_SAMPLES)

    def detect_display_emissions(self, samples):
        """Detect display refresh rate harmonics."""
        freqs, psd = self.compute_spectrum(samples)
        peaks = signal.find_peaks(psd[:len(psd)//2], height=np.median(psd) + 15,
                                  distance=100)[0]
        harmonics = []
        for p in peaks:
            harmonics.append({
                'freq': freqs[p],
                'power': psd[p],
                'possible_source': self.identify_harmonic(freqs[p])
            })
        return harmonics

    def identify_harmonic(self, freq):
        """Identify possible source of harmonic."""
        known_rates = {
            31.5e3: "VGA H-sync (640x480@60)",
            48.4e3: "HD H-sync (1280x720@60)",
            67.5e3: "FHD H-sync (1920x1080@60)",
            60: "V-sync 60Hz",
            25.175e6: "VGA pixel clock",
            148.5e6: "HDMI 1080p pixel clock"
        }
        for rate, name in known_rates.items():
            for n in range(1, 20):
                if abs(abs(freq) - n * rate) < rate * 0.01:
                    return f"{name} x{n}"
        return "Unknown"

    def compute_spectrum(self, samples):
        window = signal.windows.blackmanharris(len(samples))
        spec = fft(np.real(samples) * window)
        freqs = fftfreq(len(samples), 1 / self.sample_rate)
        psd = 20 * np.log10(np.abs(spec) + 1e-12)
        return freqs, psd

    def reconstruct_scanlines(self, samples, h_rate=31.5e3):
        """Attempt to reconstruct display scanlines from EM emanation."""
        # Demodulate AM envelope
        envelope = np.abs(signal.hilbert(np.real(samples)))
        # Reshape into scanlines
        samples_per_line = int(self.sample_rate / h_rate)
        n_lines = len(envelope) // samples_per_line
        if n_lines == 0:
            return None
        scanlines = envelope[:n_lines * samples_per_line].reshape(n_lines, samples_per_line)
        # Downsample each line to pixel resolution
        pixels_per_line = min(self.h_pixels, samples_per_line)
        image = np.zeros((n_lines, pixels_per_line))
        for i in range(n_lines):
            image[i] = signal.resample(scanlines[i], pixels_per_line)
        return image

    def assess_vulnerability(self, harmonics):
        """Assess TEMPEST vulnerability level."""
        strong_harmonics = [h for h in harmonics if h['power'] > -20]
        identified = [h for h in harmonics if 'Unknown' not in h['possible_source']]
        score = len(strong_harmonics) * 2 + len(identified) * 3
        if score > 15:
            return "HIGH", score
        elif score > 5:
            return "MEDIUM", score
        return "LOW", score

    def run_analysis(self, duration=15):
        self.init_sdr()
        print(f"[TEMPEST] EM Emanation Analysis")
        print(f"  Center: {self.center_freq/1e6:.1f} MHz")

        # Detect harmonics
        print(f"\n--- Display Emission Detection ---")
        samples = self.capture()
        harmonics = self.detect_display_emissions(samples)
        for h in harmonics[:10]:
            print(f"  {h['freq']/1e3:+8.1f} kHz  {h['power']:.1f} dB  {h['possible_source']}")

        # Vulnerability assessment
        level, score = self.assess_vulnerability(harmonics)
        print(f"\n--- TEMPEST Vulnerability: {level} (score={score}) ---")

        # Scanline reconstruction attempt
        print(f"\n--- Scanline Reconstruction ---")
        image = self.reconstruct_scanlines(samples)
        if image is not None:
            print(f"  Reconstructed: {image.shape[0]} lines x {image.shape[1]} pixels")
            print(f"  Dynamic range: {np.ptp(image):.2f}")
        else:
            print("  Insufficient data for reconstruction")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='TEMPEST EM Receiver')
    parser.add_argument('-f', '--freq', type=float, default=400e6)
    args = parser.parse_args()

    rx = TEMPESTReceiver(args.freq)
    try:
        rx.run_analysis()
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        rx.close()

if __name__ == '__main__':
    main()
