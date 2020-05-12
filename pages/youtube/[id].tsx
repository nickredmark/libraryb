import Head from "next/head";
import { useRouter } from "next/router";
import { Container } from "../../components/container";
import { Heading } from "../../components/heading";
import { useState, useEffect } from "react";
import absoluteUrl from "next-absolute-url";
import fetch from "isomorphic-fetch";

const Youtube = ({ query: { id }, library, transcript }) => {
  const video = library.videos.find(
    (video) =>
      (video.snippet.resourceId
        ? video.snippet.resourceId.videoId
        : video.id.videoId) === id
  );
  console.log(video);
  const [player, setPlayer] = useState();

  useEffect(() => {
    (window as any).onYouTubeIframeAPIReady = () => {
      const YT = (window as any).YT;
      const player = new YT.Player("player", {
        height: "300",
        width: "400",
        videoId: id,
        events: {
          onReady: () => setPlayer(player),
          onStateChange: () => {},
        },
      });
    };
    const tag = document.createElement("script");
    tag.src = `${location.protocol}//www.youtube.com/iframe_api`;
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }, []);

  return (
    <>
      <Head>
        <title>{video.title}</title>
      </Head>
      <Container>
        <Heading date={video.snippet.publishedAt}>
          {video.snippet.title}
        </Heading>
        <div className="flex">
          <div className="">
            <div id="player" />
          </div>
          <div className="">
            <ul>
              {transcript.map((line, i) => (
                <div key={i}>
                  <div>
                    {line.begin} - {line.end}
                  </div>
                  <div>{line.text}</div>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </>
  );
};

Youtube.getInitialProps = async ({ req, query }) => {
  const { origin } = absoluteUrl(req);

  const library = await (await fetch(`${origin}/data/library.json`)).json();
  const transcript = await (
    await fetch(`${origin}/data/youtube/${query.id}/transcript.json`)
  ).json();

  return { query, library, transcript };
};

export default Youtube;
