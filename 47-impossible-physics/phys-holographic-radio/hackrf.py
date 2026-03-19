#!/usr/bin/env python3
"""Holographic Radio - RTL-SDR/HackRF Companion
Implements holographic beam-forming using SDR, encoding spatial information
into RF wavefronts via phase-array synthesis and holographic reconstruction.
"""

import numpy as np
from scipy import signal
from scipy.fft import fft2, ifft2, fft, fftfreq
import time
import argparse

# SDR Configuration
CENTER_FREQ = 2.4e9
SAMPLE_RATE = 2e6
GAIN = 30
NUM_SAMPLES = 128 * 1024
ARRAY_ELEMENTS = 8        # Virtual phased array elements

class HolographicRadio:
    """Implements holographic RF beam-forming and spatial encoding."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.wavelength = 3e8 / center_freq
        self.n_elements = ARRAY_ELEMENTS
        self.element_spacing = self.wavelength / 2

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

    def create_holographic_pattern(self, target_angles):
        """Generate holographic interference pattern for beam steering."""
        # Reference wave: plane wave from broadside
        x = np.arange(self.n_elements) * self.element_spacing
        k = 2 * np.pi / self.wavelength
        ref_phase = np.zeros(self.n_elements)

        # Object wave: superposition of target directions
        obj_phase = np.zeros(self.n_elements, dtype=complex)
        for angle_deg in target_angles:
            theta = np.radians(angle_deg)
            obj_phase += np.exp(1j * k * x * np.sin(theta))

        # Hologram = interference pattern
        ref_wave = np.exp(1j * ref_phase)
        hologram = np.abs(ref_wave + obj_phase) ** 2
        return hologram

    def reconstruct_beam(self, hologram, scan_angles=None):
        """Reconstruct beam pattern from holographic pattern."""
        if scan_angles is None:
            scan_angles = np.linspace(-90, 90, 361)
        x = np.arange(self.n_elements) * self.element_spacing
        k = 2 * np.pi / self.wavelength
        pattern = np.zeros(len(scan_angles))
        for i, angle in enumerate(scan_angles):
            theta = np.radians(angle)
            steering = np.exp(-1j * k * x * np.sin(theta))
            pattern[i] = np.abs(np.sum(hologram * steering)) ** 2
        pattern_dB = 10 * np.log10(pattern / np.max(pattern) + 1e-12)
        return scan_angles, pattern_dB

    def spatial_encode(self, data_bits, angle):
        """Encode data into spatial holographic channel."""
        k = 2 * np.pi / self.wavelength
        x = np.arange(self.n_elements) * self.element_spacing
        theta = np.radians(angle)
        encoded = []
        for bit in data_bits:
            if bit:
                phase = k * x * np.sin(theta)
            else:
                phase = k * x * np.sin(theta) + np.pi
            encoded.append(np.exp(1j * phase))
        return np.array(encoded)

    def spatial_decode(self, received, angle):
        """Decode data from spatial holographic channel."""
        k = 2 * np.pi / self.wavelength
        x = np.arange(self.n_elements) * self.element_spacing
        theta = np.radians(angle)
        steering = np.exp(-1j * k * x * np.sin(theta))
        bits = []
        for symbol in received:
            correlation = np.sum(symbol * np.conj(steering))
            bits.append(1 if np.real(correlation) > 0 else 0)
        return bits

    def capture_samples(self):
        """Capture RF samples."""
        if self.sdr:
            return self.sdr.read_samples(NUM_SAMPLES)
        t = np.arange(NUM_SAMPLES) / self.sample_rate
        sig = np.zeros(NUM_SAMPLES, dtype=complex)
        for angle in [30, -15, 60]:
            sig += np.exp(2j * np.pi * 100e3 * t + 1j * np.radians(angle))
        sig += 0.1 * (np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES))
        return sig

    def holographic_imaging(self, n_pixels=32):
        """Create holographic RF image from received data."""
        image = np.zeros((n_pixels, n_pixels), dtype=complex)
        for i in range(n_pixels):
            samples = self.capture_samples()
            chunk_size = len(samples) // n_pixels
            for j in range(n_pixels):
                chunk = samples[j * chunk_size:(j + 1) * chunk_size]
                image[i, j] = np.mean(chunk)
        # Holographic reconstruction via 2D FFT
        reconstructed = np.abs(ifft2(fft2(image)))
        return reconstructed

    def run_demo(self):
        """Run holographic radio demonstration."""
        self.init_sdr()
        print(f"[HOLO] Holographic Radio Demo")
        print(f"  Wavelength: {self.wavelength*100:.1f} cm")
        print(f"  Array: {self.n_elements} elements, spacing={self.element_spacing*100:.1f} cm")

        # Beam steering demo
        target_angles = [30, -20]
        print(f"\n--- Holographic Beam Steering ---")
        print(f"  Targets: {target_angles} degrees")
        hologram = self.create_holographic_pattern(target_angles)
        print(f"  Hologram weights: {np.round(hologram, 3)}")

        angles, pattern = self.reconstruct_beam(hologram)
        for ta in target_angles:
            idx = np.argmin(np.abs(angles - ta))
            print(f"  Beam at {ta:+d} deg: {pattern[idx]:.1f} dB")

        # Spatial encoding demo
        print(f"\n--- Spatial Data Encoding ---")
        test_data = [1, 0, 1, 1, 0, 1, 0, 0]
        tx_angle = 45
        encoded = self.spatial_encode(test_data, tx_angle)
        # Add noise
        noisy = encoded + 0.3 * (np.random.randn(*encoded.shape) +
                                  1j * np.random.randn(*encoded.shape))
        decoded = self.spatial_decode(noisy, tx_angle)
        errors = sum(a != b for a, b in zip(test_data, decoded))
        print(f"  TX data:  {test_data}")
        print(f"  RX data:  {decoded}")
        print(f"  Errors:   {errors}/{len(test_data)}")

        # Wrong angle decode
        decoded_wrong = self.spatial_decode(noisy, tx_angle + 30)
        errors_w = sum(a != b for a, b in zip(test_data, decoded_wrong))
        print(f"  Wrong angle decode errors: {errors_w}/{len(test_data)}")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Holographic Radio')
    parser.add_argument('-f', '--freq', type=float, default=2.4e9, help='Center freq Hz')
    parser.add_argument('-n', '--elements', type=int, default=8, help='Array elements')
    args = parser.parse_args()

    radio = HolographicRadio(args.freq)
    radio.n_elements = args.elements
    try:
        radio.run_demo()
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        radio.close()


if __name__ == '__main__':
    main()
