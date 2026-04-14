import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // Keep API on :3000; Vite default dev port matches docker-compose host mapping (5173:3000 in container).
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
});
