"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const ws_1 = __importDefault(require("ws"));
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path_1.default.join(__dirname, "preload.js"),
            contextIsolation: true,
        },
    });
    win.loadFile(path_1.default.join(__dirname, "..", "..", "src", "index.html"));
    // Connect to the Python WebSocket server
    connectToVoiceServer(win);
}
function connectToVoiceServer(win) {
    const ws = new ws_1.default("ws://localhost:8765");
    ws.on("open", () => {
        console.log("Connected to voice control server.");
    });
    ws.on("message", (data) => {
        const command = data.toString();
        console.log("Received command from voice control:", command);
        // Forward the command to the renderer process (the game)
        win.webContents.send("voice-command", command);
    });
    ws.on("close", () => {
        console.log("Disconnected from voice control server. Retrying in 5 seconds...");
        setTimeout(() => connectToVoiceServer(win), 5000);
    });
    ws.on("error", (err) => {
        console.error("WebSocket error:", err.message);
    });
}
electron_1.app.whenReady().then(createWindow);
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("activate", () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
