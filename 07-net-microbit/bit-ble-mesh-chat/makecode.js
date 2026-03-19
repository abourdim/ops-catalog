// ============================================================
// BIT-BLE-MESH-CHAT — BLE Mesh Chat Network
// Creates a simple mesh chat network using micro:bit radio.
// Messages hop between nodes to extend range. Each node has
// a unique ID. Button A selects message, B sends, A+B shows inbox.
// ============================================================

let nodeId = Math.randomRange(1, 99)
let chatGroup = 10
let maxHops = 3
let inboxMessages: string[] = []
let inboxCount = 0
let seenMessages: string[] = []
let maxSeen = 20
let selectedReply = 0

// Predefined chat messages
let chatMessages = [
    "HI",
    "OK",
    "NO",
    "HELP",
    "WHERE",
    "WAIT",
    "COME",
    "DONE"
]

// Initialize radio mesh
radio.setGroup(chatGroup)
radio.setTransmitPower(7)

// Message format: "MESH:senderID:hopCount:msgID:text"
let msgCounter = 0

function buildMessage(text: string): string {
    msgCounter++
    let msgId = nodeId * 1000 + msgCounter
    return "MESH:" + nodeId + ":" + maxHops + ":" + msgId + ":" + text
}

// Check if we already saw this message (prevent loops)
function isNewMessage(msgId: string): boolean {
    for (let i = 0; i < seenMessages.length; i++) {
        if (seenMessages[i] == msgId) return false
    }
    return true
}

function trackMessage(msgId: string) {
    seenMessages.push(msgId)
    if (seenMessages.length > maxSeen) {
        seenMessages.shift()
    }
}

// Parse and handle incoming mesh message
function handleMeshMessage(raw: string) {
    let parts = raw.split(":")
    if (parts.length < 5) return
    if (parts[0] != "MESH") return

    let senderId = parts[1]
    let hops = parseInt(parts[2])
    let msgId = parts[3]
    let text = parts[4]

    // Skip our own messages
    if (parseInt(senderId) == nodeId) return

    // Skip already-seen messages
    if (!isNewMessage(msgId)) return
    trackMessage(msgId)

    // Store in inbox
    inboxMessages.push(senderId + ">" + text)
    if (inboxMessages.length > 5) {
        inboxMessages.shift()
    }
    inboxCount = inboxMessages.length

    // Notification
    music.playTone(659, 50)
    led.plot(4, 0)

    // Forward if hops remaining
    if (hops > 1) {
        let forwarded = "MESH:" + senderId + ":" + (hops - 1) + ":" + msgId + ":" + text
        basic.pause(Math.randomRange(50, 200))
        radio.sendString(forwarded)
    }
}

// Show node info
function showNodeInfo() {
    basic.showString("N" + nodeId)
    basic.pause(300)
    basic.showString("M" + inboxCount)
    basic.pause(300)
}

// Startup
basic.showString("MC")
basic.pause(200)
basic.showNumber(nodeId)
basic.pause(500)
basic.clearScreen()

// Button A: select message to send
input.onButtonPressed(Button.A, function () {
    selectedReply = (selectedReply + 1) % chatMessages.length
    basic.showString(chatMessages[selectedReply])
})

// Button B: send selected message
input.onButtonPressed(Button.B, function () {
    let msg = buildMessage(chatMessages[selectedReply])
    trackMessage("" + (nodeId * 1000 + msgCounter))
    radio.sendString(msg)

    // Send animation
    for (let i = 0; i < 5; i++) {
        led.plot(2, i)
        basic.pause(50)
    }
    basic.showIcon(IconNames.Yes)
    basic.pause(300)
    basic.clearScreen()
})

// Button A+B: read inbox
input.onButtonPressed(Button.AB, function () {
    if (inboxMessages.length == 0) {
        basic.showString("0")
        return
    }
    for (let m = 0; m < inboxMessages.length; m++) {
        basic.showString(inboxMessages[m])
        basic.pause(200)
    }
    basic.clearScreen()
    led.unplot(4, 0)
})

// Shake: show node info
input.onGesture(Gesture.Shake, function () {
    showNodeInfo()
})

// Radio receive handler
radio.onReceivedString(function (receivedString) {
    handleMeshMessage(receivedString)
})

// Background: mesh keepalive beacon
basic.forever(function () {
    radio.sendString("MESH:" + nodeId + ":0:0:PING")
    basic.pause(10000)
})

// Background: inbox notification blink
basic.forever(function () {
    if (inboxCount > 0) {
        led.toggle(4, 0)
        basic.pause(1000)
    }
})
