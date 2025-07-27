"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose a safe API to the renderer process (your game)
electron_1.contextBridge.exposeInMainWorld("electronAPI", {
    onVoiceCommand: (callback) => {
        // Listen for the 'voice-command' event from the main process
        electron_1.ipcRenderer.on("voice-command", (_event, command) => callback(command));
    },
});
