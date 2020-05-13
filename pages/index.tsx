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

const Main = ({ items, curators }) => {
  const [search, setSearch] = useState("");
  const [selectedCurators, setSelectedCurators] = useState([
    Object.keys(curators)[0],
  ]);
  const [selectedCategories, setSelectedCategories] = useState(
    selectedCurators.length
      ? [[selectedCurators[0], Object.keys(curators[selectedCurators[0]])[0]]]
      : []
  );

  const selectedCategoriesOnly = selectedCategories.map(
    ([, category]) => category
  );

  const selectedCollectionsObject = {};
  for (const [curator, category] of Object.values(selectedCategories)) {
    for (const collection of curators[curator][category]) {
      selectedCollectionsObject[collection] = true;
    }
  }
  const selectedCollections = Object.keys(selectedCollectionsObject);

  const filteredItems = items.filter((item) => {
    const title: string = item.snippet ? item.snippet.title : item.title;
    const description = item.snippet
      ? item.snippet.description
      : item.contentSnippet || "";

    return (
      intersects(item.collections, selectedCollections) &&
      (title.toLowerCase().includes(search.toLowerCase()) ||
        description.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const availableCategories = [];
  for (const curator of selectedCurators) {
    availableCategories.push(
      ...Object.keys(curators[curator]).map((category) => [curator, category])
    );
  }

  return (
    <>
      <Head>
        <title>Game B Library</title>
      </Head>
      <main>
        <Container>
          <Heading>The Game B Library</Heading>
          <Search search={search} setSearch={setSearch} />
          <Pills label="Curators:">
            {Object.keys(curators).map((curator) => (
              <Pill
                key={curator}
                label={curator}
                active={selectedCurators.includes(curator)}
                onToggle={() =>
                  selectedCurators.includes(curator)
                    ? setSelectedCurators(
                        selectedCurators.filter((p) => p !== curator)
                      )
                    : setSelectedCurators([...selectedCurators, curator])
                }
              />
            ))}
          </Pills>
          <Pills label="Collections:">
            {availableCategories.map(([curator, category]) => (
              <Pill
                key={`${curator}-${category}`}
                label={category}
                active={selectedCategoriesOnly.includes(category)}
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
  const { origin } = absoluteUrl(req);
  const items = orderBy(
    Object.values(await (await fetch(`${origin}/data/items.json`)).json()),
    "publishedAt",
    "desc"
  );
  const curators = await (await fetch(`${origin}/data/curators.json`)).json();

  return {
    items,
    curators,
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
