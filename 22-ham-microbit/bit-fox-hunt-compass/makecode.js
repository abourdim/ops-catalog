// ============================================================
// BIT-FOX-HUNT-COMPASS — Fox Hunt Direction Finder
// Helps locate a hidden radio transmitter ("fox") by combining
// compass heading with radio signal strength. Arrow shows
// direction, bar shows signal strength. Logs best heading.
// ============================================================

let foxGroup = 55
let foxActive = false
let isFox = false  // true = transmitter, false = hunter
let foxSignal = -128
let bestRssi = -128
let bestHeading = 0
let currentHeading = 0
let huntStarted = false
let foxBeaconInterval = 1000
let signalHistory: number[] = []
let headingHistory: number[] = []

// Initialize radio
radio.setGroup(foxGroup)

// Draw direction arrow based on heading change
function drawHuntArrow(headingDelta: number) {
    basic.clearScreen()
    // Normalize to -180 to 180
    while (headingDelta > 180) headingDelta -= 360
    while (headingDelta < -180) headingDelta += 360

    if (Math.abs(headingDelta) < 20) {
        // On target — bull's eye
        basic.showLeds(`
            . . # . .
            . # # # .
            # # . # #
            . # # # .
            . . # . .
        `)
    } else if (headingDelta > 0 && headingDelta <= 90) {
        // Turn right
        basic.showLeds(`
            . . # . .
            . . . # .
            # # # # #
            . . . # .
            . . # . .
        `)
    } else if (headingDelta > 90) {
        // Hard right / behind right
        basic.showLeds(`
            . . . . #
            . . . # .
            . . # . .
            . # . . .
            # # # # #
        `)
    } else if (headingDelta < 0 && headingDelta >= -90) {
        // Turn left
        basic.showLeds(`
            . . # . .
            . # . . .
            # # # # #
            . # . . .
            . . # . .
        `)
    } else {
        // Hard left / behind left
        basic.showLeds(`
            # . . . .
            . # . . .
            . . # . .
            . . . # .
            # # # # #
        `)
    }
}

// Draw signal strength bar on right column
function drawSignalBar(rssi: number) {
    let bars = Math.map(rssi, -100, -30, 0, 5)
    bars = Math.constrain(bars, 0, 5)
    for (let i = 0; i < bars; i++) {
        led.plot(4, 4 - i)
    }
}

// Fox beacon transmission
function foxBeacon() {
    radio.setTransmitPower(3)
    radio.sendString("FOX:BEACON")
    // Morse "MO" identifier
    music.playTone(600, 200)
    basic.pause(100)
    music.playTone(600, 200)
    basic.pause(100)
    music.playTone(600, 200)
    basic.pause(200)
    music.playTone(600, 200)
    basic.pause(100)
    music.playTone(600, 200)
    basic.pause(100)
    music.playTone(600, 200)
}

// Startup
basic.showString("FH")
basic.pause(300)
input.calibrateCompass()
basic.showString("A=HUNT B=FOX")

// Button A: start hunting
input.onButtonPressed(Button.A, function () {
    if (!huntStarted) {
        isFox = false
        huntStarted = true
        bestRssi = -128
        signalHistory = []
        headingHistory = []
        radio.setTransmitPower(0)
        basic.showString("GO!")
        basic.pause(300)
    } else if (!isFox) {
        // Show best heading
        basic.showString("B:" + bestHeading)
        basic.pause(500)
        basic.showString("S:" + bestRssi)
        basic.pause(500)
    }
})

// Button B: become the fox
input.onButtonPressed(Button.B, function () {
    if (!huntStarted) {
        isFox = true
        huntStarted = true
        radio.setTransmitPower(3)
        basic.showLeds(`
            # . . . #
            . # . # .
            . . # . .
            . # . # .
            # . . . #
        `)
        basic.pause(500)
    }
})

// Button A+B: reset hunt
input.onButtonPressed(Button.AB, function () {
    huntStarted = false
    isFox = false
    bestRssi = -128
    signalHistory = []
    headingHistory = []
    basic.showIcon(IconNames.No)
    basic.pause(300)
    basic.clearScreen()
})

// Radio receive (hunter mode)
radio.onReceivedString(function (receivedString) {
    if (isFox || !huntStarted) return
    if (receivedString.indexOf("FOX:") != 0) return

    foxSignal = radio.receivedPacket(RadioPacketProperty.SignalStrength)
    currentHeading = input.compassHeading()

    // Track signal history
    signalHistory.push(foxSignal)
    headingHistory.push(currentHeading)
    if (signalHistory.length > 20) {
        signalHistory.shift()
        headingHistory.shift()
    }

    // Update best heading
    if (foxSignal > bestRssi) {
        bestRssi = foxSignal
        bestHeading = currentHeading
    }

    // Audio feedback — pitch rises with signal strength
    let pitch = Math.map(foxSignal, -100, -30, 200, 1200)
    pitch = Math.constrain(pitch, 200, 1200)
    music.playTone(pitch, 50)
})

// Fox transmitter loop
basic.forever(function () {
    if (isFox && huntStarted) {
        foxBeacon()
        basic.pause(foxBeaconInterval)
    }
})

// Hunter display loop
basic.forever(function () {
    if (!isFox && huntStarted) {
        let headingDelta = bestHeading - input.compassHeading()
        drawHuntArrow(headingDelta)
        drawSignalBar(foxSignal)
        basic.pause(200)
    }
})
