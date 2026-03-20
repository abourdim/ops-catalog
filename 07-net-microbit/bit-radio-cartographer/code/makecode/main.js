/**
 * bit-radio-cartographer — MakeCode JavaScript
 * 🗺️ map · 📡 measure · 📊 visualize
 *
 * Workshop-DIY Educational Project
 * Paste into makecode.microbit.org editor
 */

// ── Configuration ──
const APP_NAME = "bit-radio-cartographer"
const RADIO_GROUP = 10
let running = false
let cycleCount = 0
let score = 0

// ── Initialize ──
radio.setGroup(RADIO_GROUP)
radio.setTransmitPower(6)
basic.showIcon(IconNames.Happy)
basic.pause(500)
basic.showString(APP_NAME.substr(0, 4))

// ── Button A: Toggle simulation ──
input.onButtonPressed(Button.A, function () {
    running = !running
    if (running) {
        basic.showIcon(IconNames.SmallDiamond)
    } else {
        basic.showIcon(IconNames.Square)
    }
})

// ── Button B: Show stats ──
input.onButtonPressed(Button.B, function () {
    basic.showString("C" + cycleCount)
})

// ── Receive radio data ──
radio.onReceivedString(function (receivedString) {
    basic.showIcon(IconNames.Target)
    basic.pause(200)
    if (running) {
        basic.showIcon(IconNames.SmallDiamond)
    }
})

// ── Shake: Reset ──
input.onGesture(Gesture.Shake, function () {
    cycleCount = 0
    score = 0
    basic.showIcon(IconNames.Happy)
})

// ── Main Loop ──
basic.forever(function () {
    if (running) {
        // Read sensors
        let light = input.lightLevel()
        let temp = input.temperature()
        let accelX = Math.abs(input.acceleration(Dimension.X))

        // Process
        score = (light + temp * 2 + Math.idiv(accelX, 10)) % 100

        // Broadcast
        radio.sendString(APP_NAME + ":" + score)

        // Display result
        if (score > 70) {
            basic.showIcon(IconNames.Yes)
        } else if (score > 30) {
            basic.showIcon(IconNames.Diamond)
        } else {
            basic.showIcon(IconNames.No)
        }

        cycleCount += 1
        basic.pause(100)
    } else {
        basic.pause(500)
    }
})
