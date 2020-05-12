import Head from "next/head";
import { useRef } from "react";
import { Container } from "../components/container";
import { List, ListItem } from "../components/list";
import { Card, CardList } from "../components/card";
import fetch from "isomorphic-fetch";
import { orderBy } from "lodash";
import absoluteUrl from "next-absolute-url";

const Main = ({ items }) => {
  const search = useRef(null);
  return (
    <>
      <Head>
        <title>Game B Library</title>
      </Head>
      <main>
        <Container>
          <CardList>
            {items.map((item, i) => {
              const img = item.snippet && item.snippet.thumbnails.medium.url;
              const title = item.snippet ? item.snippet.title : item.title;
              const description = item.snippet ? item.snippet.description : "";
              const url = item.snippet
                ? `/youtube/${
                    item.snippet.resourceId
                      ? item.snippet.resourceId.videoId
                      : item.id.videoId
                  }`
                : `/medium/${
                    item.guid.split("/")[item.guid.split("/").length - 1]
                  }`;
              return (
                <Card key={i} img={img} title={title} href={url}>
                  {truncate(description)}
                </Card>
              );
            })}
          </CardList>
        </Container>
      </main>
      <footer></footer>
    </>
  );
};

Main.getInitialProps = async ({ req }) => {
  const { origin } = absoluteUrl(req);
  const items = orderBy(
    Object.values(await (await fetch(`${origin}/data/items.json`)).json()),
    "publishedAt",
    "desc"
  );

  console.log(items[0]);

  return {
    items,
  };
};

export default Main;

const LIMIT = 100;

const truncate = (text) => {
  if (text.length <= LIMIT) {
    return text;
  }

  return `${text.substr(0, LIMIT)}...`;
};
