export const Pills = ({ label, children }) => (
  <div className="m-1">
    <label className="m-1 block text-sm font-medium leading-5 text-gray-700">
      {label}
    </label>
    <div className="flex flex-wrap">{children}</div>
  </div>
);

export const Pill = ({ label, active, canDeselect, onToggle }) => (
  <span
    onClick={onToggle}
    className={`m-1 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium leading-5 ${
      active ? "bg-indigo-800 text-indigo-100" : "bg-indigo-100 text-indigo-800"
    } cursor-pointer`}
  >
    {label}
    {canDeselect && active && (
      <button
        type="button"
        className="flex-shrink-0 -mr-0.5 ml-1.5 inline-flex text-indigo-400 focus:outline-none focus:text-indigo-200"
      >
        <svg
          className="h-2 w-2"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 8 8"
        >
          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
        </svg>
      </button>
    )}
  </span>
);
