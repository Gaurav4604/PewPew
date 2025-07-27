export class Bullet {
  public x: number;
  public y: number;
  public width: number = 0;
  public height: number = 0;
  public speed: number = 0;
  private image: HTMLImageElement;
  private loaded: boolean = false;

  private baseWidth: number = 5;
  private baseHeight: number = 10;
  private baseSpeed: number = 7;

  constructor(x: number, y: number, private scale: number) {
    this.x = x;
    this.y = y;

    this.image = new Image();
    this.image.src = "../assets/images/bullet.png";
    this.image.onload = () => {
      this.loaded = true;
      this.baseWidth = this.image.width;
      this.baseHeight = this.image.height;
      this.resize(scale);
      this.x = x - this.width / 2;
    };
  }

  public resize(newScale: number) {
    this.scale = newScale;
    this.width = this.baseWidth * this.scale;
    this.height = this.baseHeight * this.scale;
    this.speed = this.baseSpeed * this.scale;
  }

  update() {
    this.y -= this.speed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.loaded) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }
}
