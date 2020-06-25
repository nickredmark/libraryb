export const Container = ({ className = "", children }) => (
  <div
    className={`container flex flex-col flex-shrink overflow-hidden mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
  >
    {children}
  </div>
);
