import Head from "next/head";
import { useRouter } from "next/router";
import { Container } from "../../components/container";
import { Heading } from "../../components/heading";
import { useState, useEffect } from "react";
import absoluteUrl from "next-absolute-url";
import fetch from "isomorphic-fetch";

const Medium = ({ query, item }) => {
  return (
    <>
      <Head>
        <title>{item.title}</title>
      </Head>
      <Container>
        <Heading date={item.publishedAt}>{item.title}</Heading>
        <div
          dangerouslySetInnerHTML={{
            __html: item.content || item["content:encoded"],
          }}
        />
      </Container>
    </>
  );
};

Medium.getInitialProps = async ({ req, query }) => {
  const origin = "https://librarybdata.now.sh";

  const item = await (
    await fetch(`${origin}/medium/${query.id}/item.json`)
  ).json();

  return { query, item };
};

export default Medium;
