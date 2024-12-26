import { astra } from "../electron/preload.ts";

declare global {
  interface Window {
    astra: typeof astra;
  }
}
