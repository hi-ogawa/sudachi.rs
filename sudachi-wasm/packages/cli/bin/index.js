#!/usr/bin/env node

import fs from "node:fs";
import { initialize } from "./initialize.js";
import { DICTIONARY_PATH } from "./paths.js";

async function main() {
  const [input, dictionaryPath] = process.argv.slice(2);
  if (!input) {
    console.error(
      "usage: sudachi.wasm.cli <japanese-sentence> (<dictionary-file>)"
    );
    process.exit(1);
  }

  // initialize wasm
  const { Tokenizer } = await initialize();

  // prepare dictionary
  const dictionary = new Uint8Array(
    await fs.promises.readFile(dictionaryPath ?? DICTIONARY_PATH)
  );

  // tokenize
  const tokenizer = Tokenizer.create(dictionary);
  const morphemes = tokenizer.run(input, "C");
  console.log(JSON.stringify(morphemes, null, 2));
}

main();
