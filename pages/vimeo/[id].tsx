import Head from "next/head";
import { useRouter } from "next/router";
import { Container } from "../../components/container";
import { Heading } from "../../components/heading";
import { useState, useEffect } from "react";
import absoluteUrl from "next-absolute-url";
import fetch from "isomorphic-fetch";
import moment from "moment";
import { DATA_ORIGIN } from "../../utils/constants";

const Vimeo = ({ query: { id }, item, transcript, plainTranscript }) => {
  return (
    <>
      <Head>
        <title>{item.name}</title>
      </Head>
      <Container>
        <Heading date={item.publishedAt}>{item.name}</Heading>
        <div className="flex flex-shrink flex-row flex-wrap items-stretch overflow-auto">
          <div className="w-full lg:w-1/2 xl:w-1/3">
            <div dangerouslySetInnerHTML={{ __html: item.embed.html }} />
            <p className="p-2">{item.description}</p>
          </div>
        </div>
      </Container>
    </>
  );
};

Vimeo.getInitialProps = async ({ req, query }) => {
  const item = await (
    await fetch(`${DATA_ORIGIN}/vimeo/${query.id}/item.json`)
  ).json();

  return { query, item };
};

export default Vimeo;
