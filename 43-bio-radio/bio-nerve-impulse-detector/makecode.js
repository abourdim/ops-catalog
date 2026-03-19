/*
 * Bio Nerve Impulse Detector - micro:bit MakeCode
 * Simulates nerve impulse detection via touch pin sensitivity
 * Radio broadcasts nerve activity patterns to monitoring mesh
 */

let nerveBaseline = 0
let impulseCount = 0
let firingRate = 0
let lastImpulse = 0
let impulseHistory: number[] = []
let activityLevel = 0
let monitoring = false
let displayMode = 0

radio.setGroup(44)
radio.setTransmitPower(6)
basic.showString("NI")

function calibrateNerve() {
    let sum = 0
    for (let i = 0; i < 40; i++) {
        sum += pins.analogReadPin(AnalogPin.P0)
        basic.pause(25)
    }
    nerveBaseline = sum / 40
    basic.showIcon(IconNames.Yes)
    basic.pause(300)
}

function readNerveSignal(): number {
    let p0 = pins.analogReadPin(AnalogPin.P0)
    let p1 = pins.analogReadPin(AnalogPin.P1)
    return Math.abs(p0 - p1 - (nerveBaseline - 512))
}

function detectImpulse(signal: number): boolean {
    let threshold = 80
    if (signal > threshold) {
        let now = input.runningTime()
        if (now - lastImpulse > 50) {
            let interval = now - lastImpulse
            lastImpulse = now
            impulseHistory.push(interval)
            if (impulseHistory.length > 20) impulseHistory.shift()
            impulseCount++
            return true
        }
    }
    return false
}

function calculateFiringRate() {
    if (impulseHistory.length < 2) {
        firingRate = 0
        return
    }
    let sum = 0
    let count = Math.min(impulseHistory.length, 10)
    for (let i = impulseHistory.length - count; i < impulseHistory.length; i++) {
        sum += impulseHistory[i]
    }
    let avgInterval = sum / count
    if (avgInterval > 0) {
        firingRate = Math.round(1000 / avgInterval)
    }
}

function classifyActivity(): string {
    if (firingRate > 30) return "strong"
    if (firingRate > 15) return "moderate"
    if (firingRate > 5) return "light"
    return "rest"
}

function displayNerveActivity() {
    basic.clearScreen()
    if (displayMode == 0) {
        // Spike display
        let recent = impulseHistory.slice(Math.max(0, impulseHistory.length - 5))
        for (let i = 0; i < recent.length; i++) {
            let height = Math.constrain(Math.round(1000 / recent[i] / 10), 1, 5)
            for (let r = 4; r >= 5 - height; r--) {
                led.plot(i, r)
            }
        }
    } else {
        // Activity level bars
        let level = Math.constrain(Math.floor(firingRate / 8), 0, 4)
        for (let c = 0; c < 5; c++) {
            if (c <= level) {
                for (let r = 0; r < 5; r++) led.plot(c, r)
            }
        }
    }
}

calibrateNerve()

// Button A: Start/stop monitoring
input.onButtonPressed(Button.A, function () {
    monitoring = !monitoring
    if (monitoring) {
        basic.showIcon(IconNames.EyeOpen)
        basic.pause(300)
    } else {
        basic.showIcon(IconNames.Asleep)
        basic.pause(300)
    }
})

// Button B: Toggle display / show stats
input.onButtonPressed(Button.B, function () {
    displayMode = (displayMode + 1) % 3
    if (displayMode == 2) {
        basic.showString("R" + firingRate + "Hz")
        basic.pause(500)
        basic.showString("N" + impulseCount)
    }
})

// A+B: Reset counters
input.onButtonPressed(Button.AB, function () {
    impulseCount = 0
    impulseHistory = []
    firingRate = 0
    basic.showIcon(IconNames.Yes)
    basic.pause(300)
})

// Shake: broadcast status
input.onGesture(Gesture.Shake, function () {
    radio.sendValue("rate", firingRate)
    radio.sendValue("cnt", impulseCount)
    radio.sendString(classifyActivity())
    basic.showIcon(IconNames.Yes)
    basic.pause(200)
})

// Receive nerve data from network
radio.onReceivedValue(function (name: string, value: number) {
    if (name == "rate") {
        led.plot(4, Math.constrain(4 - Math.round(value / 10), 0, 4))
        basic.pause(50)
    }
})

radio.onReceivedString(function (s: string) {
    if (s == "strong") {
        basic.showIcon(IconNames.Skull)
        basic.pause(200)
    }
})

// Main nerve sensing loop
basic.forever(function () {
    if (!monitoring) return

    let signal = readNerveSignal()
    if (detectImpulse(signal)) {
        calculateFiringRate()
        radio.sendValue("imp", signal)
        music.playTone(440 + firingRate * 10, 20)
    }

    activityLevel = Math.constrain(firingRate, 0, 50)
    displayNerveActivity()

    basic.pause(10)
})
