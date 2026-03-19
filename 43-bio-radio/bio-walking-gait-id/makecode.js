/*
 * Bio Walking Gait ID - micro:bit MakeCode
 * Accelerometer captures walking pattern for gait recognition
 * Radio broadcasts gait identity to security mesh
 */

let gaitSamples: number[] = []
let enrolledGait: number[] = []
let enrolled = false
let recording = false
let stepCount = 0
let lastStepTime = 0
let stepsPerMinute = 0
let matchScore = 0
let gaitFeatures: number[] = []

radio.setGroup(82)
radio.setTransmitPower(7)
basic.showString("GI")

function recordGait() {
    gaitSamples = []
    recording = true
    basic.showIcon(IconNames.Target)

    for (let i = 0; i < 50; i++) {
        let mag = input.acceleration(Dimension.Strength)
        gaitSamples.push(mag)
        basic.pause(40)
    }
    recording = false
    extractFeatures()
}

function extractFeatures() {
    gaitFeatures = []
    if (gaitSamples.length < 10) return

    let sum = 0
    let minVal = 9999
    let maxVal = -9999
    for (let s of gaitSamples) {
        sum += s
        if (s < minVal) minVal = s
        if (s > maxVal) maxVal = s
    }
    let mean = sum / gaitSamples.length
    gaitFeatures.push(mean)
    gaitFeatures.push(maxVal - minVal)

    let variance = 0
    for (let s of gaitSamples) {
        let d = s - mean
        variance += d * d
    }
    gaitFeatures.push(Math.sqrt(variance / gaitSamples.length))

    let peaks = 0
    for (let i = 1; i < gaitSamples.length - 1; i++) {
        if (gaitSamples[i] > gaitSamples[i - 1] &&
            gaitSamples[i] > gaitSamples[i + 1] &&
            gaitSamples[i] > mean + 100) {
            peaks++
        }
    }
    gaitFeatures.push(peaks)
    stepsPerMinute = peaks * 30
}

function compareGait(): number {
    if (gaitFeatures.length != enrolledGait.length) return 0
    if (gaitFeatures.length == 0) return 0
    let totalDiff = 0
    let totalRef = 0
    for (let i = 0; i < gaitFeatures.length; i++) {
        totalDiff += Math.abs(gaitFeatures[i] - enrolledGait[i])
        totalRef += Math.abs(enrolledGait[i])
    }
    if (totalRef < 1) return 0
    return Math.constrain(100 - Math.round(totalDiff / totalRef * 100), 0, 100)
}

function displayGaitBars() {
    basic.clearScreen()
    if (gaitSamples.length < 5) return
    let step = Math.floor(gaitSamples.length / 5)
    for (let c = 0; c < 5; c++) {
        let val = gaitSamples[c * step]
        let row = Math.constrain(4 - Math.round((val - 800) / 200), 0, 4)
        led.plot(c, row)
    }
}

// Button A: Record and enroll gait
input.onButtonPressed(Button.A, function () {
    basic.showString("E")
    basic.pause(200)
    recordGait()
    enrolledGait = gaitFeatures.slice(0)
    enrolled = true
    basic.showIcon(IconNames.Yes)
    radio.sendValue("enroll", stepsPerMinute)
    basic.pause(500)
    displayGaitBars()
})

// Button B: Identify gait
input.onButtonPressed(Button.B, function () {
    if (!enrolled) {
        basic.showString("NO")
        return
    }
    basic.showString("ID")
    basic.pause(200)
    recordGait()
    matchScore = compareGait()

    let identified = matchScore > 65
    if (identified) {
        basic.showIcon(IconNames.Yes)
        radio.sendValue("gait", 1)
    } else {
        basic.showIcon(IconNames.No)
        radio.sendValue("gait", 0)
    }
    radio.sendValue("score", matchScore)
    basic.pause(500)
    basic.showNumber(matchScore)
})

// Shake: show steps per minute
input.onGesture(Gesture.Shake, function () {
    basic.showNumber(stepsPerMinute)
    basic.showString("spm")
})

// Step counter
basic.forever(function () {
    if (recording) return
    let mag = input.acceleration(Dimension.Strength)
    if (mag > 1400 && (input.runningTime() - lastStepTime) > 300) {
        stepCount++
        lastStepTime = input.runningTime()
        led.toggle(2, 2)
    }
    basic.pause(50)
})

radio.onReceivedValue(function (name: string, value: number) {
    if (name == "gait" && value == 1) {
        basic.showIcon(IconNames.Heart)
        basic.pause(200)
        basic.clearScreen()
    }
})
