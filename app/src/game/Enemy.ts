export class Enemy {
  public x: number;
  public y: number;
  public width: number = 0;
  public height: number = 0;
  private speed: number = 0;
  private image: HTMLImageElement;
  private loaded: boolean = false;

  private baseWidth: number = 40;
  private baseHeight: number = 40;
  private baseSpeed: number = 1;

  constructor(x: number, y: number, private scale: number) {
    this.x = x;
    this.y = y;

    this.image = new Image();
    this.image.src = "../assets/images/obstacle.png";
    this.image.onload = () => {
      this.loaded = true;
      this.baseWidth = this.image.width * 0.5;
      this.baseHeight = this.image.height * 0.5;
      this.resize(scale);
    };
  }

  public resize(newScale: number) {
    this.scale = newScale;
    this.width = this.baseWidth * this.scale;
    this.height = this.baseHeight * this.scale;
    this.speed = this.baseSpeed * this.scale;
  }

  update() {
    this.y += this.speed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.loaded) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }
}
