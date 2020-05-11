export const SubNav = ({ children }) => (
  <nav className="hidden md:flex space-x-10">{children}</nav>
);

export const NavItem = ({ active, href, children }) => (
  <a
    href={href}
    className={`text-base leading-6 font-medium ${
      active ? "text-gray-900" : "text-gray-500"
    } hover:text-gray-900 focus:outline-none focus:text-gray-900 transition ease-in-out duration-150`}
  >
    {children}
  </a>
);

export const MobileNav = ({ show, setShow, children }) => (
  <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
    <div className="rounded-lg shadow-lg">
      <div className="rounded-lg shadow-xs bg-white divide-y-2 divide-gray-50">
        <div className="pt-5 pb-6 px-5 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <img
                className="h-8 w-auto"
                src="/img/logos/workflow-mark-on-white.svg"
                alt="Game B Library"
              />
            </div>
            <Close onClick={() => setShow(false)} />
          </div>
          <div>
            <nav className="grid row-gap-8">{children}</nav>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const MobileNavItem = ({ children, href }) => (
  <a
    href={href}
    className="-m-3 p-3 flex items-center space-x-3 rounded-md hover:bg-gray-50 transition ease-in-out duration-150"
  >
    <div className="text-base leading-6 font-medium text-gray-900">
      {children}
    </div>
  </a>
);

export const Burger = ({ onClick }) => (
  <div className="-mr-2 -my-2 md:hidden">
    <button
      onClick={onClick}
      type="button"
      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
    >
      <svg
        className="h-6 w-6"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  </div>
);

export const Close = ({ onClick }) => (
  <div className="-mr-2">
    <button
      onClick={onClick}
      type="button"
      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
    >
      <svg
        className="h-6 w-6"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
);
