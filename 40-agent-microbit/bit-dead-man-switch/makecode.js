// ============================================================
// BIT-DEAD-MAN-SWITCH — Dead Man's Switch
// Requires periodic interaction to prove the agent is active.
// If no button press or movement within the timeout period,
// an emergency alert is broadcast via radio.
// ============================================================

let switchArmed = false
let timeoutSeconds = 30
let lastActivity = 0
let warningIssued = false
let alertSent = false
let checkInCount = 0
let switchGroup = 70
let agentCallsign = "A" + Math.randomRange(10, 99)

// Warning threshold (seconds before timeout to start warning)
let warningThreshold = 10

// Initialize radio
radio.setGroup(switchGroup)
radio.setTransmitPower(7)

// Record activity
function recordActivity() {
    lastActivity = input.runningTime()
    warningIssued = false
    alertSent = false
    checkInCount++
}

// Send emergency alert
function sendAlert() {
    let msg = "DMS:ALERT:" + agentCallsign + ":" + checkInCount
    for (let burst = 0; burst < 10; burst++) {
        radio.sendString(msg)
        basic.pause(100)
    }
}

// Send all-clear check-in
function sendCheckIn() {
    radio.sendString("DMS:OK:" + agentCallsign + ":" + checkInCount)
}

// Warning animation — flashing exclamation
function warningFlash() {
    basic.showLeds(`
        . . # . .
        . . # . .
        . . # . .
        . . . . .
        . . # . .
    `)
    music.playTone(880, 200)
    basic.pause(200)
    basic.clearScreen()
    basic.pause(200)
}

// Alert animation — full emergency
function alertAnimation() {
    basic.showLeds(`
        # # # # #
        # . . . #
        # . # . #
        # . . . #
        # # # # #
    `)
    music.playTone(1000, 300)
    basic.pause(200)
    basic.clearScreen()
    music.playTone(800, 300)
    basic.pause(200)
}

// Show countdown timer
function showCountdown(seconds: number) {
    basic.clearScreen()
    let bars = Math.map(seconds, 0, timeoutSeconds, 0, 25)
    bars = Math.constrain(bars, 0, 25)
    for (let i = 0; i < bars; i++) {
        let col = i % 5
        let row = 4 - Math.floor(i / 5)
        led.plot(col, row)
    }
}

// Startup
basic.showString("DMS")
basic.pause(300)
basic.showString(agentCallsign)
basic.pause(300)
basic.clearScreen()

// Button A: arm/disarm the dead man's switch
input.onButtonPressed(Button.A, function () {
    switchArmed = !switchArmed
    if (switchArmed) {
        recordActivity()
        // Arm countdown
        for (let t = 3; t > 0; t--) {
            basic.showNumber(t)
            basic.pause(1000)
        }
        basic.showIcon(IconNames.Yes)
        basic.pause(300)
        basic.clearScreen()
        sendCheckIn()
    } else {
        alertSent = false
        warningIssued = false
        basic.showIcon(IconNames.No)
        basic.pause(300)
        basic.clearScreen()
        radio.sendString("DMS:DISARM:" + agentCallsign)
    }
})

// Button B: check in (reset timer)
input.onButtonPressed(Button.B, function () {
    if (switchArmed) {
        recordActivity()
        basic.showIcon(IconNames.Heart)
        basic.pause(200)
        basic.clearScreen()
        sendCheckIn()
    } else {
        // Adjust timeout
        timeoutSeconds += 10
        if (timeoutSeconds > 120) timeoutSeconds = 10
        basic.showNumber(timeoutSeconds)
        basic.pause(500)
        basic.clearScreen()
    }
})

// Button A+B: show status
input.onButtonPressed(Button.AB, function () {
    basic.showString(agentCallsign)
    basic.pause(300)
    basic.showString("T:" + timeoutSeconds)
    basic.pause(300)
    basic.showString("C:" + checkInCount)
    basic.pause(300)
    basic.clearScreen()
    if (switchArmed) recordActivity()
})

// Shake: quick check-in
input.onGesture(Gesture.Shake, function () {
    if (switchArmed) {
        recordActivity()
        led.plot(2, 2)
        basic.pause(100)
        led.unplot(2, 2)
        sendCheckIn()
    }
})

// Motion detection as passive check-in
input.onGesture(Gesture.TiltLeft, function () {
    if (switchArmed) recordActivity()
})
input.onGesture(Gesture.TiltRight, function () {
    if (switchArmed) recordActivity()
})

// Receive DMS messages from other agents
radio.onReceivedString(function (receivedString) {
    let parts = receivedString.split(":")
    if (parts.length < 3 || parts[0] != "DMS") return

    if (parts[1] == "ALERT") {
        // Another agent's DMS triggered
        basic.showString("!" + parts[2])
        music.playTone(1000, 500)
        basic.pause(500)
    } else if (parts[1] == "OK") {
        // Another agent checked in
        led.plot(0, 0)
        basic.pause(200)
        led.unplot(0, 0)
    }
})

// Main monitoring loop
basic.forever(function () {
    if (switchArmed) {
        let elapsedMs = input.runningTime() - lastActivity
        let elapsedSec = Math.round(elapsedMs / 1000)
        let remaining = timeoutSeconds - elapsedSec

        if (remaining <= 0 && !alertSent) {
            // TIMEOUT — send emergency alert
            alertSent = true
            sendAlert()
            alertAnimation()
        } else if (remaining <= warningThreshold && remaining > 0 && !warningIssued) {
            // Warning phase
            warningIssued = true
        }

        if (alertSent) {
            alertAnimation()
            sendAlert()
        } else if (warningIssued) {
            warningFlash()
        } else {
            showCountdown(remaining)
        }

        basic.pause(500)
    }
})
