// ============================================================
// BIT-PANIC-BUTTON — Emergency Alert Button
// Press A+B simultaneously or shake hard to trigger an alert.
// Sends emergency radio broadcast and flashes SOS on LEDs.
// Long press B to arm/disarm. Button A cycles alert levels.
// ============================================================

let isArmed = false
let alertActive = false
let alertLevel = 0  // 0=silent, 1=visual, 2=audio+visual, 3=full broadcast
let sosPattern = [3, 1, 3, 1, 3, 3, 1, 3, 1, 3, 1, 3, 3, 1, 3, 1, 3]
// 3=dash(long), 1=dot(short) — S.O.S in Morse
let emergencyChannel = 42
let deviceId = Math.randomRange(100, 999)

// Initialize radio
radio.setGroup(emergencyChannel)
radio.setTransmitPower(7)  // Maximum power

// SOS LED pattern
function flashSOS() {
    for (let i = 0; i < sosPattern.length; i++) {
        if (!alertActive) break
        if (sosPattern[i] == 3) {
            basic.showLeds(`
                # # # # #
                # # # # #
                # # # # #
                # # # # #
                # # # # #
            `)
            if (alertLevel >= 2) {
                music.playTone(880, 300)
            }
            basic.pause(300)
        } else {
            basic.showLeds(`
                . . . . .
                . # # # .
                . # # # .
                . # # # .
                . . . . .
            `)
            if (alertLevel >= 2) {
                music.playTone(880, 100)
            }
            basic.pause(100)
        }
        basic.clearScreen()
        basic.pause(100)
    }
}

// Send emergency broadcast
function broadcastEmergency() {
    let msg = "PANIC:" + deviceId + ":LVL" + alertLevel
    for (let burst = 0; burst < 5; burst++) {
        radio.sendString(msg)
        basic.pause(50)
    }
}

// Show armed status
function showArmedStatus() {
    if (isArmed) {
        basic.showLeds(`
            . . # . .
            . # # # .
            . # # # .
            # # # # #
            . . # . .
        `)
    } else {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . # . .
            . . . . .
            . . . . .
        `)
    }
}

// Show alert level
function showAlertLevel() {
    basic.clearScreen()
    for (let i = 0; i <= alertLevel; i++) {
        led.plot(i, 4)
        led.plot(i, 3)
    }
    basic.pause(500)
}

// Startup
basic.showString("PB")
basic.pause(300)
showArmedStatus()

// Button A: cycle alert level
input.onButtonPressed(Button.A, function () {
    if (!alertActive) {
        alertLevel = (alertLevel + 1) % 4
        showAlertLevel()
        basic.pause(500)
        showArmedStatus()
    }
})

// Button B: arm/disarm the panic button
input.onButtonPressed(Button.B, function () {
    if (alertActive) {
        // Cancel active alert
        alertActive = false
        basic.clearScreen()
        basic.showIcon(IconNames.Yes)
        basic.pause(500)
        showArmedStatus()
        // Send all-clear
        radio.sendString("CLEAR:" + deviceId)
    } else {
        isArmed = !isArmed
        if (isArmed) {
            music.playTone(523, 100)
            basic.pause(50)
            music.playTone(659, 100)
        } else {
            music.playTone(659, 100)
            basic.pause(50)
            music.playTone(523, 100)
        }
        showArmedStatus()
    }
})

// Button A+B: TRIGGER PANIC ALERT
input.onButtonPressed(Button.AB, function () {
    if (isArmed && !alertActive) {
        alertActive = true
        // Broadcast emergency
        if (alertLevel >= 3) {
            broadcastEmergency()
        }
    }
})

// Shake: also triggers panic when armed
input.onGesture(Gesture.Shake, function () {
    let shakeForce = input.acceleration(Dimension.Strength)
    if (isArmed && !alertActive && shakeForce > 1500) {
        alertActive = true
        if (alertLevel >= 3) {
            broadcastEmergency()
        }
    }
})

// Receive alerts from other panic buttons
radio.onReceivedString(function (receivedString) {
    if (receivedString.indexOf("PANIC:") == 0) {
        // Another device triggered panic
        basic.showString("!")
        music.playTone(1000, 200)
        basic.pause(100)
        music.playTone(1000, 200)
    } else if (receivedString.indexOf("CLEAR:") == 0) {
        basic.showIcon(IconNames.Yes)
        basic.pause(500)
    }
})

// Main loop: run alert pattern when active
basic.forever(function () {
    if (alertActive) {
        flashSOS()
        if (alertLevel >= 3) {
            broadcastEmergency()
        }
        basic.pause(500)
    }
})

// Secondary loop: armed indicator blink
basic.forever(function () {
    if (isArmed && !alertActive) {
        led.plot(4, 0)
        basic.pause(500)
        led.unplot(4, 0)
        basic.pause(500)
    }
})
