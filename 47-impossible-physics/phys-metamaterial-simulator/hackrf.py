#!/usr/bin/env python3
"""Metamaterial Simulator - RTL-SDR/HackRF Companion
Measures and simulates negative-index metamaterial RF behavior.
Analyzes S-parameters and transmission characteristics through metamaterial structures.
"""

import numpy as np
from scipy import signal, optimize
from scipy.fft import fft, fftfreq
import time
import argparse

# SDR Configuration
CENTER_FREQ = 2.4e9       # 2.4 GHz - metamaterial resonance band
SAMPLE_RATE = 2e6         # 2 MS/s
GAIN = 30
NUM_SAMPLES = 128 * 1024

class MetamaterialSimulator:
    """Simulates and measures metamaterial electromagnetic properties."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.reference_spectrum = None

    def init_sdr(self):
        try:
            import rtlsdr
            self.sdr = rtlsdr.RtlSdr()
            self.sdr.center_freq = self.center_freq
            self.sdr.sample_rate = self.sample_rate
            self.sdr.gain = GAIN
            print(f"[SDR] Initialized at {self.center_freq/1e9:.2f} GHz")
        except (ImportError, Exception) as e:
            print(f"[SDR] Simulated mode: {e}")
            self.sdr = None

    def capture_spectrum(self):
        """Capture RF spectrum around center frequency."""
        if self.sdr:
            samples = self.sdr.read_samples(NUM_SAMPLES)
        else:
            t = np.arange(NUM_SAMPLES) / self.sample_rate
            # Simulate metamaterial transmission with resonance dip
            freqs_sim = [0.3e6, 0.7e6, -0.5e6]
            samples = np.zeros(NUM_SAMPLES, dtype=complex)
            for f in freqs_sim:
                samples += np.exp(2j * np.pi * f * t) * (0.5 + 0.5 * np.random.randn())
            # Add lorentzian absorption at resonance
            samples *= (1 - 0.8 * np.exp(-((t * self.sample_rate - NUM_SAMPLES/2)**2) / 1000))
            samples += 0.1 * (np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES))
        return samples

    def compute_spectrum(self, samples):
        """Compute power spectral density."""
        window = signal.windows.blackmanharris(len(samples))
        spectrum = fft(samples * window)
        freqs = fftfreq(len(samples), 1 / self.sample_rate)
        psd = 20 * np.log10(np.abs(spectrum) + 1e-12)
        return freqs, psd

    def lorentz_model(self, f, f0, gamma, amp, offset):
        """Lorentzian resonance model for metamaterial."""
        return offset - amp * gamma**2 / ((f - f0)**2 + gamma**2)

    def fit_resonance(self, freqs, psd):
        """Fit Lorentzian resonance to find metamaterial parameters."""
        # Use positive frequency half
        mask = freqs > 0
        f_pos = freqs[mask]
        p_pos = psd[mask]
        try:
            popt, pcov = optimize.curve_fit(
                self.lorentz_model, f_pos, p_pos,
                p0=[f_pos[np.argmin(p_pos)], 50e3, 20, np.max(p_pos)],
                maxfev=5000
            )
            return {
                'resonance_freq': popt[0],
                'bandwidth': abs(popt[1]) * 2,
                'depth_dB': abs(popt[2]),
                'q_factor': abs(popt[0]) / (abs(popt[1]) * 2),
                'fit_params': popt
            }
        except Exception:
            return None

    def compute_effective_parameters(self, resonance):
        """Derive effective permittivity and permeability from resonance."""
        if resonance is None:
            return None
        f0 = resonance['resonance_freq']
        Q = resonance['q_factor']
        # Drude-Lorentz model for effective parameters
        f_range = np.linspace(f0 * 0.5, f0 * 1.5, 200)
        omega = 2 * np.pi * f_range
        omega0 = 2 * np.pi * f0
        gamma = omega0 / Q
        # Effective permittivity (electric metamaterial)
        eps_eff = 1 - (omega0**2) / (omega**2 - omega0**2 + 1j * gamma * omega)
        # Effective permeability (magnetic metamaterial - SRR)
        mu_eff = 1 - 0.4 * omega0**2 / (omega**2 - (0.8 * omega0)**2 + 1j * gamma * omega)
        # Refractive index
        n_eff = np.sqrt(eps_eff * mu_eff)
        return {
            'frequencies': f_range,
            'epsilon': eps_eff,
            'mu': mu_eff,
            'n_eff': n_eff,
            'negative_index_band': f_range[np.real(n_eff) < 0]
        }

    def capture_reference(self):
        """Capture reference spectrum without metamaterial sample."""
        print("[REF] Capturing reference (no metamaterial)...")
        samples = self.capture_spectrum()
        _, self.reference_spectrum = self.compute_spectrum(samples)
        print("[REF] Reference captured")

    def measure_transmission(self):
        """Measure transmission through metamaterial sample."""
        samples = self.capture_spectrum()
        freqs, psd = self.compute_spectrum(samples)
        if self.reference_spectrum is not None:
            s21_dB = psd - self.reference_spectrum
        else:
            s21_dB = psd
        return freqs, s21_dB

    def run_analysis(self, num_sweeps=5):
        """Run full metamaterial characterization."""
        self.init_sdr()
        self.capture_reference()
        print("\n[ANALYSIS] Insert metamaterial sample, starting sweep...")
        time.sleep(1)

        for i in range(num_sweeps):
            freqs, s21 = self.measure_transmission()
            resonance = self.fit_resonance(freqs, s21)
            if resonance:
                params = self.compute_effective_parameters(resonance)
                print(f"\n--- Sweep {i+1}/{num_sweeps} ---")
                print(f"  Resonance: {resonance['resonance_freq']/1e3:.1f} kHz offset")
                print(f"  Q-factor:  {resonance['q_factor']:.1f}")
                print(f"  Depth:     {resonance['depth_dB']:.1f} dB")
                if params and len(params['negative_index_band']) > 0:
                    bw = params['negative_index_band']
                    print(f"  Neg-index band: {bw[0]/1e3:.1f} - {bw[-1]/1e3:.1f} kHz")
                else:
                    print("  No negative-index band detected")
            else:
                print(f"\n--- Sweep {i+1}: No resonance detected ---")
            time.sleep(0.5)

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Metamaterial RF Simulator')
    parser.add_argument('-f', '--freq', type=float, default=2.4e9, help='Center freq Hz')
    parser.add_argument('-n', '--sweeps', type=int, default=5, help='Number of sweeps')
    args = parser.parse_args()

    sim = MetamaterialSimulator(args.freq)
    try:
        sim.run_analysis(args.sweeps)
    except KeyboardInterrupt:
        print("\n[STOP] Interrupted")
    finally:
        sim.close()


if __name__ == '__main__':
    main()
