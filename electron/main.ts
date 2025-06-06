import { app, BrowserWindow } from "electron";
import serve from "electron-serve";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bindCallbacks } from "./subIpc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadURL = serve({ directory: "build", file: "app" });

function createWindow() {
  const win = new BrowserWindow({
    title: "A.S.T.R.A",
    minWidth: 500,
    minHeight: 500,
    resizable: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.mjs")
    }
  });

  win.webContents.openDevTools();

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    loadURL(win);
  }

  win.setMenuBarVisibility(false); // Menü çubuğunu gizle

  bindCallbacks(win);
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
