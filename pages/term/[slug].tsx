import Head from "next/head";
import { Container } from "../../components/container";
import { Heading } from "../../components/heading";
import fetch from "isomorphic-fetch";
import { DATA_ORIGIN } from "../../utils/constants";
import { Markdown } from "../../components/markdown";
import { Term, TermBody } from "../../components/term";
import { GetServerSideProps, NextPageContext } from "next";
import slugify from "slugify";
import absoluteUrl from "next-absolute-url";
import { SearchResults } from "../../components/search";

const Document = ({ items, term, data, searchResults }) => {
  return (
    <>
      <Head>
        <title>{term}</title>
      </Head>
      <Container>
        <div className="mt-4">
          <a href="/glossary">Glossary</a> &gt;
        </div>
        <Heading>{term}</Heading>
        <TermBody term={term} items={items} data={data} page />
        <h3>Full-text search results for "{term}"</h3>
        <SearchResults results={searchResults} />
      </Container>
    </>
  );
};

export const getServerSideProps = async ({ query, req }: NextPageContext) => {
  const glossary = await (await fetch(`${DATA_ORIGIN}/glossary.json`)).json();
  const items = await (await fetch(`${DATA_ORIGIN}/items.json`)).json();
  let term;
  let data;
  let found;
  bad: for (const groups of Object.values(glossary)) {
    for (const terms of Object.values(groups)) {
      for (term of Object.keys(terms)) {
        data = {
          ...terms[term],
          related: Object.keys(terms)
            .filter((t) => t !== term)
            .filter((term) => terms[term].quotes),
        };

        if (
          [term]
            .map((t) => slugify(t, { lower: true }))
            .includes((query.slug as string).toLowerCase())
        ) {
          found = true;
          break bad;
        }
      }
    }
  }

  if (!found) {
    throw new Error("Unknown term");
  }

  const { origin } = absoluteUrl(req);
  const searchResults = await (
    await fetch(`${origin}/api/search?search=${encodeURIComponent(term)}`)
  ).json();

  return { props: { items, term, data, searchResults } };
};

export default Document;
