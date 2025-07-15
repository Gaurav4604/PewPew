"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enemy = void 0;
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40; // Set a fixed width
        this.height = 40; // Set a fixed height
    }
    update() {
        this.y += 1; // Move down
    }
    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
exports.Enemy = Enemy;
