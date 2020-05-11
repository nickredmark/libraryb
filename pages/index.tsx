import Head from "next/head";
import { useRef } from "react";

const library = require("../data/library.json");

export default () => {
  const search = useRef(null);
  return (
    <div>
      <Head>
        <title>Game B Library</title>
      </Head>
      <main>
        {library.map((item, i) => {
          switch (item.type) {
            case "youtube-channel":
            case "youtube-playlist":
              return (
                <ul key={i}>
                  <li>
                    <div>{item.url}</div>
                    <ul>
                      {item.videos.map((video, j) => {
                        const thumbnail =
                          video.snippet.thumbnails.standard ||
                          video.snippet.thumbnails.default;
                        return (
                          <li key={j}>
                            <a
                              href={`/youtube/${
                                video.snippet.resourceId
                                  ? video.snippet.resourceId.videoId
                                  : video.id.videId
                              }`}
                            >
                              <img src={thumbnail.url} width="100px" />
                              <h3>{video.snippet.title}</h3>
                              <div>{video.snippet.description}</div>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                </ul>
              );
          }
        })}
      </main>
      <footer></footer>
    </div>
  );
};
