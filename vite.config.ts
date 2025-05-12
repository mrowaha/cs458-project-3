import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      tailwindcss(),
      react(),
      svgr({
        svgrOptions: {
          exportType: "default",
          ref: true,
          svgo: false,
          titleProp: true,
        },
        include: "**/*.svg",
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@lib": path.resolve(__dirname, "./src/lib"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_SVQ_DEPLOYMENT,
          changeOrigin: true,
        },
        "/sse": {
          target: env.VITE_SVQ_DEPLOYMENT,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/sse/, "/api"),
        },
      },
    },
  };
});
