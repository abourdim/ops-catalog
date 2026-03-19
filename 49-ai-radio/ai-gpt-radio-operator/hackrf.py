#!/usr/bin/env python3
"""GPT Radio Operator — RTL-SDR Capture & Audio Extraction
Captures RF signals, demodulates audio, and provides signal metrics
to the AI radio operator for voice command processing.
"""

import numpy as np
import time
import os
import logging
from scipy import signal as scipy_signal
from scipy.fft import fft, fftshift

logging.basicConfig(level=logging.INFO, format='%(asctime)s [SDR] %(message)s')
logger = logging.getLogger(__name__)

CENTER_FREQ = 145.5e6
SAMPLE_RATE = 2.4e6
AUDIO_RATE = 16000
GAIN = 30
PIPE_PATH = "/tmp/sdr_audio_pipe"
NUM_SAMPLES = 256 * 1024


def init_sdr():
    """Initialize RTL-SDR device."""
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        logger.info(f"SDR ready: {CENTER_FREQ/1e6:.3f}MHz")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_samples(sdr, num_samples=NUM_SAMPLES):
    """Capture IQ samples."""
    if sdr is not None:
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    voice_freq = 300 + 2700 * np.random.rand()
    mod_signal = np.sin(2 * np.pi * voice_freq * t)
    fm_dev = 5e3
    phase = 2 * np.pi * np.cumsum(mod_signal) * fm_dev / SAMPLE_RATE
    iq = np.exp(1j * phase) * 0.5
    noise = 0.02 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    return (iq + noise).astype(np.complex64)


def fm_demodulate(iq_samples):
    """FM demodulation using arctangent method."""
    iq_conj = iq_samples[1:] * np.conj(iq_samples[:-1])
    demod = np.angle(iq_conj)
    return demod


def am_demodulate(iq_samples):
    """AM envelope demodulation."""
    envelope = np.abs(iq_samples)
    envelope -= np.mean(envelope)
    return envelope


def decimate_to_audio(signal_data, input_rate=SAMPLE_RATE, output_rate=AUDIO_RATE):
    """Decimate demodulated signal to audio sample rate."""
    decimation = int(input_rate / output_rate)
    if decimation < 1:
        decimation = 1
    nyquist = output_rate / 2
    cutoff = nyquist / (input_rate / 2)
    if cutoff >= 1.0:
        cutoff = 0.99
    b, a = scipy_signal.butter(5, cutoff)
    filtered = scipy_signal.lfilter(b, a, signal_data)
    decimated = filtered[::decimation]
    return decimated


def bandpass_audio(audio, low=300, high=3000, fs=AUDIO_RATE):
    """Bandpass filter for voice frequencies."""
    nyquist = fs / 2
    low_n = low / nyquist
    high_n = high / nyquist
    if high_n >= 1.0:
        high_n = 0.99
    b, a = scipy_signal.butter(4, [low_n, high_n], btype='band')
    return scipy_signal.lfilter(b, a, audio)


def measure_signal(iq_samples):
    """Measure signal characteristics."""
    power = np.mean(np.abs(iq_samples) ** 2)
    power_db = 10 * np.log10(power + 1e-12)
    spectrum = np.abs(fftshift(fft(iq_samples[:1024]))) ** 2
    noise_floor = np.median(10 * np.log10(spectrum + 1e-12))
    peak_power = np.max(10 * np.log10(spectrum + 1e-12))
    snr = peak_power - noise_floor
    return {
        "power_db": float(power_db),
        "snr_db": float(snr),
        "noise_floor_db": float(noise_floor),
    }


def squelch(audio, iq_samples, threshold_db=-30):
    """Apply squelch — mute audio when signal is below threshold."""
    power_db = 10 * np.log10(np.mean(np.abs(iq_samples) ** 2) + 1e-12)
    if power_db < threshold_db:
        return np.zeros_like(audio), False
    return audio, True


def setup_pipe():
    """Create named pipe for audio IPC."""
    if os.path.exists(PIPE_PATH):
        os.remove(PIPE_PATH)
    os.mkfifo(PIPE_PATH)
    logger.info(f"Audio pipe created: {PIPE_PATH}")


def send_audio_pipe(audio):
    """Send audio samples to ML engine."""
    try:
        audio_int16 = (audio * 32767).astype(np.int16)
        fd = os.open(PIPE_PATH, os.O_WRONLY | os.O_NONBLOCK)
        os.write(fd, audio_int16.tobytes())
        os.close(fd)
        return True
    except OSError:
        return False


def set_frequency(sdr, freq_mhz):
    """Tune SDR to new frequency."""
    freq_hz = freq_mhz * 1e6
    if sdr is not None:
        sdr.center_freq = freq_hz
    logger.info(f"Tuned to {freq_mhz:.3f} MHz")


def main():
    logger.info("=== GPT Radio Operator — SDR Audio Engine ===")
    sdr = init_sdr()
    setup_pipe()
    mode = "FM"

    try:
        while True:
            iq = capture_samples(sdr)
            if mode == "FM":
                demod = fm_demodulate(iq)
            else:
                demod = am_demodulate(iq)
            audio = decimate_to_audio(demod)
            audio = bandpass_audio(audio)
            audio, is_active = squelch(audio, iq)
            metrics = measure_signal(iq)
            sent = send_audio_pipe(audio) if is_active else False
            status = "ACTIVE" if is_active else "SQUELCH"
            logger.info(f"[{status}] {mode} | SNR={metrics['snr_db']:.1f}dB | "
                        f"Pwr={metrics['power_db']:.1f}dB | "
                        f"Audio={len(audio)} smp {'-> NLP' if sent else ''}")
            time.sleep(0.2)

    except KeyboardInterrupt:
        logger.info("SDR audio stopped.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
