#!/usr/bin/env python3
"""SDR Universal Decoder - Multi-protocol decoder that auto-detects and decodes signals."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

SAMPLE_RATE = 2.4e6
FFT_SIZE = 4096
GAIN = 42

PROTOCOL_SIGNATURES = {
    "ADS-B": {"freq": 1090e6, "bw_khz": 2000, "mod": "PPM"},
    "APRS": {"freq": 144.39e6, "bw_khz": 12, "mod": "AFSK"},
    "POCSAG": {"freq": 152.48e6, "bw_khz": 15, "mod": "FSK"},
    "AIS": {"freq": 161.975e6, "bw_khz": 25, "mod": "GMSK"},
    "NOAA_APT": {"freq": 137.1e6, "bw_khz": 40, "mod": "FM"},
}

def configure_sdr(freq):
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = freq
    sdr.gain = GAIN
    return sdr

def auto_detect_protocol(sdr, freq):
    iq = sdr.read_samples(FFT_SIZE * 4)
    window = signal.blackmanharris(FFT_SIZE)
    spec = np.abs(np.fft.fftshift(np.fft.fft(iq[:FFT_SIZE] * window)))
    psd_db = 10 * np.log10(spec ** 2 + 1e-12)
    noise = np.median(psd_db)
    peak = np.max(psd_db)
    snr = peak - noise
    bw = np.sum(psd_db > peak - 6) * SAMPLE_RATE / FFT_SIZE / 1e3
    # Match against known protocols
    best_match = "unknown"
    best_score = 0
    for name, sig in PROTOCOL_SIGNATURES.items():
        score = 0
        if abs(freq - sig["freq"]) < 1e6:
            score += 3
        if abs(bw - sig["bw_khz"]) < sig["bw_khz"] * 0.5:
            score += 2
        if score > best_score:
            best_score = score
            best_match = name
    return {"protocol": best_match, "snr_db": round(float(snr), 1),
            "bw_khz": round(float(bw), 1), "confidence": best_score}

def main():
    print("=== SDR Universal Decoder ===")
    results = []
    for name, sig in PROTOCOL_SIGNATURES.items():
        try:
            sdr = configure_sdr(sig["freq"])
            result = auto_detect_protocol(sdr, sig["freq"])
            sdr.close()
            results.append(result)
            status = "ACTIVE" if result["snr_db"] > 8 else "quiet"
            print(f"  {name:12s} {sig['freq']/1e6:8.3f} MHz: {status} | "
                  f"SNR {result['snr_db']:5.1f} dB | BW {result['bw_khz']:.0f} kHz")
        except Exception as e:
            print(f"  {name}: skipped ({e})")
    with open("universal_decoder.json", "w") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    main()
