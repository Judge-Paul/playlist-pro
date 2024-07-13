import express, { Request, Response } from "express";
import axios from "axios";
import JSZip from "jszip";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { Redis } from "@upstash/redis";
import { PlaylistItem, Quality } from "./@types";
import mixpanel from "./mixpanel";

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT ?? "") || 8080;
const clientURL = process.env.CLIENT_URL;
const redisURL = process.env.REDIS_URL || "";
const redisToken = process.env.REDIS_TOKEN || "";

const redis = new Redis({
	url: redisURL,
	token: redisToken,
});

app.use(morgan("combined"));
app.use(express.json({ limit: "400kb" }));
app.use(cors({ origin: clientURL }));

app.get("/", (req: Request, res: Response) => {
	res.send(`Go to /createZip to get ZIP file`);
});

app.get("/createZip", async (req: Request, res: Response) => {
	const id = req.query.id as string;
	const quality = req.query.quality as Quality;

	if (!id) return res.status(400).json({ error: "Playlist id not specified" });
	if (!quality) return res.status(400).json({ error: "Quality not specified" });

	try {
		const playlist: any = await redis.get(id);
		if (!playlist) {
			return res.status(404).json({ error: "Playlist not found" });
		}
		const zip = new JSZip();

		let totalSize = 0;
		await Promise.all(
			playlist.items.map(async (item: PlaylistItem) => {
				const downloadLink = item.downloadLinks[quality]?.link;
				const fileName = `${item.snippet.title} ${clientURL}`;
				if (downloadLink) {
					const response = await axios.get(downloadLink, {
						responseType: "stream",
					});
					const size = response.headers["content-length"] ?? 0;
					totalSize += parseInt(size);
					zip.file(fileName, response.data, { binary: true });
				}
			}),
		);
		res.setHeader("Content-Type", "application/zip");
		res.setHeader(
			"Content-Disposition",
			`attachment; filename=ytplay.tech ${playlist.title}.zip`,
		);
		res.setHeader("Content-Length", totalSize);
		mixpanel.track("Download Playlist", { id, quality, name: playlist?.title });
		zip.generateNodeStream({ streamFiles: true }).pipe(res);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
