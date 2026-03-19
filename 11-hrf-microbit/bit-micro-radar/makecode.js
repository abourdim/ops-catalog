// ============================================================
// BIT-MICRO-RADAR — Simple Radar Display
// Displays a rotating radar sweep on the LED matrix.
// Detects nearby radio-active micro:bits and shows them as
// blips on the display based on RSSI (distance estimate).
// ============================================================

let sweepAngle = 0
let radarActive = false
let radarGroup = 35
let blips: number[][] = []  // [x, y, age] for each detected blip
let maxBlipAge = 10
let sweepSpeed = 200

// Initialize radio
radio.setGroup(radarGroup)
radio.setTransmitPower(7)
let radarId = Math.randomRange(100, 999)

// Convert angle and distance to LED grid coordinates
function polarToGrid(angle: number, distance: number): number[] {
    let radians = angle * Math.PI / 180
    let x = Math.round(2 + distance * Math.cos(radians))
    let y = Math.round(2 - distance * Math.sin(radians))
    x = Math.constrain(x, 0, 4)
    y = Math.constrain(y, 0, 4)
    return [x, y]
}

// Draw radar sweep line at current angle
function drawSweepLine() {
    for (let d = 0; d < 3; d++) {
        let pos = polarToGrid(sweepAngle, d)
        led.plot(pos[0], pos[1])
    }
}

// Draw center dot
function drawCenter() {
    led.plot(2, 2)
}

// Add a blip at estimated position
function addBlip(rssi: number, senderAngle: number) {
    // Map RSSI to distance (0-2 grid units)
    let dist = Math.map(rssi, -30, -100, 0, 2)
    dist = Math.constrain(dist, 0, 2)
    let pos = polarToGrid(senderAngle, dist)

    // Check for existing blip at same position
    for (let i = 0; i < blips.length; i++) {
        if (blips[i][0] == pos[0] && blips[i][1] == pos[1]) {
            blips[i][2] = 0  // Reset age
            return
        }
    }

    blips.push([pos[0], pos[1], 0])
    if (blips.length > 8) {
        blips.shift()
    }
}

// Draw all active blips
function drawBlips() {
    for (let i = blips.length - 1; i >= 0; i--) {
        if (blips[i][2] < maxBlipAge) {
            led.plot(blips[i][0], blips[i][1])
            blips[i][2]++
        } else {
            blips.splice(i, 1)
        }
    }
}

// Radar ping sound
function radarPing() {
    music.playTone(1200, 20)
}

// Startup
basic.showString("RD")
basic.pause(300)
basic.clearScreen()

// Button A: start/stop radar
input.onButtonPressed(Button.A, function () {
    radarActive = !radarActive
    if (radarActive) {
        blips = []
        sweepAngle = 0
        radarPing()
    } else {
        basic.clearScreen()
        basic.showIcon(IconNames.Square)
        basic.pause(300)
        basic.clearScreen()
    }
})

// Button B: change sweep speed
input.onButtonPressed(Button.B, function () {
    if (sweepSpeed == 200) {
        sweepSpeed = 100
        basic.showString("F")
    } else if (sweepSpeed == 100) {
        sweepSpeed = 400
        basic.showString("S")
    } else {
        sweepSpeed = 200
        basic.showString("N")
    }
    basic.pause(200)
})

// Button A+B: show detected count
input.onButtonPressed(Button.AB, function () {
    basic.showString("B:" + blips.length)
    basic.pause(500)
})

// Shake: clear all blips
input.onGesture(Gesture.Shake, function () {
    blips = []
    basic.showIcon(IconNames.No)
    basic.pause(300)
})

// Radio: detect incoming signals
radio.onReceivedString(function (receivedString) {
    if (!radarActive) return
    let rssi = radio.receivedPacket(RadioPacketProperty.SignalStrength)

    // Use current sweep angle as the detection angle
    // This simulates directional detection
    addBlip(rssi, sweepAngle)

    // Blip sound — pitch based on distance
    let blipFreq = Math.map(rssi, -100, -30, 400, 1200)
    music.playTone(blipFreq, 30)
})

// Main radar loop
basic.forever(function () {
    if (radarActive) {
        basic.clearScreen()

        // Draw sweep line
        drawSweepLine()

        // Draw persistent blips
        drawBlips()

        // Draw center
        drawCenter()

        // Advance sweep
        sweepAngle = (sweepAngle + 30) % 360

        // Ping at north
        if (sweepAngle == 0) {
            radarPing()
        }

        // Send radar ping for other devices to bounce off
        radio.sendString("RADAR:" + radarId)

        basic.pause(sweepSpeed)
    }
})
