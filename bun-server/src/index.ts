import { Hono } from "hono";
import { cors } from "hono/cors";
import axios from "axios";
import archiver from "archiver";
import { Playlist, PlaylistItem, Quality } from "@types";
import { getQualities } from "@/lib/utils";
import { getDownloadLinks } from "@/services";
import redis from "@/lib/redis";
import mixpanel from "@/lib/mixpanel";

const app = new Hono();
const apiKey = process.env.GOOGLE_API_KEY;

app.use(
	"/playlist",
	cors({
		origin: ["http://localhost:3000", "https://yt.jadge.me"],
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
		const res = await axios.get(
			`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${id}&key=${apiKey}`,
		);

		if (res.status === 200) {
			const data = res.data;
			let items: PlaylistItem[] = data.items;

			if (!items || items.length === 0) {
				c.status(404);
				return c.json({ error: "Playlist Items Not Found" });
			}

			const videoIds: string[] = [];

			items = items.filter((item) => {
				const { title, description } = item.snippet;
				const isPrivateOrDeleted =
					(title === "Private video" &&
						description === "This video is private.") ||
					(title === "Deleted video" &&
						description === "This video is unavailable.");

				if (!isPrivateOrDeleted) {
					videoIds.push(item.snippet.resourceId.videoId);
				}

				return !isPrivateOrDeleted;
			});

			const [linksRes, playlistRes] = await Promise.all([
				getDownloadLinks(videoIds),
				axios.get(
					`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&id=${id}&key=${apiKey}`,
				),
			]);

			const playlistData = await playlistRes.data;

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
		console.error(error);
		// if (axios.isAxiosError(error)) {
		//   return res.status(500).json({ error });
		// }
		// return res.status(500).json({ error });
		c.status(500);
		return c.json({ error: "Unexpected error occurred" });
	}
});

app.get("/download/zip", async (c) => {
	try {
		const id = c.req.query("id") as string;
		const quality = c.req.query("quality") as Quality;

		const playlist: any = await redis.get(id);

		if (!playlist) {
			return c.redirect(`https://yt.jadge.me/download/${id}`);
		}

		const archive = archiver("zip", {
			zlib: { level: 9 },
		});

		await Promise.all(
			playlist.items.map(async (item: PlaylistItem) => {
				const downloadLink = item.downloadLinks[quality]?.link;
				const fileName = `${item.snippet.title}`;
				if (downloadLink) {
					const response = await axios.get(downloadLink, {
						responseType: "stream",
					});
					const size = response.headers["content-length"] ?? 0;
					// totalSize += parseInt(size);
					archive.append(response.data, { name: fileName });
				}
			}),
		);
		archive.finalize();
		c.header("Content-Type", "application/zip");
		c.header(
			"Content-Disposition",
			`attachment; filename=yt.jadge.me ${playlist.title}.zip`,
		);
		mixpanel.track("Download Playlist", { id, quality, name: playlist?.title });
		return c.body(archive as unknown as ReadableStream);
	} catch (error) {
		console.error(error);
		return c.text("Failed", 500);
	}
});

const port = Number(process.env.PORT || 3000);

export default {
	fetch: app.fetch,
	port,
	idleTimeout: 60,
};
