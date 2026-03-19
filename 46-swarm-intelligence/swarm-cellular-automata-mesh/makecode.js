/**
 * Swarm Cellular Automata Mesh - micro:bit MakeCode
 * Each micro:bit is one cell in a distributed cellular automaton
 * LED shows cell state as pattern, evolves based on radio neighbors
 */

const GROUP = 52
let myId = control.deviceSerialNumber() & 0xFF
let myState = Math.randomRange(0, 3)
let prevState = 0
let generation = 0
let neighborStates: { id: number, state: number, time: number }[] = []
const NUM_STATES = 4

radio.setGroup(GROUP)
radio.setTransmitPower(7)

const stateIcons = [IconNames.SmallSquare, IconNames.Square, IconNames.Diamond, IconNames.SmallDiamond]

function computeNext(): number {
    let counts = [0, 0, 0, 0]
    for (let n of neighborStates) counts[n.state % NUM_STATES]++

    let dominant = 0
    for (let s = 1; s < NUM_STATES; s++)
        if (counts[s] > counts[dominant]) dominant = s

    let alive = neighborStates.length
    if (myState === 0 && (alive === 2 || alive === 3)) return 1
    if (myState > 0 && alive >= 2 && alive <= 3) return Math.min(myState + 1, NUM_STATES - 1)
    return Math.max(myState - 1, 0)
}

function broadcastState() {
    let msg = "C:" + myId + ":" + myState + ":" + generation
    radio.sendString(msg)
}

function pruneNeighbors() {
    let now = input.runningTime()
    for (let i = neighborStates.length - 1; i >= 0; i--) {
        if (now - neighborStates[i].time > 3000)
            neighborStates.splice(i, 1)
    }
}

radio.onReceivedString(function (msg: string) {
    let parts = msg.split(":")
    if (parts.length < 4 || parts[0] !== "C") return
    let sid = parseInt(parts[1])
    let state = parseInt(parts[2])

    let found = false
    for (let n of neighborStates) {
        if (n.id === sid) {
            n.state = state
            n.time = input.runningTime()
            found = true
            break
        }
    }
    if (!found && neighborStates.length < 8) {
        neighborStates.push({ id: sid, state: state, time: input.runningTime() })
    }
})

input.onButtonPressed(Button.A, function () {
    myState = (myState + 1) % NUM_STATES
    basic.showNumber(myState)
    basic.pause(500)
})

input.onButtonPressed(Button.B, function () {
    serial.writeLine("{\"id\":" + myId + ",\"state\":" + myState +
        ",\"gen\":" + generation + ",\"neighbors\":" + neighborStates.length + "}")
})

basic.forever(function () {
    pruneNeighbors()
    prevState = myState
    myState = computeNext()
    generation++
    broadcastState()
    basic.showIcon(stateIcons[myState % stateIcons.length])
    basic.pause(500)
})
