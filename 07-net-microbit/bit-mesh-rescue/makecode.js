// ============================================================
// BIT-MESH-RESCUE — Emergency Mesh Network
// Creates an emergency communication mesh for rescue scenarios.
// Nodes relay distress signals with GPS-like location tags.
// Supports SOS broadcast, status check-in, and relay counting.
// ============================================================

let rescueId = Math.randomRange(100, 999)
let rescueGroup = 99
let isInDistress = false
let relayCount = 0
let nearbyNodes: number[] = []
let lastCheckIn = 0
let statusOk = true
let signalStrength = 0

// Status codes
let STATUS_OK = "OK"
let STATUS_SOS = "SOS"
let STATUS_INJURED = "INJ"
let STATUS_TRAPPED = "TRP"
let currentStatus = STATUS_OK

// Initialize rescue radio
radio.setGroup(rescueGroup)
radio.setTransmitPower(7)

// Message format: "RES:id:status:relay:rssi"
function buildRescueMsg(): string {
    return "RES:" + rescueId + ":" + currentStatus + ":" + relayCount + ":" + signalStrength
}

// Parse rescue message
function parseRescueMsg(raw: string) {
    let parts = raw.split(":")
    if (parts.length < 4) return
    if (parts[0] != "RES") return

    let senderId = parseInt(parts[1])
    let status = parts[2]
    let relay = parseInt(parts[3])

    // Track nearby nodes
    let found = false
    for (let i = 0; i < nearbyNodes.length; i++) {
        if (nearbyNodes[i] == senderId) {
            found = true
            break
        }
    }
    if (!found && senderId != rescueId) {
        nearbyNodes.push(senderId)
        if (nearbyNodes.length > 10) nearbyNodes.shift()
    }

    // Handle distress signals
    if (status == STATUS_SOS || status == STATUS_INJURED || status == STATUS_TRAPPED) {
        // Alert this node
        music.playTone(1000, 200)
        basic.pause(100)
        music.playTone(800, 200)
        basic.showString("!" + senderId)

        // Relay if not already relayed too many times
        if (relay < 5) {
            let relayMsg = "RES:" + senderId + ":" + status + ":" + (relay + 1) + ":0"
            basic.pause(Math.randomRange(100, 500))
            radio.sendString(relayMsg)
            relayCount++
        }
    }
}

// SOS flash pattern
function flashSOS() {
    let pattern = [1, 1, 1, 3, 3, 3, 1, 1, 1]  // S.O.S
    for (let i = 0; i < pattern.length; i++) {
        basic.showLeds(`
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            # # # # #
        `)
        basic.pause(pattern[i] * 100)
        basic.clearScreen()
        basic.pause(100)
    }
}

// Show network status
function showNetworkStatus() {
    basic.showString("N:" + nearbyNodes.length)
    basic.pause(500)
    basic.showString("R:" + relayCount)
    basic.pause(500)
}

// Startup
basic.showString("MR")
basic.pause(300)
basic.showNumber(rescueId)
basic.pause(500)
basic.clearScreen()

// Button A: cycle through status codes
input.onButtonPressed(Button.A, function () {
    if (currentStatus == STATUS_OK) {
        currentStatus = STATUS_SOS
    } else if (currentStatus == STATUS_SOS) {
        currentStatus = STATUS_INJURED
    } else if (currentStatus == STATUS_INJURED) {
        currentStatus = STATUS_TRAPPED
    } else {
        currentStatus = STATUS_OK
    }
    basic.showString(currentStatus)
    basic.pause(300)
})

// Button B: broadcast current status
input.onButtonPressed(Button.B, function () {
    let msg = buildRescueMsg()
    // Triple broadcast for reliability
    for (let i = 0; i < 3; i++) {
        radio.sendString(msg)
        basic.pause(100)
    }
    if (currentStatus == STATUS_SOS) {
        flashSOS()
    } else {
        basic.showIcon(IconNames.Yes)
        basic.pause(300)
    }
    basic.clearScreen()
})

// Button A+B: show network stats
input.onButtonPressed(Button.AB, function () {
    showNetworkStatus()
    basic.clearScreen()
})

// Shake: trigger SOS immediately
input.onGesture(Gesture.Shake, function () {
    currentStatus = STATUS_SOS
    isInDistress = true
    let msg = buildRescueMsg()
    for (let burst = 0; burst < 5; burst++) {
        radio.sendString(msg)
        basic.pause(50)
    }
})

// Radio receive handler
radio.onReceivedString(function (receivedString) {
    signalStrength = radio.receivedPacket(RadioPacketProperty.SignalStrength)
    parseRescueMsg(receivedString)
})

// Background: periodic check-in beacon
basic.forever(function () {
    if (!isInDistress) {
        radio.sendString(buildRescueMsg())
        // Subtle alive indicator
        led.plot(2, 2)
        basic.pause(200)
        led.unplot(2, 2)
        basic.pause(4800)
    }
})

// Background: SOS loop when in distress
basic.forever(function () {
    if (isInDistress) {
        flashSOS()
        radio.sendString(buildRescueMsg())
        basic.pause(1000)
    }
})
