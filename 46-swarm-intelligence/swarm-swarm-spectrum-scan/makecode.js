/**
 * Swarm Spectrum Scan - micro:bit MakeCode
 * Distributed radio spectrum analysis across micro:bit swarm
 * Each node scans assigned radio groups and shares RSSI data
 */

const BASE_GROUP = 47
let myId = control.deviceSerialNumber() & 0xFF
let scanResults: { group: number, rssi: number, count: number }[] = []
let peerResults: { id: number, group: number, rssi: number }[] = []
let peerIds: number[] = []
let currentScanGroup = 0
let scanning = false

radio.setGroup(BASE_GROUP)
radio.setTransmitPower(7)

function scanGroup(group: number) {
    radio.setGroup(group)
    scanning = true
    let bestRssi = -128
    let count = 0

    // Listen briefly
    let startTime = input.runningTime()
    while (input.runningTime() - startTime < 200) {
        basic.pause(10)
    }

    scanResults.push({ group: group, rssi: bestRssi, count: count })
    radio.setGroup(BASE_GROUP)
    scanning = false
}

function shareResults() {
    for (let r of scanResults) {
        let msg = "S:" + myId + ":" + r.group + ":" + r.rssi + ":" + r.count
        radio.sendString(msg)
    }
}

function displaySpectrum() {
    basic.clearScreen()
    // Show spectrum as bar graph (5 groups)
    for (let col = 0; col < 5; col++) {
        let grp = col + 1
        let bestRssi = -100
        for (let r of scanResults) {
            if (r.group === grp && r.rssi > bestRssi) bestRssi = r.rssi
        }
        for (let pr of peerResults) {
            if (pr.group === grp && pr.rssi > bestRssi) bestRssi = pr.rssi
        }
        let bars = Math.map(bestRssi, -100, -30, 0, 4)
        bars = Math.constrain(Math.round(bars), 0, 4)
        for (let row = 4; row >= 4 - bars; row--) {
            led.plot(col, row)
        }
    }
}

radio.onReceivedString(function (msg: string) {
    if (scanning) return
    let parts = msg.split(":")
    if (parts.length < 2) return
    let senderId = parseInt(parts[1])

    if (peerIds.indexOf(senderId) < 0 && peerIds.length < 8)
        peerIds.push(senderId)

    if (parts[0] === "S" && parts.length >= 5) {
        let grp = parseInt(parts[2])
        let rssi = parseInt(parts[3])
        let found = false
        for (let pr of peerResults) {
            if (pr.id === senderId && pr.group === grp) {
                pr.rssi = rssi
                found = true
                break
            }
        }
        if (!found && peerResults.length < 40) {
            peerResults.push({ id: senderId, group: grp, rssi: rssi })
        }
    }
})

input.onButtonPressed(Button.A, function () {
    basic.showIcon(IconNames.Target)
    scanResults = []
    for (let g = 1; g <= 5; g++) {
        scanGroup(g)
    }
    shareResults()
    basic.pause(300)
})

input.onButtonPressed(Button.B, function () {
    serial.writeLine("{\"id\":" + myId + ",\"peers\":" + peerIds.length +
        ",\"scans\":" + scanResults.length + ",\"peer_data\":" + peerResults.length + "}")
})

basic.forever(function () {
    displaySpectrum()
    basic.pause(500)
})
