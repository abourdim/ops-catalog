#!/usr/bin/env python3
"""Bluetooth Impersonator - SDR Companion
Captures and analyzes BLE advertisement packets via SDR for
Bluetooth device fingerprinting and impersonation detection.
FOR AUTHORIZED SECURITY TESTING ONLY.
"""

import numpy as np
from scipy import signal
from scipy.fft import fft, fftfreq
import struct
import time
import argparse

CENTER_FREQ = 2.426e9  # BLE advertising channel 38
SAMPLE_RATE = 2e6
GAIN = 40
NUM_SAMPLES = 256 * 1024
BLE_ADV_CHANNELS = [2.402e9, 2.426e9, 2.480e9]  # Ch 37, 38, 39

class BLEImpersonatorSDR:
    """BLE advertisement capture and analysis via SDR."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.captured_devices = []

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
        sig = 0.01 * (np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES))
        # Simulate BLE advertisement bursts
        for _ in range(np.random.randint(1, 5)):
            start = np.random.randint(0, NUM_SAMPLES - 5000)
            # GFSK-like modulation
            data = np.random.bytes(40)
            bits = np.unpackbits(np.frombuffer(data, dtype=np.uint8))[:320]
            freq_dev = 250e3  # BLE frequency deviation
            phase = np.cumsum(2 * bits - 1) * freq_dev / self.sample_rate * 2 * np.pi
            symbol_rate = int(self.sample_rate / 1e6)
            phase_up = np.repeat(phase, max(symbol_rate, 1))[:5000]
            sig[start:start+len(phase_up)] += 0.3 * np.exp(1j * phase_up)
        return sig

    def detect_ble_packets(self, samples):
        """Detect BLE advertisement packets in captured data."""
        envelope = np.abs(samples)
        threshold = np.mean(envelope) + 3 * np.std(envelope)
        above = envelope > threshold
        packets = []
        in_packet = False
        start = 0
        for i in range(len(above)):
            if above[i] and not in_packet:
                start = i; in_packet = True
            elif not above[i] and in_packet:
                if i - start > 50:
                    packets.append({
                        'start': start, 'end': i,
                        'duration_us': (i - start) / self.sample_rate * 1e6,
                        'peak_power': 20 * np.log10(np.max(envelope[start:i]) + 1e-12),
                        'samples': samples[start:i]
                    })
                in_packet = False
        return packets

    def estimate_device_address(self, packet_samples):
        """Estimate device address from packet correlation."""
        # Use autocorrelation to find access address pattern
        samples = np.real(packet_samples[:1000])
        corr = np.correlate(samples, samples, mode='full')
        corr = corr[len(corr)//2:]
        peaks = signal.find_peaks(corr, height=np.max(corr)*0.5, distance=10)[0]
        # Generate pseudo-address from correlation signature
        addr = np.uint32(hash(tuple(peaks[:4])) & 0xFFFFFFFF)
        return f"{(addr>>24)&0xFF:02X}:{(addr>>16)&0xFF:02X}:" \
               f"{(addr>>8)&0xFF:02X}:{addr&0xFF:02X}"

    def fingerprint_device(self, packets):
        """Create RF fingerprint of BLE device."""
        if not packets:
            return None
        # Timing fingerprint
        intervals = []
        for i in range(1, len(packets)):
            intervals.append(packets[i]['start'] - packets[i-1]['end'])
        avg_interval = np.mean(intervals) if intervals else 0
        avg_power = np.mean([p['peak_power'] for p in packets])
        avg_duration = np.mean([p['duration_us'] for p in packets])
        return {
            'avg_interval': avg_interval / self.sample_rate * 1e3,
            'avg_power_dBm': avg_power,
            'avg_duration_us': avg_duration,
            'packet_count': len(packets)
        }

    def channel_sweep(self):
        """Sweep BLE advertising channels."""
        results = {}
        for ch_freq in BLE_ADV_CHANNELS:
            ch_num = {2.402e9: 37, 2.426e9: 38, 2.480e9: 39}[ch_freq]
            self.center_freq = ch_freq
            if self.sdr:
                self.sdr.center_freq = ch_freq
            samples = self.capture()
            packets = self.detect_ble_packets(samples)
            results[ch_num] = {
                'freq': ch_freq,
                'packets': len(packets),
                'devices_est': max(1, len(packets) // 3) if packets else 0
            }
        return results

    def run_scan(self, duration=20):
        """Run BLE impersonation scan."""
        self.init_sdr()
        print(f"[BLE] Bluetooth Impersonation Scanner")
        print(f"  Center: {self.center_freq/1e9:.3f} GHz")

        # Channel sweep
        print(f"\n--- BLE Channel Sweep ---")
        ch_results = self.channel_sweep()
        for ch, r in sorted(ch_results.items()):
            print(f"  Ch {ch} ({r['freq']/1e9:.3f} GHz): "
                  f"{r['packets']} packets, ~{r['devices_est']} devices")

        # Continuous capture
        print(f"\n--- Continuous Capture ({duration}s) ---")
        self.center_freq = CENTER_FREQ
        start = time.time()
        total_packets = 0
        while time.time() - start < duration:
            samples = self.capture()
            packets = self.detect_ble_packets(samples)
            total_packets += len(packets)
            fp = self.fingerprint_device(packets)
            if fp and fp['packet_count'] > 0:
                addr = self.estimate_device_address(packets[0]['samples'])
                print(f"  Device {addr}: {fp['packet_count']} pkts, "
                      f"power={fp['avg_power_dBm']:.1f} dBm, "
                      f"dur={fp['avg_duration_us']:.0f} us")
            time.sleep(0.5)

        print(f"\n[RESULT] Total packets captured: {total_packets}")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='BLE Impersonation SDR Scanner')
    parser.add_argument('-d', '--duration', type=int, default=20)
    args = parser.parse_args()

    scanner = BLEImpersonatorSDR()
    try:
        scanner.run_scan(args.duration)
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        scanner.close()

if __name__ == '__main__':
    main()
