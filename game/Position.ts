export default class Position {
  private x: number
  private y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  public copy(): Position {
    return new Position(this.x, this.y)
  }

  public increaseX(amount: number = 1): void {
    this.x += amount
  }

  public decreaseX(amount: number = 1): void {
    this.x -= amount
  }

  public increaseY(amount: number = 1): void {
    this.y += amount
  }

  public decreaseY(amount: number = 1): void {
    this.y -= amount
  }

  public getX(): number {
    return this.x
  }

  public getY(): number {
    return this.y
  }

  public toString(): string {
    return `{${this.x}, ${this.y}}`
  }
}
