/**
 * Swarm Hive Mind Sensor - micro:bit MakeCode
 * Collective sensor fusion using radio-shared readings
 * LED bar shows consensus value vs local reading
 */

const GROUP = 46
let myId = control.deviceSerialNumber() & 0xFF
let myReadings: number[] = []
let peerValues: { id: number, val: number, count: number }[] = []
let consensus = 0
let seq = 0

radio.setGroup(GROUP)
radio.setTransmitPower(7)

function readSensor(): number {
    return input.lightLevel() + input.temperature() * 0.1
}

function calcMean(arr: number[]): number {
    if (arr.length === 0) return 0
    let s = 0
    for (let v of arr) s += v
    return s / arr.length
}

function computeConsensus() {
    let values: number[] = []
    let myMean = calcMean(myReadings)
    values.push(myMean)
    for (let p of peerValues) {
        values.push(p.val)
    }
    if (values.length > 0) {
        // Median-based consensus (robust to outliers)
        values.sort((a, b) => a - b)
        let mid = Math.floor(values.length / 2)
        consensus = values.length % 2 === 0
            ? (values[mid - 1] + values[mid]) / 2
            : values[mid]
    }
}

function displayConsensus() {
    basic.clearScreen()
    let myVal = readSensor()
    let maxVal = 280
    // Left column: local reading
    let localBars = Math.min(Math.floor(myVal / maxVal * 5), 4)
    for (let y = 4; y >= 4 - localBars; y--) led.plot(0, y)
    for (let y = 4; y >= 4 - localBars; y--) led.plot(1, y)
    // Right column: consensus
    let consBars = Math.min(Math.floor(consensus / maxVal * 5), 4)
    for (let y = 4; y >= 4 - consBars; y--) led.plot(3, y)
    for (let y = 4; y >= 4 - consBars; y--) led.plot(4, y)
    // Middle: peer count
    let dots = Math.min(peerValues.length, 5)
    for (let y = 0; y < dots; y++) led.plot(2, y)
}

radio.onReceivedString(function (msg: string) {
    let parts = msg.split(",")
    if (parts.length < 2) return
    let senderId = parseInt(parts[0])
    let val = parseFloat(parts[1])

    let found = false
    for (let p of peerValues) {
        if (p.id === senderId) {
            p.val = val
            p.count++
            found = true
            break
        }
    }
    if (!found && peerValues.length < 8) {
        peerValues.push({ id: senderId, val: val, count: 1 })
    }
})

input.onButtonPressed(Button.A, function () {
    serial.writeLine("{\"id\":" + myId + ",\"val\":" + readSensor() +
        ",\"consensus\":" + consensus + ",\"peers\":" + peerValues.length + "}")
})

input.onButtonPressed(Button.B, function () {
    basic.showNumber(Math.round(consensus))
})

basic.forever(function () {
    let val = readSensor()
    myReadings.push(val)
    if (myReadings.length > 20) myReadings.shift()

    let msg = myId + "," + Math.roundWithPrecision(val, 1)
    radio.sendString(msg)

    computeConsensus()
    displayConsensus()
    basic.pause(300)
})
