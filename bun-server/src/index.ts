import { Hono } from "hono";
import { cors } from "hono/cors";
import { Playlist, PlaylistItem } from "@types";
import { getQualities } from "@/lib/utils";
import { getDownloadLinks } from "@/services";
import redis from "@/lib/redis";
import mixpanel from "@/lib/mixpanel";

const app = new Hono();
const apiKey = process.env.GOOGLE_API_KEY;

app.use(
	"/playlist",
	cors({
		origin: ["https://yt.jadge.me"],
	}),
);

app.get("/playlist", async (c) => {
	if (!apiKey) {
		c.status(401);
		return c.json({ error: "API Key not found" });
	}

	const id = c.req.query("id");

	if (!id) {
		c.status(400);
		return c.json({ error: "Missing playlistId" });
	}

	const cachedPlaylist = await redis.get<Playlist>(id);
	if (cachedPlaylist) {
		mixpanel.track("Fetch Playlist", {
			id: id,
			fromCache: true,
			title: cachedPlaylist?.title,
			quantity: cachedPlaylist?.items.length,
		});
		return c.json(cachedPlaylist);
	}

	try {
		const res = await fetch(
			`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${id}&key=${apiKey}`,
		);

		if (res.ok) {
			const data = await res.json();
			let items: PlaylistItem[] = data.items;

			if (!items || items.length === 0) {
				c.status(404);
				return c.json({ error: "Playlist Items Not Found" });
			}

			const videoIds = items.map((item) => item.snippet.resourceId.videoId);

			const [linksRes, playlistRes] = await Promise.all([
				getDownloadLinks(videoIds),
				fetch(
					`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&id=${id}&key=${apiKey}`,
				),
			]);

			if (!playlistRes.ok) {
				throw new Error("Failed getting playlist data");
			}

			const playlistData = await playlistRes.json();

			items = items.map((item: PlaylistItem, index: number) => {
				return {
					id: item.id,
					snippet: {
						title: item.snippet.title,
						description: item.snippet.description,
						thumbnails: item.snippet.thumbnails,
						resourceId: {
							videoId: item.snippet.resourceId.videoId,
						},
					},
					downloadLinks: linksRes[index],
					qualities: Object.getOwnPropertyNames(linksRes[index]),
				};
			});
			const qualities = getQualities(items) ?? [];
			const playlist = {
				title: playlistData.items[0].snippet.title,
				description: playlistData.items[0].snippet.description,
				items,
				qualities,
			};

			redis.set(id, playlist);
			redis.expire(id, 21600);

			mixpanel.track("Fetch Playlist", {
				id: id,
				fromCache: false,
				title: playlist?.title,
				quantity: playlist?.items.length,
			});
			return c.json(playlist);
		} else {
			c.status(500);
			c.json({ error: "Failed getting playlists data" });
		}
	} catch (error: any) {
		// console.error(error);
		// if (axios.isAxiosError(error)) {
		//   return res.status(500).json({ error });
		// }
		// return res.status(500).json({ error });
		c.status(500);
		return c.json({ error: "Unexpected error occurred" });
	}
});

const port = Number(process.env.PORT || 3000);

export default {
	fetch: app.fetch,
	port,
	idleTimeout: 60,
};
