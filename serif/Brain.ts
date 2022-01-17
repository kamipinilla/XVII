import { layers, sequential, Sequential, tensor, tensor2d, tidy } from '@tensorflow/tfjs'
import Board from '../game/Board'
import randomNormal from 'random-normal'

export default class Brain {
  private static readonly inputNodes = 10 * Board.height
  private static readonly outputNodes = 2

  private model: Sequential

  constructor(model?: Sequential) {
    if (model !== undefined) {
      this.model = model
    } else {
      this.model = Brain.createModel()
    }
  }

  crossover(other: Brain): void {
    tidy(() => {
      const weights = this.model.getWeights()
      const otherWeights = other.model.getWeights()
      const newWeights = []

      for (let i = 0; i < weights.length; i++) {
        const currentWeights = weights[i]
        const values = currentWeights.dataSync().slice()

        const otherTensor = otherWeights[i]
        const otherValues = otherTensor.dataSync().slice()

        const newValues = []

        for (let j = 0; j < values.length; j++) {
          const newValue = Math.random() < 0.5 ? values[j] : otherValues[j]
          newValues.push(newValue)
        }

        const newTensor = tensor(newValues, currentWeights.shape)
        newWeights.push(newTensor)
      }
      this.model.setWeights(newWeights)
    })
  }

  mutate(mutationRate: number): void {
    tidy(() => {
      const weights = this.model.getWeights()
      const mutatedWeights = []
      for (let i = 0; i < weights.length; i++) {
        const currentWeights = weights[i]
        const shape = weights[i].shape
        const values = currentWeights.dataSync().slice()
        for (let j = 0; j < values.length; j++) {
          if (Math.random() < mutationRate) {
            let w = values[j]
            values[j] = w + randomNormal()
          }
        }
        const newTensor = tensor(values, shape)
        mutatedWeights[i] = newTensor
      }
      this.model.setWeights(mutatedWeights)
    })
  }

  public copy(): Brain {
    return new Brain(this.model)
  }

  public predict(inputs: number[]): number[] {
    return tidy(() => {
      const xs = tensor2d([inputs])
      const ys = this.model.predict(xs)
      // @ts-expect-error
      const outputs = ys.dataSync()
      return outputs
    })
  }

  private static createModel(): Sequential {
    const model = sequential()
    const firstHidden = layers.dense({
      units: 50,
      inputShape: [Brain.inputNodes],
      activation: 'relu'
    })
    model.add(firstHidden)
    const secondHidden = layers.dense({
      units: 10,
      activation: 'relu'
    })
    model.add(secondHidden)
    const output = layers.dense({
      units: Brain.outputNodes,
      activation: 'sigmoid'
    })
    model.add(output)
    return model
  }
}