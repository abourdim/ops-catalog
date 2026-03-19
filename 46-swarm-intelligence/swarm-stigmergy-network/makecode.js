/**
 * Swarm Stigmergy Network - micro:bit MakeCode
 * Digital pheromone markers shared via radio for indirect communication
 * LED intensity shows local marker strength
 */

const GROUP = 48
let myId = control.deviceSerialNumber() & 0xFF
let markers: { id: number, intensity: number, mtype: number }[] = []
const DECAY = 0.95
const THRESHOLD = 0.05

radio.setGroup(GROUP)
radio.setTransmitPower(7)

function depositMarker(mtype: number, intensity: number) {
    let mid = (myId << 8) | (markers.length & 0xFF)
    markers.push({ id: mid, intensity: intensity, mtype: mtype })
    let msg = "D:" + myId + ":" + mid + ":" + mtype + ":" + Math.roundWithPrecision(intensity, 2)
    radio.sendString(msg)
    return mid
}

function decayAll() {
    for (let i = markers.length - 1; i >= 0; i--) {
        markers[i].intensity *= DECAY
        if (markers[i].intensity < THRESHOLD) {
            markers.splice(i, 1)
        }
    }
}

function totalIntensity(mtype: number): number {
    let total = 0
    for (let m of markers) {
        if (mtype < 0 || m.mtype === mtype) total += m.intensity
    }
    return total
}

function displayMarkers() {
    basic.clearScreen()
    // Show intensity per type as columns
    let types = [0, 1, 2, 3]
    for (let col = 0; col < 4; col++) {
        let ti = totalIntensity(types[col])
        let bars = Math.min(Math.floor(ti * 5), 4)
        for (let row = 4; row >= 4 - bars; row--) {
            led.plot(col, row)
        }
    }
    // Column 4: total active markers
    let totalM = Math.min(markers.length, 5)
    for (let row = 4; row >= 5 - totalM; row--) {
        led.plot(4, row)
    }
}

radio.onReceivedString(function (msg: string) {
    let parts = msg.split(":")
    if (parts.length < 5 || parts[0] !== "D") return
    let senderId = parseInt(parts[1])
    let mid = parseInt(parts[2])
    let mtype = parseInt(parts[3])
    let intensity = parseFloat(parts[4])

    // Check if we already have this marker
    let found = false
    for (let m of markers) {
        if (m.id === mid) {
            m.intensity = Math.max(m.intensity, intensity * 0.8)
            found = true
            break
        }
    }
    if (!found && markers.length < 32) {
        markers.push({ id: mid, intensity: intensity * 0.8, mtype: mtype })
    }
})

// Button A: deposit PATH marker
input.onButtonPressed(Button.A, function () {
    depositMarker(0, 1.0)
    basic.showIcon(IconNames.SmallDiamond)
    basic.pause(300)
})

// Button B: deposit DANGER marker
input.onButtonPressed(Button.B, function () {
    depositMarker(1, 1.0)
    basic.showIcon(IconNames.No)
    basic.pause(300)
})

input.onButtonPressed(Button.AB, function () {
    serial.writeLine("{\"id\":" + myId + ",\"markers\":" + markers.length +
        ",\"path_i\":" + Math.roundWithPrecision(totalIntensity(0), 2) +
        ",\"danger_i\":" + Math.roundWithPrecision(totalIntensity(1), 2) + "}")
})

basic.forever(function () {
    decayAll()
    displayMarkers()
    basic.pause(400)
})
