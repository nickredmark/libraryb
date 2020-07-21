import fetch from "isomorphic-fetch";
import { useState, useMemo } from "react";
import { orderBy, Dictionary } from "lodash";
import { Card, CardList } from "../components/card";
import Head from "next/head";
import { Container } from "../components/container";
import { Heading } from "../components/heading";
import { Search } from "../components/form";
import { useRouter } from "next/router";
import { Button } from "../components/button";
import { DATA_ORIGIN } from "../utils/constants";
import { ItemCard } from "../components/item-card";
import { Quote } from "../components/quote";

type Term = {
  synonyms?: string[];
};

export default ({ items, glossary }) => {
  const router = useRouter();
  const initialSearch = (router.query.search as string) || "";
  const [search, setSearch] = useState(initialSearch);
  const alphabetical = useMemo<Dictionary<Term>>(() => {
    const glossaryById = {};
    for (const curator of Object.keys(glossary)) {
      for (const group of Object.keys(glossary[curator])) {
        const terms = Object.keys(glossary[curator][group]).filter(
          (term) => glossary[curator][group][term].quotes
        );
        for (const term of terms) {
          glossaryById[term] = {
            ...glossary[curator][group][term],
            related: terms.filter((t) => t !== term),
          };
        }
      }
    }
    const alphabetical = {};
    for (const key of Object.keys(glossaryById).sort()) {
      alphabetical[key] = glossaryById[key];
    }
    return alphabetical;
  }, [glossary]);

  const filtered = useMemo<Dictionary<Term>>(() => {
    const filtered = {};
    for (const key of Object.keys(alphabetical)) {
      if (
        [key, ...(alphabetical[key].synonyms || [])].some((term) =>
          term.toLowerCase().includes(search.toLowerCase())
        )
      ) {
        filtered[key] = alphabetical[key];
      }
    }
    return filtered;
  }, [alphabetical, search]);
  return (
    <>
      <Head>
        <title>Game~B Glossary</title>
      </Head>
      <Container>
        <Heading>Game~B Glossary</Heading>
        <div className="flex-shrink overflow-auto">
          <Search
            search={search}
            setSearch={async (search) => {
              router.push(`${router.pathname}?search=${search}`);
              setSearch(search);
            }}
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/search?search=${encodeURIComponent(
                search
              )}`;
            }}
            placeholder="search term, e.g. 'sovereignty'"
          />
          {Object.keys(filtered).map((term) => (
            <Term
              key={term}
              items={items}
              term={term}
              data={alphabetical[term]}
            />
          ))}
        </div>
      </Container>
    </>
  );
};

const Term = ({ items, term, data }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-4">
      <div
        className="font-bold text-lg cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span className="text-xs w-4">{open ? "▼" : "►"}</span> {term}
      </div>
      {open && (
        <div className="mt-4 ml-4 border-gray-200 border-b clearfix">
          {data.synonyms && (
            <p>
              Synonyms:{" "}
              {data.synonyms.map((synonym, i) => (
                <>
                  {i > 0 && ", "}
                  <em>{synonym}</em>
                </>
              ))}
            </p>
          )}
          {data.related.length > 0 && (
            <p>
              Related:{" "}
              {data.related.map((related, i) => (
                <>
                  {i > 0 && ", "}
                  <a
                    className="text-black font-bold"
                    href={`?search=${related}`}
                  >
                    {related}
                  </a>
                </>
              ))}
            </p>
          )}
          {data.quotes && (
            <div>
              {data.quotes.map((quote, i) => (
                <Quote key={i} item={items[quote.item]} quote={quote.quote} />
              ))}
            </div>
          )}
          <p>
            <a
              className="text-gray-400 underline text-sm"
              href={`/search?search=${term}`}
            >
              full-text search for "{term}"
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = async () => {
  const glossary = await (await fetch(`${DATA_ORIGIN}/glossary.json`)).json();
  const items = await (await fetch(`${DATA_ORIGIN}/items.json`)).json();

  return { props: { items, glossary } };
};
