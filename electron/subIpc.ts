import { app, dialog, ipcMain } from "electron";
import nd from "ndjson";
import { spawn } from "node:child_process";

export function bindCallbacks(win: Electron.BrowserWindow) {
  const handle = spawn("python.exe", ["main.py"], { cwd: "./backend" });
  handle.on("error", (e) => {
    dialog.showErrorBox("alt islem baslatilamadi", `alt islem baslatilamadi: ${e}`);
    app.quit();
  });
  const serializer = nd.stringify();
  serializer.on("data", (line) => {
    console.debug("sending line to sub", line);
    handle.stdin.write(line);
  });
  handle.on("exit", (code, signal) => {
    console.debug("subprocess exit", code, signal);
  });
  handle.on("close", () => {
    console.debug("close event received from handle");
    serializer.end();
    app.quit();
  });
  handle.stderr.on("data", (v) => {
    process.stderr.write(v);
  });

  ipcMain.on("submit-text", (_, text) => {
    serializer.write({ action: "submit-text", text });
  });
  ipcMain.on("new-session", () => {
    serializer.write({ action: "new-session" });
  });
  ipcMain.on("rewind-session", () => {
    serializer.write({ action: "rewind-session" });
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
    console.debug("obj received", obj);
    switch (obj.action) {
      case "input-ready":
        win.webContents.send("input-ready");
      case "on-llm-response":
        win.webContents.send("on-llm-response", obj.text);
      case "on-sound-input":
        win.webContents.send("on-sound-input", obj.text);
      case "on-voice-toggle":
        win.webContents.send("on-voice-toggle", obj.status);
      case "sound-devices-list":
        win.webContents.send("sound-devices-list", obj.devices);
      case "selected-sound-input":
        win.webContents.send("selected-sound-input", obj.ok, obj.device);
      case "selected-sound-output":
        win.webContents.send("selected-sound-output", obj.ok, obj.device);
    }
  });
}
