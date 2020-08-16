export const Paragraph = ({ paragraph, excerpt = false }) => {
  switch (paragraph.type) {
    case "H2":
      return <h2>{paragraph.text}</h2>;
    case "H3":
      if (excerpt) {
        return null;
      }
      return <h3>{paragraph.text}</h3>;
    case "H4":
      return <h4>{paragraph.text}</h4>;
    case "IMG":
      if (excerpt) {
        return null;
      }
      return (
        <figure>
          <img src={`https://miro.medium.com/${paragraph.metadata.id}`} />
        </figure>
      );
    case "P":
      return <p className="pb-2">{paragraph.text}</p>;
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
    case "PRE":
      return <blockquote className="pb-2">{paragraph.text}</blockquote>;
    default:
      console.log(paragraph);
      throw new Error(`Unknown paragraph ${paragraph.type}`);
  }
};
