import { useState, FC } from "react";
import { Quote } from "./quote";
import slugify from "slugify";
import { Dictionary } from "lodash";
import { Item } from "../models/item";

export const Term: FC<{ items: Dictionary<Item>; term: string; data: any }> = ({
  items,
  term,
  data,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-4">
      <div
        className="font-bold text-lg cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span className="text-xs w-4">{open ? "▼" : "►"}</span> {term}
      </div>
      {open && (
        <TermBody
          className="mt-4 ml-4 border-gray-200 border-b clearfix"
          term={term}
          data={data}
          items={items}
        />
      )}
    </div>
  );
};

export const TermBody: FC<{
  className: string;
  term: string;
  data: any;
  items: Dictionary<Item>;
  page?: boolean;
}> = ({ className = undefined, term, data, items, page = false }) => (
  <div className={className}>
    {data.synonyms && (
      <p>
        Synonyms:{" "}
        {data.synonyms.map((synonym, i) => (
          <span key={i}>
            {i > 0 && ", "}
            <em>{synonym}</em>
          </span>
        ))}
      </p>
    )}
    {data.related.length > 0 && (
      <p>
        Related:{" "}
        {data.related.map((related, i) => (
          <span key={i}>
            {i > 0 && ", "}
            <a
              className="text-black font-bold"
              href={`/term/${slugify(related, { lower: true })}`}
            >
              {related}
            </a>
          </span>
        ))}
      </p>
    )}
    {page && <h3>Selected quotes about "{term}"</h3>}
    {data.quotes && (
      <div>
        {data.quotes.map((quote, i) => (
          <Quote key={i} item={items[quote.item]} quote={quote.quote} />
        ))}
      </div>
    )}
    {!page && (
      <p>
        <a
          className="text-gray-400 underline text-sm"
          href={`/term/${slugify(term, { lower: true })}`}
        >
          Go to term page
        </a>
      </p>
    )}
  </div>
);
