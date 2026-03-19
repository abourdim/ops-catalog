#!/usr/bin/env python3
"""
Ham WSPR Beacon Receiver
Receives WSPR (Weak Signal Propagation Reporter) transmissions.
WSPR uses 4-FSK modulation with 1.46 Hz tone spacing over 110.6 second
transmit periods, enabling decoding at -28 dB SNR.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time

WSPR_FREQ = 144.4905e6    # 2m WSPR dial frequency
SAMPLE_RATE = 250e3
AUDIO_RATE = 12000
FFT_SIZE = 8192
GAIN = 49
WSPR_PERIOD = 120          # 2-minute WSPR window
WSPR_TONE_SPACING = 1.4648 # Hz
WSPR_SYMBOLS = 162

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = WSPR_FREQ
    sdr.gain = GAIN
    return sdr

def capture_wspr_window(sdr):
    """Capture a full 2-minute WSPR window."""
    print(f"[wspr] Capturing {WSPR_PERIOD}s WSPR window...")
    iq = sdr.read_samples(int(WSPR_PERIOD * SAMPLE_RATE))
    demod = np.angle(iq[1:] * np.conj(iq[:-1]))
    dec = int(SAMPLE_RATE / AUDIO_RATE)
    return signal.decimate(demod, dec, zero_phase=True)

def search_wspr_signals(audio, sample_rate):
    """Search audio spectrum for WSPR-width signals (~6 Hz bandwidth)."""
    # Long FFT for high frequency resolution
    fft_size = min(len(audio), 65536)
    window = signal.blackmanharris(fft_size)
    spec = np.abs(np.fft.fft(audio[:fft_size] * window))[:fft_size // 2]
    freq_res = sample_rate / fft_size
    freq_axis = np.arange(fft_size // 2) * freq_res
    noise = np.median(spec)
    # WSPR signals occupy ~6 Hz (4 tones * 1.46 Hz)
    wspr_bw_bins = int(6 / freq_res) + 1
    candidates = []
    for start_bin in range(100, len(spec) - wspr_bw_bins):
        region_power = np.sum(spec[start_bin:start_bin + wspr_bw_bins])
        if region_power > noise * wspr_bw_bins * 5:
            center_freq = freq_axis[start_bin + wspr_bw_bins // 2]
            if 1400 < center_freq < 1600:  # WSPR audio passband
                snr = 10 * np.log10(region_power / (noise * wspr_bw_bins + 1e-12))
                candidates.append({
                    "freq_hz": round(float(center_freq), 2),
                    "snr_db": round(float(snr), 1),
                })
    # Deduplicate nearby candidates
    unique = []
    for c in sorted(candidates, key=lambda x: -x["snr_db"]):
        if not unique or all(abs(c["freq_hz"] - u["freq_hz"]) > 10 for u in unique):
            unique.append(c)
    return unique

def main():
    print("=== Ham WSPR Beacon Receiver ===")
    sdr = configure_sdr()
    try:
        audio = capture_wspr_window(sdr)
        print(f"[wspr] Audio: {len(audio)} samples at {AUDIO_RATE} Hz")
        signals = search_wspr_signals(audio, AUDIO_RATE)
        print(f"[wspr] Detected {len(signals)} WSPR candidates:")
        for s in signals:
            dial_offset = s["freq_hz"] - 1500
            print(f"  Audio: {s['freq_hz']:.2f} Hz | Offset: {dial_offset:+.2f} Hz | "
                  f"SNR: {s['snr_db']:.1f} dB")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
