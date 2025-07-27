import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import WebSocket from "ws";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  win.loadFile(path.join(__dirname, "..", "..", "src", "index.html"));

  // Connect to the Python WebSocket server
  connectToVoiceServer(win);
}

function connectToVoiceServer(win: BrowserWindow) {
  const ws = new WebSocket("ws://localhost:8765");

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
    console.log(
      "Disconnected from voice control server. Retrying in 5 seconds..."
    );
    setTimeout(() => connectToVoiceServer(win), 5000);
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err.message);
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
