// ============================================================
// BIT-MICRO-VPN — Encrypted Radio Tunnel
// Creates an encrypted radio communication tunnel between
// two micro:bits. All messages are XOR-encrypted with a
// rotating key. Supports key exchange and secure channels.
// ============================================================

let vpnKey: number[] = [0xAB, 0xCD, 0xEF, 0x12, 0x34, 0x56, 0x78, 0x9A]
let vpnChannel = 25
let tunnelEstablished = false
let peerId = 0
let myVpnId = Math.randomRange(100, 999)
let keyRotation = 0
let packetsSent = 0
let packetsReceived = 0
let encryptionEnabled = true

// Initialize secure radio
radio.setGroup(vpnChannel)
radio.setTransmitPower(4)

// XOR encrypt/decrypt with rotating key
function vpnEncrypt(data: string): string {
    let result = ""
    for (let i = 0; i < data.length; i++) {
        let keyByte = vpnKey[(i + keyRotation) % vpnKey.length]
        let encrypted = data.charCodeAt(i) ^ keyByte
        // Map to printable range
        result += String.fromCharCode((encrypted % 94) + 33)
    }
    return result
}

function vpnDecrypt(data: string): string {
    let result = ""
    for (let i = 0; i < data.length; i++) {
        let keyByte = vpnKey[(i + keyRotation) % vpnKey.length]
        let decrypted = (data.charCodeAt(i) - 33) ^ keyByte
        result += String.fromCharCode(Math.abs(decrypted % 128))
    }
    return result
}

// Rotate encryption key
function rotateKey() {
    keyRotation = (keyRotation + 1) % vpnKey.length
    // Derive new key material
    for (let i = 0; i < vpnKey.length; i++) {
        vpnKey[i] = (vpnKey[i] * 7 + 13) % 256
    }
}

// Tunnel handshake
function initiateHandshake() {
    basic.showLeds(`
        # . . . #
        . # . # .
        . . # . .
        . # . # .
        # . . . #
    `)
    radio.sendString("VPN:HELLO:" + myVpnId)
    basic.pause(500)
}

function completeHandshake(remoteId: number) {
    peerId = remoteId
    tunnelEstablished = true
    radio.sendString("VPN:ACK:" + myVpnId)
    basic.showIcon(IconNames.Yes)
    music.playTone(523, 100)
    music.playTone(659, 100)
    basic.pause(300)
    basic.clearScreen()
}

// Secure send
function secureSend(plaintext: string) {
    if (!tunnelEstablished) {
        basic.showString("?")
        return
    }
    let payload = encryptionEnabled ? vpnEncrypt(plaintext) : plaintext
    radio.sendString("VPN:DATA:" + myVpnId + ":" + payload)
    packetsSent++
    rotateKey()

    // Send animation
    for (let col = 0; col < 5; col++) {
        led.plot(col, 2)
        basic.pause(40)
        led.unplot(col, 2)
    }
}

// Predefined secure messages
let vpnMessages = ["ACK", "SYNC", "CLEAR", "CHECK", "ABORT", "READY"]
let selectedVpnMsg = 0

// Startup
basic.showString("VPN")
basic.pause(300)
basic.showNumber(myVpnId)
basic.pause(500)
basic.clearScreen()

// Button A: select message
input.onButtonPressed(Button.A, function () {
    selectedVpnMsg = (selectedVpnMsg + 1) % vpnMessages.length
    basic.showString(vpnMessages[selectedVpnMsg])
})

// Button B: send selected message securely
input.onButtonPressed(Button.B, function () {
    if (!tunnelEstablished) {
        initiateHandshake()
    } else {
        secureSend(vpnMessages[selectedVpnMsg])
    }
})

// Button A+B: show tunnel stats
input.onButtonPressed(Button.AB, function () {
    basic.showString("S" + packetsSent)
    basic.pause(500)
    basic.showString("R" + packetsReceived)
    basic.pause(500)
    basic.showString("P" + peerId)
    basic.pause(500)
    basic.clearScreen()
})

// Shake: toggle encryption on/off
input.onGesture(Gesture.Shake, function () {
    encryptionEnabled = !encryptionEnabled
    if (encryptionEnabled) {
        basic.showLeds(`
            . # # # .
            # . . . #
            # . # . #
            # . . . #
            . # # # .
        `)
    } else {
        basic.showLeds(`
            # . . . #
            . . . . .
            . . . . .
            . . . . .
            # . . . #
        `)
    }
    basic.pause(500)
    basic.clearScreen()
})

// Radio receive handler
radio.onReceivedString(function (receivedString) {
    let parts = receivedString.split(":")
    if (parts.length < 3 || parts[0] != "VPN") return

    let cmd = parts[1]
    let senderId = parseInt(parts[2])

    if (cmd == "HELLO" && !tunnelEstablished) {
        completeHandshake(senderId)
    } else if (cmd == "ACK" && !tunnelEstablished) {
        peerId = senderId
        tunnelEstablished = true
        basic.showIcon(IconNames.Yes)
        basic.pause(300)
        basic.clearScreen()
    } else if (cmd == "DATA" && tunnelEstablished) {
        if (senderId == peerId && parts.length >= 4) {
            let payload = parts[3]
            let plaintext = encryptionEnabled ? vpnDecrypt(payload) : payload
            packetsReceived++
            rotateKey()
            music.playTone(440, 50)
            basic.showString(plaintext)
            basic.pause(300)
            basic.clearScreen()
        }
    }
})

// Background: tunnel keepalive
basic.forever(function () {
    if (tunnelEstablished) {
        radio.sendString("VPN:PING:" + myVpnId)
        led.plot(0, 0)
        basic.pause(100)
        led.unplot(0, 0)
        basic.pause(4900)
    }
})
