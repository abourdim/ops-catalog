#!/usr/bin/env python3
"""Ghost Network Builder - SDR Companion
Generates and transmits WiFi beacon frames via HackRF to create
phantom access points for wireless security testing.
FOR AUTHORIZED SECURITY TESTING ONLY.
"""

import numpy as np
from scipy import signal
from scipy.fft import fft, fftfreq
import struct
import time
import argparse

CENTER_FREQ = 2.412e9  # WiFi Channel 1
SAMPLE_RATE = 2e6
GAIN = 40
NUM_SAMPLES = 128 * 1024

class GhostNetworkSDR:
    """Creates phantom WiFi networks via SDR beacon injection."""

    def __init__(self, center_freq=CENTER_FREQ, sample_rate=SAMPLE_RATE):
        self.center_freq = center_freq
        self.sample_rate = sample_rate
        self.sdr = None
        self.ghost_ssids = []

    def init_sdr(self):
        try:
            import rtlsdr
            self.sdr = rtlsdr.RtlSdr()
            self.sdr.center_freq = self.center_freq
            self.sdr.sample_rate = self.sample_rate
            self.sdr.gain = GAIN
            print(f"[SDR] RX initialized at {self.center_freq/1e9:.3f} GHz")
        except (ImportError, Exception) as e:
            print(f"[SIM] Simulated mode: {e}")
            self.sdr = None

    def wifi_channel_freq(self, channel):
        """Convert WiFi channel number to frequency."""
        if 1 <= channel <= 13:
            return 2.412e9 + (channel - 1) * 5e6
        return 2.412e9

    def generate_beacon_baseband(self, ssid, bssid=None):
        """Generate 802.11 beacon frame at baseband."""
        if bssid is None:
            bssid = np.random.bytes(6)
        # Simplified beacon frame structure
        frame = bytearray()
        # Frame control: beacon
        frame += struct.pack('<H', 0x0080)
        # Duration
        frame += struct.pack('<H', 0x0000)
        # Destination: broadcast
        frame += b'\xff\xff\xff\xff\xff\xff'
        # Source
        frame += bssid
        # BSSID
        frame += bssid
        # Sequence control
        frame += struct.pack('<H', 0x0000)
        # Timestamp
        frame += struct.pack('<Q', int(time.time() * 1e6))
        # Beacon interval
        frame += struct.pack('<H', 100)
        # Capability info
        frame += struct.pack('<H', 0x0411)
        # SSID tagged parameter
        frame += bytes([0, len(ssid)]) + ssid.encode('utf-8')
        return bytes(frame)

    def modulate_dsss(self, data_bytes):
        """Simple DSSS-like modulation for WiFi baseband."""
        bits = []
        for byte in data_bytes:
            for i in range(8):
                bits.append((byte >> i) & 1)
        # Barker code spreading (simplified)
        barker = np.array([1, -1, 1, 1, -1, 1, 1, 1, -1, -1, -1])
        symbols = []
        for bit in bits:
            chip = barker if bit else -barker
            symbols.extend(chip)
        # Pulse shaping
        symbols = np.array(symbols, dtype=float)
        t_sym = int(self.sample_rate / 1e6)  # Samples per chip
        upsampled = np.repeat(symbols, max(t_sym, 1))
        # BPSK modulation
        t = np.arange(len(upsampled)) / self.sample_rate
        carrier = np.exp(2j * np.pi * 0 * t)
        modulated = upsampled * carrier
        return modulated

    def scan_existing_networks(self):
        """Scan for existing WiFi networks via SDR."""
        samples = self.capture()
        freqs, psd = self.compute_spectrum(samples)
        # Find peaks indicating existing APs
        peaks = signal.find_peaks(psd[:len(psd)//2], height=-40, distance=100)[0]
        networks = []
        for p in peaks:
            networks.append({
                'freq_offset': freqs[p],
                'power': psd[p],
                'channel_est': int((self.center_freq + freqs[p] - 2.412e9) / 5e6) + 1
            })
        return networks

    def capture(self):
        if self.sdr:
            return self.sdr.read_samples(NUM_SAMPLES)
        t = np.arange(NUM_SAMPLES) / self.sample_rate
        sig = 0.05 * (np.random.randn(NUM_SAMPLES) + 1j * np.random.randn(NUM_SAMPLES))
        for i in range(3):
            f = np.random.uniform(-0.8e6, 0.8e6)
            sig += 0.3 * np.exp(2j * np.pi * f * t)
        return sig

    def compute_spectrum(self, samples):
        window = signal.windows.blackmanharris(len(samples))
        spec = fft(samples * window)
        freqs = fftfreq(len(samples), 1 / self.sample_rate)
        psd = 20 * np.log10(np.abs(spec) + 1e-12)
        return freqs, psd

    def build_ghost_network(self, ssid, channel=1):
        """Build a ghost network beacon."""
        bssid = bytes([0x02, np.random.randint(256), np.random.randint(256),
                       np.random.randint(256), np.random.randint(256), np.random.randint(256)])
        beacon = self.generate_beacon_baseband(ssid, bssid)
        baseband = self.modulate_dsss(beacon)
        self.ghost_ssids.append({
            'ssid': ssid, 'channel': channel,
            'bssid': ':'.join(f'{b:02X}' for b in bssid),
            'frame_len': len(beacon), 'samples': len(baseband)
        })
        return baseband

    def run_demo(self, ssids=None, channel=1):
        """Run ghost network demonstration."""
        self.init_sdr()
        if ssids is None:
            ssids = ["Ghost_Net_1", "FreeWiFi_Test", "Phantom_AP",
                     "Security_Audit", "HoneyPot_Lab"]

        print(f"[GHOST] Building {len(ssids)} ghost networks on ch{channel}")
        for ssid in ssids:
            baseband = self.build_ghost_network(ssid, channel)
            info = self.ghost_ssids[-1]
            print(f"  SSID: '{info['ssid']}' BSSID: {info['bssid']} "
                  f"frame: {info['frame_len']}B samples: {info['samples']}")

        print(f"\n[SCAN] Scanning existing networks...")
        networks = self.scan_existing_networks()
        for net in networks[:5]:
            print(f"  Ch~{net['channel_est']} power={net['power']:.1f} dB "
                  f"offset={net['freq_offset']/1e3:.0f} kHz")

        print(f"\n[NOTE] In TX mode (HackRF), ghost beacons would be transmitted.")
        print(f"[NOTE] RTL-SDR is receive-only; use HackRF for transmission.")

    def close(self):
        if self.sdr:
            self.sdr.close()


def main():
    parser = argparse.ArgumentParser(description='Ghost Network SDR Tool')
    parser.add_argument('-c', '--channel', type=int, default=1, help='WiFi channel')
    parser.add_argument('-s', '--ssids', nargs='+', default=None)
    args = parser.parse_args()

    ghost = GhostNetworkSDR(GhostNetworkSDR(sample_rate=SAMPLE_RATE).wifi_channel_freq(args.channel))
    try:
        ghost.run_demo(args.ssids, args.channel)
    except KeyboardInterrupt:
        print("\n[STOP]")
    finally:
        ghost.close()

if __name__ == '__main__':
    main()
