import Head from "next/head";
import { useRef, useState } from "react";
import { Container } from "../components/container";
import { List, ListItem } from "../components/list";
import { Card, CardList } from "../components/card";
import fetch from "isomorphic-fetch";
import { orderBy, uniq, flatMap } from "lodash";
import absoluteUrl from "next-absolute-url";
import { Heading } from "../components/heading";
import { Search } from "../components/form";
import { Pill, Pills } from "../components/pill";
import { ORIGIN } from "../utils/constants";
import { Paragraph } from "../components/paragraph";

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

const getDescription = (item, trunc?) =>
  item.snippet
    ? trunc
      ? truncate(item.snippet.description)
      : item.snippet.description
    : (item.previewContent ? (
        <span>
          {item.previewContent.bodyModel.paragraphs.map((p) => (
            <Paragraph paragraph={p} excerpt={true} />
          ))}
        </span>
      ) : (
        ""
      )) || "";

const Main = ({ items, curators }) => {
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
    const title: string = item.snippet ? item.snippet.title : item.title;
    const description = item.snippet
      ? truncate(item.snippet.description)
      : (item.previewContent
          ? item.previewContent.bodyModel.paragraphs
              .map((p) => p.text)
              .join(" ")
          : "") || "";

    return (
      (selectedItems.includes(item.id) ||
        intersects(item.collections, resources)) &&
      (title.toLowerCase().includes(search.toLowerCase()) ||
        description.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <>
      <Head>
        <title>Game B Library</title>
      </Head>
      <Container>
        <Heading>The Game B Library ({filteredItems.length} results)</Heading>
        <div className="flex-shrink overflow-auto">
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
          <CardList>
            {filteredItems.map((item) => {
              const img = item.snippet
                ? item.snippet.thumbnails.medium.url
                : item.previewImage.id
                ? `https://miro.medium.com/max/320/${item.previewImage.id}`
                : "";
              const title = item.snippet ? item.snippet.title : item.title;
              const description = getDescription(item, true);
              const url = item.snippet
                ? `/youtube/${item._id}`
                : `/medium/${item._id}`;
              return (
                <Card key={url} img={img} title={title} href={url}>
                  {description}
                </Card>
              );
            })}
          </CardList>
        </div>
      </Container>
    </>
  );
};

Main.getInitialProps = async ({ req }) => {
  const items = orderBy(
    Object.values(await (await fetch(`${ORIGIN}/items.json`)).json()),
    "publishedAt",
    "desc"
  );
  const curators = await (await fetch(`${ORIGIN}/curators.json`)).json();

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
