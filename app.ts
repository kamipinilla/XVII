import GeneticAlgo from './serif/GeneticAlgo'
import Player from './serif/Player'

function main() {
  const geneticAlgo = new GeneticAlgo()
  for (let i = 0; i < 100; i++) {
    if (i % 10 === 0) {
      console.log(i)
    }
    geneticAlgo.nextGeneration()
  }

  const bestPlayer = getBestPlayer(geneticAlgo)
  console.log(bestPlayer.getFitness())
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