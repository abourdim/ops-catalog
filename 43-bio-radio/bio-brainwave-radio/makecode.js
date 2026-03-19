/*
 * Bio Brainwave Radio - micro:bit MakeCode
 * Simulates brainwave detection using accelerometer stillness + light
 * Radio broadcasts focus/relaxation state to mesh network
 */

let focusLevel = 0
let relaxLevel = 0
let brainState = "neutral"
let stillness = 0
let readings: number[] = []
let monitoring = true
let meshNodes = 0
let myNodeId = Math.randomRange(1, 255)

radio.setGroup(77)
radio.setTransmitPower(7)
basic.showString("BW")

function measureStillness(): number {
    let x = input.acceleration(Dimension.X)
    let y = input.acceleration(Dimension.Y)
    let z = input.acceleration(Dimension.Z)
    let magnitude = Math.sqrt(x * x + y * y + z * z)
    let deviation = Math.abs(magnitude - 1024)
    return Math.constrain(1024 - deviation, 0, 1024)
}

function analyzeBrainState() {
    let still = measureStillness()
    let light = input.lightLevel()
    let temp = input.temperature()

    readings.push(still)
    if (readings.length > 20) readings.shift()

    let avg = 0
    for (let r of readings) avg += r
    avg /= readings.length

    let variance = 0
    for (let r of readings) {
        let diff = r - avg
        variance += diff * diff
    }
    variance /= readings.length

    stillness = Math.round(avg)
    focusLevel = Math.constrain(Math.round(avg / 10), 0, 100)
    relaxLevel = Math.constrain(100 - Math.round(Math.sqrt(variance) / 5), 0, 100)

    if (focusLevel > 70 && relaxLevel > 60) brainState = "flow"
    else if (focusLevel > 60) brainState = "focus"
    else if (relaxLevel > 70) brainState = "relax"
    else if (focusLevel < 30) brainState = "restless"
    else brainState = "neutral"
}

function displayBrainState() {
    basic.clearScreen()
    if (brainState == "flow") {
        basic.showIcon(IconNames.Diamond)
    } else if (brainState == "focus") {
        let bars = Math.floor(focusLevel / 20)
        for (let i = 0; i < bars; i++) {
            led.plot(i, 2)
            led.plot(i, 1)
        }
    } else if (brainState == "relax") {
        basic.showIcon(IconNames.Asleep)
    } else if (brainState == "restless") {
        for (let i = 0; i < 5; i++) {
            led.plot(Math.randomRange(0, 4), Math.randomRange(0, 4))
        }
    } else {
        led.plot(2, 2)
    }
}

function broadcastState() {
    radio.sendValue("node", myNodeId)
    radio.sendValue("foc", focusLevel)
    radio.sendValue("rel", relaxLevel)
    radio.sendString(brainState)
}

input.onButtonPressed(Button.A, function () {
    monitoring = !monitoring
    if (monitoring) basic.showIcon(IconNames.Yes)
    else basic.showIcon(IconNames.No)
})

input.onButtonPressed(Button.B, function () {
    basic.showString("F" + focusLevel)
    basic.pause(500)
    basic.showString("R" + relaxLevel)
})

input.onButtonPressed(Button.AB, function () {
    basic.showString("N" + meshNodes)
})

radio.onReceivedValue(function (name: string, value: number) {
    if (name == "node") {
        meshNodes++
        led.plot(4, 4)
        basic.pause(50)
        led.unplot(4, 4)
    }
})

radio.onReceivedString(function (receivedString: string) {
    if (receivedString == "flow") {
        led.plot(0, 0)
        basic.pause(100)
        led.unplot(0, 0)
    }
})

basic.forever(function () {
    if (!monitoring) return
    analyzeBrainState()
    displayBrainState()
    broadcastState()
    basic.pause(100)
})
