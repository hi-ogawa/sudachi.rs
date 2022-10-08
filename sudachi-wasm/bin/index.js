#!/usr/bin/env node

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { initSync, Tokenizer } from "../pkg/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_WASM_PATH = path.resolve(__dirname, "..", "pkg", "index_bg.wasm");

async function main() {
  const [input, dictionaryPath] = process.argv.slice(2);
  if (!input) {
    console.error(
      "usage: npx sudachi-wasm <japanese-sentence> (<dictionary-file>)"
    );
    process.exit(1);
  }

  // compile wasm
  const wasmSource = await fs.promises.readFile(DEFAULT_WASM_PATH);
  const wasmModule = await WebAssembly.compile(wasmSource);

  // initialize wasm
  initSync(wasmModule);

  // load dictionary if given
  let dictionary = undefined;
  if (dictionaryPath) {
    dictionary = new Uint8Array(await fs.promises.readFile(dictionaryPath));
  }

  // tokenize
  const tokenizer = Tokenizer.create(dictionary);
  const morphemes = tokenizer.run(input, "C");
  console.log(JSON.stringify(morphemes, null, 2));
}

main();
