export class Player {
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;
  public speed: number = 0;
  private image: HTMLImageElement;
  private loaded: boolean = false;

  private baseWidth: number = 50;
  private baseHeight: number = 50;
  private baseSpeed: number = 5;

  constructor(
    private canvasWidth: number,
    private canvasHeight: number,
    private scale: number
  ) {
    this.image = new Image();
    this.image.src = "../assets/images/ship.png";
    this.image.onload = () => {
      this.loaded = true;
      this.baseWidth = this.image.width * 0.8;
      this.baseHeight = this.image.height * 0.8;
      this.resize(canvasWidth, canvasHeight, scale);
    };
  }

  public resize(
    newCanvasWidth: number,
    newCanvasHeight: number,
    newScale: number
  ) {
    this.canvasWidth = newCanvasWidth;
    this.canvasHeight = newCanvasHeight;
    this.scale = newScale;

    this.width = this.baseWidth * this.scale;
    this.height = this.baseHeight * this.scale;
    this.speed = this.baseSpeed * this.scale;

    this.x = (this.canvasWidth - this.width) / 2;
    this.y = this.canvasHeight - this.height - 20 * this.scale;
  }

  update(keyboardInput: Set<string>, voiceInput: Set<string>) {
    if (keyboardInput.has("ArrowLeft") && this.x > 0) {
      this.x -= this.speed;
    } else if (
      keyboardInput.has("ArrowRight") &&
      this.x < this.canvasWidth - this.width
    ) {
      this.x += this.speed;
    } else if (voiceInput.has("go left") && this.x > 0) {
      this.x -= this.speed;
    } else if (
      voiceInput.has("go right") &&
      this.x < this.canvasWidth - this.width
    ) {
      this.x += this.speed;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.loaded) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }
}
