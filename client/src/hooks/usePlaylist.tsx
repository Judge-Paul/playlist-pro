import { fetcher } from "@/lib/utils";
import { Playlist } from "@/types";
import useSWRImmutable from "swr/immutable";

export const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;

const usePlaylist = (id: string) => {
  const playlist = useSWRImmutable(`${serverURL}/playlist?id=${id}`, fetcher);

  const data = playlist?.data?.data as unknown as Playlist;
  return { ...playlist, ...data };
};

export default usePlaylist;
