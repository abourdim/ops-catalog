// ============================================================
// BIT-RF-REMOTE-CONTROL — RF Remote Control
// Turns a micro:bit into a multi-channel RF remote control.
// Buttons and tilts send commands over radio to a receiver.
// Supports 4 channels with different command sets per channel.
// ============================================================

let isTransmitter = true
let remoteChannel = 0
let remoteGroup = 45
let lastCommand = ""
let commandLog: string[] = []
let repeatMode = false
let repeatInterval = 500

// Channel names and their commands
let channelNames = ["MOTOR", "LIGHT", "SERVO", "RELAY"]
let channelCommands = [
    ["FWD", "REV", "LEFT", "RIGHT", "STOP"],
    ["ON", "OFF", "DIM", "BRIGHT", "FLASH"],
    ["POS0", "POS45", "POS90", "POS135", "POS180"],
    ["R1ON", "R1OFF", "R2ON", "R2OFF", "ALLOFF"]
]
let selectedCommand = 0

// Initialize radio
radio.setGroup(remoteGroup)
radio.setTransmitPower(7)

// Send command with channel prefix
function sendCommand(cmd: string) {
    let fullCmd = "RC:" + remoteChannel + ":" + cmd
    radio.sendString(fullCmd)
    lastCommand = cmd

    // Log command
    commandLog.push(cmd)
    if (commandLog.length > 10) commandLog.shift()

    // Send animation — dot moving across
    for (let i = 0; i < 5; i++) {
        led.plot(i, 2)
        basic.pause(30)
        led.unplot(i, 2)
    }
}

// Show channel and command info
function showChannelInfo() {
    basic.clearScreen()
    // Channel indicator on top row
    for (let c = 0; c <= remoteChannel; c++) {
        led.plot(c, 0)
    }
    // Command indicator on bottom row
    for (let c = 0; c <= selectedCommand; c++) {
        led.plot(c, 4)
    }
    // Active indicator in center
    led.plot(2, 2)
}

// Receiver: execute received command
function executeCommand(channel: number, cmd: string) {
    basic.showString(cmd.charAt(0) + cmd.charAt(1))

    // Simulate output on pins based on channel
    if (channel == 0) {
        // Motor control
        if (cmd == "FWD") {
            pins.analogWritePin(AnalogPin.P0, 1023)
            pins.digitalWritePin(DigitalPin.P1, 0)
        } else if (cmd == "REV") {
            pins.analogWritePin(AnalogPin.P0, 1023)
            pins.digitalWritePin(DigitalPin.P1, 1)
        } else if (cmd == "STOP") {
            pins.analogWritePin(AnalogPin.P0, 0)
        }
    } else if (channel == 1) {
        // Light control
        if (cmd == "ON") {
            pins.digitalWritePin(DigitalPin.P0, 1)
        } else if (cmd == "OFF") {
            pins.digitalWritePin(DigitalPin.P0, 0)
        } else if (cmd == "DIM") {
            pins.analogWritePin(AnalogPin.P0, 256)
        } else if (cmd == "BRIGHT") {
            pins.analogWritePin(AnalogPin.P0, 1023)
        }
    } else if (channel == 2) {
        // Servo control
        let angle = parseInt(cmd.substr(3))
        pins.servoWritePin(AnalogPin.P0, angle)
    } else if (channel == 3) {
        // Relay control
        if (cmd == "R1ON") pins.digitalWritePin(DigitalPin.P0, 1)
        if (cmd == "R1OFF") pins.digitalWritePin(DigitalPin.P0, 0)
        if (cmd == "R2ON") pins.digitalWritePin(DigitalPin.P1, 1)
        if (cmd == "R2OFF") pins.digitalWritePin(DigitalPin.P1, 0)
        if (cmd == "ALLOFF") {
            pins.digitalWritePin(DigitalPin.P0, 0)
            pins.digitalWritePin(DigitalPin.P1, 0)
        }
    }
    music.playTone(440, 50)
}

// Startup
basic.showString("RC")
basic.pause(200)
basic.showString("A=TX B=RX")

// Button A: transmitter mode / select command
input.onButtonPressed(Button.A, function () {
    if (isTransmitter) {
        selectedCommand = (selectedCommand + 1) % 5
        let cmd = channelCommands[remoteChannel][selectedCommand]
        basic.showString(cmd.substr(0, 3))
        basic.pause(200)
        showChannelInfo()
    }
})

// Button B: cycle channels / toggle TX/RX
input.onButtonPressed(Button.B, function () {
    if (isTransmitter) {
        remoteChannel = (remoteChannel + 1) % 4
        selectedCommand = 0
        basic.showString(channelNames[remoteChannel].substr(0, 3))
        basic.pause(300)
        showChannelInfo()
    }
})

// Button A+B: send the selected command
input.onButtonPressed(Button.AB, function () {
    if (isTransmitter) {
        let cmd = channelCommands[remoteChannel][selectedCommand]
        sendCommand(cmd)
        basic.showIcon(IconNames.Yes)
        basic.pause(200)
        showChannelInfo()
    } else {
        // Receiver: show last received command
        if (lastCommand.length > 0) {
            basic.showString(lastCommand)
        }
    }
})

// Tilt gestures for quick commands (transmitter mode)
input.onGesture(Gesture.TiltLeft, function () {
    if (isTransmitter && remoteChannel == 0) {
        sendCommand("LEFT")
    }
})

input.onGesture(Gesture.TiltRight, function () {
    if (isTransmitter && remoteChannel == 0) {
        sendCommand("RIGHT")
    }
})

input.onGesture(Gesture.LogoUp, function () {
    if (isTransmitter && remoteChannel == 0) {
        sendCommand("FWD")
    }
})

input.onGesture(Gesture.LogoDown, function () {
    if (isTransmitter && remoteChannel == 0) {
        sendCommand("REV")
    }
})

// Shake: toggle transmitter/receiver mode
input.onGesture(Gesture.Shake, function () {
    isTransmitter = !isTransmitter
    if (isTransmitter) {
        basic.showString("TX")
    } else {
        basic.showString("RX")
    }
    basic.pause(300)
    basic.clearScreen()
})

// Radio receive handler
radio.onReceivedString(function (receivedString) {
    let parts = receivedString.split(":")
    if (parts.length < 3 || parts[0] != "RC") return

    let channel = parseInt(parts[1])
    let cmd = parts[2]

    if (!isTransmitter) {
        executeCommand(channel, cmd)
        lastCommand = cmd
    }
})

// Background: repeat mode for continuous commands
basic.forever(function () {
    if (isTransmitter && repeatMode) {
        let cmd = channelCommands[remoteChannel][selectedCommand]
        sendCommand(cmd)
        basic.pause(repeatInterval)
    }
})
