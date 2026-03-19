#!/usr/bin/env python3
"""AI Signal Identifier — RPi ML Inference Engine
Classifies unknown radio signals using a trained CNN model.
Captures IQ samples, generates spectrograms, and identifies modulation types.
"""

import numpy as np
import time
import json
import os
import logging
from datetime import datetime
from scipy import signal as scipy_signal
from scipy.fft import fft, fftshift

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

# Signal classes the model can identify
SIGNAL_CLASSES = [
    "AM", "FM", "SSB", "CW", "FSK", "PSK", "QAM",
    "OFDM", "CDMA", "LoRa", "Bluetooth", "WiFi",
    "LTE", "5G-NR", "DVB-T", "Unknown"
]

MODEL_PATH = os.path.expanduser("~/models/signal_identifier.tflite")
SAMPLE_RATE = 2.4e6
FFT_SIZE = 1024
SPECTROGRAM_ROWS = 128
CONFIDENCE_THRESHOLD = 0.65


def load_model(model_path):
    """Load TFLite model for signal classification."""
    try:
        import tflite_runtime.interpreter as tflite
        interpreter = tflite.Interpreter(model_path=model_path)
        interpreter.allocate_tensors()
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()
        logger.info(f"Model loaded: input shape {input_details[0]['shape']}")
        return interpreter, input_details, output_details
    except Exception as e:
        logger.warning(f"TFLite not available: {e}. Using mock inference.")
        return None, None, None


def generate_spectrogram(iq_samples, fft_size=FFT_SIZE, num_rows=SPECTROGRAM_ROWS):
    """Convert IQ samples to a spectrogram image for CNN input."""
    num_samples_needed = fft_size * num_rows
    if len(iq_samples) < num_samples_needed:
        iq_samples = np.pad(iq_samples, (0, num_samples_needed - len(iq_samples)))
    iq_samples = iq_samples[:num_samples_needed]
    reshaped = iq_samples.reshape(num_rows, fft_size)
    window = np.hanning(fft_size)
    spectrogram = np.zeros((num_rows, fft_size), dtype=np.float32)
    for i in range(num_rows):
        spectrum = fftshift(fft(reshaped[i] * window))
        spectrogram[i] = 20 * np.log10(np.abs(spectrum) + 1e-12)
    spec_min = spectrogram.min()
    spec_max = spectrogram.max()
    if spec_max > spec_min:
        spectrogram = (spectrogram - spec_min) / (spec_max - spec_min)
    return spectrogram


def extract_features(iq_samples):
    """Extract statistical features from IQ data as auxiliary input."""
    amplitude = np.abs(iq_samples)
    phase = np.angle(iq_samples)
    inst_freq = np.diff(np.unwrap(phase)) * SAMPLE_RATE / (2 * np.pi)
    features = {
        "mean_amplitude": float(np.mean(amplitude)),
        "std_amplitude": float(np.std(amplitude)),
        "kurtosis_amplitude": float(np.mean((amplitude - np.mean(amplitude))**4) /
                                     (np.std(amplitude)**4 + 1e-12)),
        "mean_inst_freq": float(np.mean(inst_freq)),
        "std_inst_freq": float(np.std(inst_freq)),
        "bandwidth_estimate": float(np.percentile(np.abs(inst_freq), 95)),
        "signal_power_db": float(10 * np.log10(np.mean(amplitude**2) + 1e-12)),
    }
    return features


def classify_signal(interpreter, input_details, output_details, spectrogram):
    """Run inference on a spectrogram to classify the signal."""
    if interpreter is None:
        idx = np.random.randint(0, len(SIGNAL_CLASSES))
        confidences = np.random.dirichlet(np.ones(len(SIGNAL_CLASSES)))
        return SIGNAL_CLASSES[np.argmax(confidences)], float(np.max(confidences)), confidences

    input_data = spectrogram.reshape(input_details[0]['shape']).astype(np.float32)
    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])[0]
    probabilities = np.exp(output_data) / np.sum(np.exp(output_data))
    predicted_idx = np.argmax(probabilities)
    confidence = float(probabilities[predicted_idx])
    return SIGNAL_CLASSES[predicted_idx], confidence, probabilities


def read_iq_from_pipe(pipe_path="/tmp/sdr_iq_pipe", num_samples=FFT_SIZE * SPECTROGRAM_ROWS):
    """Read IQ samples from a named pipe (fed by hackrf.py)."""
    if os.path.exists(pipe_path):
        try:
            with open(pipe_path, 'rb') as f:
                raw = f.read(num_samples * 8)
            return np.frombuffer(raw, dtype=np.complex64)
        except Exception as e:
            logger.warning(f"Pipe read failed: {e}")
    return np.random.randn(num_samples) + 1j * np.random.randn(num_samples)


def log_result(result, log_dir="~/signal_logs"):
    """Save classification result to JSON log."""
    log_dir = os.path.expanduser(log_dir)
    os.makedirs(log_dir, exist_ok=True)
    filename = datetime.now().strftime("%Y%m%d_%H%M%S") + ".json"
    with open(os.path.join(log_dir, filename), 'w') as f:
        json.dump(result, f, indent=2)


def main():
    logger.info("=== AI Signal Identifier — RPi ML Engine ===")
    interpreter, input_det, output_det = load_model(MODEL_PATH)
    logger.info(f"Monitoring {len(SIGNAL_CLASSES)} signal classes")

    try:
        while True:
            iq_data = read_iq_from_pipe()
            spectrogram = generate_spectrogram(iq_data)
            features = extract_features(iq_data)
            label, confidence, probs = classify_signal(interpreter, input_det, output_det, spectrogram)

            result = {
                "timestamp": datetime.now().isoformat(),
                "classification": label,
                "confidence": round(confidence, 4),
                "features": features,
                "top3": sorted(
                    [(SIGNAL_CLASSES[i], round(float(probs[i]), 4)) for i in range(len(probs))],
                    key=lambda x: x[1], reverse=True
                )[:3],
            }

            status = "HIGH" if confidence >= CONFIDENCE_THRESHOLD else "LOW"
            logger.info(f"[{status}] {label} (conf={confidence:.2%}) | "
                        f"BW~{features['bandwidth_estimate']:.0f}Hz | "
                        f"Pwr={features['signal_power_db']:.1f}dB")

            if confidence >= CONFIDENCE_THRESHOLD:
                log_result(result)

            time.sleep(0.5)

    except KeyboardInterrupt:
        logger.info("Signal identifier stopped.")


if __name__ == "__main__":
    main()
