/*
 * Bio Phantom Limb Radio - micro:bit MakeCode
 * Maps accelerometer/touch patterns to phantom limb gestures
 * Radio broadcasts phantom movement commands to prosthetic mesh
 */

let gestureDetected = "none"
let gestureConfidence = 0
let phantomCount = 0
let channelValues: number[] = [0, 0, 0]
let monitoring = false
let feedbackMode = true

radio.setGroup(39)
radio.setTransmitPower(7)
basic.showString("PL")

function readPhantomChannels() {
    channelValues[0] = pins.analogReadPin(AnalogPin.P0)
    channelValues[1] = pins.analogReadPin(AnalogPin.P1)
    channelValues[2] = Math.abs(input.acceleration(Dimension.Strength) - 1024)
}

function classifyPhantomGesture(): string {
    let p0 = channelValues[0]
    let p1 = channelValues[1]
    let accel = channelValues[2]
    let x = input.acceleration(Dimension.X)
    let y = input.acceleration(Dimension.Y)

    if (p0 > 600 && p1 > 600) {
        gestureConfidence = Math.round((p0 + p1) / 20)
        return "grip"
    }
    if (p0 > 500 && p1 < 300) {
        gestureConfidence = Math.round(p0 / 10)
        return "extend"
    }
    if (p0 < 300 && p1 > 500) {
        gestureConfidence = Math.round(p1 / 10)
        return "flex"
    }
    if (accel > 400 && Math.abs(x) > 300) {
        gestureConfidence = Math.round(accel / 10)
        return "rotate"
    }
    if (accel > 600) {
        gestureConfidence = Math.round(accel / 12)
        return "spread"
    }
    gestureConfidence = 0
    return "none"
}

function displayGesture(gesture: string) {
    basic.clearScreen()
    if (gesture == "grip") {
        // Fist icon
        led.plot(1, 1); led.plot(2, 1); led.plot(3, 1)
        led.plot(1, 2); led.plot(2, 2); led.plot(3, 2)
        led.plot(1, 3); led.plot(2, 3); led.plot(3, 3)
    } else if (gesture == "extend") {
        // Open hand
        led.plot(0, 0); led.plot(1, 0); led.plot(2, 0); led.plot(3, 0); led.plot(4, 0)
        led.plot(2, 1); led.plot(2, 2); led.plot(2, 3); led.plot(2, 4)
    } else if (gesture == "flex") {
        led.plot(1, 2); led.plot(2, 1); led.plot(3, 2)
        led.plot(1, 3); led.plot(3, 3)
    } else if (gesture == "rotate") {
        led.plot(2, 0); led.plot(3, 1); led.plot(4, 2)
        led.plot(3, 3); led.plot(2, 4)
    } else if (gesture == "spread") {
        led.plot(0, 0); led.plot(4, 0); led.plot(2, 2)
        led.plot(0, 4); led.plot(4, 4)
    }
}

function sendPhantomCommand(gesture: string) {
    let cmdMap: { [key: string]: number } = {
        "grip": 1, "extend": 2, "flex": 3, "rotate": 4, "spread": 5
    }
    let cmd = cmdMap[gesture] || 0
    if (cmd > 0) {
        radio.sendValue("phantom", cmd)
        radio.sendValue("conf", gestureConfidence)
        radio.sendString(gesture)
    }
}

function hapticFeedback(gesture: string) {
    if (!feedbackMode) return
    if (gesture == "grip") music.playTone(440, 50)
    else if (gesture == "extend") music.playTone(660, 50)
    else if (gesture == "flex") music.playTone(550, 50)
    else if (gesture == "rotate") music.playTone(770, 80)
    else if (gesture == "spread") music.playTone(880, 30)
}

// Button A: Start/stop monitoring
input.onButtonPressed(Button.A, function () {
    monitoring = !monitoring
    if (monitoring) {
        basic.showIcon(IconNames.EyeOpen)
    } else {
        basic.showIcon(IconNames.Asleep)
    }
    basic.pause(300)
})

// Button B: Show stats
input.onButtonPressed(Button.B, function () {
    basic.showString("G" + phantomCount)
    basic.pause(500)
    basic.showString("C" + gestureConfidence)
})

// A+B: Toggle haptic feedback
input.onButtonPressed(Button.AB, function () {
    feedbackMode = !feedbackMode
    if (feedbackMode) basic.showIcon(IconNames.Yes)
    else basic.showIcon(IconNames.No)
    basic.pause(300)
})

// Receive phantom commands from prosthetic
radio.onReceivedValue(function (name: string, value: number) {
    if (name == "phantom") {
        let gestures = ["", "grip", "extend", "flex", "rotate", "spread"]
        if (value > 0 && value < gestures.length) {
            displayGesture(gestures[value])
            basic.pause(300)
        }
    }
})

// Main phantom limb detection loop
basic.forever(function () {
    if (!monitoring) return

    readPhantomChannels()
    let gesture = classifyPhantomGesture()

    if (gesture != "none" && gesture != gestureDetected) {
        gestureDetected = gesture
        phantomCount++
        displayGesture(gesture)
        sendPhantomCommand(gesture)
        hapticFeedback(gesture)
        basic.pause(200)
    } else if (gesture == "none") {
        gestureDetected = "none"
    }

    basic.pause(30)
})
