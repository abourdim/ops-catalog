#!/usr/bin/env python3
"""
Ham CW (Morse Code) Decoder
Receives and decodes CW/Morse code signals from the amateur radio bands.
Uses Goertzel algorithm for tone detection, adaptive threshold for
dit/dah discrimination, and translates to text.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time

# --- Configuration ---
CW_FREQ = 7.030e6         # 40m CW calling frequency (use direct sampling or upconverter)
LISTEN_FREQ = 144.05e6    # 2m CW segment (directly receivable)
SAMPLE_RATE = 250e3
AUDIO_RATE = 8000
FFT_SIZE = 512
GAIN = 40
CW_TONE_HZ = 700          # Expected CW sidetone frequency
CAPTURE_SECONDS = 30

MORSE_CODE = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
    '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
    '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
    '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
    '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
    '--..': 'Z', '-----': '0', '.----': '1', '..---': '2',
    '...--': '3', '....-': '4', '.....': '5', '-....': '6',
    '--...': '7', '---..': '8', '----.': '9',
}

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = LISTEN_FREQ
    sdr.gain = GAIN
    return sdr

def goertzel(samples, target_freq, sample_rate):
    """Goertzel algorithm for efficient single-frequency detection."""
    n = len(samples)
    k = int(0.5 + n * target_freq / sample_rate)
    w = 2 * np.pi * k / n
    coeff = 2 * np.cos(w)
    s0, s1, s2 = 0.0, 0.0, 0.0
    for sample in samples:
        s0 = sample + coeff * s1 - s2
        s2 = s1
        s1 = s0
    power = s1 * s1 + s2 * s2 - coeff * s1 * s2
    return power

def detect_cw_tone(audio_samples, sample_rate, tone_freq, frame_size=160):
    """Detect CW tone presence in audio frames using Goertzel."""
    num_frames = len(audio_samples) // frame_size
    tone_present = []
    for i in range(num_frames):
        frame = audio_samples[i * frame_size:(i + 1) * frame_size]
        power = goertzel(frame, tone_freq, sample_rate)
        tone_present.append(power)
    powers = np.array(tone_present)
    threshold = np.median(powers) * 4
    return powers > threshold, powers

def decode_elements(tone_mask, frame_duration_ms):
    """Convert tone on/off pattern to dits, dahs, and spaces."""
    elements = []
    current_state = tone_mask[0]
    count = 1
    for i in range(1, len(tone_mask)):
        if tone_mask[i] == current_state:
            count += 1
        else:
            duration_ms = count * frame_duration_ms
            if current_state:  # Tone ON
                elements.append(('.' if duration_ms < 150 else '-', duration_ms))
            else:  # Tone OFF
                if duration_ms > 400:
                    elements.append((' ', duration_ms))
                elif duration_ms > 200:
                    elements.append(('|', duration_ms))  # Character gap
            current_state = tone_mask[i]
            count = 1
    return elements

def elements_to_text(elements):
    """Convert Morse elements to readable text."""
    current_char = ""
    text = ""
    for elem, _ in elements:
        if elem in '.':
            current_char += '.'
        elif elem == '-':
            current_char += '-'
        elif elem == '|':
            text += MORSE_CODE.get(current_char, '?')
            current_char = ""
        elif elem == ' ':
            text += MORSE_CODE.get(current_char, '?') + ' '
            current_char = ""
    if current_char:
        text += MORSE_CODE.get(current_char, '?')
    return text

def main():
    print("=== Ham CW Decoder ===")
    print(f"Listening on {LISTEN_FREQ/1e6:.3f} MHz for CW tone at {CW_TONE_HZ} Hz")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(int(CAPTURE_SECONDS * SAMPLE_RATE))
        # FM demodulate to extract audio
        demod = np.angle(iq[1:] * np.conj(iq[:-1]))
        # Decimate to audio rate
        dec_factor = int(SAMPLE_RATE / AUDIO_RATE)
        audio = signal.decimate(demod, dec_factor, zero_phase=True)
        print(f"[cw] Audio: {len(audio)} samples at {AUDIO_RATE} Hz")
        # Detect CW tone
        frame_ms = 20  # 20ms frames
        frame_size = int(AUDIO_RATE * frame_ms / 1000)
        tone_mask, powers = detect_cw_tone(audio, AUDIO_RATE, CW_TONE_HZ, frame_size)
        elements = decode_elements(tone_mask, frame_ms)
        text = elements_to_text(elements)
        print(f"[cw] Detected {sum(tone_mask)}/{len(tone_mask)} frames with tone")
        print(f"[cw] Elements: {''.join(e[0] for e in elements[:100])}")
        print(f"[cw] Decoded: {text}")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
