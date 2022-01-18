import { layers, reshape, sequential, Sequential, tensor, tensor2d, tensor3d, tensor4d, tidy } from '@tensorflow/tfjs'
import Board from '../game/Board'
import randomNormal from 'random-normal'

export default class Brain {
  private model: Sequential

  constructor(model?: Sequential) {
    if (model !== undefined) {
      this.model = model
    } else {
      this.model = Brain.createModel()
    }
  }

  crossover(other: Brain, bitCrossoverRate: number): void {
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
          const newValue = Math.random() < (1 - bitCrossoverRate) ? values[j] : otherValues[j]
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

  public predict(inputs: number[][][]): number[] {
    return tidy(() => {
      const xs = tensor4d([inputs])
      const ys = this.model.predict(xs)
      // @ts-expect-error
      const outputs = ys.dataSync()
      return outputs
    })
  }

  private static createModel(): Sequential {
    // const model = sequential()
    // const firstHidden = layers.dense({
    //   units: 50,
    //   inputShape: [Brain.inputNodes],
    //   activation: 'relu'
    // })
    // model.add(firstHidden)
    // const secondHidden = layers.dense({
    //   units: 10,
    //   activation: 'relu'
    // })
    // model.add(secondHidden)
    // const output = layers.dense({
    //   units: Brain.outputNodes,
    //   activation: 'sigmoid'
    // })
    // model.add(output)
    // return model

    const model = sequential();
  
    const IMAGE_WIDTH = 20;
    const IMAGE_HEIGHT = 20;
    const IMAGE_CHANNELS = 1;  
    
    // In the first layer of our convolutional neural network we have 
    // to specify the input shape. Then we specify some parameters for 
    // the convolution operation that takes place in this layer.
    model.add(layers.conv2d({
      inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
      kernelSize: 5,
      filters: 8,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'varianceScaling'
    }));

    // The MaxPooling layer acts as a sort of downsampling using max values
    // in a region instead of averaging.  
    model.add(layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));
    
    // Repeat another conv2d + maxPooling stack. 
    // Note that we have more filters in the convolution.
    
    model.add(layers.conv2d({
      kernelSize: 5,
      filters: 16,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'varianceScaling'
    }));
    model.add(layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));
    
    // Now we flatten the output from the 2D filters into a 1D vector to prepare
    // it for input into our last layer. This is common practice when feeding
    // higher dimensional data to a final classification output layer.
    model.add(layers.flatten());

    // Our last layer is a dense layer which has 10 output units, one for each
    // output class (i.e. 0, 1, 2, 3, 4, 5, 6, 7, 8, 9).

    const NUM_OUTPUT_CLASSES = 40;
    model.add(layers.dense({
      units: NUM_OUTPUT_CLASSES,
      kernelInitializer: 'varianceScaling',
      activation: 'softmax'
    }));

    return model
  }
}