// TODO: workaround for "?url" import in worker (cf. https://github.com/vitejs/vite/issues/9879)
if (import.meta.env.PROD && typeof document === "undefined") {
  Object.assign(globalThis, {
    document: {
      currentScript: {
        src: self.location.href,
      },
    },
  });
}
