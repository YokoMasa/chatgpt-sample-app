import { readFile } from "fs/promises";
import { createServer } from "vite";
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { listWidgetSources } from "./utils.mjs";

const widgetSources = await listWidgetSources();

function renderRootHtml() {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>index</title>
  </head>
  <body>
    <ul>
    ${ widgetSources.map(({ chunkName }) => `
      <li>
        <a href="/${chunkName}">${chunkName}</a>
      </li>
    `) }
    </ul>
  </body>
</html>
  `;
}

function renderWidgetHtml(widgetName) {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>${widgetName}</title>
    <script>
      window.openai = {};
    </script>
    <script type="module">
      import "src/preview/PreviewController.tsx"
      import "src/${widgetName}.tsx";
      import "src/content/${widgetName}MockInitializer.ts";
    </script>
  </head>
  <body>
    <main class="flex justify-center">
      <div class="w-[400px] grid gap-y-4">
        <div id="root"></div>
        <div id="preview-controller"></div>
      </div>
    </main>
  </body>
</html>
  `;
}

function widgetPreviewPlugin() {
  return {
    name: 'widget-preview',
    configureServer(server) {
      for (const widgetSource of widgetSources) {
        server.middlewares.use(`/${widgetSource.chunkName}`, async (req, res) => {
          res.setHeader("Content-Type", "text/html");
          res.statusCode = 200;
          res.end(
            await server.transformIndexHtml(
              req.url,
              renderWidgetHtml(widgetSource.chunkName)
            )
          );
        });
      }
      server.middlewares.use("/", (req, res, next) => {
        if (req.url === "/" || req.url === "") {
          res.setHeader("Content-Type", "text/html");
          res.statusCode = 200;
          res.end(renderRootHtml());
        } else {
          next();
        }
      });
    },
    resolveId(source) {
      return source;
    },
    async load(id) {
      if (id.startsWith("src/")) {
        try {
          const source = await readFile(id, { encoding: "utf-8" });
          return source;
        } catch (e) {
          console.warn(`[load] error: ${e.message ?? e.toString()}`);
          return "";
        }
      }
      return null;
    }
  }
}

const server = await createServer({
  configFile: false,
  plugins: [
    react(),
    tailwindcss(),
    widgetPreviewPlugin()
  ]
});
await server.listen();
server.printUrls();
server.bindCLIShortcuts({ print: true })