import Youtube from "youtube-api";

Youtube.authenticate({
  type: "key",
  key: process.env.YOUTUBE_API_KEY,
});
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async (req, res) => {
  const data = await new Promise((res, rej) =>
    Youtube.search.list(
      {
        part: "snippet",
        q: "game b",
      },
      (e, data) => (e ? rej(e) : res(data))
    )
  );
  res.json(data);
};
