import { useRouter } from "next/router";

const Youtube = ({ query }) => {
  const transcript = require(`../../data/youtube/${query.id}/transcript.json`);

  return (
    <div>
      <ul>
        {transcript.map((line) => (
          <div>
            <div>
              {line.begin} - {line.end}
            </div>
            <div>{line.text}</div>
          </div>
        ))}
      </ul>
    </div>
  );
};

Youtube.getInitialProps = ({ query }) => {
  return { query };
};

export default Youtube;
