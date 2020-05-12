import Head from "next/head";
import { useRef, useState } from "react";
import { Container } from "../components/container";
import { List, ListItem } from "../components/list";
import { Card, CardList } from "../components/card";
import fetch from "isomorphic-fetch";
import { orderBy } from "lodash";
import absoluteUrl from "next-absolute-url";
import { Heading } from "../components/heading";
import { Search } from "../components/form";

const Main = ({ items }) => {
  const [search, setSearch] = useState("");

  const filteredItems = items.filter((item) => {
    const title: string = item.snippet ? item.snippet.title : item.title;
    const description = item.snippet
      ? item.snippet.description
      : item.contentSnippet || "";

    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      description.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <>
      <Head>
        <title>Game B Library</title>
      </Head>
      <main>
        <Container>
          <Heading>The Game B Library</Heading>
          <Search search={search} setSearch={setSearch} />
          <CardList>
            {filteredItems.map((item) => {
              const img = item.snippet
                ? item.snippet.thumbnails.medium.url
                : item.image;
              const title = item.snippet ? item.snippet.title : item.title;
              const description = item.snippet
                ? item.snippet.description
                : item.contentSnippet || "";
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
                <Card key={url} img={img} title={title} href={url}>
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
