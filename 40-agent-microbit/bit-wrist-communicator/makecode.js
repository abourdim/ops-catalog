// ============================================================
// BIT-WRIST-COMMUNICATOR — Wrist-Worn Communicator
// A wrist-mounted micro:bit communication device for agents.
// Supports quick-reply messages, compass, clock, and covert
// vibration alerts. Designed for one-handed operation.
// ============================================================

let commGroup = 90
let commId = "W" + Math.randomRange(10, 99)
let inboxMsg = ""
let inboxFrom = ""
let hasNewMessage = false
let currentApp = 0  // 0=comms, 1=compass, 2=clock, 3=stealth
let clockSeconds = 0
let clockMinutes = 0
let clockHours = 12
let stealthMode = false
let vibratePin = DigitalPin.P0

// Quick-reply messages
let quickReplies = [
    "COPY",
    "NEGATIVE",
    "EN ROUTE",
    "HOLD",
    "ABORT",
    "CONFIRMED",
    "DANGER",
    "CLEAR"
]
let selectedReply = 0

// Initialize radio
radio.setGroup(commGroup)
radio.setTransmitPower(4)

// Vibration alert (using pin output to motor)
function vibrateAlert(pattern: number) {
    if (pattern == 0) {
        // Short buzz
        pins.digitalWritePin(vibratePin, 1)
        basic.pause(100)
        pins.digitalWritePin(vibratePin, 0)
    } else if (pattern == 1) {
        // Double buzz
        for (let i = 0; i < 2; i++) {
            pins.digitalWritePin(vibratePin, 1)
            basic.pause(100)
            pins.digitalWritePin(vibratePin, 0)
            basic.pause(100)
        }
    } else {
        // Long buzz
        pins.digitalWritePin(vibratePin, 1)
        basic.pause(500)
        pins.digitalWritePin(vibratePin, 0)
    }
}

// Show compass on LED matrix
function showCompass() {
    let heading = input.compassHeading()
    basic.clearScreen()

    // Cardinal direction indicator
    let dir = ""
    if (heading >= 337 || heading < 22) dir = "N"
    else if (heading >= 22 && heading < 67) dir = "NE"
    else if (heading >= 67 && heading < 112) dir = "E"
    else if (heading >= 112 && heading < 157) dir = "SE"
    else if (heading >= 157 && heading < 202) dir = "S"
    else if (heading >= 202 && heading < 247) dir = "SW"
    else if (heading >= 247 && heading < 292) dir = "W"
    else dir = "NW"

    basic.showString(dir)
}

// Show clock display
function showClock() {
    basic.clearScreen()
    // Hour dots (top two rows)
    let hourDots = clockHours % 12
    for (let i = 0; i < hourDots && i < 10; i++) {
        led.plot(i % 5, Math.floor(i / 5))
    }
    // Minute indicator (bottom row)
    let minDots = Math.round(clockMinutes / 12)
    for (let i = 0; i < minDots; i++) {
        led.plot(i, 4)
    }
    // Blinking seconds indicator
    if (clockSeconds % 2 == 0) {
        led.plot(2, 2)
    }
}

// Show communication app
function showCommApp() {
    if (hasNewMessage) {
        basic.showLeds(`
            # # # # #
            . # . # .
            . . # . .
            . . . . .
            . . . . .
        `)
    } else {
        // Show selected reply preview
        let preview = quickReplies[selectedReply]
        basic.showString(preview.charAt(0))
    }
}

// Show stealth mode (minimal display)
function showStealth() {
    basic.clearScreen()
    // Just a single dim pixel
    led.setBrightness(10)
    led.plot(2, 2)
    led.setBrightness(255)
}

// Startup
basic.showString(commId)
basic.pause(300)
basic.clearScreen()

// Button A: navigate apps / select reply
input.onButtonPressed(Button.A, function () {
    if (currentApp == 0) {
        // Cycle quick replies
        selectedReply = (selectedReply + 1) % quickReplies.length
        if (!stealthMode) {
            basic.showString(quickReplies[selectedReply].substr(0, 3))
            basic.pause(200)
        }
        vibrateAlert(0)
    } else {
        // Switch app
        currentApp = (currentApp + 1) % 4
        let appNames = ["COM", "CMP", "CLK", "STH"]
        if (!stealthMode) {
            basic.showString(appNames[currentApp])
            basic.pause(300)
        }
        vibrateAlert(0)
    }
})

// Button B: send reply / action in current app
input.onButtonPressed(Button.B, function () {
    if (currentApp == 0) {
        if (hasNewMessage) {
            // Read inbox message
            if (!stealthMode) {
                basic.showString(inboxFrom + ":" + inboxMsg)
            }
            vibrateAlert(1)
            hasNewMessage = false
            basic.pause(500)
        } else {
            // Send selected quick reply
            let reply = quickReplies[selectedReply]
            radio.sendString("WCOM:" + commId + ":" + reply)
            vibrateAlert(0)
            if (!stealthMode) {
                basic.showIcon(IconNames.Yes)
                basic.pause(200)
            }
        }
    } else if (currentApp == 3) {
        // Toggle stealth mode
        stealthMode = !stealthMode
        if (stealthMode) {
            led.setBrightness(1)
            music.setVolume(0)
        } else {
            led.setBrightness(255)
            music.setVolume(128)
        }
        vibrateAlert(stealthMode ? 2 : 0)
    }
})

// Button A+B: switch between apps
input.onButtonPressed(Button.AB, function () {
    currentApp = (currentApp + 1) % 4
    let appNames = ["COM", "CMP", "CLK", "STH"]
    if (!stealthMode) {
        basic.showString(appNames[currentApp])
    }
    vibrateAlert(0)
    basic.pause(300)
})

// Shake: emergency broadcast
input.onGesture(Gesture.Shake, function () {
    radio.sendString("WCOM:" + commId + ":EMERGENCY")
    vibrateAlert(2)
    if (!stealthMode) {
        basic.showString("SOS")
        basic.pause(500)
    }
})

// Radio receive handler
radio.onReceivedString(function (receivedString) {
    let parts = receivedString.split(":")
    if (parts.length < 3 || parts[0] != "WCOM") return

    inboxFrom = parts[1]
    inboxMsg = parts[2]
    hasNewMessage = true

    // Alert based on mode
    if (stealthMode) {
        vibrateAlert(1)
    } else {
        vibrateAlert(1)
        music.playTone(660, 50)
    }
})

// Main display loop
basic.forever(function () {
    if (currentApp == 0) {
        showCommApp()
    } else if (currentApp == 1) {
        showCompass()
    } else if (currentApp == 2) {
        showClock()
    } else {
        showStealth()
    }
    basic.pause(500)
})

// Clock tick
basic.forever(function () {
    basic.pause(1000)
    clockSeconds++
    if (clockSeconds >= 60) {
        clockSeconds = 0
        clockMinutes++
        if (clockMinutes >= 60) {
            clockMinutes = 0
            clockHours = (clockHours + 1) % 24
        }
    }
})

// New message blink indicator
basic.forever(function () {
    if (hasNewMessage && !stealthMode) {
        led.toggle(4, 0)
        basic.pause(500)
    }
})
