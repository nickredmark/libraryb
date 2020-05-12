const {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  renameSync,
} = require("fs");
const youtubedl = require("youtube-dl");
const Youtube = require("youtube-api");
const { parseString } = require("xml2js");
const qs = require("qs");
const { orderBy, omit } = require("lodash");
const Parser = require("rss-parser");

const parser = new Parser();

const getVideos = async (key, options, getId = (item) => item.id.videoId) => {
  const videos = [];
  let page;
  while (!page || page.nextPageToken) {
    page = await new Promise((res, rej) =>
      Youtube[key].list(
        {
          part: "snippet",
          type: "video",
          maxResults: 50,
          pageToken: page && page.nextPageToken,
          ...options,
        },
        (e, data) => (e ? rej(e) : res(data))
      )
    );
    videos.push(...page.items);
  }
  for (const item of videos) {
    try {
      await getSubs(getId(item));
    } catch (e) {
      console.error(e);
    }
  }

  return orderBy(videos, "snippet.publishedAt");
};

const getSubs = async (id) => {
  const dir = `./public/data/youtube/${id}`;
  if (existsSync(dir)) {
    return;
  }
  const url = `https://youtu.be/${id}`;
  console.log(`Getting subs for ${url}`);
  mkdirSync(dir);
  const files = await new Promise((res, rej) =>
    youtubedl.getSubs(
      url,
      {
        auto: true,
        all: false,
        format: "ttml",
        lang: "en",
        cwd: dir,
      },
      (err, files) => (err ? rej(err) : res(files))
    )
  );
  if (!files.length) {
    console.log("No transcript available.");
    return;
  }
  renameSync(`${dir}/${files[0]}`, `${dir}/transcript.ttml`);
  const subsXml = readFileSync(`${dir}/transcript.ttml`, "utf8");
  const subs = await new Promise((res, rej) =>
    parseString(subsXml, (err, subs) => (err ? rej(err) : res(subs)))
  );

  final = subs.tt.body[0].div[0].p.map((p) => ({
    text: p._,
    begin: p.$.begin,
    end: p.$.end,
  }));
  writeFileSync(`${dir}/transcript.json`, JSON.stringify(final, null, 2));
};

Youtube.authenticate({
  type: "key",
  key: process.env.YOUTUBE_API_KEY,
});
const start = async () => {
  try {
    const seed = JSON.parse(readFileSync("./public/data/seed.json", "utf8"));
    const collections = JSON.parse(
      readFileSync("./public/data/collections.json", "utf8")
    );
    const items = JSON.parse(readFileSync("./public/data/items.json", "utf8"));

    for (const collection of seed) {
      if (!collections[collection.url]) {
        collections[collection.url] = {};
      }
      Object.assign(collections[collection.url], collection);
      switch (collection.type) {
        case "youtube-playlist": {
          break;
          console.log(`playlist ${collection.url}`);
          const id = new URL(collection.url).searchParams.get("list");
          collection.videos = await getVideos(
            "playlistItems",
            {
              playlistId: id,
            },
            (item) => item.snippet.resourceId.videoId
          );
          library.items.push(...collection.videos);

          break;
        }
        case "youtube-channel": {
          break;
          console.log(`channel ${collection.url}`);
          const id = collection.url.split("/")[
            collection.url.split("/").length - 1
          ];

          collection.videos = await getVideos("search", {
            channelId: id,
          });
          library.items.push(...collection.videos);
          break;
        }
        case "medium-publication":
        case "medium-user": {
          console.log(`medium user or collection ${collection.url}`);
          await new Promise((res) => setTimeout(res, 1000));
          const parsedFeed = await parser.parseURL(collection.url);
          for (const item of parsedFeed.items) {
            const id = item.guid.split("/")[item.guid.split("/").length - 1];
            item.publishedAt = item.pubDate;
            if (!existsSync(`./public/data/medium/${id}`)) {
              mkdirSync(`./public/data/medium/${id}`);
            }
            writeFileSync(
              `./public/data/medium/${id}/item.json`,
              JSON.stringify(item, null, 2)
            );
            delete item["content:encoded"];
            if (!items[id]) {
              items[id] = {};
            }
            Object.assign(items[id], item);
          }
        }
      }
    }

    writeFileSync(
      "./public/data/collections.json",
      JSON.stringify(collections, null, 2)
    );
    writeFileSync("./public/data/items.json", JSON.stringify(items, null, 2));
  } catch (e) {
    console.error(e);
  }
};

start();
