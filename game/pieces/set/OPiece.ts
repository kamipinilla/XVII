import Position from '../../Position'
import Piece from '../Piece'
import { NumStates, PieceName, PiecePositions } from '../types'

export default class OPiece extends Piece {
  protected readonly numStates: NumStates
  protected readonly name: PieceName

  constructor(anchor: Position) {
    super(anchor)

    this.name = 'O'
    this.numStates = 1
  }

  public getPositions(): PiecePositions {
    switch (this.state) {
      case 0: {
        return this.getPosition0()
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

    positions[2].decreaseX()
    positions[2].decreaseY()

    return positions
  }
}