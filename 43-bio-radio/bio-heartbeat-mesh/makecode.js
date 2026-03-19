/*
 * Bio Heartbeat Mesh - micro:bit MakeCode
 * Simulates heartbeat via button taps, creates radio mesh of heartbeats
 * Visualizes group heartbeat synchronization
 */

let myBPM = 0
let tapTimes: number[] = []
let peerBPMs: number[] = []
let peerCount = 0
let meshSync = 0
let displayMode = 0
let myNodeId = Math.randomRange(1, 255)

radio.setGroup(60)
radio.setTransmitPower(7)
radio.setTransmitSerialNumber(true)
basic.showIcon(IconNames.Heart)
basic.pause(500)

function recordTap() {
    let now = input.runningTime()
    tapTimes.push(now)
    if (tapTimes.length > 8) tapTimes.shift()
    calculateMyBPM()
}

function calculateMyBPM() {
    if (tapTimes.length < 2) return
    let totalInterval = 0
    for (let i = 1; i < tapTimes.length; i++) {
        totalInterval += tapTimes[i] - tapTimes[i - 1]
    }
    let avgInterval = totalInterval / (tapTimes.length - 1)
    if (avgInterval > 0) {
        myBPM = Math.round(60000 / avgInterval)
    }
}

function calculateMeshSync() {
    if (peerBPMs.length == 0) {
        meshSync = 0
        return
    }
    let totalDiff = 0
    for (let pbpm of peerBPMs) {
        totalDiff += Math.abs(myBPM - pbpm)
    }
    let avgDiff = totalDiff / peerBPMs.length
    meshSync = Math.constrain(100 - Math.round(avgDiff * 3), 0, 100)
}

function displayHeartbeat() {
    basic.showIcon(IconNames.Heart)
    basic.pause(80)
    basic.showIcon(IconNames.SmallHeart)
    basic.pause(80)
    basic.clearScreen()
}

function displayMeshStatus() {
    basic.clearScreen()
    // Center dot = me
    led.plot(2, 2)
    // Peer dots around center
    let positions = [[1, 1], [3, 1], [0, 3], [4, 3], [1, 4], [3, 4]]
    for (let i = 0; i < Math.min(peerCount, 6); i++) {
        led.plot(positions[i][0], positions[i][1])
    }
}

function displaySyncBar() {
    basic.clearScreen()
    let bars = Math.floor(meshSync / 20)
    for (let c = 0; c < bars; c++) {
        for (let r = 0; r < 5; r++) {
            led.plot(c, r)
        }
    }
}

// Button A: tap heartbeat
input.onButtonPressed(Button.A, function () {
    recordTap()
    displayHeartbeat()
    radio.sendValue("hb", myBPM)
    radio.sendValue("node", myNodeId)
})

// Button B: cycle display modes
input.onButtonPressed(Button.B, function () {
    displayMode = (displayMode + 1) % 4
    if (displayMode == 0) basic.showNumber(myBPM)
    else if (displayMode == 1) displayMeshStatus()
    else if (displayMode == 2) displaySyncBar()
    else basic.showString("P" + peerCount)
})

// A+B: reset mesh
input.onButtonPressed(Button.AB, function () {
    peerBPMs = []
    peerCount = 0
    tapTimes = []
    myBPM = 0
    basic.showIcon(IconNames.Yes)
    basic.pause(300)
})

// Receive heartbeats from mesh
radio.onReceivedValue(function (name: string, value: number) {
    if (name == "hb") {
        // Flash on peer heartbeat
        led.plot(Math.randomRange(0, 4), Math.randomRange(0, 4))
        basic.pause(30)

        // Track peer BPM
        peerBPMs.push(value)
        if (peerBPMs.length > 20) peerBPMs.shift()
        calculateMeshSync()
    }
    if (name == "node") {
        peerCount = Math.min(peerCount + 1, 6)
    }
})

// Periodic sync broadcast
basic.forever(function () {
    if (myBPM > 0) {
        radio.sendValue("sync", meshSync)
    }
    basic.pause(2000)
})
