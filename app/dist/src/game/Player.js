"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(canvasWidth, canvasHeight, scale) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.scale = scale;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.speed = 0;
        this.loaded = false;
        this.baseWidth = 50;
        this.baseHeight = 50;
        this.baseSpeed = 5;
        this.image = new Image();
        this.image.src = "../assets/images/ship.png";
        this.image.onload = () => {
            this.loaded = true;
            this.baseWidth = this.image.width * 0.8;
            this.baseHeight = this.image.height * 0.8;
            this.resize(canvasWidth, canvasHeight, scale);
        };
    }
    resize(newCanvasWidth, newCanvasHeight, newScale) {
        this.canvasWidth = newCanvasWidth;
        this.canvasHeight = newCanvasHeight;
        this.scale = newScale;
        this.width = this.baseWidth * this.scale;
        this.height = this.baseHeight * this.scale;
        this.speed = this.baseSpeed * this.scale;
        this.x = (this.canvasWidth - this.width) / 2;
        this.y = this.canvasHeight - this.height - 20 * this.scale;
    }
    update(keyboardInput, voiceInput) {
        if (keyboardInput.has("ArrowLeft") && this.x > 0) {
            this.x -= this.speed;
        }
        else if (keyboardInput.has("ArrowRight") &&
            this.x < this.canvasWidth - this.width) {
            this.x += this.speed;
        }
        else if (voiceInput.has("go left") && this.x > 0) {
            this.x -= this.speed;
        }
        else if (voiceInput.has("go right") &&
            this.x < this.canvasWidth - this.width) {
            this.x += this.speed;
        }
    }
    draw(ctx) {
        if (this.loaded) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}
exports.Player = Player;
