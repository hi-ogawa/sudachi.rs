# web

sudachi.wasm demo app

```sh
# development
npm run dev

# deploy
vercel --version # Vercel CLI 25.2.3
vercel projects add sudachi-wasm-hiro18181
vercel link -p sudachi-wasm-hiro18181
npm run build
npm run release:production
```

## todo

- [ ] run wasm in worker to avoid blocking UI
  - https://github.com/GoogleChromeLabs/comlink