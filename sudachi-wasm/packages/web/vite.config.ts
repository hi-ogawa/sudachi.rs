import rakkas from "rakkasjs/vite-plugin";
import { defineConfig } from "vite";
import windicss from "vite-plugin-windicss";

export default defineConfig({
  base: "./",
  build: {
    sourcemap: true,
  },
  plugins: [
    windicss(),
    rakkas({
      adapter: "vercel",
      prerender: ["/"],
    }),
  ],
});
