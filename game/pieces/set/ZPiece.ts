import Position from '../../Position'
import { NumStates, PieceName, PiecePositions } from '../types'
import Piece from '../Piece'

export default class ZPiece extends Piece {
  protected readonly numStates: NumStates
  protected readonly name: PieceName

  constructor(anchor: Position) {
    super(anchor)

    this.name = 'Z'
    this.numStates = 2
  }

  public getPositions(): PiecePositions {
    switch (this.state) {
      case 0: {
        return this.getPosition0()
      }
      case 1: {
        return this.getPosition1()
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
    positions[2].decreaseY()

    return positions
  }

  private getPosition1(): PiecePositions {
    const positions = this.getCopiedAnchor()

    positions[0].decreaseY()

    positions[1].increaseX()

    positions[2].increaseX()
    positions[2].increaseY()

    return positions
  }
}