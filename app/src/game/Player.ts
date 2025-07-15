export class Player {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public speed: number;

  constructor(private canvasWidth: number, private canvasHeight: number) {
    this.width = 50; // Set a fixed width
    this.height = 50; // Set a fixed height
    this.x = (this.canvasWidth - this.width) / 2;
    this.y = this.canvasHeight - this.height - 20;
    this.speed = 5;
  }

  update(input: Set<string>) {
    if (input.has("ArrowLeft") && this.x > 0) {
      this.x -= this.speed;
    }
    if (input.has("ArrowRight") && this.x < this.canvasWidth - this.width) {
      this.x += this.speed;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
