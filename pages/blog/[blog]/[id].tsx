import Head from "next/head";
import { Container } from "../../../components/container";
import { Heading } from "../../../components/heading";
import fetch from "isomorphic-fetch";
import { DATA_ORIGIN } from "../../../utils/constants";
import { Markdown } from "../../../components/markdown";

const Document = ({ item }) => {
  return (
    <>
      <Head>
        <title>{item.title.rendered}</title>
      </Head>
      <Container>
        <Heading date={item.publishedAt}>{item.title.rendered}</Heading>
        <div dangerouslySetInnerHTML={{ __html: item.content.rendered }} />
      </Container>
    </>
  );
};

Document.getInitialProps = async ({ req, query }) => {
  const item = await (
    await fetch(`${DATA_ORIGIN}/blog/${query.blog}/${query.id}/item.json`)
  ).json();
  return { query, item };
};

export default Document;
