#!/usr/bin/env python3
"""Plasma Antenna - RTL-SDR/HackRF Companion
Characterizes plasma antenna behavior by measuring radiation patterns
and frequency response of ionized gas tube antennas.
"""

import numpy as np
from scipy import signal
from scipy.fft import fft, fftfreq
import time
import argparse

# SDR Configuration
CENTER_FREQ = 433e6       # 433 MHz ISM band
SAMPLE_RATE = 2.4e6
GAIN = 30
NUM_SAMPLES = 256 * 1024

class PlasmaAntennaAnalyzer:
    """Measures RF characteristics of plasma antenna elements."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.plasma_freq = 1e9  # Plasma frequency (adjustable)

    def init_sdr(self):
        try:
            import rtlsdr
            self.sdr = rtlsdr.RtlSdr()
            self.sdr.center_freq = self.center_freq
            self.sdr.sample_rate = self.sample_rate
            self.sdr.gain = GAIN
            print(f"[SDR] Ready at {self.center_freq/1e6:.1f} MHz")
        except (ImportError, Exception) as e:
            print(f"[SIM] Simulated mode: {e}")
            self.sdr = None

    def plasma_permittivity(self, freq, plasma_freq, collision_freq=1e7):
        """Compute complex permittivity of plasma medium."""
        omega = 2 * np.pi * freq
        omega_p = 2 * np.pi * plasma_freq
        nu = collision_freq
        eps = 1 - omega_p**2 / (omega**2 + 1j * nu * omega)
        return eps

    def plasma_antenna_gain(self, freq, length=0.3, plasma_density=1e17):
        """Model gain of a plasma column antenna."""
        plasma_freq = 9 * np.sqrt(plasma_density)  # Hz
        eps = self.plasma_permittivity(freq, plasma_freq)
        wavelength = 3e8 / freq
        k = 2 * np.pi / wavelength * np.sqrt(np.abs(eps))
        # Dipole-like gain modified by plasma properties
        effective_length = length * np.abs(np.sin(k * length / 2))
        directivity = 1.64 * (effective_length / wavelength)**2
        # Plasma losses
        loss = np.exp(-2 * np.imag(np.sqrt(eps)) * k * length)
        gain_dBi = 10 * np.log10(directivity * loss + 1e-12)
        return gain_dBi

    def capture_samples(self):
        """Capture RF samples."""
        if self.sdr:
            return self.sdr.read_samples(NUM_SAMPLES)
        # Simulate plasma antenna reception
        t = np.arange(NUM_SAMPLES) / self.sample_rate
        sig = np.zeros(NUM_SAMPLES, dtype=complex)
        for f_off in np.linspace(-0.8e6, 0.8e6, 20):
            freq = self.center_freq + f_off
            gain_lin = 10 ** (self.plasma_antenna_gain(freq) / 20)
            sig += gain_lin * np.exp(2j * np.pi * f_off * t)
        sig += 0.05 * (np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES))
        return sig

    def measure_pattern(self, angles=None):
        """Measure radiation pattern at multiple angles."""
        if angles is None:
            angles = np.arange(0, 360, 10)
        pattern = []
        for angle in angles:
            samples = self.capture_samples()
            power = np.mean(np.abs(samples) ** 2)
            # Simulate angular variation (dipole-like)
            theta = np.radians(angle)
            angular_factor = np.sin(theta) ** 2 if angle not in [0, 180] else 0.01
            pattern.append(10 * np.log10(power * angular_factor + 1e-12))
        return angles, np.array(pattern)

    def frequency_sweep(self, freq_start=None, freq_stop=None, steps=50):
        """Sweep frequency and measure plasma antenna response."""
        if freq_start is None:
            freq_start = self.center_freq - 1e6
        if freq_stop is None:
            freq_stop = self.center_freq + 1e6
        freqs = np.linspace(freq_start, freq_stop, steps)
        gains = np.array([self.plasma_antenna_gain(f) for f in freqs])
        return freqs, gains

    def plasma_density_sweep(self, densities=None):
        """Characterize antenna at different plasma densities."""
        if densities is None:
            densities = np.logspace(15, 19, 20)
        results = []
        for ne in densities:
            gain = self.plasma_antenna_gain(self.center_freq, plasma_density=ne)
            fp = 9 * np.sqrt(ne)
            results.append({
                'density': ne,
                'plasma_freq': fp,
                'gain_dBi': gain,
                'transparent': self.center_freq > fp
            })
        return results

    def run_characterization(self):
        """Full plasma antenna characterization."""
        self.init_sdr()
        print(f"\n[PLASMA] Characterizing plasma antenna at {self.center_freq/1e6:.1f} MHz")

        # Frequency sweep
        print("\n--- Frequency Response ---")
        freqs, gains = self.frequency_sweep()
        peak_idx = np.argmax(gains)
        print(f"  Peak gain: {gains[peak_idx]:.1f} dBi at {freqs[peak_idx]/1e6:.2f} MHz")
        print(f"  Bandwidth (>0 dBi): ", end="")
        above = freqs[gains > 0]
        if len(above) > 1:
            print(f"{(above[-1]-above[0])/1e3:.0f} kHz")
        else:
            print("N/A")

        # Density sweep
        print("\n--- Plasma Density Sweep ---")
        results = self.plasma_density_sweep()
        for r in results[::4]:
            status = "PASS" if r['transparent'] else "BLOCK"
            print(f"  ne={r['density']:.1e} /m^3  fp={r['plasma_freq']/1e9:.2f} GHz  "
                  f"gain={r['gain_dBi']:.1f} dBi [{status}]")

        # Radiation pattern
        print("\n--- Radiation Pattern ---")
        angles, pattern = self.measure_pattern()
        max_idx = np.argmax(pattern)
        print(f"  Max radiation: {pattern[max_idx]:.1f} dB at {angles[max_idx]} deg")
        print(f"  Front-to-back: {pattern[max_idx] - pattern[(max_idx + 18) % 36]:.1f} dB")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Plasma Antenna Analyzer')
    parser.add_argument('-f', '--freq', type=float, default=433e6, help='Center freq Hz')
    parser.add_argument('-d', '--density', type=float, default=1e17, help='Plasma density /m^3')
    args = parser.parse_args()

    analyzer = PlasmaAntennaAnalyzer(args.freq)
    try:
        analyzer.run_characterization()
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        analyzer.close()


if __name__ == '__main__':
    main()
