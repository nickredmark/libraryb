import Head from "next/head";
import { useRouter } from "next/router";
import { Container } from "../../components/container";
import { Heading } from "../../components/heading";
import { useState, useEffect } from "react";

const Youtube = ({ query }) => {
  const transcript = require(`../../data/youtube/${query.id}/transcript.json`);
  const library = require(`../../data/library.json`);
  const video = library.videos.find((video) =>
    video.snippet.resourceId
      ? video.snippet.resourceId.videoId
      : video.id.videoId
  );
  const [player, setPlayer] = useState();

  useEffect(() => {
    (window as any).onYouTubeIframeAPIReady = () => {
      const YT = (window as any).YT;
      const player = new YT.Player("player", {
        height: "300",
        width: "400",
        videoId: query.id,
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
        {process.browser && (
          <script
            src={`${location.protocol}//www.youtube.com/iframe_api`}
            onLoad={() => {
              console.log("wtfff");
              console.log((window as any).YT);
            }}
          />
        )}
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

Youtube.getInitialProps = ({ query }) => {
  return { query };
};

export default Youtube;
