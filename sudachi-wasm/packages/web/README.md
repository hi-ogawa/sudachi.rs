# web

sudachi.wasm demo app

```sh
# development
npm run dev

# preview production build
npm run build
npm run preview

# test
npx playwright install chromium
npm run test-e2e

# deploy
vercel --version # Vercel CLI 25.2.3
vercel projects add sudachi-wasm-hiro18181
vercel link -p sudachi-wasm-hiro18181
npm run build
npm run release:production
```
