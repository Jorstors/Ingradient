const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { autoUpdater } = require("electron-updater");
autoUpdater.checkForUpdatesAndNotify();

// Create the main window
let mainWindow;
const dbPath = path.join(__dirname, "app_data.db");
const db = new sqlite3.Database(dbPath);

// Function to create the main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../renderer/preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
}

app.on("ready", createWindow);

// IPC example: Save data to SQLite
ipcMain.handle("save-login", async (event, data) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO user_data(user, pass) VALUES(?, ?)`,
      [data.user, data.pass],
      function (err) {
        if (err) reject(err);
        else resolve(`Data saved with ID ${this.lastID}`);
      }
    );
  });
});
