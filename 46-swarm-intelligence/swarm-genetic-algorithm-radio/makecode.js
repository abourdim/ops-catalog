/**
 * Swarm Genetic Algorithm Radio - micro:bit MakeCode
 * Distributed genetic algorithm optimizing radio parameters
 * LED shows fitness level as bar graph
 */

const GROUP = 51
let myId = control.deviceSerialNumber() & 0xFF
let population: { genes: number[], fitness: number }[] = []
let bestGenes: number[] = [0, 0, 0, 0]
let bestFitness = 0
let generation = 0
const GENE_LEN = 4
const POP_SIZE = 6
const MUTATION_RATE = 0.15

radio.setGroup(GROUP)
radio.setTransmitPower(7)

function evalFitness(genes: number[]): number {
    let f = 0
    f += (genes[0] + genes[1]) / 30
    f += Math.abs(genes[2] - genes[3]) / 15
    f -= Math.abs(genes[0] - 8) / 20
    return Math.max(f, 0)
}

function randomGenes(): number[] {
    return [Math.randomRange(0, 15), Math.randomRange(0, 15),
            Math.randomRange(0, 15), Math.randomRange(0, 15)]
}

function crossover(p1: number[], p2: number[]): number[] {
    let xp = Math.randomRange(1, GENE_LEN - 1)
    let child: number[] = []
    for (let i = 0; i < GENE_LEN; i++)
        child.push(i < xp ? p1[i] : p2[i])
    return child
}

function mutate(genes: number[]) {
    for (let i = 0; i < genes.length; i++) {
        if (Math.random() < MUTATION_RATE)
            genes[i] = Math.randomRange(0, 15)
    }
}

function initPopulation() {
    population = []
    for (let i = 0; i < POP_SIZE; i++) {
        let g = randomGenes()
        population.push({ genes: g, fitness: evalFitness(g) })
    }
    updateBest()
}

function updateBest() {
    for (let ind of population) {
        if (ind.fitness > bestFitness) {
            bestFitness = ind.fitness
            bestGenes = ind.genes.slice()
        }
    }
}

function evolveStep() {
    let a = Math.randomRange(0, population.length - 1)
    let b = Math.randomRange(0, population.length - 1)
    let p1 = population[a].fitness > population[b].fitness ? population[a] : population[b]
    let c = Math.randomRange(0, population.length - 1)
    let d = Math.randomRange(0, population.length - 1)
    let p2 = population[c].fitness > population[d].fitness ? population[c] : population[d]

    let child = crossover(p1.genes, p2.genes)
    mutate(child)
    let cf = evalFitness(child)

    // Replace worst
    let worst = 0
    for (let i = 1; i < population.length; i++)
        if (population[i].fitness < population[worst].fitness) worst = i
    if (cf > population[worst].fitness) {
        population[worst] = { genes: child, fitness: cf }
    }
    generation++
    updateBest()
}

function displayFitness() {
    basic.clearScreen()
    let bars = Math.min(Math.floor(bestFitness * 2.5), 5)
    for (let col = 0; col < bars; col++) {
        for (let row = 0; row < 5; row++) {
            led.plot(col, row)
        }
    }
}

function shareBest() {
    let msg = "G:" + myId + ":" + bestGenes.join(",") + ":" +
        Math.roundWithPrecision(bestFitness, 3) + ":" + generation
    radio.sendString(msg)
}

radio.onReceivedString(function (msg: string) {
    let parts = msg.split(":")
    if (parts.length < 5 || parts[0] !== "G") return
    let genes = parts[2].split(",").map(s => parseInt(s))
    let fitness = parseFloat(parts[3])

    if (genes.length === GENE_LEN && population.length < POP_SIZE + 4) {
        let f = evalFitness(genes)
        population.push({ genes: genes, fitness: f })
        if (f > bestFitness) { bestFitness = f; bestGenes = genes.slice() }
    }
})

input.onButtonPressed(Button.A, function () {
    initPopulation()
    basic.showString("G")
    basic.pause(300)
})

input.onButtonPressed(Button.B, function () {
    serial.writeLine("{\"id\":" + myId + ",\"gen\":" + generation +
        ",\"best\":" + Math.roundWithPrecision(bestFitness, 3) +
        ",\"genes\":[" + bestGenes.join(",") + "]}")
})

initPopulation()

basic.forever(function () {
    for (let i = 0; i < 5; i++) evolveStep()
    if (generation % 20 === 0) shareBest()
    displayFitness()
    basic.pause(300)
})
