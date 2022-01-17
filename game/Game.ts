import Board from './Board'
import Piece from './pieces/Piece'
import IPiece from './pieces/set/IPiece'
import JPiece from './pieces/set/JPiece'
import LPiece from './pieces/set/LPiece'
import OPiece from './pieces/set/OPiece'
import SPiece from './pieces/set/SPiece'
import TPiece from './pieces/set/TPiece'
import ZPiece from './pieces/set/ZPiece'
import { PiecePositions } from './pieces/types'
import Position from './Position'

function getRandomPiece(): Piece {
  const anchor = Board.getStartPosition()
  const numPieces = 7
  const randomInt = Math.floor(Math.random() * numPieces)
  switch (randomInt) {
    case 0: return new OPiece(anchor)
    case 1: return new IPiece(anchor)
    case 2: return new SPiece(anchor)
    case 3: return new ZPiece(anchor)
    case 4: return new LPiece(anchor)
    case 5: return new JPiece(anchor)
    case 6: return new TPiece(anchor)
    default: throw Error()
  }
}
export default class Game {
  private board: Board
  // @ts-expect-error
  private piece: Piece
  private nextPiece: Piece
  private gameOver: boolean

  private lines: number
  constructor() {
    this.board = new Board()
    
    this.gameOver = false
    this.lines = 0
    this.nextPiece = getRandomPiece()
    this.updateCurrentPiece()
  }

  public isGameOver(): boolean {
    return this.gameOver
  }

  public updateCurrentPiece(): void {
    this.piece = this.nextPiece
    this.setupNextPiece()

    this.checkIfGameOver()
  }

  private checkIfGameOver() {
    if (this.board.createsCollision(this.piece.getPositions())) {
      this.gameOver = true
    }
  }

  private setupNextPiece(): void {
    let nextPiece = getRandomPiece()
    if (this.piece.equals(nextPiece)) {
      nextPiece = getRandomPiece()
    }

    this.nextPiece = nextPiece
  }

  public canDrop(): boolean {
    return this.board.canDrop(this.piece)
  }

  public drop(): void {
    if (this.isGameOver()) throw Error()
    if (!this.canDrop()) throw Error()

    this.piece.drop()
    if (this.piece.getCanPierce()) {
      if (this.board.createsCollision(this.piece.getPositions())) {
        if (!this.piece.getPierceStarted()) {
          this.piece.setPierceStarted()
        }
      } else {
        if (this.piece.getPierceStarted() && !this.piece.getPierceFinished()) {
          this.piece.setPierceFinished()
        }
      }
    }
  }

  public merge(): void {
    if (this.isGameOver()) throw Error()
    if (this.board.canDrop(this.piece)) throw Error()

    this.board.merge(this.piece)
  }

  public hasLinesToBurn(): boolean {
    return this.board.hasLinesToBurn()
  }

  public burnLines(): void {
    if (this.isGameOver()) throw Error()
    if (!this.hasLinesToBurn()) throw Error()

    this.lines += this.board.countLinesToBurn()
    this.board.burnLines()
  }

  public countLinesToBurn() {
    return this.board.countLinesToBurn()
  }

  public isPositionFilled(x: number, y: number): boolean {
    const position = new Position(x, y)
    return this.board.isPositionFilled(position)
  }

  public getWidth(): number {
    return Board.width
  }

  public getHeight(): number {
    return Board.height
  }

  public getLines(): number {
    return this.lines
  }

  public getBoard(): Board {
    return this.board
  }

  public getPiece(): Piece {
    return this.piece
  }

  public getNextPiece(): Piece {
    return this.nextPiece
  }

  public pieceCanMoveLeft(): boolean {
    return this.board.canMoveLeft(this.piece)
  }

  public pieceCanMoveRight(): boolean {
    return this.board.canMoveRight(this.piece)
  }

  public getPiecePositions(): PiecePositions {
    return this.piece.getPositions()
  }

  public getNextPiecePositions(): PiecePositions {
    return this.nextPiece.getPositions()
  }

  public shiftPieceLeft(): void {
    this.piece.shiftLeft()
  }

  public shiftPieceRight(): void {
    this.piece.shiftRight()
  }

  public rotatePieceRight(): void {
    this.piece.rotateRight()
  }

  public rotatePieceLeft(): void {
    this.piece.rotateLeft()
  }

  public getBrainInput(): number[] {
    const encoded = this.board.getEncoded()

    const piecePosition = this.piece.getPositions()
    for (const position of piecePosition) {
      encoded[position.getX()][position.getY()] = 1
    }
    
    // Game.displayEncoded(encoded)

    const flat = Game.flaten(encoded)
    return flat
  }

  private static displayEncoded(encoded: number[][]): void {
    for (let j = Board.height - 1; j >= 0; j--) {
      let row = ''
      for (let i = 0; i < Board.width; i++) {
        row += encoded[i][j] === 1 ? 'X' : '-'
      }
      console.log(row)
    }
    console.log('          ')
  }

  private static flaten(encoded: number[][]): number[] {
    const flat = []
    for (let i = 0; i < Board.width; i++) {
      for (let j = 0; j < Board.height; j++) {
        flat.push(encoded[i][j])
      }
    }

    return flat
  }
}