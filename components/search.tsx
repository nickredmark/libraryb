import { CardList, Card } from "./card";

export const SearchResults = ({ results }) => (
  <CardList>
    {results &&
      results.hits.hits.map((result) => {
        return (
          <Card
            key={result._id}
            href={`${result._source.type.split("-")[0]}/${result._id}`}
            img={result._source.img}
            title={result._source.title}
          >
            {(
              result.highlight.content ||
              result.highlight.description ||
              result.highlight.title
            )?.map((highlight) => (
              <div className="m-4 highlight">
                ...
                <span dangerouslySetInnerHTML={{ __html: highlight }} />
                ...
              </div>
            ))}
          </Card>
        );
      })}
  </CardList>
);
