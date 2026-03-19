// ============================================================
// BIT-MICRO-WIRE — Audio Transmission via BLE
// Transmits audio tones between two micro:bits over BLE.
// Sender encodes messages as tone sequences, receiver decodes.
// Uses frequency-shift keying for simple data transmission.
// ============================================================

// Tone encoding table (A-Z mapped to frequencies)
let baseFreq = 200
let freqStep = 30
let toneLength = 150
let gapLength = 50
let isTransmitting = false
let isReceiving = false
let messageQueue = ""
let decodedMessage = ""

// Predefined wire messages
let wireMessages = [
    "GO",
    "STOP",
    "YES",
    "NO",
    "HELP",
    "RUN"
]
let selectedWireMsg = 0

// Initialize BLE
bluetooth.startUartService()

// Convert character to frequency
function charToFreq(ch: string): number {
    let code = ch.charCodeAt(0)
    if (code >= 65 && code <= 90) {
        return baseFreq + (code - 65) * freqStep
    }
    if (code >= 97 && code <= 122) {
        return baseFreq + (code - 97) * freqStep
    }
    if (code == 32) {
        return 100  // space = low tone
    }
    return 0
}

// Convert frequency back to character
function freqToChar(freq: number): string {
    if (freq == 100) return " "
    let index = Math.round((freq - baseFreq) / freqStep)
    if (index >= 0 && index < 26) {
        return String.fromCharCode(65 + index)
    }
    return "?"
}

// Transmit a string as audio tones + BLE data
function transmitMessage(msg: string) {
    isTransmitting = true
    // Header tone
    music.playTone(1000, 200)
    basic.pause(100)
    music.playTone(1200, 200)
    basic.pause(200)

    for (let i = 0; i < msg.length; i++) {
        let freq = charToFreq(msg.charAt(i))
        if (freq > 0) {
            // Play tone locally
            music.playTone(freq, toneLength)
            // Send frequency data over BLE
            bluetooth.uartWriteString("" + freq + ",")
            // Visual feedback
            let col = i % 5
            led.plot(col, 2)
            basic.pause(gapLength)
            led.unplot(col, 2)
        }
    }

    // End-of-message tone
    music.playTone(1500, 300)
    bluetooth.uartWriteString("END\n")
    isTransmitting = false
    basic.showIcon(IconNames.Yes)
    basic.pause(300)
    basic.clearScreen()
}

// Visual waveform animation during receive
function showWaveform() {
    let positions = [2, 1, 3, 0, 4]
    for (let i = 0; i < 5; i++) {
        basic.clearScreen()
        led.plot(i, positions[i])
        led.plot(i, 2)
        basic.pause(80)
    }
}

// Startup
basic.showString("MW")
basic.pause(300)
basic.clearScreen()

// Button A: select message to transmit
input.onButtonPressed(Button.A, function () {
    if (!isTransmitting) {
        selectedWireMsg = (selectedWireMsg + 1) % wireMessages.length
        basic.showString(wireMessages[selectedWireMsg].charAt(0))
        basic.pause(200)
        basic.showNumber(selectedWireMsg + 1)
    }
})

// Button B: transmit the selected message
input.onButtonPressed(Button.B, function () {
    if (!isTransmitting) {
        basic.showLeds(`
            . . # . .
            . # # # .
            # # # # #
            . # # # .
            . . # . .
        `)
        basic.pause(300)
        transmitMessage(wireMessages[selectedWireMsg])
    }
})

// Button A+B: enter listening mode
input.onButtonPressed(Button.AB, function () {
    isReceiving = !isReceiving
    if (isReceiving) {
        decodedMessage = ""
        basic.showLeds(`
            . . # . .
            . # . # .
            # . . . #
            . # . # .
            . . # . .
        `)
    } else {
        // Show decoded message
        if (decodedMessage.length > 0) {
            basic.showString(decodedMessage)
        }
        basic.clearScreen()
    }
})

// BLE receive handler: decode frequency data
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    let data = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    let parts = data.split(",")
    decodedMessage = ""
    for (let p = 0; p < parts.length; p++) {
        let part = parts[p]
        if (part == "END" || part == "") continue
        let freq = parseInt(part)
        if (freq > 0) {
            decodedMessage += freqToChar(freq)
            music.playTone(freq, toneLength)
            basic.pause(gapLength)
        }
    }
    showWaveform()
    basic.showString(decodedMessage)
})

// BLE connection indicators
bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.SmallDiamond)
    basic.pause(300)
    basic.clearScreen()
})

bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.Skull)
    basic.pause(500)
    basic.clearScreen()
})

// Background: receiving mode animation
basic.forever(function () {
    if (isReceiving && !isTransmitting) {
        showWaveform()
        basic.pause(500)
    }
})
