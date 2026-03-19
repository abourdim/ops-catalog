/*
 * Bio Voice RF Fingerprint - micro:bit MakeCode
 * Uses microphone sound level patterns as voice fingerprint proxy
 * Radio broadcasts voice identity for mesh authentication
 */

let soundBaseline = 0
let voiceProfile: number[] = []
let enrolledVoice: number[] = []
let enrolled = false
let matchScore = 0
let recording = false
let soundEnergy = 0

radio.setGroup(53)
radio.setTransmitPower(6)
basic.showString("VF")

function calibrateSound() {
    let sum = 0
    for (let i = 0; i < 30; i++) {
        sum += input.soundLevel()
        basic.pause(30)
    }
    soundBaseline = sum / 30
    basic.showIcon(IconNames.Yes)
    basic.pause(300)
}

function recordVoiceProfile(): number[] {
    let profile: number[] = []
    recording = true
    basic.showIcon(IconNames.Target)

    for (let i = 0; i < 20; i++) {
        let level = input.soundLevel()
        profile.push(level)
        soundEnergy += level
        let row = Math.constrain(4 - Math.round(level / 55), 0, 4)
        led.plot(i % 5, row)
        basic.pause(100)
    }
    recording = false

    // Extract features: normalize
    let max2 = 1
    for (let v of profile) {
        if (v > max2) max2 = v
    }
    let normalized: number[] = []
    for (let v of profile) {
        normalized.push(Math.round(v * 100 / max2))
    }
    return normalized
}

function compareVoiceProfiles(a: number[], b: number[]): number {
    if (a.length != b.length || a.length == 0) return 0
    let dot = 0, normA = 0, normB = 0
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i]
        normA += a[i] * a[i]
        normB += b[i] * b[i]
    }
    let denom = Math.sqrt(normA) * Math.sqrt(normB)
    if (denom < 1) return 0
    return Math.round(dot / denom * 100)
}

function displayMatchResult(score: number) {
    basic.clearScreen()
    let bars = Math.floor(score / 20)
    for (let c = 0; c < Math.min(bars, 5); c++) {
        led.plot(c, 0)
        led.plot(c, 1)
    }
    if (score > 70) {
        led.plot(2, 3)
        led.plot(1, 4)
        led.plot(3, 4)
    }
}

calibrateSound()

// Button A: Enroll voice
input.onButtonPressed(Button.A, function () {
    basic.showString("E")
    basic.pause(500)
    basic.showString("SPEAK")
    basic.pause(300)
    enrolledVoice = recordVoiceProfile()
    enrolled = true
    basic.showIcon(IconNames.Yes)
    radio.sendValue("enroll", 1)
})

// Button B: Verify voice
input.onButtonPressed(Button.B, function () {
    if (!enrolled) {
        basic.showString("NO")
        return
    }
    basic.showString("V")
    basic.pause(500)
    basic.showString("SPEAK")
    basic.pause(300)
    voiceProfile = recordVoiceProfile()
    matchScore = compareVoiceProfiles(enrolledVoice, voiceProfile)

    displayMatchResult(matchScore)
    basic.pause(500)

    let verified = matchScore > 65
    if (verified) {
        basic.showIcon(IconNames.Yes)
        radio.sendValue("auth", 1)
    } else {
        basic.showIcon(IconNames.No)
        radio.sendValue("auth", 0)
    }
    radio.sendValue("score", matchScore)
    basic.pause(800)
    basic.showNumber(matchScore)
})

// A+B: Show sound level
input.onButtonPressed(Button.AB, function () {
    for (let i = 0; i < 20; i++) {
        let level = input.soundLevel()
        basic.clearScreen()
        let bars2 = Math.floor(level / 55)
        for (let r = 4; r >= 4 - bars2; r--) {
            for (let c = 0; c < 5; c++) {
                led.plot(c, r)
            }
        }
        basic.pause(100)
    }
})

// Receive auth from network
radio.onReceivedValue(function (name: string, value: number) {
    if (name == "auth" && value == 1) {
        basic.showIcon(IconNames.Heart)
        basic.pause(300)
        basic.clearScreen()
    }
})

// Background sound monitoring
basic.forever(function () {
    if (recording) return
    let level = input.soundLevel()
    if (level > soundBaseline + 30) {
        led.plot(2, 2)
    } else {
        led.unplot(2, 2)
    }
    basic.pause(100)
})
