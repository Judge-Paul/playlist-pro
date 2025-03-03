import { fetcher } from "@/lib/utils";
import { Playlist } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import useSWRImmutable from "swr/immutable";

export const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;

const usePlaylist = (id: string) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const swr = useSWRImmutable<Playlist>(
    id ? `${serverURL}/playlist?id=${id}` : null,
    async (url: string) => (await fetcher(url)).data,
  );

  const data = swr?.data as unknown as Playlist;

  const fetchMore = async (nextPageToken: string) => {
    if (!id || !nextPageToken) return;
    setIsLoadingMore(true);

    const moreData = await fetcher(
      `${serverURL}/playlist?id=${id}&nextPageToken=${nextPageToken}`,
    )
      .then((res) => res.data)
      .catch(() => toast.error("Failed to fetch more data"))
      .finally(() => setIsLoadingMore(false));

    swr.mutate((prevData) => {
      if (!prevData || !moreData) return prevData;
      return {
        ...prevData,
        items: [...prevData.items, ...moreData.items],
        nextPageToken: moreData.nextPageToken,
      };
    }, false);
  };

  return {
    ...swr,
    ...data,
    isLoadingMore,
    fetchMore,
  };
};

export default usePlaylist;
