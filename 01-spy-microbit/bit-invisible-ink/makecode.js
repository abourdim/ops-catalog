// ============================================================
// BIT-INVISIBLE-INK — Hidden Message Reveal with Light Sensor
// Uses the micro:bit's light sensor to reveal hidden messages.
// Messages are only displayed when ambient light drops below
// a threshold (simulating UV light or darkness reveal).
// ============================================================

let secretMessages = [
    "SAFE HOUSE NORTH",
    "CODE ALPHA",
    "RENDEZVOUS 0300",
    "AGENT DOWN",
    "PACKAGE SECURE"
]
let currentMessage = 0
let lightThreshold = 50
let revealMode = false
let messageSet = false
let calibratedLight = 128
let fadeLevel = 0

// Calibrate ambient light on startup
function calibrate() {
    basic.showLeds(`
        . . # . .
        . . # . .
        # # # # #
        . . # . .
        . . # . .
    `)
    basic.pause(1000)
    calibratedLight = input.lightLevel()
    lightThreshold = Math.max(calibratedLight - 60, 15)
    basic.showIcon(IconNames.Yes)
    basic.pause(500)
    basic.clearScreen()
}

// "Write" invisible ink animation
function writeAnimation() {
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            led.plot(col, row)
            basic.pause(30)
        }
    }
    basic.pause(200)
    // Fade out to simulate invisible ink drying
    for (let bright = 255; bright >= 0; bright -= 25) {
        led.setBrightness(bright)
        basic.pause(50)
    }
    led.setBrightness(255)
    basic.clearScreen()
}

// Reveal animation — characters appear gradually
function revealMessage(msg: string) {
    for (let i = 0; i < msg.length; i++) {
        // Flicker effect
        for (let flicker = 0; flicker < 3; flicker++) {
            led.setBrightness(Math.randomRange(50, 200))
            basic.showString(msg.charAt(i))
            basic.pause(50)
        }
        led.setBrightness(255)
        basic.showString(msg.charAt(i))
        basic.pause(100)
    }
}

// Startup calibration
calibrate()
basic.showString("INK")

// Button A: select message to "write"
input.onButtonPressed(Button.A, function () {
    currentMessage = (currentMessage + 1) % secretMessages.length
    basic.showNumber(currentMessage + 1)
    basic.pause(500)
})

// Button B: "write" the invisible message (store it)
input.onButtonPressed(Button.B, function () {
    writeAnimation()
    messageSet = true
    // Show confirmation dot
    led.plot(2, 2)
    basic.pause(500)
    basic.clearScreen()
})

// Button A+B: recalibrate light sensor
input.onButtonPressed(Button.AB, function () {
    messageSet = false
    calibrate()
})

// Shake: clear stored message
input.onGesture(Gesture.Shake, function () {
    messageSet = false
    basic.showIcon(IconNames.No)
    basic.pause(300)
    basic.clearScreen()
})

// Main loop: monitor light level for reveal trigger
basic.forever(function () {
    if (messageSet) {
        let currentLight = input.lightLevel()

        if (currentLight < lightThreshold) {
            // Dark enough — reveal the hidden message
            if (!revealMode) {
                revealMode = true
                music.playTone(523, 100)
                basic.pause(100)
                music.playTone(659, 100)
                revealMessage(secretMessages[currentMessage])
                revealMode = false
            }
        } else {
            // Too bright — message stays hidden
            // Show faint hint that a message exists
            fadeLevel = (fadeLevel + 1) % 10
            if (fadeLevel < 2) {
                led.plot(2, 2)
            } else {
                led.unplot(2, 2)
            }
        }
        basic.pause(100)
    } else {
        // No message stored — show light level bar
        let lightBar = Math.map(input.lightLevel(), 0, 255, 0, 5)
        basic.clearScreen()
        for (let i = 0; i < lightBar; i++) {
            led.plot(i, 4)
        }
        basic.pause(200)
    }
})
