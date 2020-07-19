import { Card } from "./card";
import { Paragraph } from "./paragraph";

export const ItemCard = ({ item }) => {
  const img = item.snippet
    ? item.snippet.thumbnails.medium.url
    : item.previewImage && item.previewImage.id
    ? `https://miro.medium.com/max/320/${item.previewImage.id}`
    : item.pictures
    ? item.pictures.sizes.find((p) => p.width > 320).link
    : "";
  const title = item.snippet ? item.snippet.title : item.title || item.name;
  const description = getDescription(item, true);
  const url = item.snippet
    ? `/youtube/${item._id}`
    : item.type === "video"
    ? `/vimeo/${item._id}`
    : `/medium/${item._id}`;
  return (
    <Card img={img} title={title} href={url}>
      {description}
    </Card>
  );
};

const getDescription = (item, trunc?) =>
  item.snippet
    ? trunc
      ? truncate(item.snippet.description)
      : item.snippet.description
    : (item.previewContent ? (
        <span>
          {item.previewContent.bodyModel.paragraphs.map((p) => (
            <Paragraph paragraph={p} excerpt={true} />
          ))}
        </span>
      ) : item.description ? (
        trunc ? (
          truncate(item.description)
        ) : (
          item.description
        )
      ) : (
        ""
      )) || "";

const LIMIT = 100;

export const truncate = (text) => {
  if (text.length <= LIMIT) {
    return text;
  }

  return `${text.substr(0, LIMIT)}...`;
};
