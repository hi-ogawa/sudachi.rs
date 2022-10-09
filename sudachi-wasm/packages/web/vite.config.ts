import rakkas from "rakkasjs/vite-plugin";
import { defineConfig } from "vite";
import windicss from "vite-plugin-windicss";

export default defineConfig({
  base: "./",
  plugins: [
    windicss(),
    rakkas({
      prerender: ["/"],
    }),
  ],
});
