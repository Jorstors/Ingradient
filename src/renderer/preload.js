// Example preload script
const { contextBridge, ipcRenderer } = require("electron");

// Expose some APIs to the renderer process securely
contextBridge.exposeInMainWorld("electron", {
  // Example: Add custom APIs to be used in the renderer
  readFile: async (filePath) => await ipcRenderer.invoke("read-file", filePath),
  saveData: async (data) => await ipcRenderer.invoke("save-data", data),
});
