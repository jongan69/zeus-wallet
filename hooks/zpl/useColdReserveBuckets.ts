import useSWR from "swr";

import { useZplClient } from "@/contexts/ZplClientProvider";

function useColdReserveBuckets() {
  const zplClient = useZplClient();
  const { data, mutate, isLoading } = useSWR(
    zplClient ? [zplClient, "getColdReserveBuckets"] : null,
    ([zplClient]) => zplClient.getColdReserveBuckets(),
    {
      dedupingInterval: 3600000,
    }
  );

  return {
    data: data ?? [],
    mutate,
    isLoading,
  };
}

export default useColdReserveBuckets;
