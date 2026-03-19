/*
 * Sonic Acoustic Levitator - ESP32 Firmware
 * Drives ultrasonic transducer array at 40kHz for acoustic levitation
 * Phase-controlled standing wave creates levitation nodes
 */

#include <math.h>

#define NUM_TRANSDUCERS 8
#define FREQ 40000
#define LED_PIN 2
#define POT_PIN 36

const int transPins[NUM_TRANSDUCERS] = {25, 26, 27, 14, 12, 13, 15, 4};
int phaseOffsets[NUM_TRANSDUCERS];
float nodePosition = 0.5; // 0.0 to 1.0
bool levitating = false;
int amplitude = 255;
float wavelength = 0.00857; // 343 m/s / 40000 Hz
int pattern = 0; // 0=levitate, 1=move, 2=rotate

hw_timer_t* timer = NULL;
volatile bool toggleState = false;
volatile int currentPhase = 0;

void IRAM_ATTR onTimer() {
  currentPhase++;
  if (currentPhase >= 360) currentPhase = 0;

  for (int i = 0; i < NUM_TRANSDUCERS; i++) {
    int effectivePhase = (currentPhase + phaseOffsets[i]) % 360;
    if (effectivePhase < 180) {
      digitalWrite(transPins[i], HIGH);
    } else {
      digitalWrite(transPins[i], LOW);
    }
  }
}

void calculatePhases(float position) {
  for (int i = 0; i < NUM_TRANSDUCERS; i++) {
    float distance = abs((float)i / NUM_TRANSDUCERS - position);
    float phaseDeg = fmod(distance / wavelength * 360.0, 360.0);

    if (i >= NUM_TRANSDUCERS / 2) {
      phaseDeg += 180.0; // opposing array
    }
    phaseOffsets[i] = (int)phaseDeg % 360;
  }
}

void setLevitationNode(float pos) {
  nodePosition = constrain(pos, 0.0, 1.0);
  calculatePhases(nodePosition);
  Serial.printf("Node position: %.3f | Phases:", nodePosition);
  for (int i = 0; i < NUM_TRANSDUCERS; i++) {
    Serial.printf(" %d", phaseOffsets[i]);
  }
  Serial.println();
}

void moveParticle(float from, float to, int steps, int delayMs) {
  for (int s = 0; s <= steps; s++) {
    float pos = from + (to - from) * s / steps;
    setLevitationNode(pos);
    delay(delayMs);
  }
}

void rotatePattern() {
  static float angle = 0;
  angle += 5.0;
  if (angle >= 360.0) angle = 0;
  for (int i = 0; i < NUM_TRANSDUCERS; i++) {
    phaseOffsets[i] = (int)(angle + i * 360.0 / NUM_TRANSDUCERS) % 360;
  }
}

float readTransducerFeedback() {
  // Simplified acoustic pressure estimation via ADC
  int raw = analogRead(POT_PIN);
  return raw / 4095.0 * 160.0; // dB SPL estimate
}

void printStatus() {
  float spl = readTransducerFeedback();
  Serial.printf("Levitating: %s | Node: %.3f | SPL: ~%.0f dB | Pattern: %d\n",
    levitating ? "YES" : "NO", nodePosition, spl, pattern);
  Serial.printf("Phases: ");
  for (int i = 0; i < NUM_TRANSDUCERS; i++) {
    Serial.printf("%3d ", phaseOffsets[i]);
  }
  Serial.println();
}

void setup() {
  Serial.begin(115200);
  Serial.println("Acoustic Levitator starting...");

  for (int i = 0; i < NUM_TRANSDUCERS; i++) {
    pinMode(transPins[i], OUTPUT);
  }
  pinMode(LED_PIN, OUTPUT);
  pinMode(POT_PIN, INPUT);
  analogReadResolution(12);

  calculatePhases(0.5);

  // Timer for 40kHz * 360 phase resolution
  timer = timerBegin(0, 2, true);
  timerAttachInterrupt(timer, &onTimer, true);
  timerAlarmWrite(timer, 40000000 / (FREQ * 360) * 80, true);

  Serial.println("Commands: l=levitate, s=stop, u/d=move, r=rotate, p=status");
}

void loop() {
  if (Serial.available()) {
    char c = Serial.read();
    switch (c) {
      case 'l':
        levitating = true;
        timerAlarmEnable(timer);
        setLevitationNode(0.5);
        digitalWrite(LED_PIN, HIGH);
        Serial.println("Levitation ON");
        break;
      case 's':
        levitating = false;
        timerAlarmDisable(timer);
        for (int i = 0; i < NUM_TRANSDUCERS; i++) digitalWrite(transPins[i], LOW);
        digitalWrite(LED_PIN, LOW);
        Serial.println("Levitation OFF");
        break;
      case 'u':
        if (levitating) moveParticle(nodePosition, nodePosition + 0.05, 10, 20);
        break;
      case 'd':
        if (levitating) moveParticle(nodePosition, nodePosition - 0.05, 10, 20);
        break;
      case 'r':
        pattern = 2;
        Serial.println("Rotate pattern");
        break;
      case 'p':
        printStatus();
        break;
    }
  }

  if (levitating && pattern == 2) {
    rotatePattern();
    delay(20);
  }
}
