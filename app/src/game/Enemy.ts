export class Enemy {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = 40; // Set a fixed width
    this.height = 40; // Set a fixed height
  }

  update() {
    this.y += 1; // Move down
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
