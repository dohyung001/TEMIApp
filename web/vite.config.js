// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  base: "./",
  build: {
    rollupOptions: {
      output: {
        format: "iife", // 즉시 실행 형식 (웹뷰 호환)
        entryFileNames: "index.js",
      },
    },
  },
});
