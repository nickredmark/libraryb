export const Search = ({ search, setSearch }) => (
  <div className="m-2">
    <label htmlFor="email" className="sr-only">
      Email
    </label>
    <div className="relative rounded-md shadow-sm">
      <input
        id="email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="form-input block w-full sm:text-sm sm:leading-5"
        placeholder="search term, e.g. 'situational assessment'"
      />
    </div>
  </div>
);
