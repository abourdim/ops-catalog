/**
 * Swarm Particle Swarm Optimizer - micro:bit MakeCode
 * Classic PSO algorithm distributed across micro:bit radio swarm
 * LED shows convergence progress toward optimum
 */

const GROUP = 56
let myId = control.deviceSerialNumber() & 0xFF
const DIM = 2
let pos = [Math.random() * 10 - 5, Math.random() * 10 - 5]
let vel = [Math.random() * 2 - 1, Math.random() * 2 - 1]
let pbestPos = pos.slice()
let pbestFit = -9999
let gbestPos = pos.slice()
let gbestFit = -9999
let iteration = 0
let swarmSize = 0
let peerIds: number[] = []

const W = 0.7
const C1 = 1.5
const C2 = 1.5

radio.setGroup(GROUP)
radio.setTransmitPower(7)

// Sphere function (minimize x^2 + y^2, negate for maximize)
function fitness(x: number[]): number {
    let sum = 0
    for (let v of x) sum += v * v
    return -sum
}

function psoStep() {
    for (let d = 0; d < DIM; d++) {
        let r1 = Math.random(), r2 = Math.random()
        vel[d] = W * vel[d]
            + C1 * r1 * (pbestPos[d] - pos[d])
            + C2 * r2 * (gbestPos[d] - pos[d])
        vel[d] = Math.constrain(vel[d], -3, 3)
        pos[d] += vel[d]
        pos[d] = Math.constrain(pos[d], -5.12, 5.12)
    }

    let fit = fitness(pos)
    if (fit > pbestFit) {
        pbestFit = fit
        pbestPos = pos.slice()
    }
    if (fit > gbestFit) {
        gbestFit = fit
        gbestPos = pos.slice()
    }
    iteration++
}

function broadcastState() {
    let msg = myId + "," +
        Math.roundWithPrecision(pos[0], 2) + "," +
        Math.roundWithPrecision(pos[1], 2) + "," +
        Math.roundWithPrecision(fitness(pos), 2) + "," +
        Math.roundWithPrecision(gbestFit, 2)
    radio.sendString(msg)
}

function displayConvergence() {
    basic.clearScreen()
    // Map position to LED
    let lx = Math.map(pos[0], -5, 5, 0, 4)
    let ly = Math.map(pos[1], -5, 5, 0, 4)
    led.plot(Math.constrain(Math.round(lx), 0, 4),
             Math.constrain(Math.round(ly), 0, 4))

    // Show global best as cross
    let gx = Math.map(gbestPos[0], -5, 5, 0, 4)
    let gy = Math.map(gbestPos[1], -5, 5, 0, 4)
    let gcx = Math.constrain(Math.round(gx), 0, 4)
    let gcy = Math.constrain(Math.round(gy), 0, 4)
    if (gcx > 0) led.plot(gcx - 1, gcy)
    if (gcx < 4) led.plot(gcx + 1, gcy)
    if (gcy > 0) led.plot(gcx, gcy - 1)
    if (gcy < 4) led.plot(gcx, gcy + 1)
}

radio.onReceivedString(function (msg: string) {
    let parts = msg.split(",")
    if (parts.length < 5) return
    let senderId = parseInt(parts[0])
    let pFit = parseFloat(parts[3])
    let pGbest = parseFloat(parts[4])

    if (peerIds.indexOf(senderId) < 0 && peerIds.length < 10) {
        peerIds.push(senderId)
        swarmSize = peerIds.length
    }

    // Update global best from peer
    if (pFit > gbestFit) {
        gbestFit = pFit
        gbestPos = [parseFloat(parts[1]), parseFloat(parts[2])]
    }
})

input.onButtonPressed(Button.A, function () {
    // Reset particle
    pos = [Math.random() * 10 - 5, Math.random() * 10 - 5]
    vel = [Math.random() * 2 - 1, Math.random() * 2 - 1]
    pbestFit = -9999
    basic.showIcon(IconNames.Surprised)
    basic.pause(500)
})

input.onButtonPressed(Button.B, function () {
    serial.writeLine("{\"id\":" + myId + ",\"iter\":" + iteration +
        ",\"fit\":" + Math.roundWithPrecision(fitness(pos), 3) +
        ",\"gbest\":" + Math.roundWithPrecision(gbestFit, 3) +
        ",\"pos\":[" + Math.roundWithPrecision(pos[0], 2) + "," +
        Math.roundWithPrecision(pos[1], 2) + "],\"swarm\":" + swarmSize + "}")
})

basic.forever(function () {
    psoStep()
    broadcastState()
    displayConvergence()
    basic.pause(200)
})
