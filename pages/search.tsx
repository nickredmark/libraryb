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
import { SearchResults } from "../components/search";

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
          <SearchResults results={results} />
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
