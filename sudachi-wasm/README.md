# sudachi-wasm

- [`sudachi-wasm`](https://github.com/hi-ogawa/sudachi.rs/tree/develop-js/sudachi-wasm) (npm [@hiogawa/sudachi.wasm](https://www.npmjs.com/package/@hiogawa/sudachi.wasm))
- [`sudachi-wasm/packages/cli`](https://github.com/hi-ogawa/sudachi.rs/tree/develop-js/sudachi-wasm/packages/cli) (npm [@hiogawa/sudachi.wasm.cli](https://www.npmjs.com/package/@hiogawa/sudachi.wasm.cli))
- [`sudachi-wasm/packages/web`](https://github.com/hi-ogawa/sudachi.rs/tree/develop-js/sudachi-wasm/packages/web) (https://sudachi-wasm-hiro18181.vercel.app/)

```sh
# build
pnpm i
npm run dev

# embed dictoinary in wasm file
SUDACHI_WASM_EMBED_DICTIONARY="$PWD/packages/cli/data/sudachi-dictionary-20220729/system_small.dic" npm run dev:embed

# release
npm run build
npm run release
```

## todo

- [ ] move napi binding from https://github.com/hi-ogawa/japanese-line-break-segmenter/tree/master/sudachi.js
