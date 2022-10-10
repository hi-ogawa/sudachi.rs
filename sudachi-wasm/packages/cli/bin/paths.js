import { createRequire } from "node:module";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const DICTIONARY_PATH = path.resolve(
  __dirname,
  "..",
  "data",
  "sudachi-dictionary-20220729",
  "system_small.dic"
);

export const WASM_PATH = require.resolve(
  "@hiogawa/sudachi.wasm/pkg/index_bg.wasm"
);
