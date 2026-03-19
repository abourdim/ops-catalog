#!/usr/bin/env python3
"""WiFi Karma Attack - SDR Companion
Monitors WiFi probe requests via SDR and detects KARMA-style attacks
by analyzing probe/response patterns in the 2.4 GHz band.
FOR AUTHORIZED SECURITY TESTING ONLY.
"""

import numpy as np
from scipy import signal
from scipy.fft import fft, fftfreq
import time
import argparse

CENTER_FREQ = 2.437e9  # WiFi Channel 6
SAMPLE_RATE = 2e6
GAIN = 40
NUM_SAMPLES = 256 * 1024

class KarmaDetectorSDR:
    """Detects KARMA WiFi attacks by monitoring probe/response patterns."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.probe_history = []

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

    def capture(self):
        if self.sdr:
            return self.sdr.read_samples(NUM_SAMPLES)
        t = np.arange(NUM_SAMPLES) / self.sample_rate
        sig = 0.02 * (np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES))
        # Simulate WiFi management frames
        for _ in range(np.random.randint(2, 8)):
            start = np.random.randint(0, NUM_SAMPLES - 8000)
            duration = np.random.randint(2000, 8000)
            f_off = np.random.uniform(-0.5e6, 0.5e6)
            sig[start:start+duration] += 0.4 * np.exp(2j * np.pi * f_off *
                                                        t[start:start+duration])
        return sig

    def detect_wifi_frames(self, samples):
        """Detect WiFi frame bursts in captured data."""
        envelope = np.abs(samples)
        threshold = np.mean(envelope) + 4 * np.std(envelope)
        frames = []
        in_frame = False
        start = 0
        for i in range(len(envelope)):
            if envelope[i] > threshold and not in_frame:
                start = i; in_frame = True
            elif envelope[i] < threshold and in_frame:
                if i - start > 100:
                    frames.append({
                        'start': start, 'end': i,
                        'duration_us': (i - start) / self.sample_rate * 1e6,
                        'power': 20 * np.log10(np.max(envelope[start:i]) + 1e-12)
                    })
                in_frame = False
        return frames

    def classify_frame(self, frame_samples):
        """Classify WiFi frame type by duration and bandwidth."""
        duration = len(frame_samples) / self.sample_rate * 1e6
        bw = self.estimate_bandwidth(frame_samples)
        if duration < 200:
            return 'ACK'
        elif duration < 500 and bw < 500e3:
            return 'ProbeReq'
        elif duration < 1000:
            return 'ProbeResp'
        elif duration > 2000:
            return 'Beacon'
        return 'Data'

    def estimate_bandwidth(self, samples):
        """Estimate signal bandwidth."""
        spec = np.abs(fft(samples))
        freqs = fftfreq(len(samples), 1 / self.sample_rate)
        threshold = np.max(spec) * 0.1
        above = np.abs(freqs[spec > threshold])
        return np.max(above) - np.min(above) if len(above) > 1 else 0

    def detect_karma_pattern(self, frames):
        """Detect KARMA attack: AP responding to every probe with matching SSID."""
        if len(frames) < 4:
            return False, 0
        # KARMA pattern: probe followed by very fast response
        fast_responses = 0
        for i in range(1, len(frames)):
            gap = (frames[i]['start'] - frames[i-1]['end']) / self.sample_rate * 1e6
            if gap < 100 and gap > 5:  # 5-100 us response time
                fast_responses += 1
        ratio = fast_responses / len(frames)
        # KARMA APs respond to nearly all probes
        return ratio > 0.6, ratio

    def channel_sweep(self):
        """Sweep WiFi channels for KARMA detection."""
        channels = {1: 2.412e9, 6: 2.437e9, 11: 2.462e9}
        results = {}
        for ch, freq in channels.items():
            self.center_freq = freq
            if self.sdr:
                self.sdr.center_freq = freq
            samples = self.capture()
            frames = self.detect_wifi_frames(samples)
            karma, ratio = self.detect_karma_pattern(frames)
            results[ch] = {
                'frames': len(frames),
                'karma_detected': karma,
                'response_ratio': ratio
            }
        return results

    def run_detection(self, duration=20):
        self.init_sdr()
        print(f"[KARMA] WiFi KARMA Attack Detector")

        # Channel sweep
        print(f"\n--- Channel Sweep ---")
        ch_results = self.channel_sweep()
        for ch, r in sorted(ch_results.items()):
            status = "KARMA DETECTED!" if r['karma_detected'] else "Clean"
            print(f"  Ch {ch}: {r['frames']} frames, ratio={r['response_ratio']:.2f} [{status}]")

        # Continuous monitoring
        print(f"\n--- Continuous Monitoring ({duration}s) ---")
        self.center_freq = CENTER_FREQ
        start = time.time()
        alert_count = 0
        while time.time() - start < duration:
            samples = self.capture()
            frames = self.detect_wifi_frames(samples)
            karma, ratio = self.detect_karma_pattern(frames)
            if karma:
                alert_count += 1
                print(f"  [ALERT] KARMA pattern detected! Ratio={ratio:.2f} Frames={len(frames)}")
            elif frames:
                print(f"  {len(frames)} frames detected (normal)")
            time.sleep(0.5)

        print(f"\n[RESULT] {alert_count} KARMA alerts in {duration}s")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='KARMA WiFi Attack Detector SDR')
    parser.add_argument('-d', '--duration', type=int, default=20)
    args = parser.parse_args()

    det = KarmaDetectorSDR()
    try:
        det.run_detection(args.duration)
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        det.close()

if __name__ == '__main__':
    main()
