#!/usr/bin/env python3
"""Doppler Cooling Simulator - RTL-SDR/HackRF Companion
Simulates laser Doppler cooling of atoms using RF analogues,
demonstrating velocity-selective absorption and radiation pressure.
"""

import numpy as np
from scipy import signal, constants
from scipy.fft import fft, fftfreq
import time
import argparse

# SDR Configuration
CENTER_FREQ = 433e6
SAMPLE_RATE = 2.4e6
GAIN = 30
NUM_SAMPLES = 128 * 1024

class DopplerCoolingSim:
    """Simulates Doppler cooling with RF signal analogues."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.linewidth = 50e3        # Transition linewidth Hz
        self.detuning = -25e3        # Red detuning Hz
        self.num_atoms = 500
        self.recoil_velocity = 0.01  # Recoil velocity (scaled units)

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

    def lorentzian_absorption(self, freq_offset, detuning=None, linewidth=None):
        """Lorentzian absorption profile for two-level atom."""
        if detuning is None:
            detuning = self.detuning
        if linewidth is None:
            linewidth = self.linewidth
        delta = freq_offset - detuning
        gamma = linewidth / 2
        return gamma ** 2 / (delta ** 2 + gamma ** 2)

    def doppler_shift(self, velocity, freq=None):
        """Calculate Doppler shift for moving atom."""
        if freq is None:
            freq = self.center_freq
        return freq * velocity / 3e8

    def scattering_rate(self, velocity, intensity=1.0):
        """Compute photon scattering rate for atom with given velocity."""
        doppler = self.doppler_shift(velocity)
        absorption = self.lorentzian_absorption(doppler)
        gamma = self.linewidth
        s = intensity  # Saturation parameter
        rate = (gamma / 2) * s * absorption / (1 + s * absorption)
        return rate

    def cooling_force(self, velocity, intensity=1.0):
        """Radiation pressure force on moving atom (two counter-propagating beams)."""
        # Force from beam traveling in +x direction
        rate_plus = self.scattering_rate(velocity, intensity)
        # Force from beam traveling in -x direction
        rate_minus = self.scattering_rate(-velocity, intensity)
        # Net force proportional to scattering rate difference
        force = self.recoil_velocity * (rate_plus - rate_minus)
        return force

    def simulate_cooling(self, num_steps=2000, dt=0.001):
        """Simulate Doppler cooling of atom ensemble."""
        # Initialize atoms with thermal velocity distribution
        temperature = 1.0  # Initial temperature (scaled)
        velocities = np.random.normal(0, np.sqrt(temperature), self.num_atoms)
        history = [velocities.copy()]
        temperatures = [np.mean(velocities ** 2)]

        for step in range(num_steps):
            forces = np.array([self.cooling_force(v) for v in velocities])
            velocities -= forces * dt
            # Random recoil kicks (heating)
            kicks = self.recoil_velocity * (2 * np.random.randint(0, 2, self.num_atoms) - 1)
            scattering = np.array([self.scattering_rate(v) for v in velocities])
            mask = np.random.random(self.num_atoms) < scattering * dt * 100
            velocities[mask] += kicks[mask]
            temperatures.append(np.mean(velocities ** 2))
            if step % 200 == 0:
                history.append(velocities.copy())

        return history, temperatures

    def doppler_limit_temperature(self):
        """Calculate Doppler cooling limit temperature."""
        # T_D = hbar * gamma / (2 * k_B) -- using scaled units
        return self.linewidth / (2 * self.sample_rate) * 0.1

    def generate_cooling_signal(self, velocities):
        """Generate RF signal representing atom fluorescence."""
        t = np.arange(NUM_SAMPLES) / self.sample_rate
        sig = np.zeros(NUM_SAMPLES, dtype=complex)
        for v in velocities[:50]:  # Limit for speed
            doppler = self.doppler_shift(v) * 1e8  # Scale up
            sig += np.exp(2j * np.pi * doppler * t) * 0.02
        sig += 0.01 * (np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES))
        return sig

    def measure_temperature(self, spectrum):
        """Extract temperature from Doppler-broadened spectrum."""
        # Fit Gaussian width to get temperature
        freqs = fftfreq(len(spectrum), 1 / self.sample_rate)
        psd = np.abs(fft(spectrum)) ** 2
        psd_pos = psd[:len(psd) // 2]
        freqs_pos = freqs[:len(freqs) // 2]
        # RMS width
        mean_f = np.average(freqs_pos, weights=psd_pos + 1e-12)
        rms_width = np.sqrt(np.average((freqs_pos - mean_f) ** 2, weights=psd_pos + 1e-12))
        temperature = (rms_width / self.center_freq * 3e8) ** 2
        return temperature, rms_width

    def run_simulation(self):
        """Run Doppler cooling simulation."""
        self.init_sdr()
        print(f"[COOLING] Doppler Cooling Simulator")
        print(f"  Atoms:      {self.num_atoms}")
        print(f"  Linewidth:  {self.linewidth/1e3:.0f} kHz")
        print(f"  Detuning:   {self.detuning/1e3:.0f} kHz")
        print(f"  Doppler limit: {self.doppler_limit_temperature():.6f} (scaled)")

        # Force profile
        print(f"\n--- Cooling Force vs Velocity ---")
        velocities = np.linspace(-2, 2, 20)
        for v in velocities[::2]:
            force = self.cooling_force(v)
            bar_len = int(abs(force) * 500)
            direction = '<' * bar_len if force > 0 else '>' * bar_len
            print(f"  v={v:+5.2f}  F={force:+.5f}  {direction}")

        # Run cooling
        print(f"\n--- Cooling Dynamics ---")
        history, temps = self.simulate_cooling()
        for i, step in enumerate(range(0, len(temps), len(temps) // 8)):
            print(f"  step={step:5d}  T={temps[step]:.6f}  "
                  f"cooling={temps[0]/max(temps[step],1e-12):.1f}x")

        print(f"\n  Initial T:  {temps[0]:.6f}")
        print(f"  Final T:    {temps[-1]:.6f}")
        print(f"  Cooling:    {temps[0]/max(temps[-1],1e-12):.1f}x")

        # Spectrum before/after
        print(f"\n--- Fluorescence Spectrum ---")
        sig_hot = self.generate_cooling_signal(history[0])
        sig_cold = self.generate_cooling_signal(history[-1])
        T_hot, w_hot = self.measure_temperature(sig_hot)
        T_cold, w_cold = self.measure_temperature(sig_cold)
        print(f"  Hot width:  {w_hot/1e3:.2f} kHz")
        print(f"  Cold width: {w_cold/1e3:.2f} kHz")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Doppler Cooling Simulator')
    parser.add_argument('-n', '--atoms', type=int, default=500, help='Number of atoms')
    parser.add_argument('-d', '--detuning', type=float, default=-25, help='Detuning kHz')
    args = parser.parse_args()

    sim = DopplerCoolingSim()
    sim.num_atoms = args.atoms
    sim.detuning = args.detuning * 1e3
    try:
        sim.run_simulation()
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        sim.close()


if __name__ == '__main__':
    main()
