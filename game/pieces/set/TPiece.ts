import Position from '../../Position'
import Piece from '../Piece'
import { NumStates, PieceName, PiecePositions } from '../types'

export default class TPiece extends Piece {
  protected readonly numStates: NumStates
  protected readonly name: PieceName

  constructor(anchor: Position) {
    super(anchor)

    this.name = 'T'
    this.numStates = 4
  }

  public getPositions(): PiecePositions {
    switch (this.state) {
      case 0: {
        return this.getPosition0()
      }
      case 1: {
        return this.getPosition1()
      }
      case 2: {
        return this.getPosition2()
      }
      case 3: {
        return this.getPosition3()
      }
      default: {
        throw Error()
      }
    }
  }

  private getPosition0(): PiecePositions {
    const positions = this.getCopiedAnchor()

    positions[0].decreaseX()
    positions[1].decreaseY()
    positions[2].increaseX()

    return positions
  }

  private getPosition1(): PiecePositions {
    const positions = this.getCopiedAnchor()

    positions[0].increaseY()
    positions[1].decreaseX()
    positions[2].decreaseY()

    return positions
  }

  private getPosition2(): PiecePositions {
    const positions = this.getCopiedAnchor()

    positions[0].increaseX()
    positions[1].increaseY()
    positions[2].decreaseX()

    return positions
  }

  private getPosition3(): PiecePositions {
    const positions = this.getCopiedAnchor()

    positions[0].decreaseY()
    positions[1].increaseX()
    positions[2].increaseY()

    return positions
  }
}