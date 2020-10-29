import { Card } from "./card";
import { Pill } from "./pill";
import { Item } from "../models/item";
import { FC } from "react";

export const ItemCard: FC<{ item: Item, collections?: string[] }> = ({ item, collections }) => (
  <Card img={getImg(item)} title={getTitle(item)} href={getUrl(item)}>
    {collections && <div className="mb-1">{collections}</div>}
    {getDescription(item, true)}
  </Card>
);

export const getImg = (item: Item) => item.img;

export const getTitle = (item: Item) => item.title;

export const getUrl = (item: Item) => `${item.type.split("-")[0]}/${item._id}`;

const getDescription = (item: Item, trunc?) =>
  trunc ? truncate(item.description) : item.description;

const LIMIT = 100;

export const truncate = (text: string) => {
  if (text.length <= LIMIT) {
    return text;
  }

  return `${text.substr(0, LIMIT)}...`;
};
