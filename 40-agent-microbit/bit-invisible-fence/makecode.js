// ============================================================
// BIT-INVISIBLE-FENCE — RF Perimeter Fence
// Creates a virtual perimeter using radio signal strength.
// Beacon nodes mark the perimeter. A patrol unit alerts when
// something crosses the signal boundary (RSSI threshold).
// ============================================================

let fenceGroup = 80
let isBeacon = false
let isPatrol = true
let fenceThreshold = -60  // RSSI threshold for "inside" perimeter
let beaconId = Math.randomRange(1, 99)
let beaconRssiMap: number[] = []  // Track RSSI from each beacon
let beaconIds: number[] = []
let breachDetected = false
let breachCount = 0
let monitorActive = false
let lastBreachTime = 0

// Initialize radio
radio.setGroup(fenceGroup)
radio.setTransmitPower(7)

// Maximum tracked beacons
let maxBeacons = 5

// Update beacon RSSI map
function updateBeaconRssi(id: number, rssi: number) {
    let index = -1
    for (let i = 0; i < beaconIds.length; i++) {
        if (beaconIds[i] == id) {
            index = i
            break
        }
    }
    if (index >= 0) {
        beaconRssiMap[index] = rssi
    } else if (beaconIds.length < maxBeacons) {
        beaconIds.push(id)
        beaconRssiMap.push(rssi)
    }
}

// Check if all beacons are within threshold (inside fence)
function checkPerimeter(): boolean {
    if (beaconIds.length == 0) return true
    for (let i = 0; i < beaconRssiMap.length; i++) {
        if (beaconRssiMap[i] < fenceThreshold) {
            return false  // Outside fence boundary
        }
    }
    return true
}

// Draw perimeter status (beacon signal levels)
function drawPerimeterStatus() {
    basic.clearScreen()
    for (let i = 0; i < beaconIds.length && i < 5; i++) {
        let bars = Math.map(beaconRssiMap[i], -100, -30, 0, 5)
        bars = Math.constrain(bars, 0, 5)
        for (let r = 0; r < bars; r++) {
            led.plot(i, 4 - r)
        }
    }
    // Threshold line
    let threshRow = Math.map(fenceThreshold, -100, -30, 4, 0)
    threshRow = Math.constrain(Math.round(threshRow), 0, 4)
    for (let c = 0; c < 5; c++) {
        led.toggle(c, threshRow)
    }
}

// Breach alarm
function breachAlarm() {
    for (let siren = 0; siren < 3; siren++) {
        basic.showLeds(`
            # . # . #
            . # . # .
            # . # . #
            . # . # .
            # . # . #
        `)
        music.playTone(1000, 150)
        basic.pause(50)
        basic.clearScreen()
        music.playTone(700, 150)
        basic.pause(50)
    }
}

// Startup
basic.showString("IF")
basic.pause(300)
basic.showString("A=PTL B=BCN")

// Button A: set as patrol / toggle monitoring
input.onButtonPressed(Button.A, function () {
    if (!isBeacon) {
        isPatrol = true
        monitorActive = !monitorActive
        if (monitorActive) {
            breachCount = 0
            basic.showString("MON")
            basic.pause(300)
        } else {
            basic.showString("OFF")
            basic.pause(300)
            basic.clearScreen()
        }
    }
})

// Button B: set as beacon / adjust threshold
input.onButtonPressed(Button.B, function () {
    if (!monitorActive && !isBeacon) {
        isBeacon = true
        isPatrol = false
        radio.setTransmitPower(4)
        basic.showString("B" + beaconId)
        basic.pause(500)
    } else if (isPatrol && !monitorActive) {
        // Adjust fence threshold
        fenceThreshold += 10
        if (fenceThreshold > -30) fenceThreshold = -90
        basic.showNumber(fenceThreshold)
        basic.pause(500)
    } else if (isPatrol && monitorActive) {
        // Acknowledge breach
        breachDetected = false
        basic.showIcon(IconNames.Yes)
        basic.pause(300)
    }
})

// Button A+B: show fence status
input.onButtonPressed(Button.AB, function () {
    basic.showString("B:" + beaconIds.length)
    basic.pause(300)
    basic.showString("X:" + breachCount)
    basic.pause(300)
    basic.showString("T:" + fenceThreshold)
    basic.pause(300)
    basic.clearScreen()
})

// Shake: reset patrol unit
input.onGesture(Gesture.Shake, function () {
    if (isPatrol) {
        beaconIds = []
        beaconRssiMap = []
        breachCount = 0
        breachDetected = false
        basic.showIcon(IconNames.No)
        basic.pause(300)
        basic.clearScreen()
    }
})

// Radio receive handler
radio.onReceivedString(function (receivedString) {
    let parts = receivedString.split(":")
    if (parts.length < 3 || parts[0] != "FENCE") return

    let cmd = parts[1]
    let senderId = parseInt(parts[2])

    if (cmd == "BEACON" && isPatrol) {
        let rssi = radio.receivedPacket(RadioPacketProperty.SignalStrength)
        updateBeaconRssi(senderId, rssi)
    } else if (cmd == "BREACH" && isBeacon) {
        // Relay breach alert
        music.playTone(1000, 200)
        basic.showString("!")
        basic.pause(300)
    }
})

// Beacon transmission loop
basic.forever(function () {
    if (isBeacon) {
        radio.sendString("FENCE:BEACON:" + beaconId)
        // Beacon heartbeat LED
        led.plot(2, 2)
        basic.pause(200)
        led.unplot(2, 2)
        basic.pause(1800)
    }
})

// Patrol monitoring loop
basic.forever(function () {
    if (isPatrol && monitorActive) {
        if (!checkPerimeter()) {
            if (!breachDetected) {
                breachDetected = true
                breachCount++
                lastBreachTime = input.runningTime()
                // Alert other nodes
                radio.sendString("FENCE:BREACH:" + beaconId)
            }
            breachAlarm()
        } else {
            breachDetected = false
            drawPerimeterStatus()
        }
        basic.pause(300)
    }
})
