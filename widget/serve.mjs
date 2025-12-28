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
    <script type="module">
      import "/widgets/${widgetName}";
    </script>
  </head>
  <body>
    <main class="flex justify-center">
      <div id="root" class="w-[400px]"></div>
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
      if (source.startsWith("/widgets/")) {
        return "src/" + source.slice(9) + ".tsx";
      }
      return null;
    },
    async load(id) {
      if (id.startsWith("src/")) {
        try {
          const source = await readFile(id, { encoding: "utf-8" });
          return source;
        } catch (e) {
          console.warn(`[load] error: ${e.message ?? e.toString()}`);
        }
      }
      return null;
    }
  }
}

const server = await createServer({
  configFile: false,
  build: {
    rollupOptions: {
      input: [
        "src/TestWidget.tsx"
      ]
    }
  },
  plugins: [
    react(),
    tailwindcss(),
    widgetPreviewPlugin()
  ]
});
await server.listen();
server.printUrls();
server.bindCLIShortcuts({ print: true })