/*
 * Bio Heartbeat Cipher - micro:bit MakeCode
 * Detects heartbeat via light sensor on finger, generates cipher from intervals
 * Radio shares encrypted heartbeat data with paired devices
 */

let beatThreshold = 150
let lastBeat = 0
let beatCount = 0
let intervals: number[] = []
let bpm = 0
let cipherKey: number[] = []
let monitoring = false
let displayMode = 0

radio.setGroup(55)
radio.setTransmitPower(6)
basic.showIcon(IconNames.Heart)
basic.pause(500)

function detectHeartbeat(): boolean {
    let light = input.lightLevel()
    let now = input.runningTime()

    if (light > beatThreshold && (now - lastBeat) > 400) {
        let interval = now - lastBeat
        lastBeat = now

        if (interval > 400 && interval < 1500) {
            intervals.push(interval)
            if (intervals.length > 8) {
                intervals.shift()
            }
            beatCount++
            return true
        }
    }
    return false
}

function calculateBPM() {
    if (intervals.length < 2) return
    let sum = 0
    for (let i = 0; i < intervals.length; i++) {
        sum += intervals[i]
    }
    bpm = Math.round(60000 / (sum / intervals.length))
}

function generateCipher() {
    cipherKey = []
    for (let i = 0; i < 8; i++) {
        let val = intervals[i % intervals.length]
        val = (val * 31 + 17) % 256
        cipherKey.push(val)
    }
}

function encryptByte(data: number, pos: number): number {
    if (cipherKey.length == 0) return data
    return (data ^ cipherKey[pos % cipherKey.length]) % 256
}

function showHeartAnimation() {
    basic.showIcon(IconNames.Heart)
    basic.pause(100)
    basic.showIcon(IconNames.SmallHeart)
    basic.pause(100)
}

function showBPMBars() {
    basic.clearScreen()
    let level = Math.constrain(Math.map(bpm, 50, 120, 0, 4), 0, 4)
    for (let y = 4; y >= 4 - level; y--) {
        led.plot(2, y)
        led.plot(1, y)
        led.plot(3, y)
    }
}

// Start monitoring
input.onButtonPressed(Button.A, function () {
    monitoring = !monitoring
    if (monitoring) {
        basic.showString("GO")
        intervals = []
        beatCount = 0
    } else {
        basic.showIcon(IconNames.No)
    }
})

// Toggle display mode
input.onButtonPressed(Button.B, function () {
    displayMode = (displayMode + 1) % 3
    if (displayMode == 0) basic.showString("H")
    if (displayMode == 1) basic.showString("B")
    if (displayMode == 2) basic.showString("K")
})

// Send cipher key on shake
input.onGesture(Gesture.Shake, function () {
    if (cipherKey.length > 0) {
        for (let i = 0; i < cipherKey.length; i++) {
            radio.sendValue("key" + i, cipherKey[i])
        }
        basic.showIcon(IconNames.Yes)
        basic.pause(300)
    }
})

// Receive heartbeat data from paired device
radio.onReceivedValue(function (name: string, value: number) {
    if (name == "hb") {
        basic.showIcon(IconNames.Heart)
        basic.pause(150)
        basic.clearScreen()
    }
    if (name.includes("key")) {
        led.plot(Math.randomRange(0, 4), Math.randomRange(0, 4))
    }
})

// Main loop
basic.forever(function () {
    if (!monitoring) return

    if (detectHeartbeat()) {
        calculateBPM()
        generateCipher()

        radio.sendValue("hb", bpm)

        if (displayMode == 0) showHeartAnimation()
        else if (displayMode == 1) showBPMBars()
    }

    basic.pause(20)
})
