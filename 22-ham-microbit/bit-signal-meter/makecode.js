// ============================================================
// BIT-SIGNAL-METER — Signal Strength Meter
// Displays radio signal strength (RSSI) as a visual meter.
// Supports multiple display modes: bar graph, numeric, peak
// hold, and audio feedback. Logs min/max/average readings.
// ============================================================

let meterActive = false
let meterMode = 0  // 0=bar, 1=numeric, 2=peak hold, 3=audio
let meterGroup = 65
let currentSignal = -100
let peakSignal = -128
let minSignal = 0
let totalSignal = 0
let sampleCount = 0
let peakHoldTime = 0
let audioEnabled = false

// Initialize radio
radio.setGroup(meterGroup)
radio.setTransmitPower(0)  // Low power for listening

// Draw bar graph (horizontal)
function drawBarGraph(rssi: number) {
    basic.clearScreen()
    let bars = Math.map(rssi, -100, -30, 0, 25)
    bars = Math.constrain(bars, 0, 25)
    for (let i = 0; i < bars; i++) {
        let col = i % 5
        let row = 4 - Math.floor(i / 5)
        led.plot(col, row)
    }
}

// Draw vertical bar graph (5 columns, each shows different metric)
function drawDetailedMeter(rssi: number) {
    basic.clearScreen()
    // Column 0: current signal
    let curr = Math.map(rssi, -100, -30, 0, 5)
    curr = Math.constrain(curr, 0, 5)
    for (let r = 0; r < curr; r++) {
        led.plot(0, 4 - r)
    }

    // Column 2: average signal
    let avg = sampleCount > 0 ? totalSignal / sampleCount : -100
    let avgBars = Math.map(avg, -100, -30, 0, 5)
    avgBars = Math.constrain(avgBars, 0, 5)
    for (let r = 0; r < avgBars; r++) {
        led.plot(2, 4 - r)
    }

    // Column 4: peak signal
    let peak = Math.map(peakSignal, -100, -30, 0, 5)
    peak = Math.constrain(peak, 0, 5)
    for (let r = 0; r < peak; r++) {
        led.plot(4, 4 - r)
    }
}

// Draw peak hold display
function drawPeakHold(rssi: number) {
    basic.clearScreen()
    // Current signal as full bar
    let curr = Math.map(rssi, -100, -30, 0, 5)
    curr = Math.constrain(Math.round(curr), 0, 4)
    for (let col = 0; col < 5; col++) {
        led.plot(col, 4 - curr)
    }

    // Peak hold as single dot
    let peak = Math.map(peakSignal, -100, -30, 0, 5)
    peak = Math.constrain(Math.round(peak), 0, 4)
    led.plot(2, 4 - peak)
}

// Audio feedback — frequency proportional to signal
function audioFeedback(rssi: number) {
    let freq = Math.map(rssi, -100, -30, 200, 2000)
    freq = Math.constrain(freq, 200, 2000)
    music.playTone(freq, 50)
}

// Show statistics
function showStats() {
    basic.showString("PK" + peakSignal)
    basic.pause(500)
    basic.showString("MN" + minSignal)
    basic.pause(500)
    if (sampleCount > 0) {
        let avg = Math.round(totalSignal / sampleCount)
        basic.showString("AV" + avg)
        basic.pause(500)
    }
    basic.showString("N" + sampleCount)
    basic.pause(500)
}

// Startup
basic.showString("SM")
basic.pause(300)
basic.clearScreen()

// Button A: start/stop meter
input.onButtonPressed(Button.A, function () {
    meterActive = !meterActive
    if (meterActive) {
        peakSignal = -128
        minSignal = 0
        totalSignal = 0
        sampleCount = 0
        basic.showLeds(`
            # . . . .
            # . . . .
            # . . . .
            # . . . .
            # # # # #
        `)
        basic.pause(300)
    } else {
        basic.clearScreen()
        showStats()
    }
})

// Button B: cycle display mode
input.onButtonPressed(Button.B, function () {
    meterMode = (meterMode + 1) % 4
    let modeNames = ["BAR", "NUM", "PEAK", "AUD"]
    basic.showString(modeNames[meterMode])
    basic.pause(300)
    if (meterMode == 3) {
        audioEnabled = true
    } else {
        audioEnabled = false
    }
})

// Button A+B: show statistics
input.onButtonPressed(Button.AB, function () {
    let wasActive = meterActive
    meterActive = false
    showStats()
    meterActive = wasActive
})

// Shake: reset peak hold
input.onGesture(Gesture.Shake, function () {
    peakSignal = -128
    minSignal = 0
    totalSignal = 0
    sampleCount = 0
    basic.showIcon(IconNames.No)
    basic.pause(200)
    basic.clearScreen()
})

// Radio receive: capture signal strength
radio.onReceivedString(function (receivedString) {
    if (!meterActive) return

    currentSignal = radio.receivedPacket(RadioPacketProperty.SignalStrength)
    sampleCount++
    totalSignal += currentSignal

    // Update peak
    if (currentSignal > peakSignal) {
        peakSignal = currentSignal
        peakHoldTime = input.runningTime()
    }

    // Update min
    if (currentSignal < minSignal || minSignal == 0) {
        minSignal = currentSignal
    }
})

// Background: send beacon for other meters to pick up
basic.forever(function () {
    radio.sendString("SIG:BEACON")
    basic.pause(500)
})

// Main display loop
basic.forever(function () {
    if (meterActive) {
        if (meterMode == 0) {
            drawBarGraph(currentSignal)
        } else if (meterMode == 1) {
            basic.showNumber(currentSignal)
        } else if (meterMode == 2) {
            drawPeakHold(currentSignal)
        } else if (meterMode == 3) {
            drawBarGraph(currentSignal)
            audioFeedback(currentSignal)
        }
        basic.pause(150)
    }
})
