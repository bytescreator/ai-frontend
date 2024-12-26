import { app, dialog } from "electron";
import { createRequire } from "module";
import nd from "ndjson";
import { spawn } from "node:child_process";
const require = createRequire(import.meta.url);
const ipcRenderer = require("electron/renderer").ipcRenderer;
const ipcMain = require("electron/main").ipcMain;

export function bindCallbacks() {
  const handle = spawn("python.exe", ["main.py"], { cwd: "./backend" });
  handle.on("error", (e) => {
    dialog.showErrorBox("alt islem baslatilamadi", `alt islem baslatilamadi: ${e}`);
    app.quit();
  });
  const serializer = nd.stringify();
  serializer.on("data", (line) => {
    handle.stdin.write(line);
  });
  handle.on("close", () => {
    serializer.end();
  });

  // TODO: stdin write
  ipcMain.on("submit-text", (_, text) => {
    serializer.write({ action: "submit-text", text });
  });
  ipcMain.on("toggle-listen", (_, status) => {
    serializer.write({ action: "toggle-listen", status });
  });
  ipcMain.on("list-sound-devices", (_) => {
    serializer.write({ action: "list-sound-devices" });
  });
  ipcMain.on("select-sound-output", (_, device_id: number) => {
    serializer.write({ action: "select-sound-output", sound_device: device_id });
  });
  ipcMain.on("select-sound-input", (_, device_id: number) => {
    serializer.write({ action: "select-sound-input", sound_device: device_id });
  });

  handle.stdout.pipe(nd.parse()).on("data", (obj) => {
    switch (obj.action) {
      case "on-llm-response":
        ipcRenderer.send("on-llm-response", obj.text);
      case "on-sound-input":
        ipcRenderer.send("on-sound-input", obj.text);
      case "sound-devices-list":
        ipcRenderer.send("sound-devices-list", obj.devices);
      case "selected-sound-input":
        ipcRenderer.send("selected-sound-input", obj.ok, obj.device);
      case "selected-sound-output":
        ipcRenderer.send("selected-sound-output", obj.ok, obj.device);
    }
  });
}
