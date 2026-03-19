// ============================================================
// BIT-RADIO-SNIFFER — Radio Packet Sniffer
// Passively monitors micro:bit radio traffic across groups.
// Displays packet count, signal strength, and group activity.
// Scans through radio groups to detect active channels.
// ============================================================

let sniffGroup = 0
let isSniffing = false
let autoScan = false
let packetCount = 0
let groupPackets: number[] = []
let lastPacketData = ""
let lastRssi = -128
let scanDelay = 500
let strongestGroup = 0
let strongestRssi = -128

// Initialize packet counters for groups 0-9
for (let g = 0; g < 10; g++) {
    groupPackets.push(0)
}

// Initialize radio
radio.setGroup(sniffGroup)
radio.setTransmitPower(0)  // Low power, we're just listening

// Draw activity bar for current group
function drawActivityBar() {
    basic.clearScreen()
    let height = Math.map(groupPackets[sniffGroup], 0, 20, 0, 5)
    height = Math.constrain(height, 0, 5)
    for (let row = 0; row < height; row++) {
        led.plot(2, 4 - row)
    }
    // Show group number on left column
    let groupDisplay = Math.min(sniffGroup, 4)
    for (let i = 0; i <= groupDisplay; i++) {
        led.plot(0, 4 - i)
    }
    // Show RSSI on right column
    let rssiBar = Math.map(lastRssi, -100, -30, 0, 5)
    rssiBar = Math.constrain(rssiBar, 0, 5)
    for (let i = 0; i < rssiBar; i++) {
        led.plot(4, 4 - i)
    }
}

// Draw scan overview (all groups on 5x2 grid)
function drawScanOverview() {
    basic.clearScreen()
    for (let g = 0; g < 10; g++) {
        let col = g % 5
        let row = Math.floor(g / 5)
        if (groupPackets[g] > 0) {
            led.plot(col, row)
        }
    }
    // Bottom row: signal strength indicator
    let bars = Math.map(strongestRssi, -100, -30, 0, 5)
    bars = Math.constrain(bars, 0, 5)
    for (let i = 0; i < bars; i++) {
        led.plot(i, 4)
    }
}

// Startup
basic.showString("RS")
basic.pause(300)
basic.clearScreen()

// Button A: toggle sniffing on/off
input.onButtonPressed(Button.A, function () {
    isSniffing = !isSniffing
    if (isSniffing) {
        packetCount = 0
        basic.showLeds(`
            . . # . .
            . # . # .
            # . . . #
            . # . # .
            . . # . .
        `)
        basic.pause(300)
    } else {
        basic.showIcon(IconNames.Square)
        basic.pause(300)
        basic.clearScreen()
    }
})

// Button B: cycle through radio groups or toggle auto-scan
input.onButtonPressed(Button.B, function () {
    if (isSniffing && !autoScan) {
        sniffGroup = (sniffGroup + 1) % 10
        radio.setGroup(sniffGroup)
        basic.showNumber(sniffGroup)
        basic.pause(300)
    } else {
        autoScan = !autoScan
        if (autoScan) {
            basic.showString("AS")
        } else {
            basic.showString("M")
        }
        basic.pause(300)
    }
})

// Button A+B: show statistics
input.onButtonPressed(Button.AB, function () {
    let wasSniffing = isSniffing
    isSniffing = false
    basic.showString("T:" + packetCount)
    basic.pause(500)
    basic.showString("G:" + strongestGroup)
    basic.pause(500)
    basic.showString("R:" + lastRssi)
    basic.pause(500)
    // Show last packet preview (first 4 chars)
    if (lastPacketData.length > 0) {
        basic.showString(lastPacketData.substr(0, 4))
        basic.pause(500)
    }
    isSniffing = wasSniffing
})

// Shake: reset all counters
input.onGesture(Gesture.Shake, function () {
    packetCount = 0
    strongestRssi = -128
    for (let g = 0; g < 10; g++) {
        groupPackets[g] = 0
    }
    basic.showIcon(IconNames.No)
    basic.pause(300)
    basic.clearScreen()
})

// Radio receive handler: capture all packets
radio.onReceivedString(function (receivedString) {
    if (!isSniffing) return
    packetCount++
    lastPacketData = receivedString
    lastRssi = radio.receivedPacket(RadioPacketProperty.SignalStrength)

    // Track per-group stats
    groupPackets[sniffGroup] = Math.min(groupPackets[sniffGroup] + 1, 50)

    // Track strongest signal
    if (lastRssi > strongestRssi) {
        strongestRssi = lastRssi
        strongestGroup = sniffGroup
    }

    // Packet detection click
    music.playTone(200, 10)
})

// Main loop: display and auto-scan
basic.forever(function () {
    if (isSniffing) {
        if (autoScan) {
            // Auto-scan through all groups
            sniffGroup = (sniffGroup + 1) % 10
            radio.setGroup(sniffGroup)
            basic.pause(scanDelay)
            drawScanOverview()
        } else {
            drawActivityBar()
            basic.pause(200)
        }
    }
})
