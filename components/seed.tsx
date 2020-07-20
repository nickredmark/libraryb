import { useEffect, useState } from "react";
import { DATA_ORIGIN } from "../utils/constants";

export const Seed = () => {
  const [seed, setSeed] = useState([]);

  useEffect(() => {
    (async () => {
      setSeed(await (await fetch(`${DATA_ORIGIN}/seed.json`)).json());
    })();
  }, []);

  return (
    <div>
      <ul className="list-disc pl-4">
        {seed.map((item) => (
          <li>
            <a href={item.url}>
              {item.name} ({item.type})
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
