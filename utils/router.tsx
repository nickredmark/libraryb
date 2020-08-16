import { useRouter } from "next/router";
import { stringify } from "qs";

export const useRouterState = (defaults: any) => {
  const router = useRouter();
  return [
    { ...defaults, ...router.query },
    (update) => {
      const url = `${router.pathname}?${stringify(
        {
          ...router.query,
          ...update,
        },
        {
          encode: false,
        }
      )}`;
      router.push(url, undefined, { shallow: true });
    },
  ];
};
