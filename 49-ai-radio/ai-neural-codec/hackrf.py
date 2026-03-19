#!/usr/bin/env python3
"""Neural Codec — RTL-SDR Audio Capture for Codec Training/Testing
Captures and demodulates radio audio, providing clean audio frames
for the neural codec compression pipeline.
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
FRAME_SIZE = 320
PIPE_PATH = "/tmp/sdr_codec_pipe"
NUM_SAMPLES = 256 * 1024


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        logger.info(f"SDR: {CENTER_FREQ/1e6:.3f}MHz")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_samples(sdr, num_samples=NUM_SAMPLES):
    if sdr is not None:
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    voice = sum(0.3 * np.sin(2 * np.pi * f * t + np.random.uniform(0, 2 * np.pi))
                for f in [200, 350, 500, 700, 1000, 1500, 2500])
    fm_dev = 5e3
    phase = 2 * np.pi * np.cumsum(voice * fm_dev / SAMPLE_RATE)
    iq = 0.5 * np.exp(1j * phase)
    noise = 0.02 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    return (iq + noise).astype(np.complex64)


def fm_demod(iq):
    """FM demodulation."""
    return np.angle(iq[1:] * np.conj(iq[:-1]))


def decimate(signal_data, in_rate, out_rate):
    """Decimate with anti-alias filter."""
    ratio = int(in_rate / out_rate)
    cutoff = min(out_rate / 2 / (in_rate / 2), 0.99)
    b, a = scipy_signal.butter(5, cutoff)
    filtered = scipy_signal.lfilter(b, a, signal_data)
    return filtered[::ratio]


def normalize_audio(audio):
    """Normalize audio to [-1, 1] range."""
    peak = np.max(np.abs(audio))
    if peak > 0:
        return audio / peak
    return audio


def apply_pre_emphasis(audio, coeff=0.97):
    """Pre-emphasis for better codec performance."""
    return np.append(audio[0], audio[1:] - coeff * audio[:-1])


def segment_frames(audio, frame_size=FRAME_SIZE):
    """Segment audio into fixed-size frames."""
    num_frames = len(audio) // frame_size
    frames = []
    for i in range(num_frames):
        frames.append(audio[i * frame_size:(i + 1) * frame_size])
    return frames


def measure_audio_quality(audio):
    """Quick audio quality metrics."""
    rms = float(np.sqrt(np.mean(audio ** 2)))
    spectrum = np.abs(fft(audio[:1024]))
    spectral_centroid = float(np.sum(np.arange(len(spectrum)) * spectrum) /
                               (np.sum(spectrum) + 1e-12))
    crest_factor = float(np.max(np.abs(audio)) / (rms + 1e-12))
    return {"rms": rms, "spectral_centroid": spectral_centroid, "crest_factor": crest_factor}


def setup_pipe():
    if os.path.exists(PIPE_PATH):
        os.remove(PIPE_PATH)
    os.mkfifo(PIPE_PATH)
    logger.info(f"Pipe: {PIPE_PATH}")


def send_frame(frame):
    try:
        fd = os.open(PIPE_PATH, os.O_WRONLY | os.O_NONBLOCK)
        os.write(fd, frame.astype(np.float32).tobytes())
        os.close(fd)
        return True
    except OSError:
        return False


def main():
    logger.info("=== Neural Codec — SDR Audio Capture ===")
    sdr = init_sdr()
    setup_pipe()
    total_frames = 0

    try:
        while True:
            iq = capture_samples(sdr)
            demod = fm_demod(iq)
            audio = decimate(demod, SAMPLE_RATE, AUDIO_RATE)
            audio = normalize_audio(audio)
            audio = apply_pre_emphasis(audio)
            frames = segment_frames(audio)
            quality = measure_audio_quality(audio)
            sent_count = 0
            for frame in frames:
                if send_frame(frame):
                    sent_count += 1
                    total_frames += 1
            logger.info(f"Captured {len(frames)} frames, sent {sent_count} | "
                        f"RMS={quality['rms']:.3f} | total={total_frames}")
            time.sleep(0.1)

    except KeyboardInterrupt:
        logger.info(f"Stopped. {total_frames} total frames.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
