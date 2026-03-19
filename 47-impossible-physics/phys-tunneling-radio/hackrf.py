#!/usr/bin/env python3
"""Tunneling Radio - RTL-SDR/HackRF Companion
Demonstrates quantum tunneling analogies in RF using evanescent wave coupling
through below-cutoff waveguide sections.
"""

import numpy as np
from scipy import signal, special
from scipy.fft import fft, fftfreq
import time
import argparse

# SDR Configuration
CENTER_FREQ = 915e6       # 915 MHz ISM band
SAMPLE_RATE = 2.4e6
GAIN = 40
NUM_SAMPLES = 128 * 1024

class TunnelingRadio:
    """Simulates and measures quantum tunneling analogies in RF."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.barrier_length = 0.05  # meters
        self.cutoff_freq = 1.2e9   # Waveguide cutoff

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

    def tunneling_coefficient(self, freq, barrier_length=None, cutoff=None):
        """Calculate RF tunneling transmission coefficient.
        Analogous to quantum mechanical tunneling through a potential barrier.
        """
        if barrier_length is None:
            barrier_length = self.barrier_length
        if cutoff is None:
            cutoff = self.cutoff_freq
        if freq >= cutoff:
            # Propagating mode
            k = 2 * np.pi * np.sqrt(freq**2 - cutoff**2) / 3e8
            T = 1.0 / (1.0 + 0.01 * np.sin(k * barrier_length)**2)
        else:
            # Evanescent (tunneling) mode
            kappa = 2 * np.pi * np.sqrt(cutoff**2 - freq**2) / 3e8
            T = 1.0 / (1.0 + np.sinh(kappa * barrier_length)**2 / 4)
        return T

    def tunneling_phase(self, freq, barrier_length=None):
        """Calculate phase advance through tunnel barrier (Hartman effect)."""
        if barrier_length is None:
            barrier_length = self.barrier_length
        if freq < self.cutoff_freq:
            kappa = 2 * np.pi * np.sqrt(self.cutoff_freq**2 - freq**2) / 3e8
            # Phase becomes independent of barrier length for thick barriers
            phase = -np.arctan(2 * kappa * barrier_length /
                              (1 - (kappa * barrier_length)**2 + 1e-12))
        else:
            k = 2 * np.pi * np.sqrt(freq**2 - self.cutoff_freq**2) / 3e8
            phase = k * barrier_length
        return phase

    def capture_samples(self):
        """Capture RF samples through tunnel barrier."""
        if self.sdr:
            return self.sdr.read_samples(NUM_SAMPLES)
        # Simulate tunneled signal
        t = np.arange(NUM_SAMPLES) / self.sample_rate
        sig = np.zeros(NUM_SAMPLES, dtype=complex)
        for f_off in np.linspace(-1e6, 1e6, 50):
            freq = self.center_freq + f_off
            T = self.tunneling_coefficient(freq)
            phi = self.tunneling_phase(freq)
            sig += np.sqrt(T) * np.exp(2j * np.pi * f_off * t + 1j * phi)
        sig += 0.02 * (np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES))
        return sig

    def measure_transmission(self):
        """Measure frequency-dependent tunneling transmission."""
        samples = self.capture_samples()
        window = signal.windows.hann(len(samples))
        spectrum = fft(samples * window)
        freqs = fftfreq(len(samples), 1 / self.sample_rate) + self.center_freq
        psd = np.abs(spectrum) ** 2
        return freqs, psd

    def barrier_sweep(self, lengths=None):
        """Sweep barrier length and measure tunneling."""
        if lengths is None:
            lengths = np.linspace(0.01, 0.15, 20)
        results = []
        for L in lengths:
            T = self.tunneling_coefficient(self.center_freq, L)
            phi = self.tunneling_phase(self.center_freq, L)
            group_delay = abs(phi) / (2 * np.pi * self.center_freq)
            results.append({
                'length_mm': L * 1000,
                'transmission': T,
                'transmission_dB': 10 * np.log10(T + 1e-15),
                'phase_rad': phi,
                'group_delay_ps': group_delay * 1e12
            })
        return results

    def hartman_effect_demo(self):
        """Demonstrate the Hartman effect - group delay saturation."""
        lengths = np.linspace(0.01, 0.2, 50)
        print("\n--- Hartman Effect (Tunneling Time Saturation) ---")
        print(f"  Frequency: {self.center_freq/1e6:.0f} MHz (below cutoff {self.cutoff_freq/1e9:.2f} GHz)")
        prev_delay = 0
        for L in lengths[::5]:
            phi = self.tunneling_phase(self.center_freq, L)
            delay = abs(phi) / (2 * np.pi * self.center_freq) * 1e12
            delta = delay - prev_delay
            print(f"  L={L*1000:6.1f} mm | delay={delay:8.3f} ps | delta={delta:+.3f} ps")
            prev_delay = delay

    def run_experiment(self):
        """Run full tunneling radio experiment."""
        self.init_sdr()
        print(f"[TUNNEL] Quantum tunneling radio experiment")
        print(f"  Signal freq:   {self.center_freq/1e6:.1f} MHz")
        print(f"  Cutoff freq:   {self.cutoff_freq/1e9:.2f} GHz")
        print(f"  Barrier:       {self.barrier_length*1000:.1f} mm")

        # Barrier sweep
        print("\n--- Barrier Length Sweep ---")
        results = self.barrier_sweep()
        for r in results[::4]:
            print(f"  L={r['length_mm']:5.1f} mm  T={r['transmission_dB']:7.1f} dB  "
                  f"delay={r['group_delay_ps']:.2f} ps")

        # Hartman effect
        self.hartman_effect_demo()

        # Transmission measurement
        print("\n--- Live Transmission Measurement ---")
        freqs, psd = self.measure_transmission()
        peak_power = 10 * np.log10(np.max(psd) + 1e-12)
        print(f"  Peak tunneled power: {peak_power:.1f} dB")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Tunneling Radio Experiment')
    parser.add_argument('-f', '--freq', type=float, default=915e6, help='Signal freq Hz')
    parser.add_argument('-c', '--cutoff', type=float, default=1.2e9, help='Cutoff freq Hz')
    parser.add_argument('-b', '--barrier', type=float, default=50, help='Barrier length mm')
    args = parser.parse_args()

    radio = TunnelingRadio(args.freq)
    radio.cutoff_freq = args.cutoff
    radio.barrier_length = args.barrier / 1000
    try:
        radio.run_experiment()
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        radio.close()


if __name__ == '__main__':
    main()
