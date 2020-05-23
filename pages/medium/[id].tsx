import Head from "next/head";
import { useRouter } from "next/router";
import { Container } from "../../components/container";
import { Heading } from "../../components/heading";
import { useState, useEffect } from "react";
import absoluteUrl from "next-absolute-url";
import fetch from "isomorphic-fetch";
import { ORIGIN } from "../../utils/constants";
import { Paragraph } from "../../components/paragraph";

const Medium = ({ query, item }) => {
  return (
    <>
      <Head>
        <title>{item.title}</title>
      </Head>
      <Container>
        <Heading date={item.publishedAt}>{item.title}</Heading>
        {item.content.bodyModel.paragraphs.map((paragraph) => (
          <Paragraph paragraph={paragraph} />
        ))}
      </Container>
    </>
  );
};

Medium.getInitialProps = async ({ req, query }) => {
  const item = await (
    await fetch(`${ORIGIN}/medium/${query.id}/item.json`)
  ).json();

  return { query, item };
};

export default Medium;
