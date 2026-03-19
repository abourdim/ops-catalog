// ============================================================
// BIT-CW-PADDLE — Morse Code Paddle
// Turns the micro:bit into a Morse code keyer/paddle.
// Button A = dit (short), Button B = dah (long).
// Decodes Morse to characters and sends over radio.
// ============================================================

let morseBuffer = ""
let decodedText = ""
let wpm = 15  // Words per minute
let ditLength = 80  // milliseconds (derived from WPM)
let dahLength = 240
let toneFreq = 700  // Sidetone frequency
let isSending = false
let charGapTimer = 0
let wordGapTimer = 0
let autoSpaceEnabled = true

// Morse code lookup table
let morseChars = "ETIANMSURWDKGOHVF*L*PJBXCYZQ**54*3***2**+****16=/***(*7***8*90"
// Tree-based lookup: dit goes left (index*2+1), dah goes right (index*2+2)

// Decode morse string to character
function decodeMorse(morse: string): string {
    let index = 0
    for (let i = 0; i < morse.length; i++) {
        if (morse.charAt(i) == ".") {
            index = index * 2 + 1
        } else if (morse.charAt(i) == "-") {
            index = index * 2 + 2
        }
        if (index >= morseChars.length) return "?"
    }
    let ch = morseChars.charAt(index)
    return ch == "*" ? "?" : ch
}

// Play dit (short tone)
function playDit() {
    music.playTone(toneFreq, ditLength)
    morseBuffer += "."
    // Visual feedback
    led.plot(1, 2)
    basic.pause(ditLength)
    led.unplot(1, 2)
    basic.pause(ditLength)  // inter-element gap
}

// Play dah (long tone)
function playDah() {
    music.playTone(toneFreq, dahLength)
    morseBuffer += "-"
    // Visual feedback
    led.plot(1, 2)
    led.plot(2, 2)
    led.plot(3, 2)
    basic.pause(dahLength)
    led.unplot(1, 2)
    led.unplot(2, 2)
    led.unplot(3, 2)
    basic.pause(ditLength)  // inter-element gap
}

// Finalize current character
function finalizeChar() {
    if (morseBuffer.length > 0) {
        let ch = decodeMorse(morseBuffer)
        decodedText += ch
        basic.showString(ch)
        // Send over radio
        radio.sendString("CW:" + ch)
        morseBuffer = ""
    }
}

// Show decoded text so far
function showDecodedText() {
    if (decodedText.length > 0) {
        basic.showString(decodedText)
    } else {
        basic.showString("?")
    }
}

// Update WPM and recalculate timings
function updateWPM() {
    ditLength = Math.round(1200 / wpm)
    dahLength = ditLength * 3
    basic.showString("" + wpm)
    basic.pause(500)
}

// Initialize radio
radio.setGroup(50)
radio.setTransmitPower(7)

// Startup
basic.showString("CW")
basic.pause(300)
updateWPM()
basic.clearScreen()

// Button A: dit (short)
input.onButtonPressed(Button.A, function () {
    playDit()
    charGapTimer = input.runningTime()
})

// Button B: dah (long)
input.onButtonPressed(Button.B, function () {
    playDah()
    charGapTimer = input.runningTime()
})

// Button A+B: finalize character manually
input.onButtonPressed(Button.AB, function () {
    finalizeChar()
})

// Tilt left: decrease WPM
input.onGesture(Gesture.TiltLeft, function () {
    wpm = Math.max(5, wpm - 2)
    updateWPM()
})

// Tilt right: increase WPM
input.onGesture(Gesture.TiltRight, function () {
    wpm = Math.min(30, wpm + 2)
    updateWPM()
})

// Shake: clear decoded text
input.onGesture(Gesture.Shake, function () {
    decodedText = ""
    morseBuffer = ""
    basic.showIcon(IconNames.No)
    basic.pause(300)
    basic.clearScreen()
})

// Receive Morse from other paddles
radio.onReceivedString(function (receivedString) {
    if (receivedString.indexOf("CW:") == 0) {
        let ch = receivedString.substr(3)
        music.playTone(toneFreq + 100, 50)
        basic.showString(ch)
        basic.pause(200)
        basic.clearScreen()
    }
})

// Main loop: auto-finalize character after gap
basic.forever(function () {
    if (autoSpaceEnabled && morseBuffer.length > 0) {
        let elapsed = input.runningTime() - charGapTimer
        if (elapsed > dahLength * 2) {
            finalizeChar()
        }
    }
    basic.pause(50)
})

// Secondary loop: word space detection
basic.forever(function () {
    if (autoSpaceEnabled && morseBuffer.length == 0 && decodedText.length > 0) {
        let elapsed = input.runningTime() - charGapTimer
        if (elapsed > dahLength * 5) {
            // Word gap detected — add space
            if (decodedText.charAt(decodedText.length - 1) != " ") {
                decodedText += " "
                radio.sendString("CW: ")
            }
            charGapTimer = input.runningTime()  // Reset to prevent multiple spaces
        }
    }
    basic.pause(100)
})
