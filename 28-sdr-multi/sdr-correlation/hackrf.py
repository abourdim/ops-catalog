#!/usr/bin/env python3
"""SDR Correlation Receiver - Cross-correlation signal detection for weak signals."""
import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

CENTER_FREQ = 137.1e6
SAMPLE_RATE = 250e3
FFT_SIZE = 4096
GAIN = 49

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    return sdr

def generate_reference_chirp(bandwidth, duration, sample_rate):
    t = np.arange(int(sample_rate * duration)) / sample_rate
    return np.exp(1j * np.pi * bandwidth / duration * t ** 2)

def correlate_detect(iq, reference):
    corr = signal.fftconvolve(iq, np.conj(reference[::-1]), mode='valid')
    peak_idx = np.argmax(np.abs(corr))
    peak_val = np.abs(corr[peak_idx])
    noise = np.median(np.abs(corr))
    snr = 10 * np.log10(peak_val / (noise + 1e-12))
    return {"peak_index": int(peak_idx), "snr_db": round(float(snr), 1),
            "delay_sec": round(float(peak_idx / SAMPLE_RATE), 6)}

def coherent_integration(sdr, num_integrations, fft_size):
    accumulated = np.zeros(fft_size, dtype=np.complex128)
    for _ in range(num_integrations):
        iq = sdr.read_samples(fft_size)
        accumulated += iq
    accumulated /= num_integrations
    power_coherent = 10 * np.log10(np.mean(np.abs(accumulated) ** 2) + 1e-12)
    # Compare with incoherent integration
    power_sum = 0
    for _ in range(num_integrations):
        iq = sdr.read_samples(fft_size)
        power_sum += np.mean(np.abs(iq) ** 2)
    power_incoherent = 10 * np.log10(power_sum / num_integrations + 1e-12)
    return {"coherent_db": round(float(power_coherent), 1),
            "incoherent_db": round(float(power_incoherent), 1),
            "gain_db": round(float(power_coherent - power_incoherent), 1)}

def main():
    print("=== SDR Correlation Receiver ===")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(FFT_SIZE * 16)
        ref = generate_reference_chirp(50e3, 0.001, SAMPLE_RATE)
        result = correlate_detect(iq, ref)
        print(f"[corr] Correlation: SNR={result['snr_db']:.1f} dB, delay={result['delay_sec']*1e6:.1f} us")
        integration = coherent_integration(sdr, 50, FFT_SIZE)
        print(f"[corr] Integration: coherent={integration['coherent_db']:.1f} dB, "
              f"incoherent={integration['incoherent_db']:.1f} dB, gain={integration['gain_db']:.1f} dB")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
