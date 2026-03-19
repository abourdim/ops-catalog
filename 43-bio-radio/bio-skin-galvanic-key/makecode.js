/*
 * Bio Skin Galvanic Key - micro:bit MakeCode
 * Measures skin conductance via touch pins for biometric auth
 * Radio broadcasts authentication status to paired devices
 */

let gsrBaseline = 0
let gsrValue = 0
let enrolled = false
let enrolledPattern: number[] = []
let currentPattern: number[] = []
let authenticated = false
let matchScore = 0
let captureMode = false

radio.setGroup(88)
radio.setTransmitPower(5)
basic.showString("SK")

function readSkinConductance(): number {
    let p0 = pins.analogReadPin(AnalogPin.P0)
    let p1 = pins.analogReadPin(AnalogPin.P1)
    return Math.abs(p0 - p1)
}

function calibrate() {
    let sum = 0
    for (let i = 0; i < 30; i++) {
        sum += readSkinConductance()
        basic.pause(30)
    }
    gsrBaseline = sum / 30
    basic.showIcon(IconNames.Yes)
    basic.pause(300)
}

function captureGSRPattern(): number[] {
    let pattern: number[] = []
    basic.showIcon(IconNames.Target)
    for (let i = 0; i < 16; i++) {
        let reading = readSkinConductance() - gsrBaseline
        pattern.push(reading)
        led.plot(Math.floor(i / 4), i % 4)
        basic.pause(100)
    }
    return pattern
}

function comparePatterns(a: number[], b: number[]): number {
    if (a.length != b.length || a.length == 0) return 0
    let dot = 0, normA = 0, normB = 0
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i]
        normA += a[i] * a[i]
        normB += b[i] * b[i]
    }
    let denom = Math.sqrt(normA) * Math.sqrt(normB)
    if (denom < 1) return 0
    return Math.round((dot / denom) * 100)
}

function generateKeyFromPattern(pattern: number[]): number {
    let key = 0
    for (let i = 0; i < pattern.length; i++) {
        key = (key * 31 + Math.abs(pattern[i])) % 65536
    }
    return key
}

calibrate()

// Button A: Enroll skin pattern
input.onButtonPressed(Button.A, function () {
    basic.showString("E")
    basic.pause(300)
    enrolledPattern = captureGSRPattern()
    enrolled = true
    basic.showIcon(IconNames.Yes)
    let key = generateKeyFromPattern(enrolledPattern)
    radio.sendValue("enroll", key)
})

// Button B: Authenticate
input.onButtonPressed(Button.B, function () {
    if (!enrolled) {
        basic.showString("NO")
        return
    }
    basic.showString("A")
    basic.pause(300)
    currentPattern = captureGSRPattern()
    matchScore = comparePatterns(enrolledPattern, currentPattern)

    authenticated = matchScore > 75
    if (authenticated) {
        basic.showIcon(IconNames.Yes)
        radio.sendValue("auth", 1)
        radio.sendValue("match", matchScore)
    } else {
        basic.showIcon(IconNames.No)
        radio.sendValue("auth", 0)
    }
    basic.pause(1000)
    basic.showNumber(matchScore)
})

// Button A+B: Show match score
input.onButtonPressed(Button.AB, function () {
    basic.showString("M" + matchScore + "%")
})

// Receive auth from other nodes
radio.onReceivedValue(function (name: string, value: number) {
    if (name == "auth" && value == 1) {
        basic.showIcon(IconNames.Heart)
        basic.pause(300)
    }
})

// Continuous GSR display
basic.forever(function () {
    gsrValue = readSkinConductance()
    let level = Math.constrain(Math.floor((gsrValue - gsrBaseline) / 50), 0, 4)
    if (!captureMode) {
        for (let col = 0; col < 5; col++) {
            if (col <= level) led.plot(col, 4)
            else led.unplot(col, 4)
        }
    }
    basic.pause(200)
})
