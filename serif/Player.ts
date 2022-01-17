import Brain from './Brain'
import Session from './Session'

export default class Player {
  private brain: Brain
  private fitness: number | null

  constructor(brain?: Brain) {
    if (brain !== undefined) {
      this.brain = brain
    } else {
      this.brain = new Brain()
    }

    this.fitness = null
  }

  public calculateFitness(): void {
    const session = new Session(this)
    session.simulate()
    const lines = session.getLines()
    const fitness = lines ** 4
    this.fitness = fitness !== 0 ? fitness : 0.01
  }

  public crossover(other: Player): void {
    this.brain.crossover(other.brain)
  }

  public mutate(mutationRate: number): void {
    this.brain.mutate(mutationRate)
  }

  public copy(): Player {
    return new Player(this.brain.copy())
  }

  public getFitness(): number {
    if (this.fitness !== null) {
      return this.fitness
    } else {
      throw Error('Fitness value has not been calculated')
    }
  }

  public predict(input: number[][][]) {
    const output: number[] = this.brain.predict(input)

    let maxValue = -1
    let maxIndex!: number
    for (const [index, value] of output.entries()) {
      if (value > maxValue) {
        maxValue = value
        maxIndex = index
      }
    }

    const shift = (maxIndex % 10) - 5
    const rot = Math.floor(maxIndex / 10)

    return {
      shift,
      rot,
    }
  }
}