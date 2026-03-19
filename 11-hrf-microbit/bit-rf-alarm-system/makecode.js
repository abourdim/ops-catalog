// ============================================================
// BIT-RF-ALARM-SYSTEM — RF Intrusion Alarm
// Multi-zone alarm system using radio links between sensor
// nodes and a base station. Sensors detect motion/light changes
// and report to base. Base displays zone status and sounds alarm.
// ============================================================

let isBaseStation = false
let zoneId = 0  // 0=base, 1-4=sensor zones
let alarmGroup = 40
let alarmActive = false
let systemArmed = false
let zoneStatus: number[] = [0, 0, 0, 0, 0]  // 0=ok, 1=alert, 2=triggered
let lightBaseline = 0
let motionBaseline = 0
let alarmSilenced = false
let tripWireThreshold = 30

// Initialize radio
radio.setGroup(alarmGroup)
radio.setTransmitPower(7)

// Calibrate sensor baselines
function calibrateSensor() {
    lightBaseline = input.lightLevel()
    motionBaseline = input.acceleration(Dimension.Strength)
    basic.showIcon(IconNames.Yes)
    basic.pause(300)
    basic.clearScreen()
}

// Draw zone status on base station (5-LED row per zone)
function drawZoneDisplay() {
    basic.clearScreen()
    for (let z = 0; z < 4; z++) {
        if (zoneStatus[z + 1] == 0) {
            // OK: single dot
            led.plot(2, z)
        } else if (zoneStatus[z + 1] == 1) {
            // Alert: three dots
            led.plot(1, z)
            led.plot(2, z)
            led.plot(3, z)
        } else {
            // Triggered: full row
            for (let col = 0; col < 5; col++) {
                led.plot(col, z)
            }
        }
    }
    // Armed indicator on bottom row
    if (systemArmed) {
        led.plot(0, 4)
        led.plot(4, 4)
    }
}

// Sound alarm siren
function soundAlarm() {
    if (alarmSilenced) return
    for (let s = 0; s < 3; s++) {
        music.playTone(880, 150)
        basic.pause(50)
        music.playTone(660, 150)
        basic.pause(50)
    }
}

// Sensor node: check for intrusion
function checkSensor(): boolean {
    let lightDiff = Math.abs(input.lightLevel() - lightBaseline)
    let motionDiff = Math.abs(input.acceleration(Dimension.Strength) - motionBaseline)

    if (lightDiff > tripWireThreshold || motionDiff > 400) {
        return true
    }
    return false
}

// Startup — choose role
basic.showString("AL")
basic.pause(300)
basic.showString("A=BASE B=ZONE")

// Button A: set as base station
input.onButtonPressed(Button.A, function () {
    if (!isBaseStation && zoneId == 0) {
        isBaseStation = true
        basic.showString("BASE")
        basic.pause(300)
        drawZoneDisplay()
    } else if (isBaseStation) {
        // Toggle system armed
        systemArmed = !systemArmed
        alarmSilenced = false
        if (systemArmed) {
            radio.sendString("ALM:ARM")
            music.playTone(523, 100)
            music.playTone(784, 100)
        } else {
            radio.sendString("ALM:DISARM")
            music.playTone(784, 100)
            music.playTone(523, 100)
            alarmActive = false
            for (let z = 0; z < 5; z++) zoneStatus[z] = 0
        }
        drawZoneDisplay()
    }
})

// Button B: set zone ID (1-4) or silence alarm
input.onButtonPressed(Button.B, function () {
    if (!isBaseStation && zoneId == 0) {
        zoneId = 1
        basic.showString("Z1")
        calibrateSensor()
    } else if (!isBaseStation && zoneId > 0) {
        zoneId = (zoneId % 4) + 1
        basic.showString("Z" + zoneId)
        calibrateSensor()
    } else if (isBaseStation && alarmActive) {
        alarmSilenced = true
        basic.showIcon(IconNames.No)
        basic.pause(300)
        drawZoneDisplay()
    }
})

// Button A+B: recalibrate or show full status
input.onButtonPressed(Button.AB, function () {
    if (isBaseStation) {
        // Show detailed status
        for (let z = 1; z <= 4; z++) {
            basic.showString("Z" + z + ":" + zoneStatus[z])
            basic.pause(300)
        }
        drawZoneDisplay()
    } else {
        calibrateSensor()
    }
})

// Radio handler
radio.onReceivedString(function (receivedString) {
    let parts = receivedString.split(":")
    if (parts.length < 2 || parts[0] != "ALM") return

    let cmd = parts[1]

    if (isBaseStation) {
        if (cmd == "TRIP" && parts.length >= 3) {
            let zone = parseInt(parts[2])
            if (zone >= 1 && zone <= 4) {
                zoneStatus[zone] = 2
                alarmActive = true
                drawZoneDisplay()
                soundAlarm()
            }
        } else if (cmd == "OK" && parts.length >= 3) {
            let zone = parseInt(parts[2])
            if (zone >= 1 && zone <= 4 && zoneStatus[zone] != 2) {
                zoneStatus[zone] = 0
            }
        }
    } else {
        if (cmd == "ARM") {
            systemArmed = true
            calibrateSensor()
            basic.showLeds(`
                . . # . .
                . # . # .
                # . . . #
                . # . # .
                . . # . .
            `)
            basic.pause(300)
        } else if (cmd == "DISARM") {
            systemArmed = false
            basic.showIcon(IconNames.Square)
            basic.pause(300)
            basic.clearScreen()
        }
    }
})

// Sensor node main loop
basic.forever(function () {
    if (!isBaseStation && zoneId > 0 && systemArmed) {
        if (checkSensor()) {
            radio.sendString("ALM:TRIP:" + zoneId)
            // Local alarm indication
            basic.showIcon(IconNames.Skull)
            music.playTone(1000, 200)
            basic.pause(2000)
        } else {
            radio.sendString("ALM:OK:" + zoneId)
            led.plot(2, 2)
            basic.pause(100)
            led.unplot(2, 2)
            basic.pause(2900)
        }
    }
})

// Base station alarm loop
basic.forever(function () {
    if (isBaseStation && alarmActive && !alarmSilenced) {
        soundAlarm()
        drawZoneDisplay()
        basic.pause(500)
    }
})
