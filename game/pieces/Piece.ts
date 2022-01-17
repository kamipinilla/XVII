import Position from '../Position'
import { NumStates, PieceName, PiecePositions, State } from './types'

function modulo(n: number, m: number): number {
  return ((n % m) + m) % m
}

export default abstract class Piece {
  protected anchor: Position
  protected state: State
  
  private canPierce: boolean
  private pierceStarted: boolean
  private pierceFinished: boolean
  
  protected readonly abstract numStates: NumStates
  protected readonly abstract name: PieceName
  
  constructor(anchor: Position) {
    this.anchor = anchor
    this.state = 0
    
    this.canPierce = false
    this.pierceStarted = false
    this.pierceFinished = false
  }

  public setCanPierce(): void {
    this.canPierce = true
  }

  public getCanPierce(): boolean {
    return this.canPierce
  }

  public setPierceStarted(): void {
    this.pierceStarted = true
  }

  public setPierceFinished(): void {
    this.pierceFinished = true
  }

  public getPierceStarted(): boolean {
    return this.pierceStarted
  }

  public getPierceFinished(): boolean {
    return this.pierceFinished
  }

  public shiftRight(): void {
    this.anchor.increaseX()
  }

  public shiftLeft(): void {
    this.anchor.decreaseX()
  }

  public drop(): void {
    this.anchor.decreaseY()
  }

  public rotateRight(): void {
    this.state = modulo(this.state + 1, this.numStates) as State
  }

  public rotateLeft(): void {
    this.state = modulo(this.state - 1, this.numStates) as State
  }

  public getName(): PieceName {
    return this.name
  }

  public equals(other: Piece): boolean {
    return this.name === other.name
  }

  public abstract getPositions(): PiecePositions

  protected getCopiedAnchor(): PiecePositions {
    return [
      this.anchor.copy(),
      this.anchor.copy(),
      this.anchor.copy(),
      this.anchor.copy(),
    ]
  }
}