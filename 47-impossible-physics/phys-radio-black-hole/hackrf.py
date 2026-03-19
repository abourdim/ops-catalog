#!/usr/bin/env python3
"""Radio Black Hole - RTL-SDR/HackRF Companion
Simulates acoustic/RF black hole analogues by creating frequency-dependent
absorption profiles that mimic event horizon behavior.
"""

import numpy as np
from scipy import signal, special
from scipy.fft import fft, ifft, fftfreq
import time
import argparse

# SDR Configuration
CENTER_FREQ = 100e6
SAMPLE_RATE = 2.4e6
GAIN = 30
NUM_SAMPLES = 256 * 1024

class RadioBlackHole:
    """Simulates RF black hole analogue with event horizon effects."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.schwarzschild_freq = 0.5e6  # Analogue event horizon freq offset
        self.hawking_temp = 1e-3         # Analogue Hawking temperature parameter

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

    def gravitational_redshift(self, freq_offset, r_ratio):
        """Compute gravitational redshift analogue.
        r_ratio: distance/schwarzschild_radius
        """
        if r_ratio <= 1.0:
            return 0  # Inside horizon
        redshift_factor = np.sqrt(1 - 1 / r_ratio)
        return freq_offset * redshift_factor

    def absorption_profile(self, freq_offsets):
        """Compute black hole absorption cross-section vs frequency."""
        # Analogue of photon capture cross-section
        f_s = self.schwarzschild_freq
        sigma = np.zeros_like(freq_offsets)
        for i, f in enumerate(freq_offsets):
            r = abs(f) / f_s if f_s > 0 else 1e10
            if r < 1:
                sigma[i] = 1.0  # Total absorption inside horizon
            else:
                # Geometric optics approximation
                b_crit = 3 * np.sqrt(3) / 2  # Critical impact parameter
                sigma[i] = np.pi * (b_crit * f_s / abs(f + 1e-10))**2
                sigma[i] = min(sigma[i], 1.0)
        return sigma

    def hawking_radiation_spectrum(self, freqs, n_modes=1000):
        """Generate analogue Hawking radiation spectrum (thermal)."""
        # Planckian spectrum at Hawking temperature
        kT = self.hawking_temp
        spectrum = np.zeros(len(freqs))
        for i, f in enumerate(freqs):
            f_abs = abs(f) + 1e-3
            # Bose-Einstein distribution
            try:
                spectrum[i] = f_abs**3 / (np.exp(f_abs / kT) - 1)
            except (OverflowError, FloatingPointError):
                spectrum[i] = 0
        # Normalize
        if np.max(spectrum) > 0:
            spectrum /= np.max(spectrum)
        return spectrum

    def simulate_infall(self, duration_samples=None):
        """Simulate signal falling into RF black hole."""
        if duration_samples is None:
            duration_samples = NUM_SAMPLES
        t = np.arange(duration_samples) / self.sample_rate
        # Chirp signal with increasing redshift (falling into horizon)
        r = 10 * np.exp(-t * 5e4)  # Radial coordinate shrinking
        r = np.maximum(r, 1.001)   # Clamp just outside horizon
        freq_inst = 100e3 * np.sqrt(1 - 1 / r)  # Redshifted frequency
        amplitude = np.sqrt(1 - 1 / r)           # Dimming
        phase = 2 * np.pi * np.cumsum(freq_inst) / self.sample_rate
        sig = amplitude * np.exp(1j * phase)
        return t, sig, r

    def capture_and_analyze(self):
        """Capture RF signal near analogue black hole."""
        if self.sdr:
            samples = self.sdr.read_samples(NUM_SAMPLES)
        else:
            _, sig, _ = self.simulate_infall()
            hawking = self.hawking_temp * (np.random.randn(NUM_SAMPLES) +
                                           1j * np.random.randn(NUM_SAMPLES))
            samples = sig + hawking
        return samples

    def measure_redshift(self, samples):
        """Measure frequency shift (redshift) in captured signal."""
        # Instantaneous frequency estimation
        analytic = signal.hilbert(np.real(samples))
        inst_phase = np.unwrap(np.angle(analytic))
        inst_freq = np.diff(inst_phase) * self.sample_rate / (2 * np.pi)
        return inst_freq

    def run_simulation(self):
        """Run full radio black hole simulation."""
        self.init_sdr()
        print("[BLACK HOLE] RF Black Hole Analogue Simulation")
        print(f"  Horizon freq: {self.schwarzschild_freq/1e3:.0f} kHz offset")
        print(f"  Hawking temp:  {self.hawking_temp:.1e}")

        # Absorption profile
        print("\n--- Absorption Cross-Section ---")
        f_range = np.linspace(-1e6, 1e6, 100)
        sigma = self.absorption_profile(f_range)
        for i in range(0, len(f_range), 10):
            bar = '#' * int(sigma[i] * 40)
            print(f"  {f_range[i]/1e3:+7.0f} kHz | {bar} {sigma[i]:.2f}")

        # Infall simulation
        print("\n--- Signal Infall Trajectory ---")
        t, sig, r = self.simulate_infall(NUM_SAMPLES // 4)
        for idx in range(0, len(t), len(t) // 8):
            amp = np.abs(sig[idx])
            freq = np.angle(sig[min(idx+1, len(sig)-1)] * np.conj(sig[idx]))
            print(f"  t={t[idx]*1e6:.1f} us  r/rs={r[idx]:.3f}  "
                  f"amp={amp:.4f}  redshift={1-amp:.4f}")

        # Hawking radiation
        print("\n--- Analogue Hawking Radiation ---")
        freqs = np.linspace(0.01, 2, 50)
        hawking = self.hawking_radiation_spectrum(freqs)
        peak_idx = np.argmax(hawking)
        print(f"  Peak at: {freqs[peak_idx]:.2f} (normalized units)")
        print(f"  Wien displacement analogue: f_peak/T = {freqs[peak_idx]/self.hawking_temp:.1f}")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Radio Black Hole Simulator')
    parser.add_argument('-f', '--freq', type=float, default=100e6, help='Center freq Hz')
    parser.add_argument('--hawking', type=float, default=1e-3, help='Hawking temp param')
    args = parser.parse_args()

    bh = RadioBlackHole(args.freq)
    bh.hawking_temp = args.hawking
    try:
        bh.run_simulation()
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        bh.close()


if __name__ == '__main__':
    main()
