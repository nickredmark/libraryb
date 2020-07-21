import Head from "next/head";
import { Container } from "../../components/container";
import { Heading } from "../../components/heading";
import fetch from "isomorphic-fetch";
import { DATA_ORIGIN } from "../../utils/constants";

const GoogleDoc = ({ item, content }) => {
  return (
    <>
      <Head>
        <title>{item.title}</title>
      </Head>
      <Container>
        <Heading date={item.publishedAt}>{item.title}</Heading>
        <div
          dangerouslySetInnerHTML={{
            __html: /<body[^>]*>((.|\s)*)<\/body>/.exec(content)[1],
          }}
        />
      </Container>
    </>
  );
};

GoogleDoc.getInitialProps = async ({ req, query }) => {
  const item = await (
    await fetch(`${DATA_ORIGIN}/google/${query.id}/item.json`)
  ).json();
  const content = await (
    await fetch(`${DATA_ORIGIN}/google/${query.id}/doc.html`)
  ).text();
  return { query, item, content };
};

export default GoogleDoc;
