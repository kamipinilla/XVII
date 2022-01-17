import Game from '../game/Game'
import Player from './Player'

export default class Session {
  private static readonly maxLines = 10

  private player: Player
  private game: Game
  
  private score: number
  private tetrisLines: number

  constructor(player: Player) {
    this.player = player
    
    this.score = 0
    this.tetrisLines = 0

    this.game = new Game()
    this.updatePlacement()
  }

  public simulate(): void {
    while (!this.game.isGameOver() && this.game.getLines() < Session.maxLines) {
      this.advance()
    }
  }

  public getScore(): number {
    return this.score
  }

  public getTetrisRate(): number {
    const rate = this.tetrisLines / this.game.getLines()
    return rate
  }

  public getLines(): number {
    return this.game.getLines()
  }

  private addScoreOfLinesToBurn(): void {
    switch (this.game.countLinesToBurn()) {
      case 1: {
        this.score += 40
        break
      }
      case 2: {
        this.score += 100
        break
      }
      case 3: {
        this.score += 300
        break
      }
      case 4: {
        this.score += 1200
        this.tetrisLines += 4
        break
      }
      default: throw Error()
    }
  }

  private advance() {
    if (this.game.isGameOver()) throw Error()

    if (this.game.canDrop()) {
      this.game.drop()
    } else {
      this.game.merge()
      if (this.game.hasLinesToBurn()) {
        this.addScoreOfLinesToBurn()
        this.game.burnLines()
      }
      this.game.updateCurrentPiece()
      this.updatePlacement()
    }
  }

  private updatePlacement() {
    const input = this.game.getBrainInput()
    const { shift, rot } = this.player.predict(input)

    this.rotate(rot)
    this.shiftBy(shift)
  }

  private rotate(rot: number): void {
    for (let i = 0; i < rot; i++) {
      this.game.rotatePieceRight()
    }
  }

  private shiftBy(shift: number): void {
    const absShifts = Math.abs(shift)
    for (let i = 0; i < absShifts; i++) {
      if (shift > 0 && this.game.pieceCanMoveRight()) {
        this.game.shiftPieceRight()
      } if (shift < 0 && this.game.pieceCanMoveLeft()) {
        this.game.shiftPieceLeft()
      }
    }
  }
}