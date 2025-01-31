import marked from "marked";
import { readFile, writeFile, access, mkdir } from "fs/promises";
import {
  resumePath,
  distPath,
  stylePath,
  websocketPath,
} from "#root/config.js";

const renderer = {
  table(header, body) {
    return `<table>${body}</table>`;
  },
};

marked.use({ renderer });

export function decorateHtml(html) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="${stylePath}" type="text/css"></link>
      </head>
      <body class="markdown-body" id="custom">
        ${html}
        <script src="${websocketPath}"></script>
      </body>
     </html>
`;
}

async function saveAsHtml(dist, content) {
  try {
    await writeFile(dist, content);
  } catch (e) {
    console.log(e);
  }
}

export async function convertMd2Html() {
  try {
    const data = await readFile(resumePath, "utf8");
    const html = await marked(data);
    return html;
  } catch (e) {
    console.log(e);
    return "";
  }
}

export async function exportMarkdown2Html() {
  const html = await convertMd2Html();
  const content = decorateHtml(html);

  try {
    await access(distPath);
    saveAsHtml(distPath, content);
  } catch (e) {
    await mkdir(distPath);
    saveAsHtml(distPath, content);
  }
}
