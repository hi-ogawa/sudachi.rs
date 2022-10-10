import initSudachi, { Morpheme, Tokenizer } from "@hiogawa/sudachi.wasm";
import SUDACHI_WASM_URL from "@hiogawa/sudachi.wasm/pkg/index_bg.wasm?url";
import initZip, { extract_by_index, read_metadata } from "@hiogawa/zip.wasm";
import ZIP_WASM_URL from "@hiogawa/zip.wasm/pkg/index_bg.wasm?url";
import * as Comlink from "comlink";
import _ from "lodash";
import { tinyassert } from "./tinyassert";

//
// tokenizer wrapper
//

export class TokenizerWorker {
  private tokenizer?: Tokenizer;

  async initialize() {
    await Promise.all([initSudachi(SUDACHI_WASM_URL), initZip(ZIP_WASM_URL)]);
  }

  // TODO: zero copy? https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage
  async loadDictionary(file: File): Promise<void> {
    const dictData = await loadDictionaryData(file);
    this.tokenizer?.free();
    delete this.tokenizer;
    this.tokenizer = Tokenizer.create(dictData);
  }

  async run(input: string): Promise<Morpheme[]> {
    tinyassert(this.tokenizer);
    return this.tokenizer.run(input, "C");
  }
}

async function loadDictionaryData(file: File): Promise<Uint8Array> {
  const fileData = new Uint8Array(await file.arrayBuffer());
  if (file.name.endsWith(".dic")) {
    return fileData;
  }
  if (file.name.endsWith(".zip")) {
    const { entries } = read_metadata(fileData) as ZipMetadata;
    const index = entries.findIndex((e) => e.file_name.endsWith(".dic"));
    const entry = entries[index];
    if (entry) {
      const dictData = new Uint8Array(entry.uncompressed_size);
      extract_by_index(fileData, index, dictData);
      return dictData;
    }
  }
  throw new Error("unsuppored file extension");
}

// TODO: add typing in https://github.com/hi-ogawa/zip/blob/e9b607dda08f4786ef6e776647444fe665f7ef83/wasm/src/lib.rs#L33-L44
interface ZipMetadata {
  entries: {
    file_name: string;
    uncompressed_size: number;
    compressed_size: number;
    compression_method: string;
  }[];
}

//
// main
//

function main() {
  const tokenizerWorker = new TokenizerWorker();
  Comlink.expose(tokenizerWorker);
}

main();
