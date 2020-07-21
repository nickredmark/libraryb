import { Card } from "./card";
import { Paragraph } from "./paragraph";

export const ItemCard = ({ item }) => (
  <Card img={getImg(item)} title={getTitle(item)} href={getUrl(item)}>
    {getDescription(item, true)}
  </Card>
);

export const getImg = (item) =>
  item.snippet
    ? item.snippet.thumbnails.medium.url
    : item.previewImage && item.previewImage.id
    ? `https://miro.medium.com/max/320/${item.previewImage.id}`
    : item.pictures
    ? item.pictures.sizes.find((p) => p.width > 320).link
    : "";

export const getTitle = (item) =>
  item.snippet
    ? item.snippet.title
    : item.title
    ? item.title.rendered || item.title
    : item.name;

export const getUrl = (item) => `${item.type.split("-")[0]}/${item._id}`;

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
