import Head from "next/head";
import { Container } from "../../components/container";
import { Heading } from "../../components/heading";
import fetch from "isomorphic-fetch";
import { DATA_ORIGIN } from "../../utils/constants";
import { Markdown } from "../../components/markdown";

const FacebookPost = ({ item, content }) => {
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

FacebookPost.getInitialProps = async ({ req, query }) => {
  const item = await (
    await fetch(`${DATA_ORIGIN}/facebook/${query.id}/item.json`)
  ).json();
  const content = await (
    await fetch(`${DATA_ORIGIN}/facebook/${query.id}/post.txt`)
  ).text();
  return { query, item, content };
};

export default FacebookPost;
