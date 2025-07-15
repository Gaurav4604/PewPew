"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.width = 50; // Set a fixed width
        this.height = 50; // Set a fixed height
        this.x = (this.canvasWidth - this.width) / 2;
        this.y = this.canvasHeight - this.height - 20;
        this.speed = 5;
    }
    update(input) {
        if (input.has("ArrowLeft") && this.x > 0) {
            this.x -= this.speed;
        }
        if (input.has("ArrowRight") && this.x < this.canvasWidth - this.width) {
            this.x += this.speed;
        }
    }
    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
exports.Player = Player;
