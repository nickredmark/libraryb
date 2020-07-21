import { NextPageContext } from "next";
import fetch from "isomorphic-fetch";
import absoluteUrl from "next-absolute-url";
import { Card, CardList } from "../components/card";
import { orderBy, uniq, flatMap } from "lodash";
import { DATA_ORIGIN } from "../utils/constants";
import { ItemCard } from "../components/item-card";
import Head from "next/head";
import { Container } from "../components/container";
import { Heading } from "../components/heading";
import { useState } from "react";
import { Search } from "../components/form";

export default ({ search: initialSearch, results }) => {
  const [search, setSearch] = useState(initialSearch);

  return (
    <>
      <Head>
        <title>Full-Text Search</title>
      </Head>
      <Container>
        <Heading>
          Full-Text Search
          {results && <> ({results.hits.hits.length} results)</>}
        </Heading>
        <div className="flex-shrink overflow-auto">
          <Search
            search={search}
            setSearch={setSearch}
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/search?search=${encodeURIComponent(
                search
              )}`;
            }}
          />
          <CardList>
            {results &&
              results.hits.hits.map((result) => {
                return (
                  <Card
                    key={result._id}
                    href={`${result._source.type.split("-")[0]}/${result._id}`}
                    img={result._source.img}
                    title={result._source.title}
                  >
                    {(
                      result.highlight.content ||
                      result.highlight.description ||
                      result.highlight.title
                    )?.map((highlight) => (
                      <div className="m-4 highlight">
                        ...
                        <span dangerouslySetInnerHTML={{ __html: highlight }} />
                        ...
                      </div>
                    ))}
                  </Card>
                );
              })}
          </CardList>
        </div>
      </Container>
    </>
  );
};

export const getServerSideProps = async ({ req, query }: NextPageContext) => {
  const { origin } = absoluteUrl(req);
  let results = null;
  if (query.search) {
    results = await (
      await fetch(
        `${origin}/api/search?search=${encodeURIComponent(
          query.search as string
        )}`
      )
    ).json();
    // results.hits.hits = orderBy(
    //   results.hits.hits,
    //   ["score", "publishedAt"],
    //   ["desc", "desc"]
    // );
  }
  return {
    props: {
      search: query.search || null,
      origin,
      results,
    },
  };
};
