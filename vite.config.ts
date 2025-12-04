import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === "lib") {
    // Library build configuration
    return {
      plugins: [
        react(),
        dts({
          include: ["src"],
          exclude: ["src/App.tsx", "src/main.tsx"],
          rollupTypes: true,
        }),
      ],
      build: {
        lib: {
          entry: resolve(__dirname, "src/index.ts"),
          name: "SnapCrop",
          fileName: "snap-crop",
        },
        rollupOptions: {
          external: ["react", "react-dom", "react/jsx-runtime"],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
              "react/jsx-runtime": "jsxRuntime",
            },
          },
        },
        cssCodeSplit: false,
      },
    };
  }

  // Development configuration
  return {
    plugins: [react()],
  };
});
