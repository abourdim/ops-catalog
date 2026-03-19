#!/usr/bin/env python3
"""EM Drive Simulator - RTL-SDR/HackRF Companion
Simulates the controversial EM drive (microwave resonant cavity thruster)
by measuring Q-factor, mode structure, and radiation pressure in RF cavities.
"""

import numpy as np
from scipy import signal, optimize, constants
from scipy.fft import fft, fftfreq
import time
import argparse

# SDR Configuration
CENTER_FREQ = 2.45e9      # 2.45 GHz magnetron frequency
SAMPLE_RATE = 2e6
GAIN = 30
NUM_SAMPLES = 128 * 1024

class EMDriveSimulator:
    """Simulates EM drive cavity resonance and thrust measurements."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.cavity_length = 0.23     # meters (frustum)
        self.large_radius = 0.14      # Large end radius
        self.small_radius = 0.08      # Small end radius
        self.input_power = 100        # Watts

    def init_sdr(self):
        try:
            import rtlsdr
            self.sdr = rtlsdr.RtlSdr()
            self.sdr.center_freq = self.center_freq
            self.sdr.sample_rate = self.sample_rate
            self.sdr.gain = GAIN
            print(f"[SDR] Initialized at {self.center_freq/1e9:.3f} GHz")
        except (ImportError, Exception) as e:
            print(f"[SIM] Simulated mode: {e}")
            self.sdr = None

    def frustum_modes(self, n_max=5, m_max=3):
        """Calculate resonant modes of frustum cavity (TE/TM)."""
        modes = []
        for n in range(1, n_max + 1):
            for m in range(0, m_max + 1):
                # Approximate: average of cylinder modes at each end
                freq_large = constants.c / (2 * np.pi * self.large_radius) * \
                            np.sqrt((n * np.pi / self.cavity_length) ** 2 +
                                    (m / self.large_radius) ** 2) / (2 * np.pi) * constants.c
                freq_small = constants.c / (2 * np.pi * self.small_radius) * \
                            np.sqrt((n * np.pi / self.cavity_length) ** 2 +
                                    (m / self.small_radius) ** 2) / (2 * np.pi) * constants.c
                freq_avg = (freq_large + freq_small) / 2
                # Simplified resonance calculation
                freq_res = constants.c * np.sqrt((n / (2 * self.cavity_length)) ** 2 +
                                                  (m / (np.pi * (self.large_radius + self.small_radius) / 2)) ** 2)
                modes.append({
                    'n': n, 'm': m,
                    'freq': freq_res,
                    'mode_type': f'TE{n}{m}' if m > 0 else f'TM{n}{m}'
                })
        modes.sort(key=lambda x: x['freq'])
        return modes

    def q_factor(self, freq, conductivity=5.8e7):
        """Estimate cavity Q-factor."""
        skin_depth = np.sqrt(2 / (2 * np.pi * freq * constants.mu_0 * conductivity))
        avg_radius = (self.large_radius + self.small_radius) / 2
        volume = np.pi * self.cavity_length * (self.large_radius ** 2 +
                 self.small_radius ** 2 + self.large_radius * self.small_radius) / 3
        surface = (np.pi * (self.large_radius + self.small_radius) *
                  np.sqrt((self.large_radius - self.small_radius) ** 2 +
                         self.cavity_length ** 2) +
                  np.pi * (self.large_radius ** 2 + self.small_radius ** 2))
        Q = 2 * np.pi * freq * constants.mu_0 * volume / (skin_depth * surface)
        return Q

    def radiation_pressure_thrust(self, Q, power=None):
        """Calculate theoretical radiation pressure thrust."""
        if power is None:
            power = self.input_power
        # Classical radiation pressure: F = P/c (for perfect reflection)
        # With cavity: F = 2*Q*P/c (resonant enhancement)
        F_classical = power / constants.c
        # Frustum asymmetry factor (controversial claim)
        asymmetry = (self.large_radius - self.small_radius) / self.large_radius
        F_emdrive = 2 * Q * power / constants.c * asymmetry
        return F_classical, F_emdrive

    def capture_cavity_spectrum(self):
        """Capture RF spectrum from cavity."""
        if self.sdr:
            samples = self.sdr.read_samples(NUM_SAMPLES)
        else:
            t = np.arange(NUM_SAMPLES) / self.sample_rate
            sig = np.zeros(NUM_SAMPLES, dtype=complex)
            modes = self.frustum_modes()
            for mode in modes:
                if abs(mode['freq'] - self.center_freq) < self.sample_rate / 2:
                    f_off = mode['freq'] - self.center_freq
                    Q = self.q_factor(mode['freq'])
                    amp = Q / 1e4
                    sig += amp * np.exp(2j * np.pi * f_off * t)
            sig += 0.05 * (np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES))
            samples = sig
        return samples

    def measure_q_from_spectrum(self, samples):
        """Extract Q-factor from spectral peak width."""
        window = signal.windows.blackmanharris(len(samples))
        spectrum = fft(samples * window)
        freqs = fftfreq(len(samples), 1 / self.sample_rate)
        psd = np.abs(spectrum) ** 2
        psd_positive = psd[:len(psd) // 2]
        freqs_positive = freqs[:len(freqs) // 2]
        peak_idx = np.argmax(psd_positive)
        peak_power = psd_positive[peak_idx]
        half_power = peak_power / 2
        above_half = psd_positive > half_power
        bw_indices = np.where(above_half)[0]
        if len(bw_indices) > 1:
            bw = (freqs_positive[bw_indices[-1]] - freqs_positive[bw_indices[0]])
            Q_meas = freqs_positive[peak_idx] / max(bw, 1)
        else:
            Q_meas = 1000
        return abs(Q_meas), freqs_positive[peak_idx]

    def run_simulation(self):
        """Run EM drive cavity simulation."""
        self.init_sdr()
        print(f"[EM DRIVE] Microwave Cavity Thruster Simulator")
        print(f"  Cavity: {self.cavity_length*100:.0f} cm length")
        print(f"  Radii:  {self.large_radius*100:.0f} / {self.small_radius*100:.0f} cm")
        print(f"  Power:  {self.input_power} W")

        # Cavity modes
        print(f"\n--- Cavity Resonant Modes ---")
        modes = self.frustum_modes()
        for m in modes[:8]:
            Q = self.q_factor(m['freq'])
            print(f"  {m['mode_type']:6s}  f={m['freq']/1e9:.4f} GHz  Q={Q:.0f}")

        # Q-factor analysis
        print(f"\n--- Q-Factor at Operating Frequency ---")
        Q_theory = self.q_factor(self.center_freq)
        print(f"  Theoretical Q: {Q_theory:.0f}")

        samples = self.capture_cavity_spectrum()
        Q_meas, f_peak = self.measure_q_from_spectrum(samples)
        print(f"  Measured Q:    {Q_meas:.0f}")
        print(f"  Peak offset:   {f_peak/1e3:.1f} kHz")

        # Thrust calculation
        print(f"\n--- Thrust Calculation ---")
        F_class, F_em = self.radiation_pressure_thrust(Q_theory)
        print(f"  Classical radiation pressure: {F_class*1e6:.4f} uN")
        print(f"  EM drive claim (Q-enhanced):  {F_em*1e6:.4f} uN")
        print(f"  Enhancement factor:           {F_em/F_class:.1f}x")
        print(f"  Thrust/Power:                 {F_em/self.input_power*1e6:.4f} uN/W")
        print(f"\n  Note: EM drive thrust claims remain unverified and")
        print(f"  likely arise from systematic experimental errors.")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='EM Drive Simulator')
    parser.add_argument('-p', '--power', type=float, default=100, help='Input power W')
    parser.add_argument('-f', '--freq', type=float, default=2.45e9, help='Freq Hz')
    args = parser.parse_args()

    sim = EMDriveSimulator(args.freq)
    sim.input_power = args.power
    try:
        sim.run_simulation()
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        sim.close()


if __name__ == '__main__':
    main()
