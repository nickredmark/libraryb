export const Search = ({ search, setSearch, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <div className="m-2 flex flex-row">
      <div className="relative rounded-md shadow-sm flex-grow pr-1">
        <input
          id="email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input block w-full sm:text-sm sm:leading-5"
          placeholder="search term, e.g. 'situational assessment'"
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        type="submit"
      >
        Full-Text Search
      </button>
    </div>
  </form>
);
