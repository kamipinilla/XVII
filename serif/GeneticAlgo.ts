import { setBackend } from '@tensorflow/tfjs'
import Player from './Player'

export default class GeneticAlgo {
  private static readonly popSize = 100

  private static readonly mutationRate = 0.01
  private static readonly bitMutationRate = 0.01
  
  private static readonly crossoverRate = 0.01
  private static readonly bitCrossoverRate = 0.01

  // @ts-expect-error
  private players: Player[]

  public getPlayers(): Player[] {
    return this.players
  }

  constructor() {
    setBackend('cpu')
    this.initializePop()
  }

  private initializePop() {
    this.players = []
    for (let i = 0; i < GeneticAlgo.popSize; i++) {
      this.players.push(new Player())
    }
  }

  public nextGeneration() {
    this.calculateFitness()
    const newPlayers = this.getNewPlayers()
    this.players = newPlayers
  }

  public calculateFitness(): void {
    for (const player of this.players) {
      player.calculateFitness()
    }
  }

  private getNewPlayers(): Player[] {
    const newPlayers = []
    for (let i = 0; i < GeneticAlgo.popSize; i++) {
      const newPlayer = this.getNewPlayer()
      newPlayers.push(newPlayer)
    }

    return newPlayers
  }

  private getNewPlayer(): Player {
    const newPlayer = this.selectAndCopyPlayer()

    if (Math.random() < GeneticAlgo.crossoverRate) {
      const otherPlayer = this.selectAndCopyPlayer()
      newPlayer.crossover(otherPlayer, GeneticAlgo.bitCrossoverRate)
    }

    if (Math.random() < GeneticAlgo.mutationRate) {
      newPlayer.mutate(GeneticAlgo.bitMutationRate)
    }
    return newPlayer
  }

  // private selectAndCopyPlayer(): Player {
  //   let index = 0
  //   let fitnessSum = 0
  //   for (const player of this.players) {
  //     fitnessSum += player.getFitness()
  //   }

  //   let r = Math.random() * fitnessSum
  //   while (r > 0) {
  //     r = r - this.players[index].getFitness()
  //     index++
  //   }
  //   index--

  //   const player = this.players[index]
  //   return player.copy()
  // }

  private selectAndCopyPlayer(): Player {
    let fitnessSum = 0
    for (const player of this.players) {
      fitnessSum += player.getFitness()
    }

    const rand = Math.random() * fitnessSum
    let runningSum = 0
    for (const player of this.players) {
      runningSum += player.getFitness()
      if (runningSum > rand) {
        return player.copy()
      }
    }

    throw Error('This point should be unreachable')
  }
}