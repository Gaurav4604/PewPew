"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enemy = void 0;
class Enemy {
    constructor(x, y, scale) {
        this.scale = scale;
        this.width = 0;
        this.height = 0;
        this.speed = 0;
        this.loaded = false;
        this.baseWidth = 40;
        this.baseHeight = 40;
        this.baseSpeed = 1;
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
    resize(newScale) {
        this.scale = newScale;
        this.width = this.baseWidth * this.scale;
        this.height = this.baseHeight * this.scale;
        this.speed = this.baseSpeed * this.scale;
    }
    update() {
        this.y += this.speed;
    }
    draw(ctx) {
        if (this.loaded) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}
exports.Enemy = Enemy;
