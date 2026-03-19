#!/usr/bin/env python3
"""Casimir Detector - RTL-SDR/HackRF Companion
Detects Casimir-effect analogues in RF by measuring mode suppression
between closely-spaced conductive plates acting as a waveguide filter.
"""

import numpy as np
from scipy import signal, constants, special
from scipy.fft import fft, fftfreq
import time
import argparse

# SDR Configuration
CENTER_FREQ = 5.8e9       # 5.8 GHz band
SAMPLE_RATE = 2.4e6
GAIN = 40
NUM_SAMPLES = 256 * 1024

class CasimirDetector:
    """Detects RF Casimir-like effects from cavity mode suppression."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.plate_gap = 0.03      # 3 cm gap
        self.plate_area = 0.01     # 1 cm^2

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

    def cavity_modes(self, n_max=20):
        """Calculate allowed cavity modes between parallel plates."""
        modes = []
        for n in range(1, n_max + 1):
            freq = n * constants.c / (2 * self.plate_gap)
            modes.append({'n': n, 'freq': freq, 'freq_GHz': freq / 1e9})
        return modes

    def mode_density_ratio(self, freq):
        """Ratio of cavity mode density to free-space mode density."""
        # Free space: continuous, cavity: discrete
        mode_spacing = constants.c / (2 * self.plate_gap)
        n = freq / mode_spacing
        # Below first mode, density is zero (Casimir suppression)
        if freq < mode_spacing:
            return 0
        return np.floor(n) / n  # Step function approximation

    def casimir_pressure_rf(self):
        """Calculate RF Casimir pressure analogue."""
        # True Casimir: F/A = -pi^2 * hbar * c / (240 * d^4)
        true_casimir = (np.pi**2 * constants.hbar * constants.c /
                       (240 * self.plate_gap**4))
        # RF analogue: pressure from mode exclusion
        cutoff = constants.c / (2 * self.plate_gap)
        # Integrate suppressed zero-point energy density
        freqs = np.linspace(1e6, cutoff, 1000)
        suppressed_energy = 0
        for f in freqs:
            suppressed_energy += 0.5 * constants.h * f * (1 - self.mode_density_ratio(f))
        df = freqs[1] - freqs[0]
        pressure_rf = suppressed_energy * df / self.plate_gap
        return true_casimir, pressure_rf

    def measure_mode_suppression(self):
        """Measure mode suppression in cavity via SDR."""
        if self.sdr:
            samples = self.sdr.read_samples(NUM_SAMPLES)
        else:
            t = np.arange(NUM_SAMPLES) / self.sample_rate
            sig = np.zeros(NUM_SAMPLES, dtype=complex)
            modes = self.cavity_modes()
            for m in modes:
                if abs(m['freq'] - self.center_freq) < self.sample_rate / 2:
                    f_off = m['freq'] - self.center_freq
                    amp = 1.0 / m['n']  # Mode amplitude decreases with n
                    sig += amp * np.exp(2j * np.pi * f_off * t)
            # Suppress modes below cutoff (Casimir effect)
            cutoff_mode = self.center_freq * 2 * self.plate_gap / constants.c
            suppression = max(0, 1 - 1 / (cutoff_mode + 0.1))
            sig *= suppression
            sig += 0.02 * (np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES))
            samples = sig

        window = signal.windows.blackmanharris(len(samples))
        spectrum = fft(samples * window)
        freqs = fftfreq(len(samples), 1 / self.sample_rate) + self.center_freq
        psd = 20 * np.log10(np.abs(spectrum) + 1e-12)
        return freqs, psd

    def gap_sweep(self, gaps=None):
        """Sweep plate gap and measure mode suppression."""
        if gaps is None:
            gaps = np.linspace(0.005, 0.1, 30)
        results = []
        for d in gaps:
            self.plate_gap = d
            cutoff = constants.c / (2 * d)
            n_modes_below = max(0, int(self.center_freq / cutoff))
            suppression = self.mode_density_ratio(self.center_freq)
            true_c, rf_c = self.casimir_pressure_rf()
            results.append({
                'gap_mm': d * 1000,
                'cutoff_GHz': cutoff / 1e9,
                'modes_below_center': n_modes_below,
                'mode_density': suppression,
                'casimir_Pa': true_c,
                'rf_analogue_Pa': rf_c
            })
        return results

    def run_measurement(self):
        """Run Casimir detection experiment."""
        self.init_sdr()
        print(f"[CASIMIR] RF Casimir Effect Detector")
        print(f"  Plate gap:    {self.plate_gap*1000:.1f} mm")
        print(f"  Center freq:  {self.center_freq/1e9:.2f} GHz")

        # Cavity modes
        print(f"\n--- Cavity Modes ---")
        modes = self.cavity_modes(10)
        for m in modes:
            in_band = abs(m['freq'] - self.center_freq) < self.sample_rate / 2
            tag = " <-- IN BAND" if in_band else ""
            print(f"  n={m['n']:2d}  f={m['freq_GHz']:.3f} GHz{tag}")

        # Casimir pressure
        print(f"\n--- Casimir Pressure ---")
        true_c, rf_c = self.casimir_pressure_rf()
        print(f"  True QED Casimir: {true_c:.2e} Pa")
        print(f"  RF analogue:      {rf_c:.2e} Pa")

        # Gap sweep
        print(f"\n--- Gap Sweep ---")
        self.plate_gap = 0.03  # Reset
        results = self.gap_sweep()
        for r in results[::5]:
            print(f"  gap={r['gap_mm']:5.1f} mm  cutoff={r['cutoff_GHz']:.2f} GHz  "
                  f"modes={r['modes_below_center']:2d}  density={r['mode_density']:.3f}")

        # Mode suppression measurement
        print(f"\n--- Measured Mode Spectrum ---")
        freqs, psd = self.measure_mode_suppression()
        peak_idx = np.argmax(psd[:len(psd)//2])
        noise_floor = np.median(psd)
        print(f"  Peak:        {psd[peak_idx]:.1f} dB at {freqs[peak_idx]/1e9:.4f} GHz")
        print(f"  Noise floor: {noise_floor:.1f} dB")
        print(f"  Dynamic range: {psd[peak_idx] - noise_floor:.1f} dB")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Casimir Effect RF Detector')
    parser.add_argument('-f', '--freq', type=float, default=5.8e9, help='Center freq Hz')
    parser.add_argument('-g', '--gap', type=float, default=30, help='Plate gap mm')
    args = parser.parse_args()

    det = CasimirDetector(args.freq)
    det.plate_gap = args.gap / 1000
    try:
        det.run_measurement()
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        det.close()


if __name__ == '__main__':
    main()
