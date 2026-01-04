import { readdir } from "fs/promises";

export async function listWidgetSources() {
  const fileNames = await readdir("src");
  return fileNames
    .filter(name => name.endsWith(".tsx"))
    .map(name => ({
      path: `src/${name}`,
      chunkName: name.split(".")[0]
    }));
}
