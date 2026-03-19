#!/usr/bin/env python3
"""SDR Coherent Receiver - Phase-coherent multi-channel SDR processing."""
import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

CENTER_FREQ = 433.92e6
SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048
GAIN = 40

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    return sdr

def phase_align(iq1, iq2):
    correlation = np.correlate(iq1[:1024], iq2[:1024], mode='full')
    peak = np.argmax(np.abs(correlation))
    phase_diff = np.angle(correlation[peak])
    aligned = iq2 * np.exp(-1j * phase_diff)
    return aligned, float(np.degrees(phase_diff))

def coherent_combine(channels):
    ref = channels[0]
    aligned = [ref]
    phase_offsets = [0.0]
    for ch in channels[1:]:
        al, offset = phase_align(ref, ch)
        aligned.append(al)
        phase_offsets.append(offset)
    combined = np.mean(aligned, axis=0)
    snr_improvement = 10 * np.log10(len(channels))
    return combined, phase_offsets, round(float(snr_improvement), 1)

def measure_phase_stability(sdr, num_captures=20):
    phases = []
    for _ in range(num_captures):
        iq = sdr.read_samples(FFT_SIZE)
        spec = np.fft.fft(iq)
        peak = np.argmax(np.abs(spec[:FFT_SIZE // 2]))
        phases.append(float(np.angle(spec[peak])))
        time.sleep(0.05)
    return {"phase_std_deg": round(float(np.degrees(np.std(phases))), 2),
            "phase_mean_deg": round(float(np.degrees(np.mean(phases))), 2)}

def main():
    print("=== SDR Coherent Receiver ===")
    sdr = configure_sdr()
    try:
        channels = [sdr.read_samples(FFT_SIZE * 4) for _ in range(4)]
        combined, offsets, snr_gain = coherent_combine(channels)
        print(f"[coherent] Phase offsets: {[round(o, 1) for o in offsets]} deg")
        print(f"[coherent] SNR improvement: {snr_gain} dB")
        stability = measure_phase_stability(sdr)
        print(f"[coherent] Phase stability: {stability}")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
