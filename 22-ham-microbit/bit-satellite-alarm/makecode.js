// ============================================================
// BIT-SATELLITE-ALARM — Satellite Pass Alarm
// Alerts when a scheduled satellite pass is about to occur.
// Uses pre-programmed pass times with countdown display.
// Shows elevation angle and direction on the LED matrix.
// ============================================================

let alarmEnabled = true
let currentPassIndex = 0
let countdownSeconds = 0
let passActive = false
let elapsedSeconds = 0

// Pre-programmed satellite passes (relative offsets in seconds from power-on)
// Each pass: [startOffset, duration, maxElevation, direction]
// Direction: 0=N, 1=NE, 2=E, 3=SE, 4=S, 5=SW, 6=W, 7=NW
let passOffsets = [60, 300, 600, 900, 1500]
let passDurations = [180, 240, 120, 300, 200]
let passElevations = [45, 72, 30, 85, 55]
let passDirections = [1, 3, 6, 0, 5]
let passNames = ["ISS", "NOAA15", "AMSAT", "ISS", "NOAA18"]
let totalPasses = 5

// Runtime timer
let startTime = input.runningTime()

// Radio for sharing pass alerts
radio.setGroup(60)
radio.setTransmitPower(4)

// Draw elevation arc on LED matrix
function drawElevation(elevation: number) {
    basic.clearScreen()
    let height = Math.map(elevation, 0, 90, 0, 4)
    height = Math.constrain(height, 0, 4)

    // Draw arc
    for (let col = 0; col < 5; col++) {
        let y = 4 - Math.round(height * Math.sin(col * Math.PI / 4))
        y = Math.constrain(y, 0, 4)
        led.plot(col, y)
    }
    // Peak indicator
    led.plot(2, 4 - Math.round(height))
}

// Draw direction arrow
function drawDirection(dir: number) {
    basic.clearScreen()
    let arrows = [
        // N
        `. . # . .
         . # # # .
         # . # . #
         . . # . .
         . . # . .`,
        // NE
        `. . # # #
         . . . # #
         . . # . #
         . # . . .
         # . . . .`,
        // E
        `. . # . .
         . . . # .
         # # # # #
         . . . # .
         . . # . .`,
        // SE
        `# . . . .
         . # . . .
         . . # . #
         . . . # #
         . . # # #`,
        // S
        `. . # . .
         . . # . .
         # . # . #
         . # # # .
         . . # . .`,
        // SW
        `. . . . #
         . . . # .
         # . # . .
         # # . . .
         # # # . .`,
        // W
        `. . # . .
         . # . . .
         # # # # #
         . # . . .
         . . # . .`,
        // NW
        `# # # . .
         # # . . .
         # . # . .
         . . . # .
         . . . . #`
    ]
    // Show direction name instead (simpler for MakeCode)
    let dirNames = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    basic.showString(dirNames[dir])
}

// Countdown alarm beep
function alarmBeep(urgency: number) {
    if (urgency > 2) {
        music.playTone(1000, 100)
    } else if (urgency > 1) {
        music.playTone(800, 200)
    } else {
        music.playTone(600, 300)
    }
}

// Show pass info
function showPassInfo(index: number) {
    basic.showString(passNames[index])
    basic.pause(300)
    basic.showString("E" + passElevations[index])
    basic.pause(300)
}

// Startup
basic.showString("SAT")
basic.pause(300)
basic.clearScreen()

// Button A: show next pass info
input.onButtonPressed(Button.A, function () {
    if (currentPassIndex < totalPasses) {
        showPassInfo(currentPassIndex)
        let secsToPass = passOffsets[currentPassIndex] - Math.round((input.runningTime() - startTime) / 1000)
        if (secsToPass > 0) {
            basic.showString("T-" + secsToPass + "s")
        } else {
            basic.showString("NOW")
        }
        basic.pause(500)
    } else {
        basic.showString("DONE")
        basic.pause(300)
    }
})

// Button B: cycle to next pass
input.onButtonPressed(Button.B, function () {
    currentPassIndex = (currentPassIndex + 1) % totalPasses
    basic.showNumber(currentPassIndex + 1)
    basic.pause(300)
    basic.showString(passNames[currentPassIndex])
    basic.pause(300)
})

// Button A+B: toggle alarm
input.onButtonPressed(Button.AB, function () {
    alarmEnabled = !alarmEnabled
    if (alarmEnabled) {
        basic.showIcon(IconNames.Yes)
        music.playTone(880, 100)
    } else {
        basic.showIcon(IconNames.No)
    }
    basic.pause(300)
    basic.clearScreen()
})

// Shake: broadcast pass alert to others
input.onGesture(Gesture.Shake, function () {
    if (currentPassIndex < totalPasses) {
        radio.sendString("SAT:PASS:" + passNames[currentPassIndex])
        basic.showIcon(IconNames.Yes)
        basic.pause(300)
        basic.clearScreen()
    }
})

// Receive pass alerts from others
radio.onReceivedString(function (receivedString) {
    if (receivedString.indexOf("SAT:PASS:") == 0) {
        let satName = receivedString.substr(9)
        basic.showString("!" + satName)
        music.playTone(1000, 200)
        basic.pause(100)
        music.playTone(1200, 200)
    }
})

// Main loop: countdown and pass tracking
basic.forever(function () {
    let elapsedMs = input.runningTime() - startTime
    elapsedSeconds = Math.round(elapsedMs / 1000)

    if (currentPassIndex < totalPasses) {
        let secsToPass = passOffsets[currentPassIndex] - elapsedSeconds

        if (secsToPass > 0 && secsToPass <= 30 && alarmEnabled) {
            // Approaching pass — countdown alarm
            basic.showNumber(secsToPass)
            let urgency = Math.map(secsToPass, 30, 0, 0, 3)
            alarmBeep(urgency)
            basic.pause(1000)
        } else if (secsToPass <= 0 && secsToPass > -passDurations[currentPassIndex]) {
            // Pass in progress
            if (!passActive) {
                passActive = true
                music.playTone(1200, 500)
            }
            drawElevation(passElevations[currentPassIndex])
            basic.pause(1000)
        } else if (secsToPass <= -passDurations[currentPassIndex]) {
            // Pass ended
            if (passActive) {
                passActive = false
                basic.showString("END")
                basic.pause(500)
                currentPassIndex++
            }
        } else {
            // Waiting — show idle indicator
            led.plot(2, 2)
            basic.pause(1000)
            led.unplot(2, 2)
            basic.pause(1000)
        }
    }
})
