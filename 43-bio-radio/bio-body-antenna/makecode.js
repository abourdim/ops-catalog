/*
 * Bio Body Antenna - micro:bit MakeCode
 * Uses body as antenna - detects touch capacitance and ambient signals
 * Radio broadcasts body antenna readings to other micro:bits
 */

let bodyReading = 0
let baseline = 0
let rfStrength = 0
let calibrated = false
let transmitGroup = 42
let sampleCount = 0
let signalHistory: number[] = []
let peakDetected = false

radio.setGroup(transmitGroup)
radio.setTransmitPower(7)
radio.setTransmitSerialNumber(true)

// Calibration on startup
basic.showString("BA")
basic.pause(500)

function calibrateBody() {
    let sum = 0
    for (let i = 0; i < 50; i++) {
        sum += pins.analogReadPin(AnalogPin.P0)
        basic.pause(10)
    }
    baseline = sum / 50
    calibrated = true
    basic.showIcon(IconNames.Yes)
    basic.pause(300)
}

function mapToBar(value: number, maxVal: number): number {
    return Math.constrain(Math.map(value, 0, maxVal, 0, 25), 0, 25)
}

function displaySignalStrength(strength: number) {
    let level = Math.constrain(Math.floor(strength / 200), 0, 4)
    basic.clearScreen()
    for (let row = 4; row >= 4 - level; row--) {
        for (let col = 0; col < 5; col++) {
            led.plot(col, row)
        }
    }
}

function detectRFBurst(): boolean {
    if (signalHistory.length < 10) return false
    let recent = 0
    let older = 0
    for (let i = signalHistory.length - 5; i < signalHistory.length; i++) {
        recent += signalHistory[i]
    }
    for (let i = signalHistory.length - 10; i < signalHistory.length - 5; i++) {
        older += signalHistory[i]
    }
    return (recent / 5) > (older / 5) * 1.5
}

calibrateBody()

// Main sensing loop
basic.forever(function () {
    if (!calibrated) return

    bodyReading = pins.analogReadPin(AnalogPin.P0)
    let touchP1 = pins.analogReadPin(AnalogPin.P1)
    let lightLevel = input.lightLevel()

    rfStrength = Math.abs(bodyReading - baseline)
    let combinedSignal = rfStrength + Math.abs(touchP1 - 512) + lightLevel

    signalHistory.push(rfStrength)
    if (signalHistory.length > 20) {
        signalHistory.shift()
    }

    peakDetected = detectRFBurst()
    displaySignalStrength(rfStrength)

    sampleCount++
    if (sampleCount % 5 == 0) {
        radio.sendValue("rf", rfStrength)
        radio.sendValue("body", bodyReading)
        if (peakDetected) {
            radio.sendValue("peak", 1)
        }
    }

    basic.pause(50)
})

// Receive other body antenna nodes
radio.onReceivedValue(function (name: string, value: number) {
    if (name == "peak") {
        basic.showIcon(IconNames.Target)
        basic.pause(200)
    }
})

// Button A: recalibrate
input.onButtonPressed(Button.A, function () {
    calibrated = false
    basic.showString("C")
    calibrateBody()
})

// Button B: show raw value
input.onButtonPressed(Button.B, function () {
    basic.showNumber(rfStrength)
})

// Shake: toggle transmit power
input.onGesture(Gesture.Shake, function () {
    transmitGroup = (transmitGroup % 255) + 1
    radio.setGroup(transmitGroup)
    basic.showNumber(transmitGroup)
})
