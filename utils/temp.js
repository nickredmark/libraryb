const { readFileSync, writeFileSync, existsSync, mkdirSync } = require("fs");
const { orderBy } = require("lodash");
const library = JSON.parse(readFileSync("./public/data/library.json", "utf8"));

console.log(library.length);
const items = {};
for (const item of orderBy(library, "publishedAt")) {
  let id;
  switch (item.kind) {
    case "youtube#searchResult":
      id = item.id.videoId;
      break;
    case "youtube#playlistItem":
      id = item.snippet.resourceId.videoId;
      break;
  }
  if (!id) {
    console.log(item);
    throw new Error();
  }
  items[id] = item;
  if (!existsSync(`./public/data/youtube/${id}`)) {
    mkdirSync(`./public/data/youtube/${id}`);
  }
  writeFileSync(
    `./public/data/youtube/${id}/item.json`,
    JSON.stringify(item, null, 2)
  );
}

writeFileSync("./public/data/items.json", JSON.stringify(items, null, 2));
