import { getUrl, getTitle } from "./item-card";
import { Markdown } from "./markdown";
import { FC } from "react";
import { Item } from "../models/item";

export const Quote: FC<{ item: Item; quote: string }> = ({ item, quote }) => (
  <div className="clearfix border-gray-200 mb-2">
    <div className="text-xl mt-2 mb-2">
      <Markdown content={`"${quote}"`} />
    </div>
    {item && (
      <div className="float-right mb-2">
        from <a href={getUrl(item)}>{getTitle(item)}</a>
      </div>
    )}
  </div>
);
