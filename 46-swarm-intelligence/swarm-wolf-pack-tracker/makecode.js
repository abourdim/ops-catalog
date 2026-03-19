/**
 * Swarm Wolf Pack Tracker - micro:bit MakeCode
 * Grey Wolf Optimizer with role hierarchy (alpha/beta/omega)
 * LED shows role icon and hunting direction
 */

const GROUP = 53
let myId = control.deviceSerialNumber() & 0xFF
let px = Math.randomRange(0, 100)
let py = Math.randomRange(0, 100)
let preyX = 50, preyY = 50
let myRole = 2  // 0=alpha, 1=beta, 2=omega
let myFitness = 0
let wolves: { id: number, px: number, py: number, fitness: number, role: number }[] = []

radio.setGroup(GROUP)
radio.setTransmitPower(7)

function distPrey(): number {
    return Math.sqrt((px - preyX) ** 2 + (py - preyY) ** 2)
}

function updateFitness() {
    myFitness = 1.0 / (distPrey() + 1)
    let rank = 0
    for (let w of wolves) if (w.fitness > myFitness) rank++
    myRole = Math.min(rank, 2)
}

function huntStep() {
    if (wolves.length === 0) return
    // Sort by fitness
    let sorted = wolves.slice().sort((a, b) => b.fitness - a.fitness)
    let alpha = sorted.length > 0 ? sorted[0] : { px: px, py: py }
    let beta = sorted.length > 1 ? sorted[1] : alpha
    let delta = sorted.length > 2 ? sorted[2] : beta

    px = (alpha.px + beta.px + delta.px) / 3 + Math.randomRange(-5, 5)
    py = (alpha.py + beta.py + delta.py) / 3 + Math.randomRange(-5, 5)
    px = Math.constrain(px, 0, 100)
    py = Math.constrain(py, 0, 100)
}

function displayRole() {
    basic.clearScreen()
    if (myRole === 0) {
        basic.showIcon(IconNames.Triangle)
    } else if (myRole === 1) {
        led.plot(1, 1); led.plot(3, 1); led.plot(1, 3); led.plot(3, 3); led.plot(2, 2)
    } else {
        led.plot(2, 2)
        // Arrow toward prey
        if (preyX > px) led.plot(3, 2)
        if (preyX < px) led.plot(1, 2)
        if (preyY > py) led.plot(2, 3)
        if (preyY < py) led.plot(2, 1)
    }
}

radio.onReceivedString(function (msg: string) {
    let parts = msg.split(",")
    if (parts.length < 5) return
    let wId = parseInt(parts[0])
    let wPx = parseFloat(parts[1])
    let wPy = parseFloat(parts[2])
    let wFit = parseFloat(parts[3])
    let wRole = parseInt(parts[4])

    let found = false
    for (let w of wolves) {
        if (w.id === wId) {
            w.px = wPx; w.py = wPy; w.fitness = wFit; w.role = wRole
            found = true; break
        }
    }
    if (!found && wolves.length < 8)
        wolves.push({ id: wId, px: wPx, py: wPy, fitness: wFit, role: wRole })
})

input.onButtonPressed(Button.A, function () {
    preyX = Math.randomRange(10, 90)
    preyY = Math.randomRange(10, 90)
    basic.showIcon(IconNames.Target)
    basic.pause(500)
})

input.onButtonPressed(Button.B, function () {
    let roles = ["alpha", "beta", "omega"]
    serial.writeLine("{\"id\":" + myId + ",\"role\":\"" + roles[myRole] +
        "\",\"pos\":[" + px + "," + py + "],\"prey\":[" + preyX + "," + preyY +
        "],\"fit\":" + Math.roundWithPrecision(myFitness, 3) + ",\"pack\":" + wolves.length + "}")
})

basic.forever(function () {
    huntStep()
    updateFitness()
    let msg = myId + "," + Math.round(px) + "," + Math.round(py) + "," +
        Math.roundWithPrecision(myFitness, 3) + "," + myRole
    radio.sendString(msg)
    displayRole()
    basic.pause(300)
})
