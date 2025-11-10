import { defineConfig } from "vitest/config";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    nodePolyfills({
      include: ["crypto", "stream", "vm"],
      globals: {
        Buffer: true,
      },
      protocolImports: true,
    }),
  ],
});
