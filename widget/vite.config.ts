import { defineConfig, Plugin } from "vite";
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function widgetPreviewPlugin(): Plugin {
  return {
    name: "vite-plugin-widget-preview",
    transformIndexHtml: {
      order: "pre",
      handler: (html, context) => {
        // Do nothing when building for production
        if (context.server == null) {
          return html;
        }

        return [
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

export default defineConfig({
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