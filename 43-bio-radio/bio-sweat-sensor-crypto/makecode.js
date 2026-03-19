/*
 * Bio Sweat Sensor Crypto - micro:bit MakeCode
 * Uses touch pin conductance as sweat/stress proxy for crypto keys
 * Radio shares encrypted data using bio-generated keys
 */

let sweatLevel = 0
let sweatBaseline = 0
let stressLevel = 0
let entropyPool: number[] = []
let cryptoKey: number[] = []
let keyReady = false
let samplesCollected = 0

radio.setGroup(48)
radio.setTransmitPower(5)
basic.showString("SC")

function calibrateSweat() {
    let sum = 0
    for (let i = 0; i < 30; i++) {
        sum += pins.analogReadPin(AnalogPin.P0)
        basic.pause(30)
    }
    sweatBaseline = sum / 30
    basic.showIcon(IconNames.Yes)
    basic.pause(300)
}

function readSweatLevel(): number {
    let p0 = pins.analogReadPin(AnalogPin.P0)
    let p1 = pins.analogReadPin(AnalogPin.P1)
    return Math.abs(p0 - p1)
}

function harvestEntropy(value: number) {
    let noise = (value * 31 + input.runningTime()) % 256
    noise = noise ^ (input.acceleration(Dimension.X) & 0xFF)
    noise = noise ^ (input.lightLevel() * 3)
    entropyPool.push(noise % 256)

    if (entropyPool.length > 64) {
        entropyPool.shift()
    }
    samplesCollected++
}

function generateKey() {
    if (entropyPool.length < 16) return
    cryptoKey = []

    for (let i = 0; i < 8; i++) {
        let mixed = 0
        for (let j = 0; j < 4; j++) {
            let idx = (i * 4 + j) % entropyPool.length
            mixed = mixed ^ entropyPool[idx]
            mixed = ((mixed << 3) | (mixed >> 5)) & 0xFF
        }
        cryptoKey.push(mixed)
    }
    keyReady = true
}

function encryptByte(data: number, pos: number): number {
    if (!keyReady || cryptoKey.length == 0) return data
    return (data ^ cryptoKey[pos % cryptoKey.length]) & 0xFF
}

function calculateStress() {
    let current = readSweatLevel()
    let delta = current - sweatBaseline
    stressLevel = Math.constrain(Math.round(delta / 5), 0, 100)
}

function displayStressBar() {
    basic.clearScreen()
    let bars = Math.floor(stressLevel / 20)
    for (let c = 0; c < Math.min(bars, 5); c++) {
        for (let r = 4; r >= 4 - c; r--) {
            led.plot(c, r)
        }
    }
}

calibrateSweat()

// Button A: Generate crypto key
input.onButtonPressed(Button.A, function () {
    if (samplesCollected < 20) {
        basic.showString("WAIT")
        return
    }
    generateKey()
    basic.showIcon(IconNames.Yes)
    basic.pause(300)

    // Display key visual
    basic.clearScreen()
    for (let i = 0; i < cryptoKey.length; i++) {
        let x = i % 5
        let y = Math.floor(i / 5)
        if (cryptoKey[i] > 128) led.plot(x, y)
    }
    basic.pause(500)
})

// Button B: Send encrypted message
input.onButtonPressed(Button.B, function () {
    if (!keyReady) {
        basic.showString("KEY?")
        return
    }
    let message = [72, 69, 76, 76, 79] // HELLO
    for (let i = 0; i < message.length; i++) {
        let encrypted = encryptByte(message[i], i)
        radio.sendValue("enc", encrypted)
        basic.pause(50)
    }
    radio.sendValue("done", cryptoKey.length)
    basic.showIcon(IconNames.Yes)
    basic.pause(300)
})

// A+B: show stress level
input.onButtonPressed(Button.AB, function () {
    basic.showNumber(stressLevel)
    basic.showString("%")
})

// Receive encrypted data
radio.onReceivedValue(function (name: string, value: number) {
    if (name == "enc" && keyReady) {
        let decrypted = encryptByte(value, 0)
        led.plot(Math.randomRange(0, 4), Math.randomRange(0, 4))
    }
})

// Continuous sweat monitoring and entropy harvesting
basic.forever(function () {
    sweatLevel = readSweatLevel()
    harvestEntropy(sweatLevel)
    calculateStress()
    displayStressBar()

    radio.sendValue("stress", stressLevel)
    basic.pause(200)
})
