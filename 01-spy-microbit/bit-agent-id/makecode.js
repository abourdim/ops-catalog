// ============================================================
// BIT-AGENT-ID — Agent ID Badge on LED Matrix
// Displays a unique agent ID on the micro:bit LED matrix.
// Button A cycles through display modes, Button B edits the ID.
// Shake to show a secret alternate identity.
// ============================================================

// Agent configuration
let agentId = "A7"
let agentName = "SHADOW"
let secretId = "X9"
let displayMode = 0  // 0=ID, 1=name scroll, 2=icon
let editDigit = 0
let isLocked = true
let unlockCode = [1, 2, 1]  // tilt sequence: left, right, left
let unlockProgress = 0

// Badge icon patterns
function showBadgeIcon() {
    basic.showLeds(`
        . # # # .
        # . # . #
        # # # # #
        # . # . #
        . # # # .
    `)
}

function showLockedIcon() {
    basic.showLeds(`
        . # # # .
        . # . # .
        # # # # #
        # # # # #
        # # # # #
    `)
}

// Startup sequence
basic.showString("ID")
basic.pause(300)
showLockedIcon()

// Button A: cycle display modes when unlocked
input.onButtonPressed(Button.A, function () {
    if (isLocked) {
        basic.showLeds(`
            . . # . .
            . # . # .
            . . . # .
            . . # . .
            . . . . .
        `)
        basic.pause(500)
        showLockedIcon()
        return
    }
    displayMode = (displayMode + 1) % 3
    if (displayMode == 0) {
        basic.showString(agentId)
    } else if (displayMode == 1) {
        basic.showString(agentName)
    } else {
        showBadgeIcon()
    }
})

// Button B: show agent ID briefly (flash mode)
input.onButtonPressed(Button.B, function () {
    if (isLocked) {
        // Attempt unlock: track tilt sequence
        unlockProgress = 0
        basic.showLeds(`
            . . . . .
            . . . . .
            . . # . .
            . . . . .
            . . . . .
        `)
        for (let i = 0; i < 3; i++) {
            basic.pause(1500)
            let tilt = input.acceleration(Dimension.X)
            if (tilt < -300) {
                unlockProgress += (unlockCode[i] == 1) ? 1 : 0
            } else if (tilt > 300) {
                unlockProgress += (unlockCode[i] == 2) ? 1 : 0
            }
            led.plot(i + 1, 2)
        }
        if (unlockProgress >= 3) {
            isLocked = false
            basic.showIcon(IconNames.Yes)
            basic.pause(500)
            basic.showString(agentId)
        } else {
            basic.showIcon(IconNames.No)
            basic.pause(500)
            showLockedIcon()
        }
        return
    }
    // Flash ID three times
    for (let flash = 0; flash < 3; flash++) {
        basic.showString(agentId)
        basic.pause(200)
        basic.clearScreen()
        basic.pause(200)
    }
})

// Button A+B: lock the badge
input.onButtonPressed(Button.AB, function () {
    isLocked = true
    showLockedIcon()
})

// Shake: reveal secret identity
input.onGesture(Gesture.Shake, function () {
    if (!isLocked) {
        basic.showString(secretId)
        basic.pause(1000)
        basic.clearScreen()
    }
})

// Tilt left: show brightness bar
input.onGesture(Gesture.TiltLeft, function () {
    if (!isLocked) {
        led.setBrightness(64)
        basic.showString(agentId)
    }
})

// Tilt right: full brightness
input.onGesture(Gesture.TiltRight, function () {
    if (!isLocked) {
        led.setBrightness(255)
        basic.showString(agentId)
    }
})

// Background: heartbeat indicator when locked
basic.forever(function () {
    if (isLocked) {
        led.plot(4, 4)
        basic.pause(1000)
        led.unplot(4, 4)
        basic.pause(1000)
    }
})
