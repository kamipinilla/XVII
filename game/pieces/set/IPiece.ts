import Position from '../../Position'
import Piece from '../Piece'
import { NumStates, PieceName, PiecePositions } from '../types'

export default class IPiece extends Piece {
  protected readonly numStates: NumStates
  protected readonly name: PieceName

  constructor(anchor: Position) {
    super(anchor)

    this.name = 'I'
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

    positions[0].decreaseX(2)
    positions[1].decreaseX(1)
    positions[2].increaseX(1)

    return positions
  }

  private getPosition1(): PiecePositions {
    const positions = this.getCopiedAnchor()

    positions[0].increaseY(2)
    positions[1].increaseY(1)
    positions[2].decreaseY(1)

    return positions
  }
}