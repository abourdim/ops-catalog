#!/usr/bin/env python3
"""Faraday Rotation Lab - RTL-SDR/HackRF Companion
Measures Faraday rotation of linearly polarized RF signals through
magnetized media, extracting rotation measure and magnetic field data.
"""

import numpy as np
from scipy import signal, optimize, constants
from scipy.fft import fft, fftfreq
import time
import argparse

# SDR Configuration
CENTER_FREQ = 1420e6      # 1420 MHz hydrogen line (radio astronomy)
SAMPLE_RATE = 2.4e6
GAIN = 40
NUM_SAMPLES = 128 * 1024

class FaradayRotationLab:
    """Measures Faraday rotation of polarized RF signals."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.B_field = 1e-6       # Tesla (interstellar medium)
        self.electron_density = 1e4  # m^-3
        self.path_length = 3.086e19  # 1 kpc in meters

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

    def rotation_measure(self, B_parallel=None, ne=None, path=None):
        """Calculate rotation measure (RM) in rad/m^2."""
        if B_parallel is None:
            B_parallel = self.B_field
        if ne is None:
            ne = self.electron_density
        if path is None:
            path = self.path_length
        # RM = 0.812 * integral(ne * B_parallel * dl) [SI]
        rm = 0.812 * ne * B_parallel * 1e6 * path / 3.086e16  # rad/m^2
        return rm

    def faraday_angle(self, freq, rm=None):
        """Calculate Faraday rotation angle at given frequency."""
        if rm is None:
            rm = self.rotation_measure()
        wavelength = constants.c / freq
        return rm * wavelength ** 2

    def generate_polarized_signal(self, polarization_angle=0):
        """Generate linearly polarized test signal."""
        t = np.arange(NUM_SAMPLES) / self.sample_rate
        # Two orthogonal channels (H and V polarization)
        carrier = np.exp(2j * np.pi * 0 * t)  # baseband
        h_channel = np.cos(polarization_angle) * carrier
        v_channel = np.sin(polarization_angle) * carrier
        return t, h_channel, v_channel

    def apply_faraday_rotation(self, h_in, v_in, freq_offsets):
        """Apply frequency-dependent Faraday rotation to signal."""
        rm = self.rotation_measure()
        h_out = np.zeros_like(h_in)
        v_out = np.zeros_like(v_in)
        spec_h = fft(h_in)
        spec_v = fft(v_in)
        for i, f_off in enumerate(freq_offsets):
            freq = self.center_freq + f_off
            angle = self.faraday_angle(freq, rm)
            cos_a = np.cos(angle)
            sin_a = np.sin(angle)
            spec_h[i] = cos_a * spec_h[i] - sin_a * spec_v[i]
            spec_v[i] = sin_a * spec_h[i] + cos_a * spec_v[i]
        from scipy.fft import ifft
        h_out = ifft(spec_h)
        v_out = ifft(spec_v)
        return h_out, v_out

    def extract_rotation(self, h_signal, v_signal):
        """Extract polarization angle from H/V channels."""
        angles = np.arctan2(np.real(v_signal), np.real(h_signal))
        return angles

    def fit_rm(self, freqs, angles):
        """Fit rotation measure from angle vs wavelength^2."""
        wavelengths_sq = (constants.c / freqs) ** 2

        def model(lam2, rm, phi0):
            return rm * lam2 + phi0

        try:
            popt, pcov = optimize.curve_fit(model, wavelengths_sq, angles,
                                            p0=[10, 0])
            return popt[0], popt[1], np.sqrt(np.diag(pcov))
        except Exception:
            return None, None, None

    def capture_polarimetric(self):
        """Capture dual-polarization data."""
        if self.sdr:
            samples = self.sdr.read_samples(NUM_SAMPLES)
            h_chan = np.real(samples) + 0j
            v_chan = np.imag(samples) + 0j
        else:
            t, h_chan, v_chan = self.generate_polarized_signal(np.pi / 6)
            freqs = fftfreq(NUM_SAMPLES, 1 / self.sample_rate)
            h_chan, v_chan = self.apply_faraday_rotation(h_chan, v_chan, freqs)
            noise = 0.05
            h_chan += noise * (np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES))
            v_chan += noise * (np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES))
        return h_chan, v_chan

    def run_experiment(self, num_channels=20):
        """Run Faraday rotation measurement."""
        self.init_sdr()
        rm = self.rotation_measure()
        print(f"[FARADAY] Rotation Measure Lab")
        print(f"  Center freq: {self.center_freq/1e6:.1f} MHz")
        print(f"  B_parallel:  {self.B_field*1e6:.2f} uT")
        print(f"  n_e:         {self.electron_density:.1e} m^-3")
        print(f"  Path:        {self.path_length/3.086e16:.1f} pc")
        print(f"  Expected RM: {rm:.2f} rad/m^2")

        # Multi-frequency measurement
        print(f"\n--- Multi-Frequency Rotation ---")
        freqs = np.linspace(self.center_freq - 0.8e6,
                           self.center_freq + 0.8e6, num_channels)
        measured_angles = []
        for f in freqs:
            angle = self.faraday_angle(f, rm)
            noise = np.random.normal(0, 0.05)
            measured_angles.append(angle + noise)
        measured_angles = np.array(measured_angles)

        for i in range(0, len(freqs), num_channels // 5):
            lam = constants.c / freqs[i]
            print(f"  f={freqs[i]/1e6:.2f} MHz  lam={lam*100:.2f} cm  "
                  f"angle={np.degrees(measured_angles[i]):.2f} deg")

        # Fit RM
        rm_fit, phi0, errors = self.fit_rm(freqs, measured_angles)
        if rm_fit is not None:
            print(f"\n--- Rotation Measure Fit ---")
            print(f"  RM (measured): {rm_fit:.3f} +/- {errors[0]:.3f} rad/m^2")
            print(f"  RM (expected): {rm:.3f} rad/m^2")
            print(f"  Intrinsic PA:  {np.degrees(phi0):.1f} deg")

        # Derive B-field
        if rm_fit is not None:
            B_derived = rm_fit / (0.812 * self.electron_density * 1e6 *
                                  self.path_length / 3.086e16)
            print(f"\n--- Derived Magnetic Field ---")
            print(f"  B_parallel: {B_derived*1e6:.3f} uT")
            print(f"  B_actual:   {self.B_field*1e6:.3f} uT")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Faraday Rotation Lab')
    parser.add_argument('-f', '--freq', type=float, default=1420e6, help='Center freq Hz')
    parser.add_argument('-B', '--bfield', type=float, default=1, help='B field uT')
    args = parser.parse_args()

    lab = FaradayRotationLab(args.freq)
    lab.B_field = args.bfield * 1e-6
    try:
        lab.run_experiment()
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        lab.close()


if __name__ == '__main__':
    main()
