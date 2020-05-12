import Head from "next/head";
import { useRef } from "react";
import { Container } from "../components/container";
import { List, ListItem } from "../components/list";
import { Card, CardList } from "../components/card";
import fetch from "isomorphic-fetch";
import { orderBy } from "lodash";
import absoluteUrl from "next-absolute-url";

const Main = ({ library }) => {
  const search = useRef(null);
  return (
    <>
      <Head>
        <title>Game B Library</title>
      </Head>
      <main>
        <Container>
          <CardList>
            {library.videos.map((video, i) => {
              const thumbnail = video.snippet.thumbnails.medium;
              return (
                <Card
                  key={i}
                  img={thumbnail.url}
                  title={video.snippet.title}
                  href={`/youtube/${
                    video.snippet.resourceId
                      ? video.snippet.resourceId.videoId
                      : video.id.videoId
                  }`}
                >
                  {truncate(video.snippet.description)}
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
  const library = await (await fetch(`${origin}/data/library.json`)).json();
  library.videos = orderBy(library.videos, "snippet.publishedAt", "desc");

  return {
    library,
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
