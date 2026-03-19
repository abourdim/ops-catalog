#!/usr/bin/env python3
"""Gravitational Wave Simulator - RTL-SDR/HackRF Companion
Simulates gravitational wave strain signals in RF, modulating carrier
frequency to represent spacetime metric perturbations.
"""

import numpy as np
from scipy import signal
from scipy.fft import fft, fftfreq
import time
import argparse

# SDR Configuration
CENTER_FREQ = 100e6
SAMPLE_RATE = 2.4e6
GAIN = 30
NUM_SAMPLES = 512 * 1024

class GravitationalWaveSim:
    """Encodes gravitational wave templates into RF signals."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None

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

    def inspiral_waveform(self, m1=30, m2=30, duration=None):
        """Generate compact binary inspiral waveform (Newtonian chirp).
        m1, m2: component masses in solar masses.
        """
        M_sun = 1.989e30  # kg
        G = 6.674e-11
        c = 3e8
        M = (m1 + m2) * M_sun
        mu = (m1 * m2) / (m1 + m2) * M_sun
        M_chirp = mu ** 0.6 * M ** 0.4

        if duration is None:
            duration = NUM_SAMPLES / self.sample_rate

        t = np.linspace(-duration, 0, int(duration * self.sample_rate))
        tau = np.abs(t) + 1e-6  # Time to coalescence

        # GW frequency evolution (Newtonian)
        f_gw = (1 / np.pi) * (5 / (256 * tau)) ** (3.0 / 8.0) * \
               (G * M_chirp / c ** 3) ** (-5.0 / 8.0)

        # Scale to audio/RF range for demonstration
        f_gw_scaled = f_gw / np.max(f_gw) * (self.sample_rate / 4)

        # Amplitude evolution
        amplitude = (G * M_chirp / c ** 2) * (np.pi * f_gw) ** (2.0 / 3.0)
        amplitude /= np.max(amplitude)

        # Phase
        phase = 2 * np.pi * np.cumsum(f_gw_scaled) / self.sample_rate
        h_plus = amplitude * np.cos(phase)
        h_cross = amplitude * np.sin(phase)

        return t, h_plus, h_cross, f_gw_scaled

    def ringdown_waveform(self, f_qnm=250, tau_decay=0.003, amplitude=1.0):
        """Generate black hole ringdown quasi-normal mode."""
        duration = 5 * tau_decay
        t = np.linspace(0, duration, int(duration * self.sample_rate))
        # QNM: damped sinusoid
        f_scaled = f_qnm / 500 * self.sample_rate / 8
        h = amplitude * np.exp(-t / tau_decay) * np.cos(2 * np.pi * f_scaled * t)
        return t, h

    def encode_gw_to_rf(self, h_plus, h_cross, strain_scale=1e3):
        """Encode GW strain as RF signal modulation."""
        t = np.arange(len(h_plus)) / self.sample_rate
        # Frequency modulation: GW strain modulates carrier
        freq_deviation = strain_scale * h_plus * self.sample_rate / 10
        phase = 2 * np.pi * np.cumsum(freq_deviation) / self.sample_rate
        # Amplitude modulation: h_cross modulates envelope
        envelope = 1 + strain_scale * h_cross * 0.1
        rf_signal = envelope * np.exp(1j * phase)
        return rf_signal

    def matched_filter(self, data, template):
        """Apply matched filter to detect GW signal in data."""
        # Normalize template
        template_norm = template / np.sqrt(np.sum(np.abs(template) ** 2))
        # Cross-correlation in frequency domain
        data_fft = fft(data)
        template_fft = fft(template_norm, n=len(data))
        corr = np.abs(np.fft.ifft(data_fft * np.conj(template_fft)))
        snr = corr / np.std(corr)
        return snr

    def capture_and_detect(self, template_h):
        """Capture RF and attempt GW template matching."""
        if self.sdr:
            samples = self.sdr.read_samples(NUM_SAMPLES)
        else:
            rf = self.encode_gw_to_rf(template_h, np.zeros_like(template_h))
            noise = 0.5 * (np.random.randn(len(rf)) + 1j * np.random.randn(len(rf)))
            samples = rf + noise
        return samples

    def run_simulation(self, m1=30, m2=30):
        """Run gravitational wave RF simulation."""
        self.init_sdr()
        print(f"[GW] Gravitational Wave RF Simulator")
        print(f"  Binary: {m1} + {m2} solar masses")

        # Generate inspiral
        print(f"\n--- Inspiral Waveform ---")
        t, h_plus, h_cross, f_gw = self.inspiral_waveform(m1, m2)
        print(f"  Duration:  {abs(t[0])*1000:.1f} ms")
        print(f"  Peak freq: {np.max(f_gw)/1e3:.1f} kHz (scaled)")
        print(f"  Samples:   {len(t)}")

        # Chirp evolution
        print(f"\n--- Chirp Evolution ---")
        for idx in np.linspace(0, len(t) - 1, 8, dtype=int):
            print(f"  t={t[idx]*1000:+8.2f} ms  f={f_gw[idx]/1e3:8.1f} kHz  "
                  f"h+={h_plus[idx]:+.4f}")

        # Encode to RF
        print(f"\n--- RF Encoding ---")
        rf_signal = self.encode_gw_to_rf(h_plus, h_cross)
        print(f"  RF bandwidth: {np.std(np.diff(np.angle(rf_signal)))*self.sample_rate/(2*np.pi)/1e3:.1f} kHz")

        # Ringdown
        print(f"\n--- Ringdown ---")
        t_rd, h_rd = self.ringdown_waveform()
        print(f"  QNM duration: {len(t_rd)/self.sample_rate*1000:.2f} ms")

        # Matched filter detection
        print(f"\n--- Matched Filter Detection ---")
        samples = self.capture_and_detect(h_plus)
        snr = self.matched_filter(np.real(samples[:len(h_plus)]), h_plus)
        peak_snr = np.max(snr)
        print(f"  Peak SNR:   {peak_snr:.1f}")
        print(f"  Detection:  {'YES' if peak_snr > 8 else 'NO'} (threshold=8)")
        if peak_snr > 8:
            peak_time = np.argmax(snr) / self.sample_rate
            print(f"  Merger at:  {peak_time*1000:.2f} ms")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='GW RF Simulator')
    parser.add_argument('-m1', '--mass1', type=float, default=30, help='Mass 1 (solar)')
    parser.add_argument('-m2', '--mass2', type=float, default=30, help='Mass 2 (solar)')
    args = parser.parse_args()

    sim = GravitationalWaveSim()
    try:
        sim.run_simulation(args.mass1, args.mass2)
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        sim.close()


if __name__ == '__main__':
    main()
