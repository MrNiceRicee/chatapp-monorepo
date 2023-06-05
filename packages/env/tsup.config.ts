import { defineConfig } from "tsup";

export default defineConfig((opts) => ({
  entry: ["src/index.ts"],
  format: ["esm"],
  clean: !opts.watch,
  minify: !opts.watch,
  // dts: true,
  // sourcemap: true,
  splitting: true,
  treeshake: true,
}));
