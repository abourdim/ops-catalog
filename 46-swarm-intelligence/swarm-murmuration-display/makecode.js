/**
 * Swarm Murmuration Display - micro:bit MakeCode
 * Starling murmuration with accelerometer-driven movement
 * LED shows bird position relative to flock center
 */

const GROUP = 49
let myId = control.deviceSerialNumber() & 0xFF
let px = Math.randomRange(-25, 25)
let py = Math.randomRange(-25, 25)
let vx = 0, vy = 0
let neighbors: { id: number, px: number, py: number, vx: number, vy: number }[] = []

radio.setGroup(GROUP)
radio.setTransmitPower(7)

function murmurationStep() {
    // Use accelerometer for perturbation
    let ax = input.acceleration(Dimension.X) / 1024
    let ay = input.acceleration(Dimension.Y) / 1024

    let sepX = 0, sepY = 0, aliX = 0, aliY = 0, cohX = 0, cohY = 0
    let count = 0

    for (let n of neighbors) {
        let dx = n.px - px, dy = n.py - py
        let d = Math.sqrt(dx * dx + dy * dy) + 0.01
        count++
        if (d < 10) { sepX -= dx / d; sepY -= dy / d }
        aliX += n.vx; aliY += n.vy
        cohX += n.px; cohY += n.py
    }

    if (count > 0) {
        aliX /= count; aliY /= count
        cohX = cohX / count - px; cohY = cohY / count - py
        vx += sepX * 0.15 + (aliX - vx) * 0.08 + cohX * 0.02 + ax * 0.3
        vy += sepY * 0.15 + (aliY - vy) * 0.08 + cohY * 0.02 + ay * 0.3
    } else {
        vx += ax * 0.5
        vy += ay * 0.5
    }

    let speed = Math.sqrt(vx * vx + vy * vy)
    if (speed > 3) { vx = vx / speed * 3; vy = vy / speed * 3 }
    px += vx; py += vy
    if (px > 25) px = -25; if (px < -25) px = 25
    if (py > 25) py = -25; if (py < -25) py = 25
}

function displayPosition() {
    basic.clearScreen()
    // Map position to LED grid
    let lx = Math.map(px, -25, 25, 0, 4)
    let ly = Math.map(py, -25, 25, 0, 4)
    led.plot(Math.constrain(Math.round(lx), 0, 4),
             Math.constrain(Math.round(ly), 0, 4))

    // Show neighbors as dimmer dots
    for (let n of neighbors) {
        let nx = Math.map(n.px, -25, 25, 0, 4)
        let ny = Math.map(n.py, -25, 25, 0, 4)
        led.plot(Math.constrain(Math.round(nx), 0, 4),
                 Math.constrain(Math.round(ny), 0, 4))
    }
}

radio.onReceivedString(function (msg: string) {
    let parts = msg.split(",")
    if (parts.length < 5) return
    let nId = parseInt(parts[0])
    let nData = { id: nId, px: parseFloat(parts[1]), py: parseFloat(parts[2]),
                  vx: parseFloat(parts[3]), vy: parseFloat(parts[4]) }
    let found = false
    for (let i = 0; i < neighbors.length; i++) {
        if (neighbors[i].id === nId) { neighbors[i] = nData; found = true; break }
    }
    if (!found && neighbors.length < 7) neighbors.push(nData)
})

input.onButtonPressed(Button.A, function () {
    serial.writeLine("{\"bird\":" + myId + ",\"p\":[" + Math.round(px) + "," +
        Math.round(py) + "],\"v\":[" + Math.roundWithPrecision(vx, 1) + "," +
        Math.roundWithPrecision(vy, 1) + "],\"flock\":" + neighbors.length + "}")
})

basic.forever(function () {
    murmurationStep()
    let msg = myId + "," + Math.round(px) + "," + Math.round(py) + "," +
        Math.roundWithPrecision(vx, 1) + "," + Math.roundWithPrecision(vy, 1)
    radio.sendString(msg)
    displayPosition()
    basic.pause(100)
})
