/**
 * Swarm Democratic Frequency - micro:bit MakeCode
 * Democratic voting to select best radio group for the swarm
 * LED shows vote count and elected channel
 */

const GROUP = 54
let myId = control.deviceSerialNumber() & 0xFF
let voteTally: number[] = [0, 0, 0, 0, 0, 0, 0, 0]
let electedGroup = 1
let currentRound = 0
let myProposal = 1
let voting = false
let voterIds: number[] = []

radio.setGroup(GROUP)
radio.setTransmitPower(7)

function proposeChannel(): number {
    // Use RSSI to estimate best channel
    return Math.randomRange(1, 7)
}

function startElection() {
    currentRound++
    voting = true
    voteTally = [0, 0, 0, 0, 0, 0, 0, 0]
    myProposal = proposeChannel()
    voteTally[myProposal]++

    let msg = "P:" + myId + ":" + currentRound + ":" + myProposal
    radio.sendString(msg)
    serial.writeLine("[VOTE] Round " + currentRound + " proposing group " + myProposal)

    // Wait for votes
    basic.showIcon(IconNames.Clock)
    basic.pause(3000)
    tallyResults()
}

function tallyResults() {
    let bestCh = 0, bestVotes = 0
    for (let ch = 0; ch < voteTally.length; ch++) {
        if (voteTally[ch] > bestVotes) {
            bestVotes = voteTally[ch]
            bestCh = ch
        }
    }
    electedGroup = bestCh
    voting = false

    let msg = "R:" + myId + ":" + currentRound + ":" + electedGroup + ":" + bestVotes
    radio.sendString(msg)
    serial.writeLine("[VOTE] Elected group " + electedGroup + " with " + bestVotes + " votes")
}

function displayElected() {
    basic.clearScreen()
    if (voting) {
        basic.showIcon(IconNames.Clock)
    } else {
        // Show elected channel as number
        basic.showNumber(electedGroup)
    }
}

radio.onReceivedString(function (msg: string) {
    let parts = msg.split(":")
    if (parts.length < 4) return
    let senderId = parseInt(parts[1])

    if (voterIds.indexOf(senderId) < 0 && voterIds.length < 10)
        voterIds.push(senderId)

    if (parts[0] === "P" && parseInt(parts[2]) === currentRound) {
        let proposal = parseInt(parts[3])
        // Vote for their proposal or mine based on simple heuristic
        let myVote = Math.random() > 0.5 ? proposal : myProposal
        voteTally[myVote]++
        let vMsg = "V:" + myId + ":" + currentRound + ":" + myVote
        radio.sendString(vMsg)
    } else if (parts[0] === "V" && parseInt(parts[2]) === currentRound) {
        voteTally[parseInt(parts[3])]++
    } else if (parts[0] === "R") {
        electedGroup = parseInt(parts[3])
        voting = false
    }
})

input.onButtonPressed(Button.A, function () {
    startElection()
})

input.onButtonPressed(Button.B, function () {
    serial.writeLine("{\"id\":" + myId + ",\"elected\":" + electedGroup +
        ",\"round\":" + currentRound + ",\"voters\":" + voterIds.length + "}")
})

basic.forever(function () {
    displayElected()
    basic.pause(500)
})
