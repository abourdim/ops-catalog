# Multi-Factor Authentication Theory

## What is MFA?

Multi-Factor Authentication (MFA) requires users to provide two or more verification factors to gain access to a resource. Factors fall into three categories:

### 1. Something You KNOW (Knowledge Factor)
- Passwords, PINs, security questions
- Weakness: can be guessed, stolen, or brute-forced
- Example in this project: 4-digit PIN code

### 2. Something You HAVE (Possession Factor)
- Physical tokens, smart cards, NFC tags, phones
- Weakness: can be lost, stolen, or cloned
- Example in this project: NFC tag with unique UID

### 3. Something You ARE (Inherence Factor)
- Fingerprints, iris scans, voice, facial recognition
- Weakness: can be spoofed (though difficult)
- Example in this project: Fingerprint scan

## Why Three Factors?

Each factor alone has vulnerabilities:
- Password alone: brute-force attacks succeed in minutes
- NFC alone: tags can be cloned with a $20 device
- Fingerprint alone: lifted prints can fool basic sensors

Combining all three makes unauthorized access exponentially harder. An attacker would need to simultaneously:
1. Know your secret PIN
2. Possess your physical NFC tag
3. Replicate your fingerprint

## Real-World Examples

| System | Factors Used |
|--------|-------------|
| ATM | Card (have) + PIN (know) |
| iPhone | Face ID (are) + Passcode (know) |
| Military vault | Retina (are) + Badge (have) + Code (know) |
| Online banking | Password (know) + SMS code (have) |

## Security Metrics

- **FAR** (False Accept Rate): Probability of accepting an unauthorized user
- **FRR** (False Reject Rate): Probability of rejecting an authorized user
- Modern fingerprint sensors: FAR < 0.001%, FRR < 1%
- NFC UID collision probability: ~1 in 4 billion (4-byte UID)

## ESP32 Implementation

The ESP32 is ideal for MFA projects because it supports:
- Multiple UART ports (fingerprint sensor)
- I2C bus (NFC reader)
- GPIO matrix scanning (keypad)
- PWM output (servo lock)
- Wi-Fi/BLE for remote monitoring
