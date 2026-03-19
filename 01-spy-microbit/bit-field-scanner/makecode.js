// ============================================================
// BIT-FIELD-SCANNER — RF Field Strength Scanner
// Uses the micro:bit radio RSSI to scan for nearby RF sources.
// Displays signal strength as a bar graph on the LED matrix.
// Button A toggles scan mode, Button B logs peak reading.
// ============================================================

let scanning = false
let rssiValue = 0
let peakRssi = -128
let scanChannel = 0
let channelStrengths: number[] = []
let displayMode = 0  // 0=bar, 1=numeric, 2=sweep

// Initialize radio for passive scanning
radio.setGroup(1)
radio.setTransmitPower(0)

// Initialize channel strength array
for (let ch = 0; ch < 5; ch++) {
    channelStrengths.push(-128)
}

// Draw signal strength bar (0-4 columns based on RSSI)
function drawSignalBar(rssi: number) {
    basic.clearScreen()
    // Map RSSI (-128 to 0) to 0-25 LEDs
    let strength = Math.map(rssi, -100, -30, 0, 25)
    strength = Math.constrain(strength, 0, 25)
    let ledsOn = Math.round(strength)
    for (let i = 0; i < ledsOn; i++) {
        let col = i % 5
        let row = 4 - Math.floor(i / 5)
        led.plot(col, row)
    }
}

// Draw numeric RSSI value
function drawNumeric(rssi: number) {
    basic.showNumber(rssi)
}

// Draw channel sweep display
function drawSweep() {
    basic.clearScreen()
    for (let col = 0; col < 5; col++) {
        let height = Math.map(channelStrengths[col], -100, -30, 0, 5)
        height = Math.constrain(height, 0, 5)
        for (let row = 0; row < height; row++) {
            led.plot(col, 4 - row)
        }
    }
}

// Start scanning animation
function showScanStart() {
    for (let i = 0; i < 5; i++) {
        led.plot(i, 0)
        basic.pause(50)
    }
    for (let i = 0; i < 5; i++) {
        led.unplot(i, 0)
        basic.pause(50)
    }
}

// Startup
basic.showString("RF")
basic.pause(300)

// Button A: toggle scanning on/off
input.onButtonPressed(Button.A, function () {
    scanning = !scanning
    if (scanning) {
        showScanStart()
        peakRssi = -128
    } else {
        basic.clearScreen()
        basic.showIcon(IconNames.Square)
    }
})

// Button B: toggle display mode
input.onButtonPressed(Button.B, function () {
    displayMode = (displayMode + 1) % 3
    if (displayMode == 0) {
        basic.showString("B")
    } else if (displayMode == 1) {
        basic.showString("N")
    } else {
        basic.showString("S")
    }
    basic.pause(300)
})

// Button A+B: show peak RSSI reading
input.onButtonPressed(Button.AB, function () {
    basic.showString("P:")
    basic.showNumber(peakRssi)
    basic.pause(500)
})

// Receive any radio packet to measure RSSI
radio.onReceivedString(function (receivedString) {
    rssiValue = radio.receivedPacket(RadioPacketProperty.SignalStrength)
    if (rssiValue > peakRssi) {
        peakRssi = rssiValue
    }
    channelStrengths[scanChannel] = rssiValue
})

// Background: active scanning loop
basic.forever(function () {
    if (scanning) {
        // Send a probe packet to stimulate responses
        radio.sendString("SCAN")

        // Cycle through radio groups for channel sweep
        scanChannel = (scanChannel + 1) % 5
        radio.setGroup(scanChannel + 1)

        basic.pause(100)

        // Update display based on mode
        if (displayMode == 0) {
            drawSignalBar(rssiValue)
        } else if (displayMode == 1) {
            drawNumeric(rssiValue)
        } else {
            drawSweep()
        }

        // Alert on strong signal
        if (rssiValue > -40) {
            music.playTone(880, 50)
        }

        basic.pause(200)
    }
})

// Secondary loop: beacon for other scanners
basic.forever(function () {
    if (scanning) {
        radio.sendString("PING")
        basic.pause(1000)
    }
})
