// ============================================================
// BIT-STEALTH-ALARM — Light-Based Intrusion Detector
// Monitors ambient light level and triggers an alarm when
// a significant change is detected (door opens, flashlight).
// Sends alert via radio. Configurable sensitivity.
// ============================================================

let baselineLight = 0
let sensitivity = 30  // change threshold
let alarmTriggered = false
let alarmArmed = false
let silentMode = true
let tripCount = 0
let cooldownActive = false
let sampleCount = 0
let lightHistory: number[] = []

// Radio setup for alert broadcast
radio.setGroup(15)
radio.setTransmitPower(7)
let deviceTag = "SA" + Math.randomRange(10, 99)

// Calibrate baseline light level
function calibrateBaseline() {
    let total = 0
    basic.showLeds(`
        . . # . .
        . . # . .
        # # # # #
        . . # . .
        . . # . .
    `)
    for (let i = 0; i < 10; i++) {
        total += input.lightLevel()
        basic.pause(100)
    }
    baselineLight = Math.round(total / 10)
    basic.showIcon(IconNames.Yes)
    basic.pause(300)
    basic.clearScreen()
}

// Show sensitivity level
function showSensitivity() {
    basic.clearScreen()
    let bars = Math.map(sensitivity, 10, 80, 1, 5)
    bars = Math.constrain(bars, 1, 5)
    for (let i = 0; i < bars; i++) {
        for (let row = 4; row >= 4 - i; row--) {
            led.plot(i, row)
        }
    }
    basic.pause(500)
}

// Trigger alarm sequence
function triggerAlarm() {
    alarmTriggered = true
    tripCount++

    // Send radio alert
    radio.sendString("ALARM:" + deviceTag + ":" + tripCount)

    if (!silentMode) {
        // Audible alarm
        for (let siren = 0; siren < 5; siren++) {
            music.playTone(880, 100)
            basic.showLeds(`
                # . # . #
                . # . # .
                # . # . #
                . # . # .
                # . # . #
            `)
            basic.pause(100)
            music.playTone(440, 100)
            basic.clearScreen()
            basic.pause(100)
        }
    } else {
        // Silent alarm — just radio and subtle LED
        for (let flash = 0; flash < 3; flash++) {
            led.plot(0, 0)
            basic.pause(200)
            led.unplot(0, 0)
            basic.pause(200)
        }
    }

    // Cooldown to prevent repeated triggers
    cooldownActive = true
    basic.pause(3000)
    cooldownActive = false
    alarmTriggered = false
}

// Startup
basic.showString("SA")
basic.pause(300)
calibrateBaseline()

// Button A: arm/disarm
input.onButtonPressed(Button.A, function () {
    alarmArmed = !alarmArmed
    if (alarmArmed) {
        calibrateBaseline()
        music.playTone(523, 100)
        basic.pause(50)
        music.playTone(659, 100)
        basic.pause(50)
        music.playTone(784, 100)
        // Show armed countdown
        for (let t = 3; t > 0; t--) {
            basic.showNumber(t)
            basic.pause(1000)
        }
        basic.clearScreen()
    } else {
        music.playTone(784, 100)
        basic.pause(50)
        music.playTone(523, 100)
        basic.showIcon(IconNames.No)
        basic.pause(300)
        basic.clearScreen()
    }
})

// Button B: toggle silent/audible mode
input.onButtonPressed(Button.B, function () {
    silentMode = !silentMode
    if (silentMode) {
        basic.showLeds(`
            . . . . .
            . . . . .
            # # # # #
            . . . . .
            . . . . .
        `)
    } else {
        basic.showLeds(`
            . . # . .
            . # # # .
            # # # # #
            # # # # #
            . # . # .
        `)
    }
    basic.pause(500)
    basic.clearScreen()
})

// Button A+B: adjust sensitivity and show trip count
input.onButtonPressed(Button.AB, function () {
    sensitivity = (sensitivity + 10) % 90
    if (sensitivity < 10) sensitivity = 10
    showSensitivity()
    basic.showString("T:" + tripCount)
    basic.pause(500)
    basic.clearScreen()
})

// Receive alerts from other alarm units
radio.onReceivedString(function (receivedString) {
    if (receivedString.indexOf("ALARM:") == 0) {
        basic.showString("!")
        music.playTone(1000, 200)
    }
})

// Main monitoring loop
basic.forever(function () {
    if (alarmArmed && !alarmTriggered && !cooldownActive) {
        let currentLight = input.lightLevel()
        let diff = Math.abs(currentLight - baselineLight)

        // Store in history for trend analysis
        lightHistory.push(currentLight)
        if (lightHistory.length > 10) {
            lightHistory.shift()
        }

        if (diff > sensitivity) {
            triggerAlarm()
        }

        // Subtle armed indicator
        sampleCount = (sampleCount + 1) % 20
        if (sampleCount == 0) {
            led.plot(4, 4)
            basic.pause(50)
            led.unplot(4, 4)
        }
        basic.pause(50)
    }
})
