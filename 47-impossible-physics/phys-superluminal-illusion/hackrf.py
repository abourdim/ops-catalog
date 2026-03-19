#!/usr/bin/env python3
"""Superluminal Illusion - RTL-SDR/HackRF Companion
Demonstrates apparent superluminal RF propagation effects using
anomalous dispersion and pulse reshaping in narrow-band media.
"""

import numpy as np
from scipy import signal
from scipy.fft import fft, ifft, fftfreq
import time
import argparse

# SDR Configuration
CENTER_FREQ = 433e6
SAMPLE_RATE = 2.4e6
GAIN = 30
NUM_SAMPLES = 256 * 1024

class SuperluminalIllusion:
    """Demonstrates apparent superluminal effects in RF propagation."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.medium_length = 0.1  # meters
        self.resonance_freq = 0   # Offset from center

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

    def anomalous_dispersion(self, freq_offset, linewidth=50e3, strength=0.8):
        """Model anomalous dispersion medium (gain doublet)."""
        # Two gain lines create anomalous dispersion between them
        delta1 = freq_offset - linewidth
        delta2 = freq_offset + linewidth
        gamma = linewidth / 10
        chi1 = strength * gamma / (delta1 + 1j * gamma)
        chi2 = strength * gamma / (delta2 + 1j * gamma)
        chi = chi1 + chi2
        n = 1 + chi / 2  # Refractive index
        return n

    def group_velocity(self, freq_offset, linewidth=50e3):
        """Calculate group velocity in anomalous dispersion medium."""
        df = 100  # Hz step for derivative
        n1 = self.anomalous_dispersion(freq_offset - df, linewidth)
        n2 = self.anomalous_dispersion(freq_offset + df, linewidth)
        dn_df = (np.real(n2) - np.real(n1)) / (2 * df)
        freq = self.center_freq + freq_offset
        n = np.real(self.anomalous_dispersion(freq_offset, linewidth))
        vg = 3e8 / (n + freq * dn_df)
        return vg

    def generate_pulse(self, width_us=10):
        """Generate Gaussian test pulse."""
        t = np.arange(NUM_SAMPLES) / self.sample_rate
        t_center = t[len(t) // 2]
        sigma = width_us * 1e-6
        pulse = np.exp(-((t - t_center) ** 2) / (2 * sigma ** 2))
        return t, pulse.astype(complex)

    def propagate_through_medium(self, pulse):
        """Propagate pulse through anomalous dispersion medium."""
        freqs = fftfreq(len(pulse), 1 / self.sample_rate)
        spectrum = fft(pulse)
        # Apply frequency-dependent propagation
        for i, f in enumerate(freqs):
            n = self.anomalous_dispersion(f)
            k = 2 * np.pi * (self.center_freq + f) * n / 3e8
            phase = k * self.medium_length
            spectrum[i] *= np.exp(1j * phase)
        output = ifft(spectrum)
        return output

    def measure_group_delay(self, input_pulse, output_pulse, t):
        """Measure group delay by cross-correlation."""
        corr = np.correlate(np.abs(output_pulse), np.abs(input_pulse), mode='full')
        lag = np.arange(-len(input_pulse) + 1, len(input_pulse))
        dt = 1 / self.sample_rate
        peak_lag = lag[np.argmax(corr)] * dt
        return peak_lag

    def capture_and_analyze(self):
        """Capture live signal and detect superluminal signatures."""
        if self.sdr:
            samples = self.sdr.read_samples(NUM_SAMPLES)
        else:
            t, pulse = self.generate_pulse()
            samples = self.propagate_through_medium(pulse)
            samples += 0.01 * (np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES))
        return samples

    def velocity_sweep(self, freq_range=None):
        """Sweep frequency and compute apparent group velocity."""
        if freq_range is None:
            freq_range = np.linspace(-200e3, 200e3, 100)
        results = []
        for f_off in freq_range:
            vg = self.group_velocity(f_off)
            results.append({
                'freq_offset_kHz': f_off / 1e3,
                'vg': vg,
                'vg_over_c': vg / 3e8,
                'superluminal': vg > 3e8 or vg < 0
            })
        return results

    def run_experiment(self):
        """Run superluminal illusion demonstration."""
        self.init_sdr()
        print("[SUPERLUMINAL] Anomalous dispersion experiment")
        print(f"  Center: {self.center_freq/1e6:.1f} MHz")
        print(f"  Medium: {self.medium_length*100:.0f} cm")

        # Group velocity sweep
        print("\n--- Group Velocity vs Frequency ---")
        results = self.velocity_sweep()
        superluminal_count = 0
        for r in results[::10]:
            tag = " << SUPERLUMINAL" if r['superluminal'] else ""
            if r['superluminal']:
                superluminal_count += 1
            print(f"  f_off={r['freq_offset_kHz']:+8.1f} kHz  "
                  f"vg/c={r['vg_over_c']:+10.2f}{tag}")

        # Pulse propagation
        print("\n--- Pulse Propagation ---")
        t, input_pulse = self.generate_pulse()
        output_pulse = self.propagate_through_medium(input_pulse)
        delay = self.measure_group_delay(input_pulse, output_pulse, t)
        vacuum_delay = self.medium_length / 3e8
        print(f"  Vacuum transit time:  {vacuum_delay*1e9:.3f} ns")
        print(f"  Measured group delay: {delay*1e9:.3f} ns")
        print(f"  Apparent velocity:    {self.medium_length/abs(delay+1e-15)/3e8:.2f} c")

        if delay < vacuum_delay:
            print("  Result: APPARENT superluminal propagation detected!")
            print("  Note: No information travels faster than c (Brillouin limit)")
        else:
            print("  Result: Subluminal propagation")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Superluminal Illusion Experiment')
    parser.add_argument('-f', '--freq', type=float, default=433e6, help='Center freq Hz')
    parser.add_argument('-l', '--length', type=float, default=10, help='Medium length cm')
    args = parser.parse_args()

    exp = SuperluminalIllusion(args.freq)
    exp.medium_length = args.length / 100
    try:
        exp.run_experiment()
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        exp.close()


if __name__ == '__main__':
    main()
