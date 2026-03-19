/*
 * Bio Muscle Telegraph - micro:bit MakeCode
 * Uses button press patterns as muscle flex simulation for Morse code
 * Radio transmits decoded telegraph messages between devices
 */

let morseBuffer = ""
let decodedMessage = ""
let pressing = false
let pressStart = 0
let releaseStart = 0
let dotThreshold = 200
let dashThreshold = 500
let spaceThreshold = 1200
let charGapThreshold = 700

let morseTable: string[] = [
    ".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..",
    ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-",
    ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--.."
]

radio.setGroup(70)
radio.setTransmitPower(7)
basic.showString("MT")

function decodeMorse(code: string): string {
    for (let i = 0; i < 26; i++) {
        if (code == morseTable[i]) return String.fromCharCode(65 + i)
    }
    return "?"
}

function displayMorse() {
    basic.clearScreen()
    for (let i = 0; i < Math.min(morseBuffer.length, 5); i++) {
        if (morseBuffer.charAt(i) == ".") {
            led.plot(i, 2)
        } else {
            led.plot(i, 1)
            led.plot(i, 2)
            led.plot(i, 3)
        }
    }
}

function processPress(duration: number) {
    if (duration < dotThreshold) {
        morseBuffer += "."
        music.playTone(880, 80)
    } else if (duration < dashThreshold) {
        morseBuffer += "-"
        music.playTone(660, 200)
    }
    displayMorse()
}

function checkCharacterGap() {
    let elapsed = input.runningTime() - releaseStart
    if (elapsed > charGapThreshold && morseBuffer.length > 0) {
        let decoded = decodeMorse(morseBuffer)
        decodedMessage += decoded
        radio.sendString(decoded)
        radio.sendValue("morse", morseBuffer.length)
        basic.showString(decoded)
        basic.pause(200)
        morseBuffer = ""
    }
    if (elapsed > spaceThreshold * 2 && decodedMessage.length > 0) {
        decodedMessage += " "
    }
}

// Button A is the telegraph key
input.onButtonPressed(Button.A, function () {
    // handled in forever loop for timing
})

// Button B: show full message
input.onButtonPressed(Button.B, function () {
    basic.showString(decodedMessage)
})

// A+B: clear message
input.onButtonPressed(Button.AB, function () {
    decodedMessage = ""
    morseBuffer = ""
    basic.showIcon(IconNames.Yes)
    basic.pause(300)
    basic.clearScreen()
})

// Shake: send full message via radio
input.onGesture(Gesture.Shake, function () {
    if (decodedMessage.length > 0) {
        radio.sendString("MSG:" + decodedMessage)
        basic.showIcon(IconNames.Yes)
        basic.pause(500)
    }
})

// Receive telegraph from others
radio.onReceivedString(function (receivedString: string) {
    if (receivedString.includes("MSG:")) {
        basic.showString(receivedString.substr(4))
    } else {
        basic.showString(receivedString)
        basic.pause(150)
    }
})

// Main loop: handle telegraph timing
basic.forever(function () {
    let aPressed = input.buttonIsPressed(Button.A)

    if (aPressed && !pressing) {
        pressing = true
        pressStart = input.runningTime()
        led.plot(2, 2)
    } else if (!aPressed && pressing) {
        pressing = false
        let duration = input.runningTime() - pressStart
        releaseStart = input.runningTime()
        processPress(duration)
        led.unplot(2, 2)
    }

    if (!pressing && morseBuffer.length > 0) {
        checkCharacterGap()
    }

    // EMG simulation via accelerometer
    let accel = Math.abs(input.acceleration(Dimension.Strength) - 1024)
    if (accel > 300) {
        radio.sendValue("flex", accel)
    }

    basic.pause(20)
})
