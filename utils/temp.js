const { readFileSync, writeFileSync, existsSync, mkdirSync } = require("fs");
const { orderBy } = require("lodash");
const items = JSON.parse(readFileSync("./public/data/items.json", "utf8"));
const { parse } = require("node-html-parser");

for (const item of Object.values(items)) {
  if (!item.snippet) {
    const id = item.guid.split("/")[item.guid.split("/").length - 1];
    const actualItem = JSON.parse(
      readFileSync(`./public/data/medium/${id}/item.json`, "utf8")
    );
    const content = actualItem.content || actualItem["content:encoded"];
    const root = parse(content);
    const img = root.querySelector("img");
    if (img) {
      const image = img.getAttribute("src");
      actualItem.image = image;
      item.image = image;
      writeFileSync(
        `./public/data/medium/${id}/item.json`,
        JSON.stringify(actualItem, null, 2)
      );
    }
  }
}

writeFileSync("./public/data/items.json", JSON.stringify(items, null, 2));
