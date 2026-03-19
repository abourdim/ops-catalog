#!/usr/bin/env python3
"""Sagnac Interferometer - RTL-SDR/HackRF Companion
Implements an RF Sagnac interferometer to detect rotation via the
Sagnac effect in counter-propagating RF signals.
"""

import numpy as np
from scipy import signal, constants
from scipy.fft import fft, fftfreq
import time
import argparse

# SDR Configuration
CENTER_FREQ = 1e9         # 1 GHz
SAMPLE_RATE = 2.4e6
GAIN = 30
NUM_SAMPLES = 256 * 1024

class SagnacInterferometer:
    """RF Sagnac interferometer for rotation sensing."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.loop_area = 1.0         # m^2
        self.loop_perimeter = 4.0    # m
        self.n_loops = 10            # Number of fiber/cable loops
        self.rotation_rate = 7.292e-5  # Earth rotation rad/s

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

    def sagnac_phase_shift(self, omega=None, area=None, n=None):
        """Calculate Sagnac phase shift: dphi = 8*pi*N*A*Omega/(lambda*c)."""
        if omega is None:
            omega = self.rotation_rate
        if area is None:
            area = self.loop_area
        if n is None:
            n = self.n_loops
        wavelength = constants.c / self.center_freq
        dphi = 8 * np.pi * n * area * omega / (wavelength * constants.c)
        return dphi

    def sagnac_frequency_shift(self, omega=None, perimeter=None, n=None):
        """Calculate Sagnac beat frequency: df = 4*N*A*Omega/(lambda*P)."""
        if omega is None:
            omega = self.rotation_rate
        if perimeter is None:
            perimeter = self.loop_perimeter
        if n is None:
            n = self.n_loops
        area = self.loop_area
        wavelength = constants.c / self.center_freq
        df = 4 * n * area * omega / (wavelength * perimeter)
        return df

    def generate_counter_propagating(self, omega=None):
        """Generate CW and CCW signals with Sagnac phase difference."""
        t = np.arange(NUM_SAMPLES) / self.sample_rate
        dphi = self.sagnac_phase_shift(omega)
        # Clockwise signal
        cw = np.exp(2j * np.pi * 0 * t)  # Baseband reference
        # Counter-clockwise signal with Sagnac phase
        ccw = np.exp(2j * np.pi * 0 * t + 1j * dphi)
        return t, cw, ccw

    def interfere(self, cw, ccw):
        """Combine CW and CCW signals at beam combiner."""
        output_1 = (cw + ccw) / 2          # Constructive port
        output_2 = (cw - ccw) / 2          # Destructive port
        return output_1, output_2

    def extract_beat_frequency(self, signal_data):
        """Extract Sagnac beat frequency from interference signal."""
        window = signal.windows.hann(len(signal_data))
        spectrum = fft(signal_data * window)
        freqs = fftfreq(len(signal_data), 1 / self.sample_rate)
        psd = np.abs(spectrum[:len(spectrum) // 2]) ** 2
        freqs_pos = freqs[:len(freqs) // 2]
        # Find peak above DC
        dc_cutoff = 10
        psd[: dc_cutoff] = 0
        peak_idx = np.argmax(psd)
        return freqs_pos[peak_idx], psd[peak_idx]

    def rotation_sweep(self, omega_range=None):
        """Sweep rotation rate and measure Sagnac response."""
        if omega_range is None:
            omega_range = np.logspace(-7, -1, 30)
        results = []
        for omega in omega_range:
            dphi = self.sagnac_phase_shift(omega)
            df = self.sagnac_frequency_shift(omega)
            sensitivity = dphi / omega if omega > 0 else 0
            results.append({
                'omega_rad_s': omega,
                'omega_deg_hr': np.degrees(omega) * 3600,
                'phase_shift_rad': dphi,
                'beat_freq_Hz': df,
                'sensitivity': sensitivity
            })
        return results

    def capture_interference(self):
        """Capture live interference pattern."""
        if self.sdr:
            samples = self.sdr.read_samples(NUM_SAMPLES)
        else:
            t, cw, ccw = self.generate_counter_propagating()
            noise = 0.01 * (np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES))
            out1, out2 = self.interfere(cw, ccw)
            samples = out1 + noise
        return samples

    def run_interferometer(self):
        """Run Sagnac interferometer experiment."""
        self.init_sdr()
        print(f"[SAGNAC] RF Sagnac Interferometer")
        print(f"  Frequency:  {self.center_freq/1e9:.2f} GHz")
        print(f"  Loop area:  {self.loop_area:.2f} m^2")
        print(f"  N loops:    {self.n_loops}")
        print(f"  Perimeter:  {self.loop_perimeter:.1f} m")

        # Earth rotation measurement
        print(f"\n--- Earth Rotation Detection ---")
        dphi = self.sagnac_phase_shift()
        df = self.sagnac_frequency_shift()
        print(f"  Earth rate:     {self.rotation_rate:.3e} rad/s "
              f"({np.degrees(self.rotation_rate)*3600:.1f} deg/hr)")
        print(f"  Sagnac phase:   {dphi:.6e} rad")
        print(f"  Beat frequency: {df:.6e} Hz")

        # Sensitivity analysis
        print(f"\n--- Rotation Sensitivity ---")
        results = self.rotation_sweep()
        for r in results[::5]:
            detectable = "OK" if r['phase_shift_rad'] > 1e-6 else "BELOW NOISE"
            print(f"  Omega={r['omega_deg_hr']:12.4f} deg/hr  "
                  f"dphi={r['phase_shift_rad']:.3e} rad  "
                  f"df={r['beat_freq_Hz']:.3e} Hz  [{detectable}]")

        # Live measurement
        print(f"\n--- Live Interference Measurement ---")
        samples = self.capture_interference()
        beat_f, beat_power = self.extract_beat_frequency(samples)
        print(f"  Beat frequency: {beat_f:.3f} Hz")
        print(f"  Beat power:     {10*np.log10(beat_power+1e-12):.1f} dB")

        # Derive rotation
        if beat_f > 0:
            wavelength = constants.c / self.center_freq
            omega_meas = beat_f * wavelength * self.loop_perimeter / \
                        (4 * self.n_loops * self.loop_area)
            print(f"  Derived rotation: {omega_meas:.3e} rad/s")
            print(f"                    {np.degrees(omega_meas)*3600:.3f} deg/hr")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Sagnac Interferometer')
    parser.add_argument('-f', '--freq', type=float, default=1e9, help='RF frequency Hz')
    parser.add_argument('-a', '--area', type=float, default=1.0, help='Loop area m^2')
    parser.add_argument('-n', '--loops', type=int, default=10, help='Number of loops')
    args = parser.parse_args()

    sagnac = SagnacInterferometer(args.freq)
    sagnac.loop_area = args.area
    sagnac.n_loops = args.loops
    try:
        sagnac.run_interferometer()
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        sagnac.close()


if __name__ == '__main__':
    main()
