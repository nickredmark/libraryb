import Head from "next/head";
import { useRef, useState, FC } from "react";
import { Container } from "../components/container";
import { List, ListItem } from "../components/list";
import { Card, CardList } from "../components/card";
import fetch from "isomorphic-fetch";
import { orderBy, uniq, flatMap, Dictionary } from "lodash";
import absoluteUrl from "next-absolute-url";
import { Heading } from "../components/heading";
import { Search } from "../components/form";
import { Pill, Pills } from "../components/pill";
import { DATA_ORIGIN } from "../utils/constants";
import { Paragraph } from "../components/paragraph";
import { truncate, ItemCard } from "../components/item-card";
import { Item } from "../models/item";

const intersects = (arr1, arr2) => {
  for (const item of arr1) {
    if (arr2.includes(item)) {
      return true;
    }
  }
  return false;
};

const intersection = (arr1, arr2) => {
  return arr1.filter((item) => arr2.includes(item));
};

const Main: FC<{
  items: Item[];
  curators: Dictionary<Dictionary<string[]>>;
}> = ({ items, curators }) => {
  const [search, setSearch] = useState("");
  const [selectedCurators, setSelectedCurators] = useState([
    Object.keys(curators)[0],
  ]);
  const [selectedCategories, setSelectedCategories] = useState(
    Object.keys(curators).map((curator) => [
      curator,
      Object.keys(curators[curator])[0],
    ])
  );

  const selectedCategoriesOnly = selectedCategories.map(
    ([, category]) => category
  );

  const availableCategories = [];
  for (const curator of selectedCurators) {
    availableCategories.push(
      ...Object.keys(curators[curator]).map((category) => [curator, category])
    );
  }
  const actuallySelectedCategories = availableCategories.filter(
    ([curator, category]) =>
      selectedCategories.some(([cu, ca]) => curator === cu && category === ca)
  );

  const resources = uniq(
    flatMap(
      Object.values(actuallySelectedCategories),
      ([curator, category]) => curators[curator][category]
    )
  );
  const selectedItems = resources
    .filter((r) => r.includes("medium.com"))
    .map((i) => i.split("-")[i.split("-").length - 1]);

  const filteredItems = items.filter((item) => {
    const title: string = item.title;
    const description = truncate(item.description);

    return (
      (selectedItems.includes(item._id) ||
        intersects(item.collections, resources)) &&
      (title.toLowerCase().includes(search.toLowerCase()) ||
        description.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <>
      <Head>
        <title>The Game~B Library</title>
      </Head>
      <Container>
        <Heading>The Game~B Library</Heading>
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
          <Pills label="Curators:">
            {Object.keys(curators).map((curator) => (
              <Pill
                key={curator}
                label={curator}
                active={selectedCurators.includes(curator)}
                canDeselect={false}
                onToggle={() => {
                  if (!selectedCurators.includes(curator)) {
                    setSelectedCurators([curator]);
                    setSelectedCategories([
                      [curator, Object.keys(curators[curator])[0]],
                    ]);
                  }
                  /*selectedCurators.includes(curator)
                    ? setSelectedCurators(
                        selectedCurators.filter((p) => p !== curator)
                      )
                    : setSelectedCurators([...selectedCurators, curator])*/
                }}
              />
            ))}
          </Pills>
          <Pills label={`Collections by ${selectedCurators[0]}:`}>
            {availableCategories.map(([curator, category]) => (
              <Pill
                key={`${curator}-${category}`}
                label={category}
                active={selectedCategoriesOnly.includes(category)}
                canDeselect={false}
                onToggle={() => {
                  if (!selectedCategoriesOnly.includes(category)) {
                    setSelectedCategories([[curator, category]]);
                  }
                  /*
                  selectedCategoriesOnly.includes(category)
                    ? setSelectedCategories(
                        selectedCategories.filter(
                          ([cu, ca]) => !(cu === curator && ca === category)
                        )
                      )
                    : setSelectedCategories([
                        ...selectedCategories,
                        [curator, category],
                      ])
                      */
                }}
              />
            ))}
          </Pills>
          <div className="m-2">
            Showing {filteredItems.length} / {items.length} entries:
          </div>
          <CardList>
            {filteredItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </CardList>
        </div>
      </Container>
    </>
  );
};

export const getServerSideProps = async () => {
  const items: Item[] = orderBy(
    Object.values(await (await fetch(`${DATA_ORIGIN}/items.json`)).json()),
    "publishedAt",
    "desc"
  );
  const curators = await (await fetch(`${DATA_ORIGIN}/curators.json`)).json();

  return {
    props: {
      items,
      curators,
    },
  };
};

export default Main;
