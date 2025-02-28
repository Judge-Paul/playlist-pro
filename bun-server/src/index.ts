import { Hono } from "hono";
import { cors } from "hono/cors";
import * as archiver from "archiver";
import { Playlist, PlaylistItem, Quality } from "@types";
import { getQualities, sanitizeFileName } from "@/lib/utils";
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
			return c.json({ error: "Playlist not found" }, 404);
		}

		const stream = new ReadableStream({
			async start(controller) {
				const archive = archiver("zip", { zlib: { level: 9 } });

				archive.on("data", (chunk) => controller.enqueue(chunk));
				archive.on("end", () => controller.close());
				archive.on("error", (err) => controller.error(err));

				playlist.items.forEach(async (item: any) => {
					const downloadLink = item.downloadLinks[quality]?.link;
					const fileName = `${item.snippet.title}.mp4`;

					if (downloadLink) {
						const res = await fetch(downloadLink);
						if (!res.ok || !res.body) {
							console.error(
								`Failed to fetch: ${downloadLink} - Err status: ${res.statusText}`,
							);
							controller.error(
								new Error(`Failed to fetch video: ${res.statusText}`),
							);
							return;
						}

						archive.append(res.body, { name: fileName });
					}
				});

				archive.finalize();
			},
		});

		mixpanel.track("Download Playlist", { id, quality, name: playlist?.title });

		return new Response(stream, {
			headers: {
				"Content-Type": "application/zip",
				"Content-Disposition": `attachment; filename=ytplay.tech "${sanitizeFileName(
					playlist.title,
				)}.zip"`,
			},
		});
	} catch (error) {
		console.error(error);
		return c.json({ error: "Internal Server Error" }, 500);
	}
});

const port = Number(process.env.PORT || 3000);

export default {
	fetch: app.fetch,
	port,
	idleTimeout: 60,
};
