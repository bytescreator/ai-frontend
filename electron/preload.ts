import { contextBridge, ipcRenderer } from "electron";

export const astra = {
  /**
   * sends given text to backend for llm inference
   * @param text to submit
   */
  submitText: (text: string) => ipcRenderer.send("submit-text", text),

  /**
   * calls cb when voice is disabled or after voice has been spoken
   * @param cb callback to call when a textual response has been received
   */
  onResponse: (cb: (s: string) => void) => {
    ipcRenderer.on("llm-response", (_, text: string) => {
      if (typeof text !== "string") {
        throw new Error("llm-response is not a string");
      }
      cb(text);
    });
  },

  /**
   * submits a listening request to backend
   */
  toggleVoice: (status: boolean) => ipcRenderer.send("toggle-listen", status),

  /**
   * Called when sound input is detected when listening is armed.
   * @param cb called when a sound input is received
   */
  onSoundInput: (cb: (s: string) => void) => {}
};

contextBridge.exposeInMainWorld("astra", astra);
