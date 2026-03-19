// ============================================================
// BIT-FREQUENCY-DUEL — Frequency Guessing Game
// Two-player game where players guess the target frequency.
// A tone is played and players tilt to select their guess.
// Closest guess wins the round. Uses radio for multiplayer.
// ============================================================

let targetFreq = 0
let playerGuess = 440
let opponentGuess = 0
let score = 0
let opponentScore = 0
let roundNumber = 0
let maxRounds = 5
let gameActive = false
let isHost = false
let guessLocked = false
let guessMin = 200
let guessMax = 1000
let guessStep = 50

// Radio setup for multiplayer
radio.setGroup(30)
radio.setTransmitPower(4)
let playerId = Math.randomRange(1, 999)

// Generate random target frequency
function newTargetFreq(): number {
    return Math.randomRange(guessMin / guessStep, guessMax / guessStep) * guessStep
}

// Play the target tone
function playTarget() {
    for (let rep = 0; rep < 3; rep++) {
        music.playTone(targetFreq, 300)
        basic.pause(200)
    }
}

// Play player's guess tone
function playGuess() {
    music.playTone(playerGuess, 500)
}

// Show frequency as bar graph
function showFreqBar(freq: number) {
    basic.clearScreen()
    let level = Math.map(freq, guessMin, guessMax, 0, 25)
    level = Math.constrain(level, 0, 25)
    for (let i = 0; i < level; i++) {
        let col = i % 5
        let row = 4 - Math.floor(i / 5)
        led.plot(col, row)
    }
}

// Show round result
function showResult(won: boolean) {
    if (won) {
        score++
        basic.showIcon(IconNames.Happy)
        music.playTone(880, 100)
        music.playTone(1047, 200)
    } else {
        basic.showIcon(IconNames.Sad)
        music.playTone(440, 100)
        music.playTone(330, 200)
    }
    basic.pause(500)
}

// Show scores
function showScores() {
    basic.showString("Y" + score)
    basic.pause(300)
    basic.showString("O" + opponentScore)
    basic.pause(300)
}

// Start a new round
function startRound() {
    roundNumber++
    guessLocked = false
    playerGuess = 440
    opponentGuess = 0

    basic.showString("R" + roundNumber)
    basic.pause(300)

    if (isHost) {
        targetFreq = newTargetFreq()
        radio.sendString("FREQ:TARGET:" + targetFreq)
    }

    basic.pause(500)
    // Play target tone
    basic.showLeds(`
        . . # . .
        . # . # .
        # . . . #
        . # . # .
        . . # . .
    `)
    playTarget()
    basic.clearScreen()

    // Show guessing UI
    showFreqBar(playerGuess)
}

// Evaluate round
function evaluateRound() {
    let playerDiff = Math.abs(playerGuess - targetFreq)
    let opponentDiff = Math.abs(opponentGuess - targetFreq)

    basic.showString("T:" + targetFreq)
    basic.pause(300)

    if (playerDiff <= opponentDiff) {
        showResult(true)
    } else {
        showResult(false)
        opponentScore++
    }

    if (roundNumber >= maxRounds) {
        // Game over
        gameActive = false
        basic.showString("END")
        basic.pause(300)
        showScores()
        if (score > opponentScore) {
            basic.showString("WIN!")
        } else if (score < opponentScore) {
            basic.showString("LOSE")
        } else {
            basic.showString("TIE")
        }
    } else {
        basic.pause(1000)
        startRound()
    }
}

// Startup
basic.showString("FD")
basic.pause(300)

// Button A: host a game
input.onButtonPressed(Button.A, function () {
    if (!gameActive) {
        isHost = true
        gameActive = true
        score = 0
        opponentScore = 0
        roundNumber = 0
        radio.sendString("FREQ:START:" + playerId)
        basic.showString("HOST")
        basic.pause(500)
        startRound()
    } else if (!guessLocked) {
        // Decrease guess
        playerGuess = Math.max(playerGuess - guessStep, guessMin)
        showFreqBar(playerGuess)
        playGuess()
    }
})

// Button B: join game or increase guess
input.onButtonPressed(Button.B, function () {
    if (!gameActive) {
        isHost = false
        radio.sendString("FREQ:JOIN:" + playerId)
        basic.showString("JOIN")
        basic.pause(500)
    } else if (!guessLocked) {
        // Increase guess
        playerGuess = Math.min(playerGuess + guessStep, guessMax)
        showFreqBar(playerGuess)
        playGuess()
    }
})

// Button A+B: lock in guess
input.onButtonPressed(Button.AB, function () {
    if (gameActive && !guessLocked) {
        guessLocked = true
        radio.sendString("FREQ:GUESS:" + playerGuess)
        basic.showIcon(IconNames.Yes)
        music.playTone(playerGuess, 200)
        basic.pause(300)

        if (opponentGuess > 0) {
            evaluateRound()
        }
    } else if (!gameActive) {
        showScores()
    }
})

// Radio handler
radio.onReceivedString(function (receivedString) {
    let parts = receivedString.split(":")
    if (parts.length < 3 || parts[0] != "FREQ") return

    let cmd = parts[1]
    let value = parseInt(parts[2])

    if (cmd == "START" && !gameActive) {
        gameActive = true
        score = 0
        opponentScore = 0
        roundNumber = 0
        basic.showString("GO!")
        basic.pause(300)
    } else if (cmd == "TARGET") {
        targetFreq = value
        playTarget()
        showFreqBar(playerGuess)
    } else if (cmd == "GUESS") {
        opponentGuess = value
        if (guessLocked) {
            evaluateRound()
        }
    } else if (cmd == "JOIN" && isHost) {
        basic.showString("P2")
        basic.pause(300)
        startRound()
    }
})

// Shake: replay target tone
input.onGesture(Gesture.Shake, function () {
    if (gameActive) {
        playTarget()
    }
})
