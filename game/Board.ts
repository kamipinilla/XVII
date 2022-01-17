import Piece from './pieces/Piece'
import { PiecePositions } from './pieces/types'
import Position from './Position'

export default class Board {
  public static readonly width: number = 10
  public static readonly height: number = 20

  // @ts-expect-error
  private board: boolean[][]

  constructor() {
    this.initializeBoard()
  }

  private initializeBoard(): void {
    this.board = []
    for (let i = 0; i < Board.width; i++) {
      const newCol = []
      for (let j = 0; j < Board.height; j++) {
        newCol.push(false)
      }
      this.board.push(newCol)
    }

    // for (let i = 0; i < Board.width; i++) {
    //   this.board[i][0] = true
    // }

    // for (let i = 0; i < 4; i++) {
    //   this.board[i][Board.height - 7] = true
    // }
  }

  private isWithinBounds(piecePositions: PiecePositions): boolean {
    for (const position of piecePositions) {
      const x = position.getX()
      const y = position.getY()
  
      if (x < 0 || x >= Board.width) {
        return false
      }
  
      if (y < 0 || y >= Board.height + 2) {
        return false
      }
    }

    return true
  }

  public createsCollision(piecePositions: PiecePositions): boolean {
    for (const position of piecePositions) {
      if (this.board[position.getX()][position.getY()]) {
        return true
      }
    }

    return false
  }

  public canDrop(piece: Piece): boolean {
    const positions = piece.getPositions()
    const positionsCopy = positions.slice() as PiecePositions

    for (const position of positionsCopy) {
      position.decreaseY()
    }

    if (!this.isWithinBounds(positionsCopy)) {
      return false
    }

    if (this.createsCollision(positionsCopy)) {
      if (!piece.getCanPierce()) {
        return false
      } else {
        if (piece.getPierceFinished()) {
          return false
        }
      }
    }

    return true
  }

  public merge(piece: Piece): void {
    if (this.canDrop(piece)) throw Error()

    const positions = piece.getPositions()
    for (const position of positions) {
      this.board[position.getX()][position.getY()] = true
    }
  }

  private lineIsFull(yPos: number): boolean {
    for (let i = 0; i < Board.width; i++) {
      if (!this.board[i][yPos]) {
        return false
      }
    }

    return true
  }

  public hasLinesToBurn(): boolean {
    return this.countLinesToBurn() !== 0
  }

  public countLinesToBurn(): number {
    let count = 0

    for (let j = 0; j < Board.height; j++) {
      if (this.lineIsFull(j)) {
        count++
      }
    }

    return count
  }


  private burnLine(yPos: number): void {
    for (let j = yPos; j < Board.height - 1; j++) {
      for (let i = 0; i < Board.width; i++) {
        this.board[i][j] = this.board[i][j + 1]
      }
    }

    const topRow = Board.height - 1
    for (let i = 0; i < Board.width; i++) {
      this.board[i][topRow] = false
    }
  }

  public burnLines(): void {
    if (!this.hasLinesToBurn()) throw Error()

    let j = 0
    while (j < Board.height) {
      if (this.lineIsFull(j)) {
        this.burnLine(j)
      } else {
        j++
      }
    }
  }

  public canMoveLeft(piece: Piece): boolean {
    const positions = piece.getPositions()
    const positionsCopy = positions.slice() as PiecePositions

    for (const position of positionsCopy) {
      position.decreaseX()
    }

    if (!this.isWithinBounds(positionsCopy) || this.createsCollision(positionsCopy)) {
      return false
    }

    return true
  }

  public canMoveRight(piece: Piece): boolean {
    const positions = piece.getPositions()
    const positionsCopy = positions.slice() as PiecePositions

    for (const position of positionsCopy) {
      position.increaseX()
    }

    if (!this.isWithinBounds(positionsCopy) || this.createsCollision(positionsCopy)) {
      return false
    }

    return true
  }

  public isPositionFilled(position: Position): boolean {
    return this.board[position.getX()][position.getY()]
  }

  public static getStartPosition(): Position {
    return new Position(5, Board.height - 1)
  }

  public getEncoded(): number[][][] {
    const encoded: number[][][] = []
    for (let i = 0; i < Board.width; i++) {
      const col: number[][] = []
      for (let j = 0; j < Board.height; j++) {
        const value = this.isPositionFilled(new Position(i, j)) ? [1] : [0]
        col.push(value)
      }
      encoded.push(col)
    }

    return encoded
  }
}