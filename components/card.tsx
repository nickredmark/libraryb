export const CardList = ({ children }) => (
  <div>
    <ul className="flex flex-wrap">{children}</ul>
  </div>
);

export const Card = ({ img, href, title, children }) => (
  <li className="m-2 rounded overflow-hidden shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
    <a href={href}>
      <img className="w-full" src={img} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{children}</p>
      </div>
    </a>
  </li>
);
