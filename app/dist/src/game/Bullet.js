"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bullet = void 0;
class Bullet {
    constructor(x, y, scale) {
        this.scale = scale;
        this.width = 0;
        this.height = 0;
        this.speed = 0;
        this.loaded = false;
        this.baseWidth = 5;
        this.baseHeight = 10;
        this.baseSpeed = 7;
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
    resize(newScale) {
        this.scale = newScale;
        this.width = this.baseWidth * this.scale;
        this.height = this.baseHeight * this.scale;
        this.speed = this.baseSpeed * this.scale;
    }
    update() {
        this.y -= this.speed;
    }
    draw(ctx) {
        if (this.loaded) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}
exports.Bullet = Bullet;
