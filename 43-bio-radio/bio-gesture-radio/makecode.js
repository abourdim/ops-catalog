/*
 * Bio Gesture Radio - micro:bit MakeCode
 * Accelerometer-based gesture recognition for radio commands
 * Broadcasts classified gestures to control remote devices
 */

let lastGesture = "none"
let gestureCount = 0
let gestureHistory: string[] = []
let commandMode = false
let sensitivity = 300

radio.setGroup(73)
radio.setTransmitPower(7)
basic.showString("GR")

function classifyMotion(): string {
    let x = input.acceleration(Dimension.X)
    let y = input.acceleration(Dimension.Y)
    let z = input.acceleration(Dimension.Z)
    let mag = Math.sqrt(x * x + y * y + z * z)

    if (mag > 2000) return "shake"
    if (x < -sensitivity && Math.abs(y) < sensitivity) return "left"
    if (x > sensitivity && Math.abs(y) < sensitivity) return "right"
    if (y < -sensitivity && Math.abs(x) < sensitivity) return "up"
    if (y > sensitivity && Math.abs(x) < sensitivity) return "down"
    if (z < 700) return "flip"
    return "none"
}

function showGestureIcon(gesture: string) {
    basic.clearScreen()
    if (gesture == "left") {
        led.plot(0, 2); led.plot(1, 1); led.plot(1, 3)
        led.plot(2, 2); led.plot(3, 2); led.plot(4, 2)
    } else if (gesture == "right") {
        led.plot(4, 2); led.plot(3, 1); led.plot(3, 3)
        led.plot(2, 2); led.plot(1, 2); led.plot(0, 2)
    } else if (gesture == "up") {
        led.plot(2, 0); led.plot(1, 1); led.plot(3, 1)
        led.plot(2, 2); led.plot(2, 3); led.plot(2, 4)
    } else if (gesture == "down") {
        led.plot(2, 4); led.plot(1, 3); led.plot(3, 3)
        led.plot(2, 2); led.plot(2, 1); led.plot(2, 0)
    } else if (gesture == "shake") {
        basic.showIcon(IconNames.Skull)
    } else if (gesture == "flip") {
        basic.showIcon(IconNames.ArrowSouth)
    }
}

function executeCommand(gesture: string) {
    if (!commandMode) return
    let cmdMap: { [key: string]: number } = {
        "left": 1, "right": 2, "up": 3,
        "down": 4, "shake": 5, "flip": 6
    }
    let cmd = cmdMap[gesture] || 0
    if (cmd > 0) {
        radio.sendValue("cmd", cmd)
        radio.sendString("G:" + gesture)
    }
}

function checkGestureCombo() {
    if (gestureHistory.length < 3) return
    let last3 = gestureHistory.slice(gestureHistory.length - 3)
    let combo = last3.join("-")

    if (combo == "left-right-left") {
        radio.sendValue("combo", 1)
        basic.showString("!")
    } else if (combo == "up-up-down") {
        radio.sendValue("combo", 2)
        basic.showString("*")
    } else if (combo == "shake-shake-flip") {
        radio.sendValue("combo", 3)
        basic.showString("#")
    }
}

// Button A: toggle command mode
input.onButtonPressed(Button.A, function () {
    commandMode = !commandMode
    if (commandMode) {
        basic.showIcon(IconNames.Sword)
    } else {
        basic.showIcon(IconNames.Asleep)
    }
    basic.pause(400)
})

// Button B: show gesture count
input.onButtonPressed(Button.B, function () {
    basic.showNumber(gestureCount)
})

// A+B: adjust sensitivity
input.onButtonPressed(Button.AB, function () {
    sensitivity = (sensitivity == 300) ? 500 : 300
    basic.showNumber(sensitivity)
})

// Receive gestures from other nodes
radio.onReceivedValue(function (name: string, value: number) {
    if (name == "cmd") {
        let gestures = ["", "left", "right", "up", "down", "shake", "flip"]
        if (value > 0 && value < gestures.length) {
            showGestureIcon(gestures[value])
            basic.pause(300)
        }
    }
    if (name == "combo") {
        music.playTone(880, 200)
    }
})

// Main detection loop
basic.forever(function () {
    let gesture = classifyMotion()

    if (gesture != "none" && gesture != lastGesture) {
        lastGesture = gesture
        gestureCount++
        gestureHistory.push(gesture)
        if (gestureHistory.length > 10) gestureHistory.shift()

        showGestureIcon(gesture)
        executeCommand(gesture)
        checkGestureCombo()
        radio.sendValue("gest", gestureCount)
        basic.pause(300)
    }

    if (gesture == "none") lastGesture = "none"
    basic.pause(50)
})
