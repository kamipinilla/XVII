import GeneticAlgo from './serif/GeneticAlgo'
import Player from './serif/Player'

function main() {
  const geneticAlgo = new GeneticAlgo()

  const totalGen = 50000
  const logEvery = 100

  for (let i = 0; i < totalGen; i++) {
    geneticAlgo.nextGeneration()
    if (i % logEvery === 0) {
      const bestPlayer = getBestPlayer(geneticAlgo)
      console.log(i, bestPlayer.getFitness())
    }
  }
}

function getBestPlayer(geneticAlgo: GeneticAlgo) {
  geneticAlgo.calculateFitness()

  let bestFitness = -1
  let bestPlayer!: Player
  for (const player of geneticAlgo.getPlayers()) {
    if (player.getFitness() > bestFitness) {
      bestFitness = player.getFitness()
      bestPlayer = player
    }
  }

  return bestPlayer
}

main()