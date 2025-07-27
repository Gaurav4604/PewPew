import { contextBridge, ipcRenderer } from "electron";

// Expose a safe API to the renderer process (your game)
contextBridge.exposeInMainWorld("electronAPI", {
  onVoiceCommand: (callback: (command: string) => void) => {
    // Listen for the 'voice-command' event from the main process
    ipcRenderer.on("voice-command", (_event, command) => callback(command));
  },
});
