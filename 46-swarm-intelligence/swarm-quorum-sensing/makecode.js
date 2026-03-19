/**
 * Swarm Quorum Sensing - micro:bit MakeCode
 * Bacterial quorum sensing: behavior changes at population threshold
 * LED brightness shows local density, pattern changes at quorum
 */

const GROUP = 50
let myId = control.deviceSerialNumber() & 0xFF
let QUORUM_THRESHOLD = 3
let neighborSignals: { id: number, strength: number, time: number }[] = []
let quorumActive = false
let localDensity = 0

radio.setGroup(GROUP)
radio.setTransmitPower(7)

function emitSignal() {
    let strength = quorumActive ? 2 : 1
    let msg = "Q:" + myId + ":" + strength + ":" + localDensity
    radio.sendString(msg)
}

function updateDensity() {
    let now = input.runningTime()
    // Remove stale neighbors
    for (let i = neighborSignals.length - 1; i >= 0; i--) {
        if (now - neighborSignals[i].time > 5000) {
            neighborSignals.splice(i, 1)
        }
    }
    localDensity = neighborSignals.length
    let wasActive = quorumActive
    quorumActive = localDensity >= QUORUM_THRESHOLD

    if (quorumActive && !wasActive) {
        serial.writeLine("[QUORUM] Activated! density=" + localDensity)
    } else if (!quorumActive && wasActive) {
        serial.writeLine("[QUORUM] Deactivated, density=" + localDensity)
    }
}

function displayState() {
    basic.clearScreen()
    if (quorumActive) {
        // Quorum pattern: full cross
        led.plot(2, 0); led.plot(2, 1); led.plot(2, 2); led.plot(2, 3); led.plot(2, 4)
        led.plot(0, 2); led.plot(1, 2); led.plot(3, 2); led.plot(4, 2)
    } else {
        // Show density as dots
        for (let i = 0; i < Math.min(localDensity, 9); i++) {
            led.plot(1 + (i % 3), 1 + Math.floor(i / 3))
        }
        // Blink center
        if (input.runningTime() % 1000 < 500) led.plot(2, 2)
    }
}

radio.onReceivedString(function (msg: string) {
    let parts = msg.split(":")
    if (parts.length < 4 || parts[0] !== "Q") return
    let senderId = parseInt(parts[1])
    let strength = parseFloat(parts[2])

    let found = false
    for (let n of neighborSignals) {
        if (n.id === senderId) {
            n.strength = strength
            n.time = input.runningTime()
            found = true
            break
        }
    }
    if (!found && neighborSignals.length < 12) {
        neighborSignals.push({ id: senderId, strength: strength, time: input.runningTime() })
    }
})

input.onButtonPressed(Button.A, function () {
    QUORUM_THRESHOLD = Math.max(1, QUORUM_THRESHOLD - 1)
    basic.showNumber(QUORUM_THRESHOLD)
    basic.pause(500)
})

input.onButtonPressed(Button.B, function () {
    QUORUM_THRESHOLD = Math.min(10, QUORUM_THRESHOLD + 1)
    basic.showNumber(QUORUM_THRESHOLD)
    basic.pause(500)
})

input.onButtonPressed(Button.AB, function () {
    serial.writeLine("{\"id\":" + myId + ",\"density\":" + localDensity +
        ",\"quorum\":" + quorumActive + ",\"threshold\":" + QUORUM_THRESHOLD + "}")
})

basic.forever(function () {
    emitSignal()
    updateDensity()
    displayState()
    basic.pause(500)
})
