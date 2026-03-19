// ============================================================
// BIT-EXTRACTION-SIGNAL — Emergency Extraction Signal
// Sends a coded extraction request via radio and visual signals.
// Supports multiple extraction codes and confirmation protocol.
// LED patterns serve as visual signaling for nearby allies.
// ============================================================

let extractGroup = 75
let extractActive = false
let extractCode = 0
let extractConfirmed = false
let signalPattern = 0
let myExtractId = "X" + Math.randomRange(10, 99)
let beaconMode = false

// Extraction codes
let extractCodes = ["ALPHA", "BRAVO", "DELTA", "OMEGA"]
let extractMeanings = ["EXTRACT", "EVAC NOW", "RALLY PT", "ABORT"]

// Visual signal patterns
let patternNames = ["FLASH", "PULSE", "STROBE", "WAVE"]

// Initialize radio
radio.setGroup(extractGroup)
radio.setTransmitPower(7)

// Flash pattern: rapid on/off
function patternFlash() {
    for (let i = 0; i < 5; i++) {
        basic.showLeds(`
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            # # # # #
        `)
        basic.pause(100)
        basic.clearScreen()
        basic.pause(100)
    }
}

// Pulse pattern: fade-like effect
function patternPulse() {
    for (let b = 0; b < 5; b++) {
        for (let r = 0; r <= b; r++) {
            for (let c = 0; c < 5; c++) {
                led.plot(c, r)
            }
        }
        basic.pause(100)
    }
    for (let b = 4; b >= 0; b--) {
        for (let c = 0; c < 5; c++) {
            led.unplot(c, b)
        }
        basic.pause(100)
    }
}

// Strobe pattern: alternating checkerboard
function patternStrobe() {
    for (let s = 0; s < 4; s++) {
        basic.showLeds(`
            # . # . #
            . # . # .
            # . # . #
            . # . # .
            # . # . #
        `)
        basic.pause(80)
        basic.showLeds(`
            . # . # .
            # . # . #
            . # . # .
            # . # . #
            . # . # .
        `)
        basic.pause(80)
    }
    basic.clearScreen()
}

// Wave pattern: scrolling columns
function patternWave() {
    for (let col = 0; col < 7; col++) {
        basic.clearScreen()
        for (let c = 0; c < 3; c++) {
            let x = col - c
            if (x >= 0 && x < 5) {
                for (let r = 0; r < 5; r++) {
                    led.plot(x, r)
                }
            }
        }
        basic.pause(80)
    }
    basic.clearScreen()
}

// Execute current signal pattern
function executePattern() {
    if (signalPattern == 0) patternFlash()
    else if (signalPattern == 1) patternPulse()
    else if (signalPattern == 2) patternStrobe()
    else patternWave()
}

// Send extraction request
function sendExtraction() {
    let msg = "EXT:" + myExtractId + ":" + extractCodes[extractCode]
    for (let burst = 0; burst < 3; burst++) {
        radio.sendString(msg)
        basic.pause(50)
    }
}

// Send extraction confirmation
function sendConfirmation(targetId: string) {
    radio.sendString("EXT:ACK:" + targetId + ":" + myExtractId)
}

// Startup
basic.showString("EX")
basic.pause(300)
basic.clearScreen()

// Button A: cycle extraction code
input.onButtonPressed(Button.A, function () {
    if (!extractActive) {
        extractCode = (extractCode + 1) % extractCodes.length
        basic.showString(extractCodes[extractCode].substr(0, 2))
        basic.pause(300)
        basic.clearScreen()
    } else {
        // Change signal pattern while active
        signalPattern = (signalPattern + 1) % 4
        basic.showString(patternNames[signalPattern].charAt(0))
        basic.pause(200)
    }
})

// Button B: activate/deactivate extraction signal
input.onButtonPressed(Button.B, function () {
    extractActive = !extractActive
    extractConfirmed = false
    if (extractActive) {
        // Activation sequence
        music.playTone(440, 100)
        music.playTone(660, 100)
        music.playTone(880, 200)
        sendExtraction()
        basic.showString("TX")
        basic.pause(300)
    } else {
        // Deactivation
        music.playTone(880, 100)
        music.playTone(440, 200)
        radio.sendString("EXT:CANCEL:" + myExtractId)
        basic.showIcon(IconNames.No)
        basic.pause(300)
        basic.clearScreen()
    }
})

// Button A+B: toggle beacon mode (continuous visual signal)
input.onButtonPressed(Button.AB, function () {
    beaconMode = !beaconMode
    if (beaconMode) {
        basic.showString("BCN")
    } else {
        basic.showString("OFF")
    }
    basic.pause(300)
    basic.clearScreen()
})

// Shake: emergency quick-send (OMEGA code)
input.onGesture(Gesture.Shake, function () {
    extractCode = 3  // OMEGA = ABORT
    extractActive = true
    sendExtraction()
    music.playTone(1200, 500)
    basic.showString("!!!")
    basic.pause(500)
})

// Radio receive handler
radio.onReceivedString(function (receivedString) {
    let parts = receivedString.split(":")
    if (parts.length < 3 || parts[0] != "EXT") return

    let cmd = parts[1]

    if (cmd == "ACK" && parts.length >= 4) {
        // Our extraction was confirmed
        if (parts[2] == myExtractId) {
            extractConfirmed = true
            music.playTone(523, 100)
            music.playTone(659, 100)
            music.playTone(784, 100)
            music.playTone(1047, 300)
            basic.showIcon(IconNames.Yes)
            basic.pause(500)
        }
    } else if (cmd != "CANCEL" && cmd != "ACK") {
        // Received extraction request from another agent
        let senderId = cmd
        let code = parts[2]
        basic.showString("!" + code.substr(0, 2))
        music.playTone(800, 200)
        // Auto-acknowledge
        sendConfirmation(senderId)
    }
})

// Main loop: active extraction signal
basic.forever(function () {
    if (extractActive && !extractConfirmed) {
        executePattern()
        sendExtraction()
        basic.pause(500)
    } else if (extractActive && extractConfirmed) {
        // Confirmed — slow pulse
        led.plot(2, 2)
        basic.pause(1000)
        led.unplot(2, 2)
        basic.pause(1000)
    }
})

// Beacon mode loop
basic.forever(function () {
    if (beaconMode && !extractActive) {
        executePattern()
        basic.pause(2000)
    }
})
