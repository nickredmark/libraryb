import { Button } from "./button";

export const Search = ({
  search,
  setSearch,
  onSubmit,
  placeholder = "search term, e.g. 'situational assessment'",
}) => (
  <form onSubmit={onSubmit}>
    <div className="m-2 flex flex-row">
      <div className="relative rounded-md shadow-sm flex-grow pr-1">
        <input
          id="email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input block w-full sm:text-sm sm:leading-5"
          placeholder={placeholder}
        />
      </div>
      <Button type="submit">Full-Text Search</Button>
    </div>
  </form>
);
