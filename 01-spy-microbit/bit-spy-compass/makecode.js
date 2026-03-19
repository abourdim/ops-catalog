// ============================================================
// BIT-SPY-COMPASS — Compass-Guided Navigation
// Guides the agent toward a target bearing using the compass.
// Arrow indicators show direction to turn. Distance estimation
// via step counting with the accelerometer.
// ============================================================

let targetBearing = 0
let currentBearing = 0
let waypointIndex = 0
let stepCount = 0
let isNavigating = false
let stepThreshold = 1200
let lastAccel = 0
let stepDetected = false

// Predefined waypoints (bearings in degrees)
let waypointBearings = [0, 45, 90, 135, 180, 270, 315]
let waypointNames = ["N", "NE", "E", "SE", "S", "W", "NW"]
let waypointDistances = [50, 30, 80, 20, 60, 40, 25]

// Draw compass arrow pointing in relative direction
function drawArrow(angle: number) {
    basic.clearScreen()
    if (angle < 0) angle += 360

    if (angle >= 337 || angle < 22) {
        // North (up)
        basic.showLeds(`
            . . # . .
            . # # # .
            # . # . #
            . . # . .
            . . # . .
        `)
    } else if (angle >= 22 && angle < 67) {
        // Northeast
        basic.showLeds(`
            . . # # #
            . . . # #
            . . # . #
            . # . . .
            # . . . .
        `)
    } else if (angle >= 67 && angle < 112) {
        // East (right)
        basic.showLeds(`
            . . # . .
            . . . # .
            # # # # #
            . . . # .
            . . # . .
        `)
    } else if (angle >= 112 && angle < 157) {
        // Southeast
        basic.showLeds(`
            # . . . .
            . # . . .
            . . # . #
            . . . # #
            . . # # #
        `)
    } else if (angle >= 157 && angle < 202) {
        // South (down)
        basic.showLeds(`
            . . # . .
            . . # . .
            # . # . #
            . # # # .
            . . # . .
        `)
    } else if (angle >= 202 && angle < 247) {
        // Southwest
        basic.showLeds(`
            . . . . #
            . . . # .
            # . # . .
            # # . . .
            # # # . .
        `)
    } else if (angle >= 247 && angle < 292) {
        // West (left)
        basic.showLeds(`
            . . # . .
            . # . . .
            # # # # #
            . # . . .
            . . # . .
        `)
    } else {
        // Northwest
        basic.showLeds(`
            # # # . .
            # # . . .
            # . # . .
            . . . # .
            . . . . #
        `)
    }
}

// Show "on target" indicator
function showOnTarget() {
    basic.showLeds(`
        . . # . .
        . # # # .
        # # # # #
        . # # # .
        . . # . .
    `)
    music.playTone(880, 100)
}

// Startup — calibrate compass
basic.showString("CAL")
input.calibrateCompass()
basic.showString("SC")
basic.pause(300)

// Button A: start/stop navigation
input.onButtonPressed(Button.A, function () {
    isNavigating = !isNavigating
    if (isNavigating) {
        targetBearing = waypointBearings[waypointIndex]
        stepCount = 0
        basic.showString(waypointNames[waypointIndex])
        basic.pause(300)
    } else {
        basic.clearScreen()
        basic.showIcon(IconNames.Square)
    }
})

// Button B: next waypoint
input.onButtonPressed(Button.B, function () {
    waypointIndex = (waypointIndex + 1) % waypointBearings.length
    targetBearing = waypointBearings[waypointIndex]
    basic.showString(waypointNames[waypointIndex])
    basic.pause(300)
    stepCount = 0
})

// Button A+B: show step count and estimated distance
input.onButtonPressed(Button.AB, function () {
    isNavigating = false
    basic.showString("S:" + stepCount)
    basic.pause(1000)
    let remaining = Math.max(waypointDistances[waypointIndex] - stepCount, 0)
    basic.showString("R:" + remaining)
    basic.pause(500)
    isNavigating = true
})

// Main navigation loop
basic.forever(function () {
    if (isNavigating) {
        currentBearing = input.compassHeading()

        // Calculate relative bearing to target
        let relativeBearing = targetBearing - currentBearing
        if (relativeBearing < 0) relativeBearing += 360

        // Check if on target (within 15 degrees)
        if (relativeBearing < 15 || relativeBearing > 345) {
            showOnTarget()
        } else {
            drawArrow(relativeBearing)
        }

        // Simple step detection using accelerometer
        let accel = input.acceleration(Dimension.Strength)
        if (accel > stepThreshold && !stepDetected) {
            stepDetected = true
            stepCount++
        }
        if (accel < stepThreshold - 200) {
            stepDetected = false
        }

        basic.pause(100)
    }
})
