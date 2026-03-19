#!/usr/bin/env python3
"""SDR Server - Network-accessible SDR streaming and control server."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json, struct, socket

SAMPLE_RATE = 2.4e6
CENTER_FREQ = 100e6
GAIN = 40
SERVER_PORT = 1234
CHUNK_SIZE = 65536

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    return sdr

def create_rtl_tcp_header(freq, sample_rate, gain):
    """Create RTL-TCP compatible header."""
    header = struct.pack('>4sI', b'RTL0', 0)
    return header

def stream_iq(sdr, duration_sec=10):
    """Stream IQ data with metadata headers."""
    total = int(duration_sec * SAMPLE_RATE)
    streamed = 0
    chunks_sent = 0
    start = time.time()
    while streamed < total:
        n = min(CHUNK_SIZE, total - streamed)
        iq = sdr.read_samples(n)
        iq_bytes = iq.astype(np.complex64).tobytes()
        streamed += len(iq)
        chunks_sent += 1
    elapsed = time.time() - start
    return {"samples_streamed": streamed, "chunks": chunks_sent,
            "throughput_msps": round(streamed / elapsed / 1e6, 2),
            "duration_sec": round(elapsed, 2)}

def handle_command(sdr, command):
    """Process tuning/gain commands."""
    if command.startswith("FREQ:"):
        freq = float(command[5:])
        sdr.center_freq = freq
        return {"status": "ok", "freq_hz": freq}
    elif command.startswith("GAIN:"):
        gain = float(command[5:])
        sdr.gain = gain
        return {"status": "ok", "gain_db": gain}
    elif command == "STATUS":
        return {"freq_hz": sdr.center_freq, "sample_rate": sdr.sample_rate, "gain": sdr.gain}
    return {"status": "unknown_command"}

def main():
    print("=== SDR Server ===")
    sdr = configure_sdr()
    try:
        print(f"[server] SDR configured: {CENTER_FREQ/1e6:.1f} MHz, {SAMPLE_RATE/1e6:.1f} MSPS")
        # Demo: stream test
        result = stream_iq(sdr, duration_sec=5)
        print(f"[server] Stream test: {result}")
        # Demo: command processing
        for cmd in ["STATUS", "FREQ:144390000", "GAIN:42", "STATUS"]:
            resp = handle_command(sdr, cmd)
            print(f"  CMD '{cmd}' -> {resp}")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
