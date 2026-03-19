/*
 * Bio Pupil Morse - micro:bit MakeCode
 * Uses light sensor to detect eye blinks for Morse code input
 * Radio transmits decoded blink messages
 */

let lightBaseline = 0
let blinkDetected = false
let blinkStart = 0
let blinkEnd = 0
let morseBuffer = ""
let decodedMsg = ""
let lastOpenTime = 0
let blinkCount = 0
let monitoring = false

let morseTable = [
    ".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..",
    ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-",
    ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--.."
]

radio.setGroup(95)
radio.setTransmitPower(6)
basic.showString("PM")

function calibrateLight() {
    let sum = 0
    for (let i = 0; i < 30; i++) {
        sum += input.lightLevel()
        basic.pause(30)
    }
    lightBaseline = sum / 30
    basic.showIcon(IconNames.Yes)
    basic.pause(300)
}

function decodeMorse(code: string): string {
    for (let i = 0; i < 26; i++) {
        if (code == morseTable[i]) {
            return String.fromCharCode(65 + i)
        }
    }
    return "?"
}

function processBlink(duration: number) {
    if (duration < 100) return // noise

    blinkCount++
    if (duration < 350) {
        morseBuffer += "."
        music.playTone(880, 50)
    } else if (duration < 800) {
        morseBuffer += "-"
        music.playTone(660, 150)
    }

    // Display morse dots/dashes
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

function checkCharacterGap() {
    let elapsed = input.runningTime() - lastOpenTime
    if (elapsed > 1200 && morseBuffer.length > 0) {
        let char2 = decodeMorse(morseBuffer)
        decodedMsg += char2
        radio.sendString(char2)
        radio.sendValue("blink", blinkCount)
        basic.showString(char2)
        basic.pause(200)
        morseBuffer = ""
    }
}

calibrateLight()

// Button A: start/stop monitoring
input.onButtonPressed(Button.A, function () {
    monitoring = !monitoring
    if (monitoring) {
        basic.showIcon(IconNames.EyeOpen)
        calibrateLight()
    } else {
        basic.showIcon(IconNames.Asleep)
    }
})

// Button B: show decoded message
input.onButtonPressed(Button.B, function () {
    if (decodedMsg.length > 0) {
        basic.showString(decodedMsg)
    } else {
        basic.showString("--")
    }
})

// A+B: clear message
input.onButtonPressed(Button.AB, function () {
    decodedMsg = ""
    morseBuffer = ""
    blinkCount = 0
    basic.showIcon(IconNames.Yes)
    basic.pause(300)
})

// Receive blink messages from others
radio.onReceivedString(function (receivedString: string) {
    basic.showString(receivedString)
    basic.pause(200)
})

// Main blink detection loop
basic.forever(function () {
    if (!monitoring) return

    let light = input.lightLevel()
    let isCovered = light < lightBaseline * 0.4

    if (isCovered && !blinkDetected) {
        blinkDetected = true
        blinkStart = input.runningTime()
    } else if (!isCovered && blinkDetected) {
        blinkDetected = false
        blinkEnd = input.runningTime()
        lastOpenTime = blinkEnd
        let duration = blinkEnd - blinkStart
        processBlink(duration)
    }

    if (!blinkDetected && morseBuffer.length > 0) {
        checkCharacterGap()
    }

    basic.pause(20)
})
