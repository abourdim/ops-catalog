/*
 * ESP Antenna Analyzer - firmware.ino
 * Measures antenna SWR, impedance, and resonance using an
 * Si5351 clock generator as DDS and an analog bridge circuit.
 * Sweeps a frequency range and displays SWR curve on OLED.
 *
 * Hardware: ESP32 DevKit + Si5351 + SWR bridge + SSD1306 OLED
 * Wiring:  Si5351 SDA->GPIO21 SCL->GPIO22, FWD ADC->GPIO34, REV ADC->GPIO35
 */

#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_Si5351.h>

#define SCREEN_W 128
#define SCREEN_H  64
Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);
Adafruit_Si5351 si5351;

// ---------- Pins ----------
#define ADC_FWD   34   // Forward power from SWR bridge
#define ADC_REV   35   // Reflected power from SWR bridge
#define LED_PIN    2
#define BTN_BAND   4   // Cycle band
#define BTN_SWEEP 15   // Start sweep

// ---------- Band definitions ----------
typedef struct {
  const char *name;
  uint32_t startFreq;  // Hz
  uint32_t endFreq;
  uint32_t stepSize;
} Band;

static const Band bands[] = {
  {"80m",  3500000,  4000000,  10000},
  {"40m",  7000000,  7300000,   5000},
  {"20m", 14000000, 14350000,   5000},
  {"15m", 21000000, 21450000,   5000},
  {"10m", 28000000, 29700000,  20000},
  {"2m", 144000000,148000000,  50000},
};
#define NUM_BANDS 6
static int currentBand = 1;  // Default: 40m

// ---------- Sweep data ----------
#define MAX_POINTS 128
static float swrData[MAX_POINTS];
static uint32_t freqData[MAX_POINTS];
static int numPoints = 0;
static float minSWR = 99.0;
static uint32_t resonantFreq = 0;

// ---------- Measure SWR at single frequency ----------
float measureSWR(uint32_t freq) {
  // Set Si5351 CLK0 output to target frequency
  si5351.setupPLL(SI5351_PLL_A, 36, 0, 1);  // Simplified PLL setup
  uint32_t divider = 900000000UL / freq;     // Approximate divider
  si5351.setupMultisynth(0, SI5351_PLL_A, divider, 0, 1);
  si5351.enableOutputs(true);
  delay(5);  // Settle time

  // Read forward and reflected voltages
  int fwd = analogRead(ADC_FWD);
  int rev = analogRead(ADC_REV);

  si5351.enableOutputs(false);

  if (fwd <= 0) return 99.0;

  // Calculate reflection coefficient and SWR
  float gamma = (float)rev / (float)fwd;
  if (gamma >= 1.0) return 99.0;
  float swr = (1.0 + gamma) / (1.0 - gamma);
  if (swr < 1.0) swr = 1.0;
  if (swr > 99.0) swr = 99.0;
  return swr;
}

// ---------- Full band sweep ----------
void performSweep() {
  const Band &b = bands[currentBand];
  numPoints = 0;
  minSWR = 99.0;

  Serial.printf("[SWEEP] %s: %u - %u Hz\n", b.name, b.startFreq, b.endFreq);

  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(20, 28);
  oled.printf("Sweeping %s...", b.name);
  oled.display();

  for (uint32_t f = b.startFreq; f <= b.endFreq && numPoints < MAX_POINTS; f += b.stepSize) {
    float swr = measureSWR(f);
    swrData[numPoints] = swr;
    freqData[numPoints] = f;
    numPoints++;

    if (swr < minSWR) {
      minSWR = swr;
      resonantFreq = f;
    }

    // Progress indicator
    digitalWrite(LED_PIN, numPoints % 4 < 2);
  }

  digitalWrite(LED_PIN, LOW);
  Serial.printf("[SWEEP] Done. %d points. Min SWR=%.2f @ %u Hz\n",
                numPoints, minSWR, resonantFreq);
}

// ---------- Display SWR curve ----------
void displaySWRCurve() {
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);

  // Title
  oled.setCursor(0, 0);
  oled.printf("%s  SWR:%.1f", bands[currentBand].name, minSWR);

  // Resonant frequency
  oled.setCursor(70, 0);
  if (resonantFreq >= 1000000) {
    oled.printf("%.3fM", resonantFreq / 1e6);
  } else {
    oled.printf("%ukHz", resonantFreq / 1000);
  }

  // Graph area: y=10..58
  int graphTop = 10;
  int graphH = 48;
  int graphW = SCREEN_W;

  // SWR scale: 1.0 to 5.0
  float swrMin = 1.0, swrMax = 5.0;

  // Draw horizontal grid lines
  for (float s = 1.5; s <= 4.5; s += 1.0) {
    int y = graphTop + (int)((s - swrMin) / (swrMax - swrMin) * graphH);
    for (int x = 0; x < graphW; x += 4) {
      oled.drawPixel(x, y, SSD1306_WHITE);
    }
  }

  // Draw SWR curve
  for (int i = 1; i < numPoints; i++) {
    int x0 = (i - 1) * graphW / numPoints;
    int x1 = i * graphW / numPoints;
    float s0 = constrain(swrData[i - 1], swrMin, swrMax);
    float s1 = constrain(swrData[i], swrMin, swrMax);
    int y0 = graphTop + (int)((s0 - swrMin) / (swrMax - swrMin) * graphH);
    int y1 = graphTop + (int)((s1 - swrMin) / (swrMax - swrMin) * graphH);
    oled.drawLine(x0, y0, x1, y1, SSD1306_WHITE);
  }

  // Scale labels
  oled.setCursor(0, graphTop);
  oled.print("1");
  oled.setCursor(0, graphTop + graphH - 6);
  oled.print("5");

  // 2:1 SWR reference line (good antenna threshold)
  int y2 = graphTop + (int)((2.0 - swrMin) / (swrMax - swrMin) * graphH);
  oled.setCursor(SCREEN_W - 12, y2 - 3);
  oled.print("2");

  oled.display();
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);
  Serial.println("[AntennaAnalyzer] Starting...");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_BAND, INPUT_PULLUP);
  pinMode(BTN_SWEEP, INPUT_PULLUP);
  pinMode(ADC_FWD, INPUT);
  pinMode(ADC_REV, INPUT);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  if (si5351.begin() != ERROR_NONE) {
    Serial.println("[Si5351] Init failed!");
    oled.clearDisplay();
    oled.setCursor(10, 28);
    oled.print("Si5351 ERROR");
    oled.display();
  }

  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(SSD1306_WHITE);
  oled.setCursor(10, 20);
  oled.print("Antenna Analyzer");
  oled.setCursor(10, 36);
  oled.printf("Band: %s", bands[currentBand].name);
  oled.setCursor(10, 48);
  oled.print("Press SWEEP to start");
  oled.display();
}

// ---------- Main loop ----------
void loop() {
  if (digitalRead(BTN_BAND) == LOW) {
    delay(200);
    currentBand = (currentBand + 1) % NUM_BANDS;
    oled.clearDisplay();
    oled.setCursor(20, 28);
    oled.printf("Band: %s", bands[currentBand].name);
    oled.display();
    Serial.printf("[BAND] %s\n", bands[currentBand].name);
  }

  if (digitalRead(BTN_SWEEP) == LOW) {
    delay(200);
    performSweep();
    displaySWRCurve();
  }

  delay(50);
}
