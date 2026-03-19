#!/usr/bin/env python3
"""Deepfake Voice Detector — RTL-SDR Voice Capture
Captures radio voice communications, demodulates audio,
and feeds it to the deepfake detection ML pipeline.
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
GAIN = 35
PIPE_PATH = "/tmp/sdr_voice_pipe"
NUM_SAMPLES = 256 * 1024
SQUELCH_THRESHOLD_DB = -35


def init_sdr():
    """Initialize RTL-SDR."""
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        logger.info(f"SDR: {CENTER_FREQ/1e6:.3f}MHz, {SAMPLE_RATE/1e6:.1f}MS/s")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_samples(sdr, num_samples=NUM_SAMPLES):
    """Capture IQ samples."""
    if sdr is not None:
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    voice_freqs = [200, 400, 600, 800, 1200, 2000]
    mod_signal = sum(0.3 * np.sin(2 * np.pi * f * t + np.random.uniform(0, 2*np.pi))
                     for f in voice_freqs)
    fm_dev = 5e3
    phase = 2 * np.pi * np.cumsum(mod_signal * fm_dev / SAMPLE_RATE)
    iq = 0.5 * np.exp(1j * phase)
    noise = 0.02 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    return (iq + noise).astype(np.complex64)


def fm_demodulate(iq_samples):
    """FM demodulation."""
    product = iq_samples[1:] * np.conj(iq_samples[:-1])
    return np.angle(product)


def decimate_audio(signal_data, in_rate=SAMPLE_RATE, out_rate=AUDIO_RATE):
    """Decimate to audio rate with anti-alias filter."""
    ratio = int(in_rate / out_rate)
    nyq = out_rate / 2
    cutoff = min(nyq / (in_rate / 2), 0.99)
    b, a = scipy_signal.butter(6, cutoff)
    filtered = scipy_signal.lfilter(b, a, signal_data)
    return filtered[::ratio]


def voice_bandpass(audio, fs=AUDIO_RATE):
    """Bandpass for voice frequencies 100-4000 Hz."""
    nyq = fs / 2
    b, a = scipy_signal.butter(4, [100 / nyq, min(4000 / nyq, 0.99)], btype='band')
    return scipy_signal.lfilter(b, a, audio)


def pre_emphasis(audio, coeff=0.97):
    """Pre-emphasis filter to boost high frequencies."""
    return np.append(audio[0], audio[1:] - coeff * audio[:-1])


def noise_gate(audio, threshold=0.01):
    """Simple noise gate."""
    envelope = np.abs(scipy_signal.hilbert(audio))
    smoothed = scipy_signal.lfilter(np.ones(100) / 100, 1, envelope)
    gate = (smoothed > threshold).astype(np.float32)
    gate = scipy_signal.lfilter(np.ones(50) / 50, 1, gate)
    return audio * np.clip(gate, 0, 1)


def measure_voice_activity(audio, frame_ms=20):
    """Measure voice activity ratio in audio."""
    frame_size = int(AUDIO_RATE * frame_ms / 1000)
    num_frames = len(audio) // frame_size
    active_frames = 0
    for i in range(num_frames):
        frame = audio[i * frame_size:(i + 1) * frame_size]
        energy = np.mean(frame ** 2)
        if energy > 1e-4:
            active_frames += 1
    return active_frames / max(1, num_frames)


def signal_power_db(iq_samples):
    """Measure signal power in dB."""
    return float(10 * np.log10(np.mean(np.abs(iq_samples) ** 2) + 1e-12))


def setup_pipe():
    """Create audio IPC pipe."""
    if os.path.exists(PIPE_PATH):
        os.remove(PIPE_PATH)
    os.mkfifo(PIPE_PATH)
    logger.info(f"Voice pipe: {PIPE_PATH}")


def send_audio(audio):
    """Send audio to ML detector."""
    try:
        audio_int16 = (np.clip(audio, -1, 1) * 32767).astype(np.int16)
        fd = os.open(PIPE_PATH, os.O_WRONLY | os.O_NONBLOCK)
        os.write(fd, audio_int16.tobytes())
        os.close(fd)
        return True
    except OSError:
        return False


def main():
    logger.info("=== Deepfake Voice Detector — SDR Voice Capture ===")
    sdr = init_sdr()
    setup_pipe()
    voice_segments = 0

    try:
        while True:
            iq = capture_samples(sdr)
            power = signal_power_db(iq)
            if power < SQUELCH_THRESHOLD_DB:
                logger.debug(f"Squelch: {power:.1f}dB")
                time.sleep(0.1)
                continue
            demod = fm_demodulate(iq)
            audio = decimate_audio(demod)
            audio = voice_bandpass(audio)
            audio = pre_emphasis(audio)
            audio = noise_gate(audio)
            vad_ratio = measure_voice_activity(audio)
            if vad_ratio > 0.2:
                sent = send_audio(audio)
                voice_segments += 1
                logger.info(f"Voice #{voice_segments}: {len(audio)} smp | "
                            f"VAD={vad_ratio:.0%} | Pwr={power:.1f}dB "
                            f"{'-> ML' if sent else '(pipe busy)'}")
            time.sleep(0.1)

    except KeyboardInterrupt:
        logger.info(f"Stopped. {voice_segments} voice segments captured.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
