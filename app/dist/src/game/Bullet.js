"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bullet = void 0;
class Bullet {
    constructor(x, y) {
        this.width = 5;
        this.height = 10;
        this.speed = 7;
        this.x = x;
        this.y = y;
    }
    update() {
        this.y -= this.speed;
    }
    draw(ctx) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
exports.Bullet = Bullet;
