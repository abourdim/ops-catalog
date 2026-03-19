#!/usr/bin/env python3
"""
SDR DSP Workbench
Interactive DSP processing chain for SDR signals. Captures IQ data and
applies configurable filter, decimation, and demodulation blocks.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time

CENTER_FREQ = 100e6
SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048
GAIN = 40

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    return sdr

def apply_fir_filter(iq, num_taps, cutoff_norm):
    taps = signal.firwin(num_taps, cutoff_norm, window='hamming')
    return signal.fftconvolve(iq, taps, mode='same')

def apply_iir_filter(iq, order, cutoff_norm, btype='low'):
    b, a = signal.butter(order, cutoff_norm, btype=btype)
    return signal.filtfilt(b, a, np.real(iq)) + 1j * signal.filtfilt(b, a, np.imag(iq))

def frequency_shift(iq, shift_hz, sample_rate):
    t = np.arange(len(iq)) / sample_rate
    return iq * np.exp(1j * 2 * np.pi * shift_hz * t)

def polyphase_decimate(iq, factor, num_taps=64):
    taps = signal.firwin(num_taps * factor, 1.0 / factor, window='hamming')
    filtered = signal.fftconvolve(iq, taps, mode='same')
    return filtered[::factor]

def compute_spectrogram(iq, sample_rate, nperseg=512):
    f, t, Sxx = signal.spectrogram(iq, fs=sample_rate, nperseg=nperseg, return_onesided=False)
    return f, t, 10 * np.log10(np.fft.fftshift(Sxx, axes=0) + 1e-12)

def measure_evm(iq_symbols, reference_symbols):
    error = iq_symbols[:len(reference_symbols)] - reference_symbols
    evm = np.sqrt(np.mean(np.abs(error) ** 2)) / np.sqrt(np.mean(np.abs(reference_symbols) ** 2))
    return round(float(evm * 100), 2)

def main():
    print("=== SDR DSP Workbench ===")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(FFT_SIZE * 16)
        print(f"[dsp] Captured {len(iq)} IQ samples")
        # FIR filter
        fir_out = apply_fir_filter(iq, 64, 0.3)
        print(f"[dsp] FIR filtered: {len(fir_out)} samples")
        # Frequency shift
        shifted = frequency_shift(iq, 50e3, SAMPLE_RATE)
        print(f"[dsp] Shifted by +50 kHz")
        # Decimate
        decimated = polyphase_decimate(iq, 4)
        print(f"[dsp] Decimated 4x: {len(decimated)} samples ({SAMPLE_RATE/4/1e3:.0f} kHz)")
        # IIR bandpass
        bp = apply_iir_filter(iq, 4, [0.1, 0.4], btype='band')
        print(f"[dsp] IIR bandpass: {len(bp)} samples")
        # Spectrogram
        f, t, Sxx = compute_spectrogram(iq, SAMPLE_RATE)
        print(f"[dsp] Spectrogram: {Sxx.shape}")
        np.savez("dsp_workbench_output.npz", iq=iq[:1024], fir=fir_out[:1024],
                 decimated=decimated[:256])
        print("[dsp] Output saved to dsp_workbench_output.npz")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
