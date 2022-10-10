import fs from "node:fs";
import * as lib from "@hiogawa/sudachi.wasm";
import { WASM_PATH } from "./paths.js";

export async function initialize() {
  // compile wasm
  const wasmSource = await fs.promises.readFile(WASM_PATH);
  const wasmModule = await WebAssembly.compile(wasmSource);

  // initialize wasm
  lib.initSync(wasmModule);
  return lib;
}
