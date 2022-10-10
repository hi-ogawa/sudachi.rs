# sudachi-wasm

- [sudachi-wasm](https://github.com/hi-ogawa/sudachi.rs/tree/develop-js/sudachi-wasm) https://www.npmjs.com/package/@hiogawa/sudachi.wasm
- [sudachi-wasm/packages/cli](https://github.com/hi-ogawa/sudachi.rs/tree/develop-js/sudachi-wasm/packages/cli) https://www.npmjs.com/package/@hiogawa/sudachi.wasm.cli

```sh
# build
npm i
npm run dev

# embed dictoinary in wasm file
SUDACHI_WASM_EMBED_DICTIONARY="$PWD/packages/cli/data/sudachi-dictionary-20220729/system_small.dic" npm run dev:embed

# release
npm run build
npm publish --access public
```
