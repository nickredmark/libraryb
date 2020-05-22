import Head from "next/head";
import { useRouter } from "next/router";
import { Container } from "../../components/container";
import { Heading } from "../../components/heading";
import { useState, useEffect } from "react";
import absoluteUrl from "next-absolute-url";
import fetch from "isomorphic-fetch";
import { ORIGIN } from "../constants";

const Medium = ({ query, item }) => {
  return (
    <>
      <Head>
        <title>{item.title}</title>
      </Head>
      <Container>
        <Heading date={item.publishedAt}>{item.title}</Heading>
        {item.content.bodyModel.paragraphs.map((paragraph) => {
          switch (paragraph.type) {
            case "H2":
              return <h2>{paragraph.text}</h2>;
            case "H3":
              return <h3>{paragraph.text}</h3>;
            case "H4":
              return <h4>{paragraph.text}</h4>;
            case "IMG":
              return (
                <figure>
                  <img
                    src={`https://miro.medium.com/${paragraph.metadata.id}`}
                  />
                </figure>
              );
            case "P":
              return <p>{paragraph.text}</p>;
            case "BQ":
              return <blockquote>{paragraph.text}</blockquote>;
            case "PQ":
              return <blockquote>{paragraph.text}</blockquote>;
            case "ULI":
              return (
                <ul>
                  <li>{paragraph.text}</li>
                </ul>
              );
            case "OLI":
              return (
                <ol>
                  <li>{paragraph.text}</li>
                </ol>
              );
            case "MIXTAPE_EMBED":
              return null;
            case "IFRAME":
              return <iframe src={paragraph.iframe.mediaResource.href} />;
            default:
              console.log(paragraph);
              throw new Error(`Unknown paragraph ${paragraph.type}`);
          }
        })}
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
