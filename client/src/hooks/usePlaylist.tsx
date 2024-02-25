import { fetcher } from "@/lib/utils";
import { Quality } from "@/types";
import useSWRImmutable from "swr/immutable";

const usePlaylist = (id: string) => {
  let qualities: Quality[] = [];
  const { data, error } = useSWRImmutable(
    `/api/playlistItems?id=${id}`,
    fetcher,
  );

  if (data?.error || error) {
    return { error: "Failed to get playlist items", qualities };
  }

  return { data, error };
};

export default usePlaylist;
