"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputHandler = void 0;
class InputHandler {
    constructor() {
        this.keys = new Set();
        window.addEventListener("keydown", (e) => this.keys.add(e.key));
        window.addEventListener("keyup", (e) => this.keys.delete(e.key));
    }
}
exports.InputHandler = InputHandler;
