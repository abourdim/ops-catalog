# SDR Noise Floor — How To Use

## Quick Start
1. Open `index.html` in any modern browser
2. Set temperature (290K = room temp), bandwidth, and noise figure
3. Click **Start** to begin live noise floor analysis
4. Adjust test signal level to see it emerge from noise

## Controls
- **Temperature**: affects thermal noise power (higher = more noise)
- **Bandwidth**: wider bandwidth = higher noise floor
- **Noise Figure**: receiver-added noise in dB
- **Test Signal**: inject a signal at specified dBm level
- **Averaging**: reduce noise variance (3dB improvement per doubling)

## Noise Calculations (Section A)
- **kTB**: theoretical thermal noise power
- **Noise Floor**: kTB + noise figure
- **MDS**: minimum detectable signal (NF + 3dB)
- **SNR**: signal-to-noise ratio at test signal level
- **Dynamic Range**: noise floor to 0 dBm compression point

## Noise Distribution (Section B)
- Histogram shows amplitude distribution of noise samples
- White curve shows ideal Gaussian distribution for comparison

## Tips
- Room temperature (290K) gives -174 dBm/Hz thermal noise
- A good LNA has NF of 1-3 dB
- Doubling bandwidth raises noise floor by 3 dB
- Averaging 8x reduces displayed noise by ~9 dB
- MDS determines the weakest signal your receiver can hear
