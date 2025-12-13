import { SWRConfiguration } from "swr";

export const swrOption: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
  revalidateOnReconnect: false,
};
