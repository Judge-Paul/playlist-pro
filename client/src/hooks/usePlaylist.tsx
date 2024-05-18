import { fetcher } from "@/lib/utils";
import { Playlist } from "@/types";
import useSWRImmutable from "swr/immutable";

const usePlaylist = (id: string) => {
  const playlist = useSWRImmutable(`/api/playlist?id=${id}`, fetcher);

  const data = playlist?.data?.data as unknown as Playlist;
  return { ...playlist, ...data };
};

export default usePlaylist;
