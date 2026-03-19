/**
 * Swarm Ant Colony Mesh - micro:bit MakeCode
 * Ant colony pheromone routing over micro:bit radio
 * Visual pheromone trail display with RSSI-based path selection
 */

const RADIO_GROUP = 42
const ANT_MSG = 0
const PHEROMONE_MSG = 1
const FOOD_MSG = 2
const DECAY_RATE = 0.9
const MAX_NEIGHBORS = 5

let myId = control.deviceSerialNumber() & 0xFF
let isNest = false
let isFood = false
let antCount = 0
let pheromones: number[] = [0, 0, 0, 0, 0]
let neighborIds: number[] = []
let neighborRssi: number[] = []
let seq = 0

radio.setGroup(RADIO_GROUP)
radio.setTransmitPower(7)

// Display role icon
function updateDisplay() {
    basic.clearScreen()
    if (isNest) {
        led.plot(2, 2)
        led.plot(1, 2)
        led.plot(3, 2)
        led.plot(2, 1)
        led.plot(2, 3)
    } else if (isFood) {
        led.plot(0, 0)
        led.plot(4, 0)
        led.plot(0, 4)
        led.plot(4, 4)
        led.plot(2, 2)
    } else {
        // Show pheromone intensity
        let maxP = 0
        for (let p of pheromones) if (p > maxP) maxP = p
        for (let y = 0; y < 5; y++) {
            let level = pheromones[y] / (maxP + 0.001)
            let cols = Math.min(Math.floor(level * 5), 4)
            for (let x = 0; x <= cols; x++) {
                led.plot(x, y)
            }
        }
    }
}

function addNeighbor(id: number, rssi: number) {
    let idx = neighborIds.indexOf(id)
    if (idx >= 0) {
        neighborRssi[idx] = rssi
        return idx
    }
    if (neighborIds.length < MAX_NEIGHBORS) {
        neighborIds.push(id)
        neighborRssi.push(rssi)
        pheromones.push(0.1)
        return neighborIds.length - 1
    }
    return -1
}

function selectNext(visited: number[]): number {
    let totalWeight = 0
    let weights: number[] = []
    for (let i = 0; i < neighborIds.length; i++) {
        if (visited.indexOf(neighborIds[i]) >= 0) {
            weights.push(0)
            continue
        }
        let w = (pheromones[i] + 0.01) * (100 / (Math.abs(neighborRssi[i]) + 1))
        weights.push(w)
        totalWeight += w
    }
    if (totalWeight <= 0) return -1
    let r = Math.random() * totalWeight
    let cum = 0
    for (let i = 0; i < weights.length; i++) {
        cum += weights[i]
        if (cum >= r && weights[i] > 0) return neighborIds[i]
    }
    return -1
}

function launchAnt() {
    let path = "" + myId
    let nextHop = selectNext([myId])
    if (nextHop >= 0) {
        let msg = "" + ANT_MSG + ":" + myId + ":" + antCount + ":" + path
        radio.sendString(msg)
        antCount++
    }
}

function decayPheromones() {
    for (let i = 0; i < pheromones.length; i++) {
        pheromones[i] *= DECAY_RATE
    }
}

radio.onReceivedString(function (receivedString: string) {
    let rssi = radio.receivedPacket(RadioPacketProperty.SignalStrength)
    let parts = receivedString.split(":")
    if (parts.length < 4) return
    let msgType = parseInt(parts[0])
    let senderId = parseInt(parts[1])

    addNeighbor(senderId, rssi)

    if (msgType === ANT_MSG) {
        let antId = parseInt(parts[2])
        let pathStr = parts[3]
        let pathNodes = pathStr.split(",").map(s => parseInt(s))

        if (isFood) {
            // Deposit pheromone on reverse path
            let deposit = 1.0 / pathNodes.length
            for (let nid of pathNodes) {
                let idx = neighborIds.indexOf(nid)
                if (idx >= 0) pheromones[idx] += deposit
            }
            let pMsg = "" + PHEROMONE_MSG + ":" + myId + ":" + deposit + ":" + pathStr
            radio.sendString(pMsg)
            return
        }

        if (pathNodes.indexOf(myId) >= 0) return
        pathNodes.push(myId)
        if (pathNodes.length > 6) return

        let next = selectNext(pathNodes)
        if (next >= 0) {
            let fwd = "" + ANT_MSG + ":" + senderId + ":" + antId + ":" + pathNodes.join(",")
            radio.sendString(fwd)
        }
    } else if (msgType === PHEROMONE_MSG) {
        let deposit = parseFloat(parts[2])
        let idx = neighborIds.indexOf(senderId)
        if (idx >= 0) pheromones[idx] += deposit
    }
})

input.onButtonPressed(Button.A, function () {
    isNest = true
    isFood = false
    basic.showString("N")
    basic.pause(500)
})

input.onButtonPressed(Button.B, function () {
    isFood = true
    isNest = false
    basic.showString("F")
    basic.pause(500)
})

input.onButtonPressed(Button.AB, function () {
    serial.writeLine("{\"id\":" + myId + ",\"role\":\"" +
        (isNest ? "nest" : isFood ? "food" : "relay") +
        "\",\"neighbors\":" + neighborIds.length +
        ",\"ants\":" + antCount + "}")
})

basic.forever(function () {
    decayPheromones()
    if (isNest) launchAnt()
    updateDisplay()
    basic.pause(500)
})
