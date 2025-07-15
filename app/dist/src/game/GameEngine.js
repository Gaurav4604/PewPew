"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameEngine = void 0;
const Player_1 = require("./Player");
const InputHandler_1 = require("./InputHandler");
const Bullet_1 = require("./Bullet");
const Enemy_1 = require("./Enemy");
class GameEngine {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.bullets = [];
        this.enemies = [];
        this.frameId = null;
        this.enemyTimer = 0;
        this.enemyInterval = 1000; // Spawn enemy every 1000ms
        this.player = new Player_1.Player(this.width, this.height);
        this.inputHandler = new InputHandler_1.InputHandler();
        // Add shooting controls
        window.addEventListener("keydown", (e) => {
            if (e.key === " ") {
                // Space bar
                this.shoot();
            }
        });
    }
    shoot() {
        const bullet = new Bullet_1.Bullet(this.player.x + this.player.width / 2 - 2.5, this.player.y);
        this.bullets.push(bullet);
    }
    gameLoop(timestamp) {
        // Update game objects
        this.player.update(this.inputHandler.keys);
        this.bullets.forEach((bullet, index) => {
            bullet.update();
            if (bullet.y < 0)
                this.bullets.splice(index, 1);
        });
        this.enemies.forEach((enemy, index) => {
            enemy.update();
            if (enemy.y > this.height)
                this.enemies.splice(index, 1);
            // Collision detection: bullet and enemy
            this.bullets.forEach((bullet, bulletIndex) => {
                if (bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y) {
                    this.bullets.splice(bulletIndex, 1);
                    this.enemies.splice(index, 1);
                }
            });
        });
        // Spawn enemies
        if (this.enemyTimer > this.enemyInterval) {
            const x = Math.random() * (this.width - 40);
            this.enemies.push(new Enemy_1.Enemy(x, -40));
            this.enemyTimer = 0;
        }
        else {
            this.enemyTimer += 16; // approximately 16ms per frame
        }
        // Draw everything
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.player.draw(this.ctx);
        this.bullets.forEach((bullet) => bullet.draw(this.ctx));
        this.enemies.forEach((enemy) => enemy.draw(this.ctx));
        this.frameId = requestAnimationFrame(this.gameLoop.bind(this));
    }
    start() {
        this.frameId = requestAnimationFrame(this.gameLoop.bind(this));
    }
    stop() {
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
        }
    }
}
exports.GameEngine = GameEngine;
