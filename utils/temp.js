const { readFileSync, writeFileSync, existsSync, mkdirSync } = require("fs");
const { orderBy } = require("lodash");
const items = JSON.parse(readFileSync("./public/data/items.json", "utf8"));
const { parse } = require("node-html-parser");

for (const key of Object.keys(items)) {
  if (!items[key]._id) {
    delete items[key];
  }
}

writeFileSync("./public/data/items.json", JSON.stringify(items, null, 2));
