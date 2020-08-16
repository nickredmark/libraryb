import fetch from "isomorphic-fetch";
import { useMemo, FC } from "react";
import { Dictionary } from "lodash";
import Head from "next/head";
import { Container } from "../components/container";
import { Heading } from "../components/heading";
import { Search } from "../components/form";
import { DATA_ORIGIN } from "../utils/constants";
import { Term } from "../components/term";
import { Item } from "../models/item";
import { useRouterState } from "../utils/router";

type Term = {
  synonyms?: string[];
};

const Glossary: FC<{
  items: Dictionary<Item>;
  glossary: Dictionary<
    Dictionary<Dictionary<{ quotes: { item: string; quote: string }[] }>>
  >;
}> = ({ items, glossary }) => {
  const [query, updateQuery] = useRouterState({ search: "" });
  const search = query.search;
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
            related: terms
              .filter((t) => t !== term)
              .filter((term) => glossary[curator][group][term].quotes),
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
            setSearch={async (search) => updateQuery({ search })}
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

export default Glossary;

export const getServerSideProps = async () => {
  const glossary = await (await fetch(`${DATA_ORIGIN}/glossary.json`)).json();
  const items = await (await fetch(`${DATA_ORIGIN}/items.json`)).json();

  return { props: { items, glossary } };
};
