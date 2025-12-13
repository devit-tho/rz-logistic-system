import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "path";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: true,
      port: 3010,
      strictPort: true,
    },
    preview: {
      host: true,
      port: 3010,
      strictPort: true,
      allowedHosts: ["RZ-system.app"],
    },
    optimizeDeps: {
      exclude: ["fs"],
    },
    define: {
      "process.env": JSON.stringify({
        APP_MODE: mode,
        ADMIN_API: env.ADMIN_API,
      }),
    },
    build: {
      sourcemap: false,
    },
  };
});
