import { readFileSync, readdirSync } from 'node:fs';
import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const entrypointHtmlFileNames = readdirSync(".")
  .filter(fileName => fileName.endsWith(".html"));

function widgetPreviewPlugin() {
  return {
    name: "vite-plugin-widget-preview",
    configureServer: (server) => {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/") {
          res.setHeader("Content-Type", "text/html");
          res.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8"/>
              <title>プレビュー</title>
            </head>
            <body>
              <ul>${entrypointHtmlFileNames.map(fileName => `<li><a href="/${fileName}">${fileName}</a></li>`)}</ul>
            </body>
          </html>  
          `);
          res.end();
        } else {
          next();
        }
      })
    },
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

const base = process.env.SERVER_BASE_URL != null
  ? process.env.SERVER_BASE_URL + "/static"
  : "http://localhost:3000"
export default defineConfig({
  base: base,
  build: {
    rollupOptions: {
      input: entrypointHtmlFileNames.map(fileName => `./${fileName}`),
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