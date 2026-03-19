/**
 * Swarm Flock Formation - micro:bit MakeCode
 * Boids flocking algorithm with RSSI-based neighbor awareness
 * LED display shows flock direction and density
 */

const GROUP = 43
let myId = control.deviceSerialNumber() & 0xFF
let px = Math.randomRange(-50, 50)
let py = Math.randomRange(-50, 50)
let vx = Math.random() * 2 - 1
let vy = Math.random() * 2 - 1
let neighbors: { id: number, px: number, py: number, vx: number, vy: number, rssi: number }[] = []

radio.setGroup(GROUP)
radio.setTransmitPower(7)

function limitSpeed(x: number, y: number, max: number): number[] {
    let s = Math.sqrt(x * x + y * y)
    if (s > max) { x = x / s * max; y = y / s * max }
    return [x, y]
}

function applyBoidRules() {
    if (neighbors.length === 0) return
    let sepX = 0, sepY = 0, aliX = 0, aliY = 0, cohX = 0, cohY = 0

    for (let n of neighbors) {
        let dx = n.px - px
        let dy = n.py - py
        let dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 20 && dist > 0) { sepX -= dx / dist; sepY -= dy / dist }
        aliX += n.vx; aliY += n.vy
        cohX += n.px; cohY += n.py
    }

    let cnt = neighbors.length
    aliX /= cnt; aliY /= cnt
    cohX = cohX / cnt - px; cohY = cohY / cnt - py

    vx += sepX * 0.1 + (aliX - vx) * 0.05 + cohX * 0.01
    vy += sepY * 0.1 + (aliY - vy) * 0.05 + cohY * 0.01
    let lim = limitSpeed(vx, vy, 3)
    vx = lim[0]; vy = lim[1]

    px += vx; py += vy
    if (px > 50) px = -50; if (px < -50) px = 50
    if (py > 50) py = -50; if (py < -50) py = 50
}

function displayFlock() {
    basic.clearScreen()
    // Show direction arrow
    let angle = Math.atan2(vy, vx) * 180 / Math.PI
    let cx = 2, cy = 2
    led.plot(cx, cy)
    if (angle > -45 && angle <= 45) led.plot(4, 2)       // right
    else if (angle > 45 && angle <= 135) led.plot(2, 4)   // down
    else if (angle > -135 && angle <= -45) led.plot(2, 0)  // up
    else led.plot(0, 2)                                     // left

    // Show neighbor count as brightness
    let density = Math.min(neighbors.length, 4)
    for (let i = 0; i < density; i++) {
        led.plot(i, 4)
    }
}

radio.onReceivedString(function (msg: string) {
    let rssi = radio.receivedPacket(RadioPacketProperty.SignalStrength)
    let parts = msg.split(",")
    if (parts.length < 5) return
    let nId = parseInt(parts[0])
    let nPx = parseFloat(parts[1])
    let nPy = parseFloat(parts[2])
    let nVx = parseFloat(parts[3])
    let nVy = parseFloat(parts[4])

    let found = false
    for (let n of neighbors) {
        if (n.id === nId) {
            n.px = nPx; n.py = nPy; n.vx = nVx; n.vy = nVy; n.rssi = rssi
            found = true
            break
        }
    }
    if (!found && neighbors.length < 8) {
        neighbors.push({ id: nId, px: nPx, py: nPy, vx: nVx, vy: nVy, rssi: rssi })
    }
})

input.onButtonPressed(Button.A, function () {
    serial.writeLine("{\"boid\":" + myId + ",\"px\":" + px + ",\"py\":" + py +
        ",\"vx\":" + vx + ",\"vy\":" + vy + ",\"flock\":" + neighbors.length + "}")
})

input.onButtonPressed(Button.B, function () {
    px = 0; py = 0; vx = 0; vy = 0
    basic.showIcon(IconNames.Target)
    basic.pause(500)
})

basic.forever(function () {
    applyBoidRules()
    let msg = myId + "," + Math.round(px) + "," + Math.round(py) + "," +
        Math.roundWithPrecision(vx, 1) + "," + Math.roundWithPrecision(vy, 1)
    radio.sendString(msg)
    displayFlock()
    // Prune old neighbors
    if (neighbors.length > 8) neighbors.splice(0, neighbors.length - 8)
    basic.pause(200)
})
