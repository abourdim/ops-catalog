/*
 * Bio Thermal Signature - micro:bit MakeCode
 * Uses onboard temperature sensor for thermal pattern recognition
 * Radio shares thermal identity with mesh network
 */

let tempBaseline = 0
let thermalProfile: number[] = []
let enrolledProfile: number[] = []
let enrolled = false
let matchResult = 0
let capturing = false
let sampleInterval = 500

radio.setGroup(91)
radio.setTransmitPower(6)
basic.showString("TS")

function calibrateThermal() {
    let sum = 0
    for (let i = 0; i < 20; i++) {
        sum += input.temperature()
        basic.pause(100)
    }
    tempBaseline = sum / 20
    basic.showIcon(IconNames.Yes)
    basic.pause(300)
}

function captureThermalProfile(): number[] {
    let profile: number[] = []
    capturing = true
    basic.showIcon(IconNames.Target)

    for (let i = 0; i < 10; i++) {
        let temp = input.temperature()
        let light = input.lightLevel()
        let accelZ = input.acceleration(Dimension.Z)
        let combined = (temp - tempBaseline) * 100 + light + (accelZ / 100)
        profile.push(combined)

        let col = i % 5
        let row = Math.floor(i / 5)
        led.plot(col, row)
        basic.pause(sampleInterval)
    }
    capturing = false
    return profile
}

function compareProfiles(a: number[], b: number[]): number {
    if (a.length != b.length || a.length == 0) return 0
    let sumDiffSq = 0
    let sumTotal = 0
    for (let i = 0; i < a.length; i++) {
        let diff = a[i] - b[i]
        sumDiffSq += diff * diff
        sumTotal += Math.abs(a[i])
    }
    if (sumTotal < 1) return 0
    let rmse = Math.sqrt(sumDiffSq / a.length)
    return Math.constrain(100 - Math.round(rmse), 0, 100)
}

function displayMatchBar(score: number) {
    basic.clearScreen()
    let bars = Math.floor(score / 20)
    for (let c = 0; c < bars; c++) {
        for (let r = 0; r < 5; r++) {
            led.plot(c, r)
        }
    }
}

calibrateThermal()

// Button A: Enroll thermal signature
input.onButtonPressed(Button.A, function () {
    basic.showString("E")
    basic.pause(200)
    enrolledProfile = captureThermalProfile()
    enrolled = true
    basic.showIcon(IconNames.Yes)
    radio.sendValue("enroll", enrolledProfile.length)
})

// Button B: Match thermal signature
input.onButtonPressed(Button.B, function () {
    if (!enrolled) {
        basic.showString("NO")
        return
    }
    basic.showString("M")
    basic.pause(200)
    thermalProfile = captureThermalProfile()
    matchResult = compareProfiles(enrolledProfile, thermalProfile)

    displayMatchBar(matchResult)
    basic.pause(500)

    if (matchResult > 60) {
        basic.showIcon(IconNames.Yes)
        radio.sendValue("match", matchResult)
        radio.sendValue("id", 1)
    } else {
        basic.showIcon(IconNames.No)
        radio.sendValue("match", matchResult)
        radio.sendValue("id", 0)
    }
    basic.pause(1000)
    basic.showNumber(matchResult)
})

// A+B: Show current temperature
input.onButtonPressed(Button.AB, function () {
    basic.showNumber(input.temperature())
    basic.showString("C")
})

// Receive thermal ID from network
radio.onReceivedValue(function (name: string, value: number) {
    if (name == "id" && value == 1) {
        basic.showIcon(IconNames.Heart)
        basic.pause(300)
        basic.clearScreen()
    }
    if (name == "match") {
        displayMatchBar(value)
        basic.pause(500)
    }
})

// Continuous temperature monitoring
basic.forever(function () {
    if (capturing) return
    let temp = input.temperature()
    let delta = temp - tempBaseline
    radio.sendValue("temp", temp)
    basic.pause(2000)
})
