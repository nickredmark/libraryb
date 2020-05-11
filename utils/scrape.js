const {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  renameSync,
} = require("fs");
const youtubedl = require("youtube-dl");
const library = require("../data/seed.json");
const Youtube = require("youtube-api");
const { parseString } = require("xml2js");
const qs = require("qs");

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
    await getSubs(getId(item));
  }

  return videos;
};

const getSubs = async (id) => {
  const dir = `./data/youtube/${id}`;
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
    for (const item of library) {
      switch (item.type) {
        case "youtube-playlist": {
          console.log(`playlist ${item.url}`);
          const id = new URL(item.url).searchParams.get("list");
          item.videos = await getVideos(
            "playlistItems",
            {
              playlistId: id,
            },
            (item) => item.snippet.resourceId.videoId
          );

          break;
        }
        case "youtube-channel": {
          console.log(`channel ${item.url}`);
          const id = item.url.split("/")[item.url.split("/").length - 1];

          item.videos = await getVideos("search", {
            channelId: id,
          });
          break;
        }
      }
    }
    writeFileSync("./data/library.json", JSON.stringify(library, null, 2));
  } catch (e) {
    console.error(e);
  }
};

start();
