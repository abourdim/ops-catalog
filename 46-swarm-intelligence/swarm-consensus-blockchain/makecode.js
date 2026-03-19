/**
 * Swarm Consensus Blockchain - micro:bit MakeCode
 * Lightweight blockchain with radio-based voting consensus
 * LED shows chain length and mining status
 */

const GROUP = 44
let myId = control.deviceSerialNumber() & 0xFF
let chainLen = 1
let lastHash = 0
let peerCount = 0
let peerIds: number[] = []
let mining = false
let votes = 0
let seq = 0

radio.setGroup(GROUP)
radio.setTransmitPower(7)

function simpleHash(data: string, nonce: number): number {
    let h = 5381
    for (let i = 0; i < data.length; i++) {
        h = ((h << 5) + h + data.charCodeAt(i)) & 0xFFFF
    }
    h = ((h << 5) + h + nonce) & 0xFFFF
    return h
}

function mineBlock(data: string) {
    mining = true
    basic.showIcon(IconNames.SmallDiamond)
    let nonce = 0
    let hash = 0
    for (nonce = 0; nonce < 10000; nonce++) {
        hash = simpleHash(data + lastHash, nonce)
        if ((hash & 0xF000) === 0) break
    }
    // Broadcast block for vote
    let msg = "B:" + myId + ":" + chainLen + ":" + hash + ":" + nonce + ":" + data
    radio.sendString(msg)
    votes = 1
    basic.pause(1000)
    if (votes > peerCount / 2 || peerCount === 0) {
        lastHash = hash
        chainLen++
        serial.writeLine("[CHAIN] Block " + chainLen + " mined, hash=" + hash)
    }
    mining = false
}

function showChainStatus() {
    basic.clearScreen()
    let bars = Math.min(chainLen, 25)
    for (let i = 0; i < bars; i++) {
        led.plot(i % 5, Math.floor(i / 5))
    }
}

radio.onReceivedString(function (msg: string) {
    let parts = msg.split(":")
    if (parts.length < 2) return
    let senderId = parseInt(parts[1])

    if (peerIds.indexOf(senderId) < 0) {
        peerIds.push(senderId)
        peerCount = peerIds.length
    }

    if (parts[0] === "B" && parts.length >= 6) {
        let blockIdx = parseInt(parts[2])
        let hash = parseInt(parts[3])
        let nonce = parseInt(parts[4])
        let data = parts[5]
        let valid = (hash & 0xF000) === 0
        let voteMsg = "V:" + myId + ":" + (valid ? 1 : 0) + ":" + blockIdx
        radio.sendString(voteMsg)
        if (valid && blockIdx >= chainLen) {
            lastHash = hash
            chainLen = blockIdx + 1
        }
    } else if (parts[0] === "V" && parts.length >= 4) {
        if (parseInt(parts[2]) === 1) votes++
    } else if (parts[0] === "P") {
        radio.sendString("P:" + myId + ":" + chainLen)
    }
})

input.onButtonPressed(Button.A, function () {
    mineBlock("tx" + seq++)
})

input.onButtonPressed(Button.B, function () {
    serial.writeLine("{\"id\":" + myId + ",\"chain\":" + chainLen +
        ",\"peers\":" + peerCount + ",\"hash\":" + lastHash + "}")
})

input.onButtonPressed(Button.AB, function () {
    radio.sendString("P:" + myId + ":" + chainLen)
    basic.showNumber(peerCount)
    basic.pause(1000)
})

basic.forever(function () {
    if (!mining) showChainStatus()
    basic.pause(500)
})
