#!/usr/bin/env python3
"""
Ham SSTV Gallery Receiver
Receives Slow-Scan Television (SSTV) transmissions from amateur bands.
Detects SSTV VIS codes (Vertical Interval Signaling) to identify the
SSTV mode, and extracts image data from the audio tones.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time

SSTV_FREQ = 145.5e6       # Common SSTV simplex frequency
SAMPLE_RATE = 250e3
AUDIO_RATE = 11025
GAIN = 40
CAPTURE_SECONDS = 60

# SSTV VIS codes for common modes
VIS_CODES = {
    60: "Scottie_S1", 56: "Scottie_S2",
    44: "Martin_M1", 40: "Martin_M2",
    36: "Robot_36", 72: "Robot_72",
}

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = SSTV_FREQ
    sdr.gain = GAIN
    return sdr

def extract_audio(iq, sr, ar):
    demod = np.angle(iq[1:] * np.conj(iq[:-1]))
    return signal.decimate(demod, int(sr / ar), zero_phase=True)

def detect_vis_header(audio, sample_rate):
    """Detect SSTV VIS (Vertical Interval Signaling) header."""
    # VIS starts with 1900 Hz leader, then 1200 Hz break
    # Then 8 bits at 1100/1300 Hz, then 1200 Hz stop
    frame_size = int(sample_rate * 0.03)  # 30ms frames
    num_frames = len(audio) // frame_size
    freq_timeline = []
    for i in range(num_frames):
        frame = audio[i * frame_size:(i + 1) * frame_size]
        spec = np.abs(np.fft.fft(frame))[:frame_size // 2]
        peak_bin = np.argmax(spec)
        peak_freq = peak_bin * sample_rate / frame_size
        freq_timeline.append(peak_freq)
    # Search for 1900 Hz leader (>300ms) followed by 1200 Hz break
    vis_positions = []
    for i in range(len(freq_timeline) - 20):
        leader_count = sum(1 for f in freq_timeline[i:i+10] if 1800 < f < 2000)
        if leader_count >= 8:
            break_idx = i + 10
            if break_idx < len(freq_timeline) and 1100 < freq_timeline[break_idx] < 1300:
                vis_positions.append(break_idx)
    return vis_positions, freq_timeline

def decode_vis_code(freq_timeline, start_pos, sample_rate):
    """Decode the 8-bit VIS code from frequency timeline."""
    bit_frames = int(0.03 * sample_rate / (sample_rate * 0.03))  # 1 frame = 30ms
    vis_bits = []
    for bit in range(8):
        idx = start_pos + 1 + bit  # Skip break tone
        if idx < len(freq_timeline):
            freq = freq_timeline[idx]
            vis_bits.append(0 if freq > 1200 else 1)  # 1100=1, 1300=0
    vis_code = sum(b << i for i, b in enumerate(vis_bits))
    return vis_code

def freq_to_pixel(freq_hz):
    """Convert SSTV frequency to grayscale pixel value (1500-2300 Hz)."""
    pixel = int((freq_hz - 1500) / (2300 - 1500) * 255)
    return max(0, min(255, pixel))

def main():
    print("=== Ham SSTV Gallery Receiver ===")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(int(CAPTURE_SECONDS * SAMPLE_RATE))
        audio = extract_audio(iq, SAMPLE_RATE, AUDIO_RATE)
        vis_pos, freq_tl = detect_vis_header(audio, AUDIO_RATE)
        print(f"[sstv] Audio: {len(audio)} samples")
        print(f"[sstv] VIS headers found: {len(vis_pos)}")
        for pos in vis_pos:
            vis_code = decode_vis_code(freq_tl, pos, AUDIO_RATE)
            mode = VIS_CODES.get(vis_code, f"Unknown({vis_code})")
            print(f"  VIS code: {vis_code} -> Mode: {mode}")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
