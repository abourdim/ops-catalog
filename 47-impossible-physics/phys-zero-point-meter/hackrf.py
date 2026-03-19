#!/usr/bin/env python3
"""Zero-Point Energy Meter - RTL-SDR/HackRF Companion
Attempts to measure quantum vacuum fluctuations in the RF spectrum
by characterizing the noise floor below thermal (Johnson-Nyquist) noise.
"""

import numpy as np
from scipy import signal, constants, stats
from scipy.fft import fft, fftfreq
import time
import argparse

# SDR Configuration
CENTER_FREQ = 50e6        # 50 MHz - low noise region
SAMPLE_RATE = 2.4e6
GAIN = 0                  # Minimum gain for noise floor
NUM_SAMPLES = 512 * 1024
TEMPERATURE = 300         # Kelvin

class ZeroPointMeter:
    """Measures RF noise floor and compares with quantum zero-point predictions."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.temperature = TEMPERATURE

    def init_sdr(self):
        try:
            import rtlsdr
            self.sdr = rtlsdr.RtlSdr()
            self.sdr.center_freq = self.center_freq
            self.sdr.sample_rate = self.sample_rate
            self.sdr.gain = GAIN
            print(f"[SDR] Initialized at {self.center_freq/1e6:.1f} MHz, gain=min")
        except (ImportError, Exception) as e:
            print(f"[SIM] Simulated mode: {e}")
            self.sdr = None

    def thermal_noise_power(self, freq, bandwidth):
        """Classical Johnson-Nyquist thermal noise."""
        return constants.k * self.temperature * bandwidth

    def quantum_noise_power(self, freq, bandwidth):
        """Quantum noise including zero-point energy: hf/2 per mode."""
        hf = constants.h * freq
        # Planck distribution + zero-point
        n_photons = 1 / (np.exp(hf / (constants.k * self.temperature)) - 1) + 0.5
        return hf * n_photons * bandwidth

    def zero_point_contribution(self, freq, bandwidth):
        """Pure zero-point energy contribution: hf/2 per mode."""
        return 0.5 * constants.h * freq * bandwidth

    def capture_noise_floor(self, num_averages=100):
        """Capture and average noise floor measurements."""
        accumulated = np.zeros(NUM_SAMPLES // 2)
        for i in range(num_averages):
            if self.sdr:
                samples = self.sdr.read_samples(NUM_SAMPLES)
            else:
                # Simulate thermal + zero-point noise
                thermal = np.sqrt(constants.k * self.temperature * self.sample_rate)
                zpe = np.sqrt(0.5 * constants.h * self.center_freq * self.sample_rate)
                noise_amp = np.sqrt(thermal**2 + zpe**2) * 1e6  # Scaled for SDR units
                samples = noise_amp * (np.random.randn(NUM_SAMPLES) +
                                       1j * np.random.randn(NUM_SAMPLES))
            window = signal.windows.blackmanharris(NUM_SAMPLES)
            spec = fft(samples * window)
            psd = np.abs(spec[:NUM_SAMPLES // 2]) ** 2
            accumulated += psd
        return accumulated / num_averages

    def analyze_noise_statistics(self, samples_block):
        """Analyze noise statistics for quantum signatures."""
        if self.sdr:
            samples = self.sdr.read_samples(NUM_SAMPLES)
        else:
            noise = np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES)
            samples = noise
        amplitudes = np.abs(samples)
        # Quantum noise should follow Rayleigh distribution
        param = stats.rayleigh.fit(amplitudes)
        _, ks_p = stats.kstest(amplitudes, 'rayleigh', param)
        # Check for excess kurtosis (quantum squeezing indicator)
        kurtosis = stats.kurtosis(amplitudes)
        return {
            'rayleigh_p': ks_p,
            'is_rayleigh': ks_p > 0.05,
            'kurtosis': kurtosis,
            'mean_amplitude': np.mean(amplitudes),
            'std_amplitude': np.std(amplitudes)
        }

    def spectral_comparison(self):
        """Compare measured noise floor with theoretical predictions."""
        freqs = np.linspace(self.center_freq - self.sample_rate/2,
                           self.center_freq + self.sample_rate/2, 100)
        bw = self.sample_rate / 100
        results = []
        for f in freqs:
            thermal = self.thermal_noise_power(f, bw)
            quantum = self.quantum_noise_power(f, bw)
            zpe = self.zero_point_contribution(f, bw)
            results.append({
                'freq': f,
                'thermal_dBm': 10 * np.log10(thermal * 1000 + 1e-30),
                'quantum_dBm': 10 * np.log10(quantum * 1000 + 1e-30),
                'zpe_dBm': 10 * np.log10(zpe * 1000 + 1e-30),
                'zpe_fraction': zpe / quantum
            })
        return results

    def run_measurement(self, num_averages=50):
        """Run zero-point energy measurement campaign."""
        self.init_sdr()
        print(f"[ZPE] Zero-Point Energy Measurement")
        print(f"  Frequency: {self.center_freq/1e6:.1f} MHz")
        print(f"  Temperature: {self.temperature} K")

        # Theoretical comparison
        print("\n--- Theoretical Noise Components ---")
        bw = 1e3  # 1 kHz bandwidth
        thermal = self.thermal_noise_power(self.center_freq, bw)
        quantum = self.quantum_noise_power(self.center_freq, bw)
        zpe = self.zero_point_contribution(self.center_freq, bw)
        print(f"  Thermal (kT*B):    {10*np.log10(thermal*1e3+1e-30):.1f} dBm")
        print(f"  Quantum (full):    {10*np.log10(quantum*1e3+1e-30):.1f} dBm")
        print(f"  Zero-point (hf/2): {10*np.log10(zpe*1e3+1e-30):.1f} dBm")
        print(f"  ZPE/Total ratio:   {zpe/quantum*100:.6f}%")
        print(f"  Note: At {self.center_freq/1e6:.0f} MHz, ZPE is negligible vs thermal")

        # Noise floor measurement
        print(f"\n--- Noise Floor Measurement ({num_averages} averages) ---")
        psd_avg = self.capture_noise_floor(num_averages)
        noise_floor = 10 * np.log10(np.mean(psd_avg) + 1e-30)
        noise_std = 10 * np.log10(np.std(psd_avg) + 1e-30)
        print(f"  Mean noise floor:  {noise_floor:.2f} dB")
        print(f"  Noise std dev:     {noise_std:.2f} dB")

        # Statistical analysis
        print("\n--- Noise Statistics ---")
        noise_stats = self.analyze_noise_statistics(psd_avg)
        print(f"  Rayleigh test p:   {noise_stats['rayleigh_p']:.4f} "
              f"({'PASS' if noise_stats['is_rayleigh'] else 'FAIL'})")
        print(f"  Kurtosis:          {noise_stats['kurtosis']:.4f}")
        print(f"  (Rayleigh = thermal/quantum noise; deviation may indicate artifacts)")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Zero-Point Energy Meter')
    parser.add_argument('-f', '--freq', type=float, default=50e6, help='Center freq Hz')
    parser.add_argument('-T', '--temp', type=float, default=300, help='Temperature K')
    parser.add_argument('-n', '--averages', type=int, default=50, help='Num averages')
    args = parser.parse_args()

    meter = ZeroPointMeter(args.freq)
    meter.temperature = args.temp
    try:
        meter.run_measurement(args.averages)
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        meter.close()


if __name__ == '__main__':
    main()
