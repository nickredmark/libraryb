import { NextApiRequest, NextApiResponse } from "next";
import elasticsearch, { SearchResponse } from "elasticsearch";

const client = new elasticsearch.Client({
  host: process.env.ES_HOST,
});

const index = "libraryb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const result: SearchResponse<{}> = await client.search({
    index,
    q: `"${req.query.search as string}"`,
    size: 50,
    // sort: [
    //   {
    //     publishedAt: "desc",
    //   },
    // ] as any,
    body: {
      highlight: {
        fields: {
          content: {},
          description: {},
          title: {},
        },
      },
    },
  });
  res.json(result);
};
