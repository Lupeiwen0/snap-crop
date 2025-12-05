import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === "lib") {
    // Library build configuration
    return {
      plugins: [
        react(),
        tailwindcss(),
        dts({
          include: ["src"],
          exclude: ["src/App.tsx", "src/main.tsx"],
          rollupTypes: true,
        }),
      ],
      build: {
        lib: {
          entry: resolve(__dirname, "src/components/index.ts"),
          name: "SnapCrop",
          fileName: "snap-crop",
        },
        rollupOptions: {
          external: [
            "react",
            "react-dom",
            "react/jsx-runtime",
            "react-easy-crop",
          ],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
              "react/jsx-runtime": "jsxRuntime",
              "react-easy-crop": "Cropper",
            },
          },
        },
        cssCodeSplit: false,
      },
    };
  }

  // Development configuration
  return {
    plugins: [react(), tailwindcss()],
    base: process.env.GITHUB_ACTIONS ? "/snap-crop/" : "/",
  };
});
