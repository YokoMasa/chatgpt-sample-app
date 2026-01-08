import { readFileSync } from 'node:fs';
import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function widgetPreviewPlugin() {
  return {
    name: "vite-plugin-widget-preview",
    transformIndexHtml: {
      order: "pre",
      handler: (html, context) => {
        // Do nothing when building for production
        if (context.server == null) {
          return html;
        }

        const base = context.filename.split(".")[0];
        const mockJsonPath = `${base}.mock.json`;
        let mockJson = {};
        try {
          const mockJsonStr = readFileSync(mockJsonPath, { encoding: "utf-8" });
          mockJson = JSON.parse(mockJsonStr);
        } catch (e) {
          console.warn(`Failed to load mock json (${mockJsonPath}). error: ${e.message ?? e.toString()}`);
        }

        return [
          {
            tag: "script",
            children: `window.openai = ${JSON.stringify(mockJson)}`
          },
          {
            tag: "script",
            attrs: {
              type: "module",
              src: "./src/preview/PreviewEntrypoint.tsx"
            }
          }
        ]
      }
    }
  };
}

const baseUrl = process.env.SERVER_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  base: baseUrl + "/static",
  build: {
    rollupOptions: {
      input: [
        "./CartWidget.html",
        "./ProductWidget.html",
      ],
      output: {
        dir: "dist"
      }
    }
  },
  plugins: [
    react(),
    tailwindcss(),
    widgetPreviewPlugin()
  ]
});