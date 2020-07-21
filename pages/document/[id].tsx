import Head from "next/head";
import { Container } from "../../components/container";
import { Heading } from "../../components/heading";
import fetch from "isomorphic-fetch";
import { DATA_ORIGIN } from "../../utils/constants";
import { Markdown } from "../../components/markdown";

const Document = ({ item, content }) => {
  return (
    <>
      <Head>
        <title>{item.title}</title>
      </Head>
      <Container>
        <Heading date={item.publishedAt}>{item.title}</Heading>
        <Markdown content={content} />
      </Container>
    </>
  );
};

Document.getInitialProps = async ({ req, query }) => {
  const item = await (
    await fetch(`${DATA_ORIGIN}/document/${query.id}/item.json`)
  ).json();
  const content = await (
    await fetch(`${DATA_ORIGIN}/document/${query.id}/doc.md`)
  ).text();
  return { query, item, content };
};

export default Document;
