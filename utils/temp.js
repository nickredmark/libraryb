const { readFileSync, writeFileSync, existsSync, mkdirSync } = require("fs");
const { orderBy } = require("lodash");
const items = JSON.parse(readFileSync("./public/data/items.json", "utf8"));

for (const item of Object.values(items)) {
  if (!item.publishedAt) {
    item.publishedAt = item.snippet.publishedAt;
  }
}

writeFileSync("./public/data/items.json", JSON.stringify(items, null, 2));
