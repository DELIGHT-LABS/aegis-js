import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Aegis",
      formats: ["es", "cjs"],
      fileName: "index",
    },
  },
  plugins: [
    dts(),
    nodePolyfills({
      include: ["crypto", "stream", "vm"],
      globals: {
        Buffer: true,
      },
      protocolImports: true,
    }),
  ],
});
