#!/usr/bin/env python3
"""
Ham FT8 Station - Full FT8 Receiver Pipeline
Complete FT8 receive chain: SDR capture, audio extraction, symbol sync,
tone extraction, and Costas array synchronization for FT8 decoding.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time

CENTER_FREQ = 144.174e6
SAMPLE_RATE = 250e3
AUDIO_RATE = 12000
GAIN = 40
FT8_SYMBOL_TIME = 0.160
FT8_NUM_SYMBOLS = 79
FT8_TONES = 8
COSTAS_PATTERN = [3, 1, 4, 0, 6, 5, 2]  # FT8 Costas synchronization array

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    return sdr

def capture_and_demod(sdr, duration_sec):
    iq = sdr.read_samples(int(duration_sec * SAMPLE_RATE))
    demod = np.angle(iq[1:] * np.conj(iq[:-1]))
    dec = int(SAMPLE_RATE / AUDIO_RATE)
    return signal.decimate(demod, dec, zero_phase=True)

def compute_symbol_spectrogram(audio, sample_rate, symbol_time):
    """Compute spectrogram aligned to FT8 symbol boundaries."""
    samples_per_sym = int(sample_rate * symbol_time)
    num_syms = len(audio) // samples_per_sym
    tone_resolution = 1.0 / symbol_time  # 6.25 Hz
    spec_matrix = []
    for i in range(num_syms):
        seg = audio[i * samples_per_sym:(i + 1) * samples_per_sym]
        window = signal.hann(len(seg))
        fft_out = np.abs(np.fft.fft(seg * window))[:samples_per_sym // 2]
        spec_matrix.append(fft_out)
    return np.array(spec_matrix)

def search_costas_sync(spec_matrix, audio_rate, symbol_time):
    """Search for FT8 Costas array synchronization pattern."""
    tone_res = 1.0 / symbol_time
    num_freq_bins = spec_matrix.shape[1]
    best_score = 0
    best_offset = (0, 0)
    # Search across time offsets and frequency offsets
    for t_off in range(max(1, spec_matrix.shape[0] - FT8_NUM_SYMBOLS)):
        for f_off in range(50, min(500, num_freq_bins - 10)):
            score = 0
            for k, tone in enumerate(COSTAS_PATTERN):
                bin_idx = f_off + int(tone * tone_res / (audio_rate / num_freq_bins))
                if 0 <= bin_idx < num_freq_bins and t_off + k < spec_matrix.shape[0]:
                    score += spec_matrix[t_off + k, bin_idx]
            if score > best_score:
                best_score = score
                best_offset = (t_off, f_off)
    return best_offset, best_score

def extract_tones(spec_matrix, time_offset, freq_offset, audio_rate, symbol_time):
    """Extract 8-FSK tone indices for each FT8 symbol."""
    tone_res = 1.0 / symbol_time
    num_freq_bins = spec_matrix.shape[1]
    bin_per_tone = tone_res / (audio_rate / num_freq_bins)
    tones = []
    for sym in range(min(FT8_NUM_SYMBOLS, spec_matrix.shape[0] - time_offset)):
        row = spec_matrix[time_offset + sym]
        tone_powers = []
        for t in range(FT8_TONES):
            bin_idx = int(freq_offset + t * bin_per_tone)
            if 0 <= bin_idx < len(row):
                tone_powers.append(row[bin_idx])
            else:
                tone_powers.append(0)
        tones.append(int(np.argmax(tone_powers)))
    return tones

def main():
    print("=== Ham FT8 Station ===")
    sdr = configure_sdr()
    try:
        audio = capture_and_demod(sdr, 15.5)
        print(f"[ft8] Audio: {len(audio)} samples at {AUDIO_RATE} Hz")
        spec = compute_symbol_spectrogram(audio, AUDIO_RATE, FT8_SYMBOL_TIME)
        print(f"[ft8] Symbol spectrogram: {spec.shape}")
        offset, score = search_costas_sync(spec, AUDIO_RATE, FT8_SYMBOL_TIME)
        print(f"[ft8] Costas sync: t={offset[0]} f={offset[1]} score={score:.1f}")
        tones = extract_tones(spec, offset[0], offset[1], AUDIO_RATE, FT8_SYMBOL_TIME)
        print(f"[ft8] Extracted {len(tones)} tone symbols: {tones[:20]}...")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
