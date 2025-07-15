import { Player } from "./Player";
import { InputHandler } from "./InputHandler";
import { Bullet } from "./Bullet";
import { Enemy } from "./Enemy";

export class GameEngine {
  private player: Player;
  private inputHandler: InputHandler;
  private bullets: Bullet[] = [];
  private enemies: Enemy[] = [];
  private frameId: number | null = null;
  private enemyTimer: number = 0;
  private enemyInterval: number = 1000; // Spawn enemy every 1000ms

  constructor(
    private ctx: CanvasRenderingContext2D,
    private width: number,
    private height: number
  ) {
    this.player = new Player(this.width, this.height);
    this.inputHandler = new InputHandler();

    // Add shooting controls
    window.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        // Space bar
        this.shoot();
      }
    });
  }

  private shoot() {
    const bullet = new Bullet(
      this.player.x + this.player.width / 2 - 2.5,
      this.player.y
    );
    this.bullets.push(bullet);
  }

  private gameLoop(timestamp: number) {
    // Update game objects
    this.player.update(this.inputHandler.keys);
    this.bullets.forEach((bullet, index) => {
      bullet.update();
      if (bullet.y < 0) this.bullets.splice(index, 1);
    });
    this.enemies.forEach((enemy, index) => {
      enemy.update();
      if (enemy.y > this.height) this.enemies.splice(index, 1);

      // Collision detection: bullet and enemy
      this.bullets.forEach((bullet, bulletIndex) => {
        if (
          bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y
        ) {
          this.bullets.splice(bulletIndex, 1);
          this.enemies.splice(index, 1);
        }
      });
    });

    // Spawn enemies
    if (this.enemyTimer > this.enemyInterval) {
      const x = Math.random() * (this.width - 40);
      this.enemies.push(new Enemy(x, -40));
      this.enemyTimer = 0;
    } else {
      this.enemyTimer += 16; // approximately 16ms per frame
    }

    // Draw everything
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.player.draw(this.ctx);
    this.bullets.forEach((bullet) => bullet.draw(this.ctx));
    this.enemies.forEach((enemy) => enemy.draw(this.ctx));

    this.frameId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  public start() {
    this.frameId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  public stop() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }
}
