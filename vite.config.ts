import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Aegis",
      formats: ["es"],
      fileName: "aegis",
    },
  },
  plugins: [dts()],
});
