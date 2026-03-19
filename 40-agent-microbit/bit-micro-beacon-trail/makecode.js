// ============================================================
// BIT-MICRO-BEACON-TRAIL — Beacon Trail System
// Drop radio beacons along a path. A follower can retrace the
// trail by following signal strength from beacon to beacon.
// Each beacon has a sequence number for ordered navigation.
// ============================================================

let trailGroup = 85
let isDropper = true  // true=dropping beacons, false=following trail
let beaconSeq = 0
let followTarget = 1
let trailId = Math.randomRange(10, 99)
let droppedBeacons: number[] = []
let maxTrailLength = 20
let followRssi = -128
let followLocked = false
let breadcrumbInterval = 5000

// Initialize radio
radio.setGroup(trailGroup)
radio.setTransmitPower(4)

// Show beacon drop animation
function dropAnimation() {
    basic.showLeds(`
        . . . . .
        . . . . .
        . . # . .
        . . . . .
        . . . . .
    `)
    basic.pause(100)
    basic.showLeds(`
        . . . . .
        . # # # .
        . # . # .
        . # # # .
        . . . . .
    `)
    basic.pause(100)
    basic.showLeds(`
        # # # # #
        # . . . #
        # . . . #
        # . . . #
        # # # # #
    `)
    basic.pause(200)
    basic.clearScreen()
}

// Show follow indicator (arrow toward stronger signal)
function showFollowIndicator(rssi: number) {
    basic.clearScreen()
    // Signal strength bar on bottom
    let bars = Math.map(rssi, -100, -30, 0, 5)
    bars = Math.constrain(bars, 0, 5)
    for (let c = 0; c < bars; c++) {
        led.plot(c, 4)
    }
    // Target beacon number on top
    let numLeds = Math.min(followTarget, 5)
    for (let c = 0; c < numLeds; c++) {
        led.plot(c, 0)
    }
    // Getting warmer/colder indicator
    if (rssi > -50) {
        // Very close — filled center
        led.plot(1, 2)
        led.plot(2, 2)
        led.plot(3, 2)
        led.plot(2, 1)
        led.plot(2, 3)
    } else if (rssi > -70) {
        // Medium — center dot
        led.plot(2, 2)
    }
}

// Show trail map (sequence of dropped beacons)
function showTrailMap() {
    basic.clearScreen()
    for (let i = 0; i < droppedBeacons.length && i < 25; i++) {
        let col = i % 5
        let row = Math.floor(i / 5)
        led.plot(col, row)
    }
}

// Startup
basic.showString("BT")
basic.pause(300)
basic.showString("A=DROP B=FOLLOW")

// Button A: drop a beacon / select mode
input.onButtonPressed(Button.A, function () {
    if (isDropper) {
        // Drop a beacon at current location
        beaconSeq++
        droppedBeacons.push(beaconSeq)
        if (droppedBeacons.length > maxTrailLength) {
            droppedBeacons.shift()
        }
        dropAnimation()
        basic.showNumber(beaconSeq)
        basic.pause(300)
        // Announce beacon drop
        radio.sendString("TRAIL:" + trailId + ":DROP:" + beaconSeq)
        music.playTone(523, 100)
    } else {
        // Follower: next target beacon
        followTarget++
        basic.showString("T" + followTarget)
        basic.pause(300)
    }
})

// Button B: toggle dropper/follower mode
input.onButtonPressed(Button.B, function () {
    if (!isDropper && followTarget > 1) {
        // Previous target beacon
        followTarget = Math.max(1, followTarget - 1)
        basic.showString("T" + followTarget)
        basic.pause(300)
    } else {
        isDropper = !isDropper
        if (isDropper) {
            basic.showString("DROP")
            radio.setTransmitPower(4)
        } else {
            followTarget = 1
            basic.showString("HUNT")
            radio.setTransmitPower(0)
        }
        basic.pause(300)
        basic.clearScreen()
    }
})

// Button A+B: show trail status
input.onButtonPressed(Button.AB, function () {
    if (isDropper) {
        basic.showString("N:" + beaconSeq)
        basic.pause(300)
        showTrailMap()
        basic.pause(1000)
        basic.clearScreen()
    } else {
        basic.showString("T:" + followTarget)
        basic.pause(300)
        basic.showString("S:" + followRssi)
        basic.pause(300)
        basic.clearScreen()
    }
})

// Shake: clear trail
input.onGesture(Gesture.Shake, function () {
    if (isDropper) {
        beaconSeq = 0
        droppedBeacons = []
        radio.sendString("TRAIL:" + trailId + ":CLEAR:0")
        basic.showIcon(IconNames.No)
        basic.pause(300)
        basic.clearScreen()
    }
})

// Radio receive handler
radio.onReceivedString(function (receivedString) {
    let parts = receivedString.split(":")
    if (parts.length < 4 || parts[0] != "TRAIL") return

    let sendTrailId = parseInt(parts[1])
    let cmd = parts[2]
    let seq = parseInt(parts[3])

    if (!isDropper && cmd == "BEACON") {
        // Following mode: track signal from target beacon
        if (seq == followTarget) {
            followRssi = radio.receivedPacket(RadioPacketProperty.SignalStrength)

            // Audio proximity feedback
            let pitch = Math.map(followRssi, -100, -30, 200, 1500)
            pitch = Math.constrain(pitch, 200, 1500)
            music.playTone(pitch, 30)

            // Check if we've reached the beacon
            if (followRssi > -35) {
                if (!followLocked) {
                    followLocked = true
                    basic.showIcon(IconNames.Yes)
                    music.playTone(880, 200)
                    music.playTone(1047, 300)
                    basic.pause(500)
                    followTarget++
                    followLocked = false
                }
            }
        }
    }
})

// Dropper: broadcast beacon signals continuously
basic.forever(function () {
    if (isDropper && beaconSeq > 0) {
        // Broadcast all dropped beacons (most recent most frequently)
        for (let i = droppedBeacons.length - 1; i >= Math.max(0, droppedBeacons.length - 3); i--) {
            radio.sendString("TRAIL:" + trailId + ":BEACON:" + droppedBeacons[i])
            basic.pause(200)
        }
        basic.pause(breadcrumbInterval)
    } else if (isDropper) {
        basic.pause(1000)
    }
})

// Follower: display loop
basic.forever(function () {
    if (!isDropper) {
        showFollowIndicator(followRssi)
        basic.pause(200)
    }
})
