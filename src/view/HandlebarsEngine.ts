import { readFile } from "fs/promises";
import Handlebars from "handlebars";

const templateCache = new Map<string, HandlebarsTemplateDelegate<any>>();

/**
 * Handlebarsを使ってレンダリングするためのexpress用engine
 * 
 * @param templateFilePath 
 * @param templateVars 
 * @param renderCallback 
 */
export async function handlebarsEngine(
  templateFilePath: string,
  templateVars: Record<string, any>,
  renderCallback: (error: Error | null, renderResult?: string) => void
) {
  try {
    let render = templateCache.get(templateFilePath);
    if (render == null) {
      render = await compileTemplate(templateFilePath);
      templateCache.set(templateFilePath, render);
    }

    const renderedView = render(templateVars);
    renderCallback(null, renderedView);
  } catch (e) {
    if (e instanceof Error) {
      renderCallback(e);
    } else {
      renderCallback(new Error(`Error occurred in rendering view. details: ${e != null ? e.toString() : "null"}`));
    }
  }
}

async function compileTemplate(templateFilePath: string): Promise<HandlebarsTemplateDelegate<any>> {
  const content = await readFile(templateFilePath, "utf-8");
  const render = Handlebars.compile(content);
  return render;
}