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
import { Pill, Pills } from "../components/pill";

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

const Main = ({ items, curators, collections }) => {
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
  const [selectedCollections, setSelectedCollections] = useState(
    Object.keys(collections)
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

  const availableCollectionsObject = {};
  for (const [curator, category] of Object.values(actuallySelectedCategories)) {
    for (const collection of curators[curator][category]) {
      availableCollectionsObject[collection] = true;
    }
  }
  const availableCollections = Object.keys(availableCollectionsObject);
  const actuallySelectedCollections = intersection(
    selectedCollections,
    availableCollections
  );

  const filteredItems = items.filter((item) => {
    const title: string = item.snippet ? item.snippet.title : item.title;
    const description = item.snippet
      ? item.snippet.description
      : item.contentSnippet || "";

    return (
      intersects(item.collections, actuallySelectedCollections) &&
      (title.toLowerCase().includes(search.toLowerCase()) ||
        description.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <>
      <Head>
        <title>Game B Library</title>
      </Head>
      <main>
        <Container>
          <Heading>The Game B Library ({filteredItems.length} results)</Heading>
          <Search search={search} setSearch={setSearch} />
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
                canDeselect={true}
                onToggle={() =>
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
                }
              />
            ))}
          </Pills>
          {false && (
            <Pills label="Publications:">
              {availableCollections.map((collection) => (
                <Pill
                  key={collection}
                  label={collections[collection].name}
                  active={selectedCollections.includes(collection)}
                  canDeselect={true}
                  onToggle={() =>
                    selectedCollections.includes(collection)
                      ? setSelectedCollections(
                          selectedCollections.filter((p) => p !== collection)
                        )
                      : setSelectedCollections([
                          ...selectedCollections,
                          collection,
                        ])
                  }
                />
              ))}
            </Pills>
          )}
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
                ? `/youtube/${item._id}`
                : `/medium/${item._id}`;
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
  const origin = "https://librarybdata.now.sh";
  const items = orderBy(
    Object.values(await (await fetch(`${origin}/items.json`)).json()),
    "publishedAt",
    "desc"
  );
  const curators = await (await fetch(`${origin}/curators.json`)).json();
  const collections = await (await fetch(`${origin}/collections.json`)).json();

  return {
    items,
    curators,
    collections,
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
