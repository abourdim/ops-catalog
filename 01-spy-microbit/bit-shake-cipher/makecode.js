// ============================================================
// BIT-SHAKE-CIPHER — Shake-to-Unlock Cipher
// Encrypts/decrypts messages using a shake-generated key.
// The cipher key is derived from the pattern and intensity
// of shakes. Two devices must shake in sync to share a key.
// ============================================================

let cipherKey: number[] = []
let keyLength = 8
let keyIndex = 0
let isRecordingKey = false
let keyReady = false
let messageIndex = 0
let encryptedOutput = ""

// Secret messages to encrypt
let secretMessages = [
    "ALPHA TEAM GO",
    "BETA SECURE",
    "DROP POINT EAST",
    "EXTRACT READY"
]

// Record shake intensity as key material
let shakeBuffer: number[] = []
let shakeCount = 0

// Generate key from shake pattern
function generateKeyFromShakes() {
    cipherKey = []
    for (let i = 0; i < keyLength; i++) {
        if (i < shakeBuffer.length) {
            // Normalize shake value to 0-255
            cipherKey.push(Math.abs(shakeBuffer[i]) % 256)
        } else {
            cipherKey.push(42)  // padding
        }
    }
}

// Caesar cipher with variable shift per character
function encrypt(text: string): string {
    let result = ""
    for (let i = 0; i < text.length; i++) {
        let code = text.charCodeAt(i)
        let shift = cipherKey[i % cipherKey.length]
        if (code >= 65 && code <= 90) {
            // Uppercase letters
            result += String.fromCharCode(((code - 65 + shift) % 26) + 65)
        } else if (code == 32) {
            result += " "
        } else {
            result += text.charAt(i)
        }
    }
    return result
}

function decrypt(text: string): string {
    let result = ""
    for (let i = 0; i < text.length; i++) {
        let code = text.charCodeAt(i)
        let shift = cipherKey[i % cipherKey.length]
        if (code >= 65 && code <= 90) {
            result += String.fromCharCode(((code - 65 - shift + 260) % 26) + 65)
        } else if (code == 32) {
            result += " "
        } else {
            result += text.charAt(i)
        }
    }
    return result
}

// Show key strength as LED bar
function showKeyStrength() {
    basic.clearScreen()
    let strength = Math.min(shakeCount, 5)
    for (let i = 0; i < strength; i++) {
        for (let row = 4; row >= 4 - i; row--) {
            led.plot(i, row)
        }
    }
}

// Startup
basic.showString("SC")
basic.pause(300)
basic.showLeds(`
    # . . . #
    . # . # .
    . . # . .
    . # . # .
    # . . . #
`)

// Button A: start/stop key recording
input.onButtonPressed(Button.A, function () {
    if (!isRecordingKey) {
        // Start recording shakes
        isRecordingKey = true
        shakeBuffer = []
        shakeCount = 0
        basic.showLeds(`
            . . . . .
            . . . . .
            . . # . .
            . . . . .
            . . . . .
        `)
        music.playTone(440, 100)
    } else {
        // Stop recording and generate key
        isRecordingKey = false
        generateKeyFromShakes()
        keyReady = true
        basic.showIcon(IconNames.Yes)
        music.playTone(880, 200)
        basic.pause(500)
    }
})

// Button B: encrypt and display current message
input.onButtonPressed(Button.B, function () {
    if (keyReady) {
        let plain = secretMessages[messageIndex]
        encryptedOutput = encrypt(plain)
        basic.showString(encryptedOutput)
        // Send encrypted over radio
        radio.setGroup(7)
        radio.sendString(encryptedOutput)
    } else {
        basic.showString("?")
        basic.pause(300)
    }
})

// Button A+B: decrypt received message
input.onButtonPressed(Button.AB, function () {
    if (keyReady && encryptedOutput.length > 0) {
        let decrypted = decrypt(encryptedOutput)
        basic.showString(decrypted)
    }
})

// Shake handler: record shake data
input.onGesture(Gesture.Shake, function () {
    if (isRecordingKey) {
        let intensity = input.acceleration(Dimension.Strength)
        shakeBuffer.push(intensity)
        shakeCount++
        showKeyStrength()
        music.playTone(200 + shakeCount * 100, 50)
    } else {
        // Cycle message selection when not recording
        messageIndex = (messageIndex + 1) % secretMessages.length
        basic.showNumber(messageIndex + 1)
        basic.pause(300)
    }
})

// Receive encrypted messages from other devices
radio.setGroup(7)
radio.onReceivedString(function (receivedString) {
    if (keyReady) {
        encryptedOutput = receivedString
        music.playTone(523, 100)
        basic.showLeds(`
            # # # # #
            . # . # .
            . . # . .
            . . . . .
            . . . . .
        `)
    }
})

// Background: show idle animation
basic.forever(function () {
    if (!isRecordingKey && !keyReady) {
        led.toggle(Math.randomRange(0, 4), Math.randomRange(0, 4))
        basic.pause(500)
    }
})
