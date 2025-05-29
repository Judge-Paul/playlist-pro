import * as ytdl from "@distube/ytdl-core";
import { cookies } from "@/utils/cookies";
import cron from "node-cron";
import crypto from "crypto";
import redis from "@/lib/redis";
import { getRandomWholeNumber } from "./lib/utils";

const qualityMap: any = {
	"1080p": "ultraHigh",
	"720p": "high",
	"480p": "standard",
	"360p": "medium",
	"240p": "low",
	"144p": "ultraLow",
};

const agentOptions = {
	maxSockets: 10,
	maxFreeSockets: 5,
	timeout: 30000,
	maxRedirections: 5,
};

const agent = ytdl.createAgent(cookies, agentOptions);

export async function getDownloadLinks(videoIds: string[]) {
	if (!videoIds) {
		throw new Error("Missing videoIds");
	}

	try {
		const responses = await Promise.all(
			videoIds.map(async (videoId: string) => {
				return ytdl
					.getInfo(`https://www.youtube.com/watch?v=${videoId}`, {
						agent,
						requestOptions: {
							headers: {
								"User-Agent":
									"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
							},
						},
						playerClients: ["WEB"],
					})
					.then((info) => {
						const formats = ytdl.filterFormats(info.formats, "videoandaudio");

						const downloadLinks: any = {};
						formats.forEach((format) => {
							if (format.hasVideo && format.hasAudio && format.url) {
								const url = new URL(format.url);
								url.searchParams.set("title", info.videoDetails.title);
								downloadLinks[qualityMap[format.qualityLabel]] = {
									resolution: format.qualityLabel,
									format: format.container,
									link: url.toString(),
									size: format.contentLength,
								};
							}
						});
						return downloadLinks;
					})
					.catch((err) => {
						console.error(`${videoId} caused err:`, err);
						throw new Error(err);
					});
			}),
		);

		return responses;
	} catch (error) {
		console.error("Download links error:", error);
		throw new Error("Failed to generate download links");
	}
}

export async function keepDBAlive() {
	return cron
		.schedule(
			`0 ${getRandomWholeNumber(1, 5)},${getRandomWholeNumber(
				14,
				18,
			)},${getRandomWholeNumber(20, 23)} * * *`,
			async () => {
				const id = crypto.randomBytes(10).toString("hex");

				const data =
					crypto.randomBytes(60).toString("base64") +
					`\nSet at ${Date.now().toLocaleString()}`;

				await redis.set(id, data, { ex: 60 * 60 * 2 });
			},
		)
		.start();
}
