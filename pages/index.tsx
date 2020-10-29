import Head from "next/head";
import { FC } from "react";
import { Container } from "../components/container";
import { CardList } from "../components/card";
import fetch from "isomorphic-fetch";
import { orderBy, uniq, flatMap, Dictionary } from "lodash";
import { Heading } from "../components/heading";
import { Search } from "../components/form";
import { Pill, Pills } from "../components/pill";
import { DATA_ORIGIN } from "../utils/constants";
import { truncate, ItemCard } from "../components/item-card";
import { Item } from "../models/item";
import { useRouterState } from "../utils/router";
import { FaYoutube, FaMedium, FaVimeo, FaGoogle, FaFacebook, FaFile, FaBlog } from 'react-icons/fa';

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
  seed: { name: string, type: string, url: string}[];
  items: Item[];
  curators: Dictionary<Dictionary<string[]>>;
}> = ({ seed, items, curators }) => {
  const [query, updateQuery] = useRouterState({
    search: "",
    curators: Object.keys(curators)[0],
    categories: Object.keys(curators)
      .map((curator) => `${curator}-${Object.keys(curators[curator])[0]}`)
      .join("--"),
    sources: ""
  });
  const search = query.search;

  const selectedCurators = query.curators.split("-");
  const selectedCategories = query.categories
    .split("--")
    .map((category) => category.split("-"));

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

  let sources = [];

  const filteredItems = items.filter((item) => {
    const title: string = item.title;
    const description = truncate(item.description);

    const isInCollections = (
      (selectedItems.includes(item._id) ||
        intersects(item.collections, resources)) &&
      (title.toLowerCase().includes(search.toLowerCase()) ||
        description.toLowerCase().includes(search.toLowerCase()))
    );

    if (!isInCollections) {
      return false
    }

    sources.push(...item.collections)

    return true
  });

  sources = uniq(sources)

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
            setSearch={(search) => updateQuery({ search })}
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
                    updateQuery({
                      curators: curator,
                      categories: `${curator}-${
                        Object.keys(curators[curator])[0]
                      }`,
                    });
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
                    updateQuery({
                      categories: `${curator}-${category}`,
                    });
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
          <Pills label={`Sources for ${selectedCategoriesOnly[0]} collection:`}>
              {sources.map(source => <div className="mr-2 mb-2"><SourceContent collection={source} seed={seed}/></div>)}
          </Pills>
          <div className="m-2">
            Showing {filteredItems.length} / {items.length} entries:
          </div>
          <CardList>
            {filteredItems.map((item) => (
              <ItemCard key={item._id} item={item} collections={item.collections.map(collection => <SourceContent collection={collection} seed={seed}/>)}/>
            ))}
          </CardList>
        </div>
      </Container>
    </>
  );
};

const SourceContent = ({collection, seed}) => {
  const source = seed.find(c => c.url === collection)
  if (!source) {
    return null
  }
  return <a href={source.url} target="_blank" className="flex items-center text-xs underline"><span className="flex-none"><Icon className="flex-none" type={source.type}/></span><span className="ml-1">{source.name}</span></a>
}

const Icon = ({type}) => {
  switch (type) {
    case "youtube-playlist":
    case "youtube-channel":
      return <FaYoutube/>
    case "medium-user":
      return <FaMedium/>
    case "vimeo-user":
      return <FaVimeo/>
    case "google-doc":
      return <FaGoogle/>
    case "facebook-post":
      return <FaFacebook/>
    case "document":
      return <FaFile/>
    case "blog":
      return <FaBlog/>
    default:
      console.log(source.type)
      return null;
  }
}

export const getServerSideProps = async () => {
  const items: Item[] = orderBy(
    Object.values(await (await fetch(`${DATA_ORIGIN}/items.json`)).json()),
    "publishedAt",
    "desc"
  );
  const curators = await (await fetch(`${DATA_ORIGIN}/curators.json`)).json();
  const seed = await (await fetch(`${DATA_ORIGIN}/seed.json`)).json();

  return {
    props: {
      items,
      curators,
      seed,
    },
  };
};

export default Main;
