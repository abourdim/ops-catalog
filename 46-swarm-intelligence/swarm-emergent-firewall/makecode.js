/**
 * Swarm Emergent Firewall - micro:bit MakeCode
 * Collective threat detection via radio consensus voting
 * LED shows threat level and blocked count
 */

const GROUP = 45
let myId = control.deviceSerialNumber() & 0xFF
let threats: { mac: number, score: number, reporters: number, blocked: boolean }[] = []
let peerIds: number[] = []
let blockedCount = 0

radio.setGroup(GROUP)
radio.setTransmitPower(7)

function findThreat(mac: number): number {
    for (let i = 0; i < threats.length; i++)
        if (threats[i].mac === mac) return i
    return -1
}

function reportThreat(mac: number, score: number) {
    let idx = findThreat(mac)
    if (idx < 0) {
        threats.push({ mac: mac, score: score, reporters: 1, blocked: false })
        idx = threats.length - 1
    }
    let msg = "T:" + myId + ":" + mac + ":" + score
    radio.sendString(msg)
}

function checkBlock(idx: number) {
    if (threats[idx].reporters >= 3 && !threats[idx].blocked) {
        threats[idx].blocked = true
        blockedCount++
        serial.writeLine("[FW] BLOCKED mac=" + threats[idx].mac +
            " score=" + threats[idx].score)
    }
}

function displayStatus() {
    basic.clearScreen()
    let activeThreats = 0
    for (let t of threats) if (!t.blocked) activeThreats++
    // Red zone = active threats (top rows)
    for (let i = 0; i < Math.min(activeThreats, 10); i++) {
        led.plot(i % 5, Math.floor(i / 5))
    }
    // Green zone = blocked (bottom rows)
    for (let i = 0; i < Math.min(blockedCount, 5); i++) {
        led.plot(i, 4)
    }
}

radio.onReceivedString(function (msg: string) {
    let parts = msg.split(":")
    if (parts.length < 2) return
    let senderId = parseInt(parts[1])

    if (peerIds.indexOf(senderId) < 0 && peerIds.length < 10)
        peerIds.push(senderId)

    if (parts[0] === "T" && parts.length >= 4) {
        let mac = parseInt(parts[2])
        let score = parseInt(parts[3])
        let idx = findThreat(mac)
        if (idx < 0) {
            threats.push({ mac: mac, score: score, reporters: 1, blocked: false })
            idx = threats.length - 1
        } else {
            threats[idx].reporters++
            if (score > threats[idx].score) threats[idx].score = score
        }
        checkBlock(idx)
        // Vote back
        let vote = "V:" + myId + ":" + mac + ":1"
        radio.sendString(vote)
    } else if (parts[0] === "V" && parts.length >= 4) {
        let mac = parseInt(parts[2])
        let idx = findThreat(mac)
        if (idx >= 0 && parseInt(parts[3]) === 1) {
            threats[idx].reporters++
            checkBlock(idx)
        }
    }
})

input.onButtonPressed(Button.A, function () {
    let fakeMac = Math.randomRange(1, 255)
    reportThreat(fakeMac, Math.randomRange(50, 100))
    basic.showIcon(IconNames.Skull)
    basic.pause(500)
})

input.onButtonPressed(Button.B, function () {
    serial.writeLine("{\"id\":" + myId + ",\"peers\":" + peerIds.length +
        ",\"threats\":" + threats.length + ",\"blocked\":" + blockedCount + "}")
})

basic.forever(function () {
    displayStatus()
    basic.pause(500)
})
