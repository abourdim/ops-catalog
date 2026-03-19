/**
 * Swarm Slime Mold Router - micro:bit MakeCode
 * Physarum-inspired routing: links grow with use, shrink without
 * LED shows active link strength as brightness pattern
 */

const GROUP = 55
let myId = control.deviceSerialNumber() & 0xFF
let links: { id: number, conductivity: number, packets: number }[] = []
const DECAY = 0.95
const MIN_COND = 0.02
const BOOST = 0.3
let totalFlow = 0

radio.setGroup(GROUP)
radio.setTransmitPower(7)

function findLink(id: number): number {
    for (let i = 0; i < links.length; i++)
        if (links[i].id === id) return i
    return -1
}

function reinforce(id: number, amount: number) {
    let idx = findLink(id)
    if (idx >= 0) {
        links[idx].conductivity += amount
        links[idx].packets++
    } else if (links.length < 8) {
        links.push({ id: id, conductivity: 0.5, packets: 1 })
    }
}

function selectRoute(exclude: number[]): number {
    let totalCond = 0
    let candidates: { id: number, cond: number }[] = []
    for (let l of links) {
        if (exclude.indexOf(l.id) >= 0) continue
        candidates.push({ id: l.id, cond: l.conductivity })
        totalCond += l.conductivity
    }
    if (candidates.length === 0) return -1
    let r = Math.random() * totalCond
    let cum = 0
    for (let c of candidates) {
        cum += c.cond
        if (cum >= r) return c.id
    }
    return candidates[candidates.length - 1].id
}

function decayLinks() {
    for (let i = links.length - 1; i >= 0; i--) {
        links[i].conductivity *= DECAY
        if (links[i].conductivity < MIN_COND) {
            links.splice(i, 1)
        }
    }
}

function sendFlow(dst: number) {
    let next = selectRoute([myId])
    if (next >= 0) {
        reinforce(next, BOOST)
        let msg = "F:" + myId + ":" + dst + ":" + myId
        radio.sendString(msg)
        totalFlow++
    }
}

function displayLinks() {
    basic.clearScreen()
    for (let i = 0; i < Math.min(links.length, 5); i++) {
        let bars = Math.min(Math.floor(links[i].conductivity * 5), 4)
        for (let row = 4; row >= 4 - bars; row--) {
            led.plot(i, row)
        }
    }
}

radio.onReceivedString(function (msg: string) {
    let parts = msg.split(":")
    if (parts.length < 4 || parts[0] !== "F") return
    let senderId = parseInt(parts[1])
    let dst = parseInt(parts[2])
    let path = parts[3]

    reinforce(senderId, BOOST * 0.5)

    if (dst === myId) {
        // Reached destination
        serial.writeLine("[SLIME] Flow arrived from " + senderId + " via " + path)
        return
    }

    // Forward
    let pathNodes = path.split(",").map(s => parseInt(s))
    if (pathNodes.indexOf(myId) >= 0) return
    if (pathNodes.length > 5) return
    pathNodes.push(myId)

    let next = selectRoute(pathNodes)
    if (next >= 0) {
        reinforce(next, BOOST * 0.3)
        let fwd = "F:" + parts[1] + ":" + dst + ":" + pathNodes.join(",")
        radio.sendString(fwd)
    }
})

input.onButtonPressed(Button.A, function () {
    // Send flow to random destination
    sendFlow(Math.randomRange(1, 255))
    basic.showIcon(IconNames.ArrowEast)
    basic.pause(300)
})

input.onButtonPressed(Button.B, function () {
    serial.writeLine("{\"id\":" + myId + ",\"links\":" + links.length +
        ",\"flow\":" + totalFlow + "}")
})

basic.forever(function () {
    decayLinks()
    displayLinks()
    basic.pause(500)
})
