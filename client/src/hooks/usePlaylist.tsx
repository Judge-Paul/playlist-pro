import useSWRImmutable from "swr/immutable";

import { fetcher } from "@/lib/utils";
import { Quality } from "@/types";

const usePlaylist = (id: string) => {
	const qualities: Quality[] = [];
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
