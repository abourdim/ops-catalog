// ============================================================
// BIT-RADIO-CARTOGRAPHER — Radio Signal Mapper
// Maps radio signal strength across an area by recording RSSI
// values at different positions. Displays a 5x5 heatmap on
// the LED matrix. Move around to build the signal map.
// ============================================================

let mapGrid: number[][] = []
let gridX = 2  // Current cursor position (center)
let gridY = 2
let isMapping = false
let samplesPerCell = 5
let mapChannel = 20
let beaconDetected = false
let currentRssi = -100
let minRssi = -100
let maxRssi = -30

// Initialize 5x5 grid with default values
for (let row = 0; row < 5; row++) {
    let gridRow: number[] = []
    for (let col = 0; col < 5; col++) {
        gridRow.push(-128)
    }
    mapGrid.push(gridRow)
}

// Initialize radio
radio.setGroup(mapChannel)
radio.setTransmitPower(7)

// Map RSSI to LED brightness (0-255)
function rssiBrightness(rssi: number): number {
    let bright = Math.map(rssi, minRssi, maxRssi, 0, 255)
    return Math.constrain(bright, 0, 255)
}

// Draw the signal heatmap
function drawHeatmap() {
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            if (mapGrid[r][c] > -128) {
                let brightness = rssiBrightness(mapGrid[r][c])
                if (brightness > 128) {
                    led.plot(c, r)
                } else {
                    led.unplot(c, r)
                }
            } else {
                led.unplot(c, r)
            }
        }
    }
    // Show cursor position
    led.toggle(gridX, gridY)
}

// Draw cursor at current position
function drawCursor() {
    basic.clearScreen()
    led.plot(gridX, gridY)
}

// Take RSSI sample at current grid position
function samplePosition() {
    let total = 0
    let validSamples = 0

    // Send pings and collect RSSI
    for (let s = 0; s < samplesPerCell; s++) {
        radio.sendString("MAP:PING")
        basic.pause(100)
        if (currentRssi > -128) {
            total += currentRssi
            validSamples++
        }
    }

    if (validSamples > 0) {
        mapGrid[gridY][gridX] = Math.round(total / validSamples)
        music.playTone(440 + mapGrid[gridY][gridX] * 5, 50)
    }
}

// Startup
basic.showString("RC")
basic.pause(300)
drawCursor()

// Button A: start/stop mapping mode
input.onButtonPressed(Button.A, function () {
    isMapping = !isMapping
    if (isMapping) {
        basic.showLeds(`
            . . . . .
            . # # # .
            . # . # .
            . # # # .
            . . . . .
        `)
        basic.pause(300)
        drawCursor()
    } else {
        drawHeatmap()
    }
})

// Button B: take sample at current position
input.onButtonPressed(Button.B, function () {
    if (isMapping) {
        // Sampling animation
        for (let blink = 0; blink < 3; blink++) {
            led.plot(gridX, gridY)
            basic.pause(100)
            led.unplot(gridX, gridY)
            basic.pause(100)
        }
        samplePosition()
        drawHeatmap()
    } else {
        // Show current RSSI value
        basic.showNumber(currentRssi)
        basic.pause(500)
        drawHeatmap()
    }
})

// Button A+B: clear map and reset
input.onButtonPressed(Button.AB, function () {
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            mapGrid[r][c] = -128
        }
    }
    gridX = 2
    gridY = 2
    basic.showIcon(IconNames.No)
    basic.pause(300)
    basic.clearScreen()
    drawCursor()
})

// Tilt to move cursor
input.onGesture(Gesture.TiltLeft, function () {
    if (isMapping && gridX > 0) {
        gridX--
        drawCursor()
    }
})

input.onGesture(Gesture.TiltRight, function () {
    if (isMapping && gridX < 4) {
        gridX++
        drawCursor()
    }
})

input.onGesture(Gesture.LogoDown, function () {
    if (isMapping && gridY > 0) {
        gridY--
        drawCursor()
    }
})

input.onGesture(Gesture.LogoUp, function () {
    if (isMapping && gridY < 4) {
        gridY++
        drawCursor()
    }
})

// Radio receive: capture RSSI from any packet
radio.onReceivedString(function (receivedString) {
    currentRssi = radio.receivedPacket(RadioPacketProperty.SignalStrength)
    beaconDetected = true
})

// Background: beacon mode (also acts as a signal source)
basic.forever(function () {
    radio.sendString("MAP:BEACON")
    basic.pause(2000)
})

// Background: auto-sample when mapping
basic.forever(function () {
    if (isMapping) {
        // Blink cursor
        led.toggle(gridX, gridY)
        basic.pause(300)
    }
})
