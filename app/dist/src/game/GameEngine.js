"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameEngine = void 0;
const Player_1 = require("./Player");
const InputHandler_1 = require("./InputHandler");
const Bullet_1 = require("./Bullet");
const Enemy_1 = require("./Enemy");
// Define the possible states of the game
var GameState;
(function (GameState) {
    GameState[GameState["START_SCREEN"] = 0] = "START_SCREEN";
    GameState[GameState["PLAYING"] = 1] = "PLAYING";
    GameState[GameState["GAME_OVER"] = 2] = "GAME_OVER";
    GameState[GameState["WIN"] = 3] = "WIN";
})(GameState || (GameState = {}));
class GameEngine {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.voiceCommands = new Set();
        this.bullets = [];
        this.enemies = [];
        this.frameId = null;
        this.enemyTimer = 0;
        this.enemyInterval = 2000;
        this.enemiesSpawned = 0;
        this.maxEnemies = 10;
        this.lives = 3;
        this.score = 0;
        this.gameState = GameState.START_SCREEN;
        // Add scale and base dimension properties
        this.scale = 1;
        this.baseWidth = 800;
        this.baseHeight = 600;
        this.calculateScale();
        this.player = new Player_1.Player(this.width, this.height, this.scale);
        this.inputHandler = new InputHandler_1.InputHandler();
        this.lifeIcon = new Image();
        this.lifeIcon.src = "../assets/images/ship.png";
        window.electronAPI.onVoiceCommand((command) => this.handleVoiceCommand(command));
        window.addEventListener("keydown", (e) => {
            if (this.gameState === GameState.PLAYING && e.key === " ")
                this.shoot();
        });
    }
    // New method to calculate the scale factor
    calculateScale() {
        this.scale = Math.min(this.width / this.baseWidth, this.height / this.baseHeight);
    }
    // New method to handle window resizing
    resize(newWidth, newHeight) {
        this.width = newWidth;
        this.height = newHeight;
        this.calculateScale();
        // Notify all game objects of the resize
        this.player.resize(this.width, this.height, this.scale);
        this.enemies.forEach((enemy) => enemy.resize(this.scale));
        this.bullets.forEach((bullet) => bullet.resize(this.scale));
    }
    handleVoiceCommand(command) {
        if (this.gameState !== GameState.PLAYING)
            return;
        if (command === "go left" || command === "go right") {
            this.voiceCommands.add(command);
            setTimeout(() => this.voiceCommands.delete(command), 200);
        }
        else if (command === "single fire") {
            this.shoot();
        }
    }
    shoot() {
        this.bullets.push(new Bullet_1.Bullet(this.player.x + this.player.width / 2, this.player.y, this.scale));
    }
    gameLoop() {
        if (this.gameState === GameState.PLAYING)
            this.updateGame();
        this.drawGame();
        this.frameId = requestAnimationFrame(this.gameLoop.bind(this));
    }
    updateGame() {
        this.player.update(this.inputHandler.keys, this.voiceCommands);
        this.bullets.forEach((bullet, index) => {
            bullet.update();
            if (bullet.y + bullet.height < 0)
                this.bullets.splice(index, 1);
        });
        this.enemies.forEach((enemy, enemyIndex) => {
            enemy.update();
            if (enemy.y > this.height) {
                this.enemies.splice(enemyIndex, 1);
                this.lives--;
                if (this.lives <= 0)
                    this.gameState = GameState.GAME_OVER;
            }
            if (this.player.x < enemy.x + enemy.width &&
                this.player.x + this.player.width > enemy.x &&
                this.player.y < enemy.y + enemy.height &&
                this.player.y + this.player.height > enemy.y) {
                this.enemies.splice(enemyIndex, 1);
                this.lives--;
                if (this.lives <= 0)
                    this.gameState = GameState.GAME_OVER;
            }
            this.bullets.forEach((bullet, bulletIndex) => {
                if (bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y) {
                    this.bullets.splice(bulletIndex, 1);
                    this.enemies.splice(enemyIndex, 1);
                    this.score += 100;
                    if (this.enemies.length === 0 &&
                        this.enemiesSpawned === this.maxEnemies) {
                        this.gameState = GameState.WIN;
                    }
                }
            });
        });
        if (this.enemyTimer > this.enemyInterval &&
            this.enemiesSpawned < this.maxEnemies) {
            const spawnRange = 300 * this.scale;
            const minX = Math.max(0, this.player.x - spawnRange / 2);
            const maxX = Math.min(this.width - 40 * this.scale, this.player.x + spawnRange / 2);
            const x = Math.random() * (maxX - minX) + minX;
            this.enemies.push(new Enemy_1.Enemy(x, -40 * this.scale, this.scale));
            this.enemiesSpawned++;
            this.enemyTimer = 0;
            this.enemyInterval = Math.random() * (5000 - 4000) + 4000;
        }
        else {
            this.enemyTimer += 16;
        }
    }
    drawGame() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        switch (this.gameState) {
            case GameState.START_SCREEN:
                this.drawTextScreen("Space Shooter", "Click to Start");
                break;
            case GameState.PLAYING:
                this.player.draw(this.ctx);
                this.bullets.forEach((bullet) => bullet.draw(this.ctx));
                this.enemies.forEach((enemy) => enemy.draw(this.ctx));
                this.drawUI();
                break;
            case GameState.GAME_OVER:
                this.drawTextScreen("Game Over", "Click to Restart");
                break;
            case GameState.WIN:
                this.drawTextScreen("You Win!", "");
                break;
        }
    }
    drawTextScreen(title, subtitle) {
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.font = `${40 * this.scale}px 'Nulshock'`;
        this.ctx.fillText(title, this.width / 2, this.height / 2 - 20 * this.scale);
        if (subtitle) {
            this.ctx.font = `${20 * this.scale}px 'Nulshock'`;
            this.ctx.fillText(subtitle, this.width / 2, this.height / 2 + 20 * this.scale);
        }
    }
    drawUI() {
        // Draw Lives
        const lifeSize = 30 * this.scale;
        for (let i = 0; i < this.lives; i++) {
            this.ctx.drawImage(this.lifeIcon, 10 + i * (lifeSize + 10), 10, lifeSize, lifeSize);
        }
        // Common text style for UI
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "right";
        this.ctx.font = `${20 * this.scale}px 'Nulshock'`;
        // Draw Score
        this.ctx.fillText(`Score: ${this.score}`, this.width - 10, 30 * this.scale);
        // Draw Enemies Left
        const enemiesDestroyed = this.score / 100;
        this.ctx.fillText(`Enemies Left: ${this.maxEnemies - enemiesDestroyed}/${this.maxEnemies}`, this.width - 10, 55 * this.scale);
        // Draw Timer
        if (this.enemiesSpawned < this.maxEnemies) {
            const timeRemaining = (this.enemyInterval - this.enemyTimer) / 1000;
            this.ctx.textAlign = "center";
            this.ctx.font = `${16 * this.scale}px 'Nulshock'`;
            this.ctx.fillText(`Next Enemy: ${timeRemaining.toFixed(1)}s`, this.width / 2, 30 * this.scale);
        }
    }
    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.gameLoop.bind(this));
        }
    }
    stop() {
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
    }
    handleClick() {
        if (this.gameState === GameState.START_SCREEN) {
            this.gameState = GameState.PLAYING;
        }
        else if (this.gameState === GameState.GAME_OVER) {
            this.restartGame();
        }
    }
    restartGame() {
        this.lives = 3;
        this.score = 0;
        this.enemies = [];
        this.bullets = [];
        this.enemiesSpawned = 0;
        this.enemyTimer = 0;
        this.enemyInterval = 2000;
        this.gameState = GameState.PLAYING;
    }
}
exports.GameEngine = GameEngine;
