// ============================================================
// BIT-DEAD-DROP — BLE Encrypted Message Exchange
// Two micro:bits exchange encrypted messages over BLE UART.
// Messages are XOR-encrypted with a shared key before sending.
// Button A composes, Button B receives, A+B clears.
// ============================================================

// Encryption key (shared between paired devices)
let encryptionKey = [42, 17, 93, 65, 8, 71, 33, 50]
let messageBuffer = ""
let receivedMessage = ""
let inboxFull = false
let composing = false

// Predefined dead-drop messages (select with tilts)
let messages = [
    "MEET AT DAWN",
    "PACKAGE READY",
    "ABORT MISSION",
    "ALL CLEAR",
    "COMPROMISED",
    "EXTRACT NOW"
]
let selectedMsg = 0

// XOR encrypt/decrypt a string using the shared key
function xorCipher(text: string): string {
    let result = ""
    for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i)
        let keyByte = encryptionKey[i % encryptionKey.length]
        let encrypted = charCode ^ keyByte
        result += String.fromCharCode(encrypted)
    }
    return result
}

// Initialize BLE UART service
bluetooth.startUartService()

// Show ready indicator
basic.showLeds(`
    . . . . .
    . # . # .
    . . . . .
    . # # # .
    # . . . #
`)
basic.pause(500)
basic.showString("DD")

// Button A: compose and send a message
input.onButtonPressed(Button.A, function () {
    composing = true
    basic.showNumber(selectedMsg + 1)
    basic.pause(300)
    basic.showString(messages[selectedMsg].charAt(0) + messages[selectedMsg].charAt(1))
})

// Tilt to cycle through messages while composing
input.onGesture(Gesture.TiltRight, function () {
    if (composing) {
        selectedMsg = (selectedMsg + 1) % messages.length
        basic.showNumber(selectedMsg + 1)
    }
})

input.onGesture(Gesture.TiltLeft, function () {
    if (composing) {
        selectedMsg = (selectedMsg - 1 + messages.length) % messages.length
        basic.showNumber(selectedMsg + 1)
    }
})

// Button B: send the selected message (encrypted)
input.onButtonPressed(Button.B, function () {
    if (composing) {
        // Encrypt and send
        let plaintext = messages[selectedMsg]
        let ciphertext = xorCipher(plaintext)
        bluetooth.uartWriteString(ciphertext + "\n")

        // Sending animation
        for (let i = 0; i < 5; i++) {
            led.plot(i, 2)
            basic.pause(100)
        }
        basic.showIcon(IconNames.Yes)
        basic.pause(500)
        composing = false
        basic.clearScreen()
    } else if (inboxFull) {
        // Read received message
        basic.showString(receivedMessage)
        basic.pause(500)
        inboxFull = false
        basic.clearScreen()
    }
})

// Button A+B: clear all messages and reset
input.onButtonPressed(Button.AB, function () {
    receivedMessage = ""
    messageBuffer = ""
    inboxFull = false
    composing = false
    basic.showIcon(IconNames.No)
    basic.pause(300)
    basic.clearScreen()
})

// BLE UART data received handler
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    let raw = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    // Decrypt the received message
    receivedMessage = xorCipher(raw)

    inboxFull = true
    // Notification: blink envelope icon
    for (let blink = 0; blink < 3; blink++) {
        basic.showLeds(`
            # # # # #
            . # . # .
            . . # . .
            . . . . .
            . . . . .
        `)
        basic.pause(300)
        basic.clearScreen()
        basic.pause(300)
    }
    basic.showLeds(`
        # # # # #
        . # . # .
        . . # . .
        . . . . .
        . . . . .
    `)
})

// BLE connection events
bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.SmallDiamond)
    basic.pause(300)
})

bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.Skull)
    basic.pause(500)
    basic.clearScreen()
})

// Background: idle heartbeat
basic.forever(function () {
    if (!composing && !inboxFull) {
        led.plot(2, 2)
        basic.pause(2000)
        led.unplot(2, 2)
        basic.pause(2000)
    }
})
