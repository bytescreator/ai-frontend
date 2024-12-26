import { contextBridge, ipcRenderer } from "electron";

export const astra = {
  /**
   * sends given text to backend for llm inference
   * @param text to submit
   */
  submitText: (text: string) => ipcRenderer.send("submit-text", text),

  /**
   * submits a listening request to backend
   */
  toggleVoice: (status: boolean) => ipcRenderer.send("toggle-listen", status),

  /**
   * requests sound device list from subprocess
   */
  requestSoundDevices: () => {
    ipcRenderer.send("list-sound-devices");
  },

  selectSoundOutput: (id: number) => {
    ipcRenderer.send("select-sound-output", id);
  },

  selectSoundInput: (id: number) => {
    ipcRenderer.send("select-sound-input", id);
  },

  /**
   * calls cb when voice is disabled or after voice has been spoken
   * @param cb callback to call when a textual response has been received
   */
  onResponse: (cb: (s: string) => void) => {
    ipcRenderer.on("on-llm-response", (_, text: string) => {
      if (typeof text !== "string") {
        throw new Error("llm-response is not a string");
      }
      cb(text);
    });
  },

  /**
   * Called when sound input is detected when listening is armed.
   * @param cb called when a sound input is received
   */
  onSoundInput: (cb: (s: string) => void) => {
    ipcRenderer.on("on-sound-input", (_, text) => {
      if (typeof text !== "string") {
        throw new Error("on-sound-input is not a string");
      }
      cb(text);
    });
  },

  /**
   * called when sound toggle responds
   * @param cb to be called when sound is toggled
   */
  onVoiceToggle: (cb: (s: boolean) => void) => {
    ipcRenderer.on("on-voice-toggle", (_, s) => {
      cb(s);
    });
  },

  /**
   * listens for sound device list calls initiated by requestSoundDevices
   * @param cb callback to call with devices
   */
  onSoundDeviceResponse: (cb: (devices: any) => void) => {
    ipcRenderer.on("sound-devices-list", (_, devices) => cb(devices));
  },

  onSelectedSoundInput: (cb: (ok: boolean, id: number) => void) => {
    ipcRenderer.on("selected-sound-input", (_, ok, device) => {
      cb(ok, device);
    });
  },

  onSelectedSoundOutput: (cb: (ok: boolean, id: number) => void) => {
    ipcRenderer.on("selected-sound-output", (_, ok, device) => {
      cb(ok, device);
    });
  }
};

contextBridge.exposeInMainWorld("astra", astra);
