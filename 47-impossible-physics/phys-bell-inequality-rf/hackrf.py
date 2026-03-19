#!/usr/bin/env python3
"""Bell Inequality RF - RTL-SDR/HackRF Companion
Tests Bell-type inequalities using correlated RF noise sources as
classical analogues to quantum entanglement experiments.
"""

import numpy as np
from scipy import signal, stats
from scipy.fft import fft, fftfreq
import time
import argparse

# SDR Configuration
CENTER_FREQ = 100e6
SAMPLE_RATE = 2.4e6
GAIN = 20
NUM_SAMPLES = 128 * 1024
NUM_TRIALS = 1000

class BellInequalityRF:
    """Tests CHSH Bell inequality using correlated RF signals."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.bell_limit = 2.0        # Classical CHSH limit
        self.quantum_limit = 2 * np.sqrt(2)  # Tsirelson bound ~2.828

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

    def generate_correlated_pair(self, correlation=1.0):
        """Generate correlated noise pair (classical analogue of entangled photons)."""
        common = np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES)
        noise_a = np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES)
        noise_b = np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES)
        signal_a = correlation * common + np.sqrt(1 - correlation**2) * noise_a
        signal_b = correlation * common + np.sqrt(1 - correlation**2) * noise_b
        return signal_a, signal_b

    def measure_at_angle(self, sig, angle):
        """Measure signal projection at given polarization angle."""
        rotated = np.real(sig) * np.cos(angle) + np.imag(sig) * np.sin(angle)
        return np.sign(rotated)  # Binary outcome: +1 or -1

    def compute_correlation(self, outcomes_a, outcomes_b):
        """Compute expectation value E(a,b) = <A*B>."""
        return np.mean(outcomes_a * outcomes_b)

    def chsh_test(self, sig_a, sig_b, angles_a=(0, np.pi/4),
                  angles_b=(np.pi/8, 3*np.pi/8)):
        """Compute CHSH parameter S = |E(a1,b1) - E(a1,b2) + E(a2,b1) + E(a2,b2)|."""
        a1, a2 = angles_a
        b1, b2 = angles_b

        A1 = self.measure_at_angle(sig_a, a1)
        A2 = self.measure_at_angle(sig_a, a2)
        B1 = self.measure_at_angle(sig_b, b1)
        B2 = self.measure_at_angle(sig_b, b2)

        E11 = self.compute_correlation(A1, B1)
        E12 = self.compute_correlation(A1, B2)
        E21 = self.compute_correlation(A2, B1)
        E22 = self.compute_correlation(A2, B2)

        S = abs(E11 - E12 + E21 + E22)
        return S, {'E11': E11, 'E12': E12, 'E21': E21, 'E22': E22}

    def capture_pair(self):
        """Capture correlated signal pair."""
        if self.sdr:
            samples = self.sdr.read_samples(NUM_SAMPLES * 2)
            sig_a = samples[:NUM_SAMPLES]
            sig_b = samples[NUM_SAMPLES:]
        else:
            sig_a, sig_b = self.generate_correlated_pair(correlation=0.95)
        return sig_a, sig_b

    def statistical_analysis(self, S_values):
        """Analyze Bell test results statistically."""
        mean_S = np.mean(S_values)
        std_S = np.std(S_values)
        # Test against classical limit
        t_stat = (mean_S - self.bell_limit) / (std_S / np.sqrt(len(S_values)))
        p_value = stats.t.sf(t_stat, len(S_values) - 1)
        return {
            'mean_S': mean_S,
            'std_S': std_S,
            'sigma_violation': (mean_S - self.bell_limit) / std_S,
            't_statistic': t_stat,
            'p_value': p_value,
            'violates_bell': mean_S > self.bell_limit
        }

    def angle_sweep(self, sig_a, sig_b, n_angles=36):
        """Sweep measurement angles and compute correlation."""
        angles = np.linspace(0, np.pi, n_angles)
        correlations = []
        for theta in angles:
            A = self.measure_at_angle(sig_a, 0)
            B = self.measure_at_angle(sig_b, theta)
            E = self.compute_correlation(A, B)
            correlations.append(E)
        return angles, np.array(correlations)

    def run_bell_test(self, num_trials=100):
        """Run full Bell inequality test."""
        self.init_sdr()
        print(f"[BELL] CHSH Bell Inequality RF Test")
        print(f"  Classical limit (CHSH): S <= {self.bell_limit:.3f}")
        print(f"  Quantum limit (Tsirelson): S <= {self.quantum_limit:.3f}")
        print(f"  Trials: {num_trials}")

        S_values = []
        for i in range(num_trials):
            sig_a, sig_b = self.capture_pair()
            S, correlations = self.chsh_test(sig_a, sig_b)
            S_values.append(S)
            if i < 5 or i == num_trials - 1:
                print(f"  Trial {i+1:3d}: S={S:.4f}  "
                      f"E(a1,b1)={correlations['E11']:+.3f}  "
                      f"E(a1,b2)={correlations['E12']:+.3f}")

        # Statistical analysis
        print(f"\n--- Statistical Analysis ---")
        result = self.statistical_analysis(S_values)
        print(f"  Mean S:    {result['mean_S']:.4f} +/- {result['std_S']:.4f}")
        print(f"  Violation: {result['sigma_violation']:.1f} sigma")
        print(f"  p-value:   {result['p_value']:.6f}")
        verdict = "VIOLATED" if result['violates_bell'] else "RESPECTED"
        print(f"  Bell inequality: {verdict}")

        if result['violates_bell']:
            print("  Note: Classical correlations can appear to violate Bell")
            print("  inequality due to shared noise source (not true nonlocality)")

        # Angle sweep
        print(f"\n--- Correlation vs Angle ---")
        sig_a, sig_b = self.capture_pair()
        angles, corrs = self.angle_sweep(sig_a, sig_b)
        for i in range(0, len(angles), len(angles) // 6):
            print(f"  theta={np.degrees(angles[i]):5.1f} deg  E={corrs[i]:+.3f}")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Bell Inequality RF Test')
    parser.add_argument('-f', '--freq', type=float, default=100e6, help='Center freq')
    parser.add_argument('-n', '--trials', type=int, default=100, help='Num trials')
    args = parser.parse_args()

    bell = BellInequalityRF(args.freq)
    try:
        bell.run_bell_test(args.trials)
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        bell.close()


if __name__ == '__main__':
    main()
