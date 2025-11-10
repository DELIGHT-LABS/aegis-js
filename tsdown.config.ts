import { defineConfig } from "tsdown";
import { polyfillNode } from "esbuild-plugin-polyfill-node";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "es"],
  outExtensions: ({ format }) => {
    switch (format) {
      case "cjs":
        return {
          js: ".cjs",
          dts: ".d.ts",
        };
      case "es":
        return {
          js: ".js",
          dts: ".d.ts",
        };
    }
  },
  plugins: [
    polyfillNode({
      polyfills: {
        crypto: true,
        stream: true,
        vm: true,
      },
      globals: {
        buffer: true,
      },
    }),
  ],
  // we should strip 'node:' protocol from imports
  // esbuild node polifill plugin doesn't support protocol imports option
  nodeProtocol: "strip",
  dts: true,
  unbundle: true,
  sourcemap: true,
  clean: true,
  tsconfig: "tsconfig.json",
});
