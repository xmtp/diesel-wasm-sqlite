import { defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import terser from "@rollup/plugin-terser";

export default defineConfig([
  {
    input: "sqlite3-diesel.js",
    output: {
      file: "src/js/sqlite3-diesel.js",
      format: "es",
    },
    treeshake: "smallest",
    plugins: [
      nodeResolve(),
      terser(),
      copy({
        targets: [
          {
            src: "./node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3.wasm",
            dest: "src/js",
          },
        ],
      }),
    ],
  },
  {
    input:
      "./node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3-opfs-async-proxy.js",
    output: {
      file: "src/js/sqlite3-opfs-async-proxy.js",
      format: "es",
    },
    plugins: [terser()],
  },
]);
