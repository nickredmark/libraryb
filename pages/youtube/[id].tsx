import Head from "next/head";
import { useRouter } from "next/router";
import { Container } from "../../components/container";
import { Heading } from "../../components/heading";
import { useState, useEffect } from "react";
import absoluteUrl from "next-absolute-url";
import fetch from "isomorphic-fetch";
import moment from "moment";

const Youtube = ({ query: { id }, item, transcript }) => {
  const [player, setPlayer] = useState<any>();

  useEffect(() => {
    if (!player) {
      const initPlayer = () => {
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
      if (!(window as any).YT) {
        (window as any).onYouTubeIframeAPIReady = initPlayer;
        const tag = document.createElement("script");
        tag.src = `${location.protocol}//www.youtube.com/iframe_api`;
        var firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        initPlayer();
      }
    }
  }, [player]);

  return (
    <>
      <Head>
        <title>{item.title}</title>
      </Head>
      <Container>
        <Heading date={item.snippet.publishedAt}>{item.snippet.title}</Heading>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-1/2 xl:w-1/3">
            <div id="player" />
            <p className="p-2">{item.snippet.description}</p>
          </div>
          {transcript && (
            <div className="flex-auto h-64 max-h-screen overflow-auto">
              <ul>
                {transcript.map((line, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      player &&
                      player.seekTo(moment.duration(line.begin).asSeconds())
                    }
                    className="flex cursor-pointer"
                  >
                    <div className="p-2 text-xs align-baseline">
                      {line.begin} - {line.end}
                    </div>
                    <div className="p-2">{line.text}</div>
                  </div>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

Youtube.getInitialProps = async ({ req, query }) => {
  const origin = "https://librarybdata.now.sh";

  const item = await (
    await fetch(`${origin}/youtube/${query.id}/item.json`)
  ).json();
  let transcript;
  try {
    transcript = await (
      await fetch(`${origin}/youtube/${query.id}/transcript.json`)
    ).json();
  } catch (e) {}

  return { query, item, transcript };
};

export default Youtube;
