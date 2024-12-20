import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron/simple";

export default defineConfig({
  plugins: [
    sveltekit(),
    // @ts-expect-error seems like our tsconfig can't catch this, does work in practice
    electron({
      main: {
        // Shortcut of `build.lib.entry`
        entry: "electron/main.ts"
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`
        input: "electron/preload.ts"
      },
      // Optional: Use Node.js API in the Renderer process
      renderer: {}
    })
  ]
});
