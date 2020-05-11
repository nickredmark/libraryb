export const Heading = ({ date, children }) => (
  <div className="lg:flex lg:items-center lg:justify-between">
    <div className="flex-1 min-w-0">
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
        {children}
      </h2>
      <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap">
        <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
          <svg
            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
          Published {date}
        </div>
      </div>
    </div>
  </div>
);
