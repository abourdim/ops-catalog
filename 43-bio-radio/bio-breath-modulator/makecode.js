/*
 * Bio Breath Modulator - micro:bit MakeCode
 * Detects breathing via accelerometer chest movement and mic
 * Radio modulates data transmission based on breath rhythm
 */

let breathValue = 0
let breathBaseline = 0
let breathRate = 0
let inhaling = true
let breathCycles = 0
let lastCrossing = 0
let breathHistory: number[] = []
let dataToSend: number[] = [72, 101, 108, 108, 111]
let sendIndex = 0
let modulating = false

radio.setGroup(65)
radio.setTransmitPower(7)
basic.showString("BM")

function calibrateBreath() {
    let sum = 0
    basic.showIcon(IconNames.Target)
    for (let i = 0; i < 40; i++) {
        sum += input.acceleration(Dimension.Z)
        basic.pause(50)
    }
    breathBaseline = sum / 40
    basic.showIcon(IconNames.Yes)
    basic.pause(300)
}

function detectBreathPhase(): number {
    let z = input.acceleration(Dimension.Z)
    let deviation = z - breathBaseline
    breathHistory.push(deviation)
    if (breathHistory.length > 30) breathHistory.shift()
    return deviation
}

function calculateBreathRate() {
    if (breathHistory.length < 10) return
    let crossings = 0
    for (let i = 1; i < breathHistory.length; i++) {
        if (breathHistory[i] * breathHistory[i - 1] < 0) {
            crossings++
        }
    }
    breathRate = Math.round(crossings * 60 / (breathHistory.length * 0.1) / 2)
}

function displayBreathWave() {
    basic.clearScreen()
    let cols = Math.min(breathHistory.length, 5)
    let startIdx = breathHistory.length - cols
    for (let c = 0; c < cols; c++) {
        let val = breathHistory[startIdx + c]
        let row = Math.constrain(2 - Math.round(val / 50), 0, 4)
        led.plot(c, row)
    }
}

function modulateData(breathPhase: number) {
    if (!modulating || dataToSend.length == 0) return

    if (inhaling && sendIndex < dataToSend.length) {
        let byte = dataToSend[sendIndex]
        let modByte = (byte + Math.abs(Math.round(breathPhase))) % 256
        radio.sendValue("bmod", modByte)
        sendIndex++
        if (sendIndex >= dataToSend.length) {
            sendIndex = 0
            radio.sendValue("done", 1)
        }
    }
}

calibrateBreath()

// Button A: Start/stop breath modulation
input.onButtonPressed(Button.A, function () {
    modulating = !modulating
    sendIndex = 0
    if (modulating) {
        basic.showString("TX")
    } else {
        basic.showIcon(IconNames.No)
    }
    basic.pause(300)
})

// Button B: Show breath rate
input.onButtonPressed(Button.B, function () {
    basic.showNumber(breathRate)
    basic.pause(500)
    basic.showString("bpm")
})

// Shake: recalibrate
input.onGesture(Gesture.Shake, function () {
    calibrateBreath()
})

// Receive modulated data
radio.onReceivedValue(function (name: string, value: number) {
    if (name == "bmod") {
        led.plot(4, Math.constrain(Math.round(value / 60), 0, 4))
        basic.pause(50)
    }
    if (name == "done") {
        basic.showIcon(IconNames.Yes)
        basic.pause(300)
    }
})

// Main breath sensing loop
basic.forever(function () {
    let phase = detectBreathPhase()

    let wasInhaling = inhaling
    inhaling = phase > 0

    if (wasInhaling && !inhaling) {
        breathCycles++
    }

    calculateBreathRate()
    displayBreathWave()
    modulateData(phase)

    radio.sendValue("br", breathRate)
    radio.sendValue("ph", inhaling ? 1 : 0)

    basic.pause(100)
})
