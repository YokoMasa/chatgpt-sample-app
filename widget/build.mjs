import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { build } from "vite"
import { listWidgetSources } from "./utils.mjs"

function renderHtml(title, jsCode, css) {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <style>
      ${css}
    </style>
  </head>
  <body>
    <main id="root">
    </main>
    <script>
      ${jsCode}
    </script>
  </body>
</html>
`;
}

function chatgptWidgetPlugin(chunkName) {
  return {
    name: "rollup-plugin-chatgpt-widget",
    version: "1.0.0",
    generateBundle(_, bundle) {
      let jsCode = "";
      let css = "";
      for (const fileName of Object.keys(bundle)) {
        const asset = bundle[fileName];
        if (asset.type === "asset") {
          css = asset.source;
        } else if (asset.type === "chunk") {
          jsCode = asset.code;
        }
        delete bundle[fileName];
      }

      this.emitFile({
        type: "prebuilt-chunk",
        fileName: `${chunkName}.html`,
        code: renderHtml(chunkName, jsCode, css)
      });
    }
  };
}

const sources = await listWidgetSources();
for (const { path, chunkName } of sources) {
  await build({
    build: {
      emptyOutDir: false,
      assetsDir: ".",
      rollupOptions: {
        input: [
          path
        ],
        output: {
          dir: "dist",
          manualChunks() {
            return chunkName;
          }
        },
      }
    },
    plugins: [
      react(),
      tailwindcss(),
      chatgptWidgetPlugin(chunkName)
    ]
  });
}