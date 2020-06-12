import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_PROXY_TARGET ?? "http://localhost:8000";

  return {
    plugins: [react(), tsconfigPaths()],
    server: {
      port: Number(env.VITE_DEV_PORT ?? 5173),
      strictPort: true,
      proxy: { "/api": { target: apiTarget, changeOrigin: true } },
    },
  };
});
