import Board from './Board'
import Piece from './pieces/Piece'
import IPiece from './pieces/set/IPiece'
import JPiece from './pieces/set/JPiece'
import LPiece from './pieces/set/LPiece'
import OPiece from './pieces/set/OPiece'
import SPiece from './pieces/set/SPiece'
import TPiece from './pieces/set/TPiece'
import ZPiece from './pieces/set/ZPiece'
import { PieceName, PiecePositions } from './pieces/types'
import Position from './Position'

function createPiece(pieceName: PieceName): Piece {
  const anchor = Board.getStartPosition()
  switch (pieceName) {
    case 'O': return new OPiece(anchor)
    case 'I': return new IPiece(anchor)
    case 'S': return new SPiece(anchor)
    case 'Z': return new ZPiece(anchor)
    case 'L': return new LPiece(anchor)
    case 'J': return new JPiece(anchor)
    case 'T': return new TPiece(anchor)
  }
}

function getRandomPieceName(): PieceName {
  const pieceNames: PieceName[] = ['O', 'I', 'S', 'Z', 'L', 'J', 'T']
  const randomIndex = Math.floor(Math.random() * pieceNames.length)
  const randomPiece = pieceNames[randomIndex]
  return randomPiece
}

export default class Game {
  private static nameSequence: PieceName[] | null = null

  private static initSequence(): void {
    if (Game.nameSequence !== null) throw Error('Sequence already initialized')

    const sequenceSize = 10000
    const sequence = [getRandomPieceName()]

    for (let i = 0; i < sequenceSize - 1; i++) {
      const currentPiece = sequence[sequence.length - 1]
      let nextPiece = getRandomPieceName()
      if (nextPiece === currentPiece) {
        nextPiece = getRandomPieceName()
      }
      sequence.push(nextPiece)
    }

    Game.nameSequence = sequence
  }

  private sequence: Piece[]
  private position: number

  private board: Board
  private gameOver: boolean

  private lines: number

  constructor() {
    if (Game.nameSequence === null) {
      Game.initSequence()
    }

    this.sequence = []
    for (const pieceName of Game.nameSequence!) {
      const piece = createPiece(pieceName)
      this.sequence.push(piece)
    }
    this.position = 0

    this.board = new Board()
    
    this.gameOver = false
    this.lines = 0
  }

  public isGameOver(): boolean {
    return this.gameOver
  }

  public updateCurrentPiece(): void {
    this.position++

    this.checkIfGameOver()
  }

  private checkIfGameOver() {
    if (this.board.createsCollision(this.getPiece().getPositions())) {
      this.gameOver = true
    }
  }

  public canDrop(): boolean {
    return this.board.canDrop(this.getPiece())
  }

  public drop(): void {
    if (this.isGameOver()) throw Error()
    if (!this.canDrop()) throw Error()

    this.getPiece().drop()
    if (this.getPiece().getCanPierce()) {
      if (this.board.createsCollision(this.getPiece().getPositions())) {
        if (!this.getPiece().getPierceStarted()) {
          this.getPiece().setPierceStarted()
        }
      } else {
        if (this.getPiece().getPierceStarted() && !this.getPiece().getPierceFinished()) {
          this.getPiece().setPierceFinished()
        }
      }
    }
  }

  public merge(): void {
    if (this.isGameOver()) throw Error()
    if (this.board.canDrop(this.getPiece())) throw Error()

    this.board.merge(this.getPiece())
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
    return this.sequence[this.position]
  }

  public getNextPiece(): Piece {
    return this.sequence[this.position + 1]
  }

  public pieceCanMoveLeft(): boolean {
    return this.board.canMoveLeft(this.getPiece())
  }

  public pieceCanMoveRight(): boolean {
    return this.board.canMoveRight(this.getPiece())
  }

  public getPiecePositions(): PiecePositions {
    return this.getPiece().getPositions()
  }

  public getNextPiecePositions(): PiecePositions {
    return this.getNextPiece().getPositions()
  }

  public shiftPieceLeft(): void {
    this.getPiece().shiftLeft()
  }

  public shiftPieceRight(): void {
    this.getPiece().shiftRight()
  }

  public rotatePieceRight(): void {
    this.getPiece().rotateRight()
  }

  public rotatePieceLeft(): void {
    this.getPiece().rotateLeft()
  }

  public getBrainInput(): number[][][] {
    const encoded = this.board.getEncoded()

    const piecePosition = this.getPiece().getPositions()
    for (const position of piecePosition) {
      encoded[position.getX()][position.getY()] = [1]
    }
    
    for (let i = 0; i < 10; i++) {
      const col = []
      for (let j = 0; j < 20; j++) {
        col.push([0])
      }

      if (i < 5) {
        encoded.unshift(col)
      } else {
        encoded.push(col)
      }
    }

    // Game.displayEncoded(encoded)

    return encoded
  }

  private static displayEncoded(encoded: number[][][]): void {
    for (let j = encoded[0].length - 1; j >= 0; j--) {
      let row = ''
      for (let i = 0; i < encoded.length; i++) {
        row += encoded[i][j][0] === 1 ? 'X' : '-'
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