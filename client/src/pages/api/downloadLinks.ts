import { NextApiRequest, NextApiResponse } from "next";
import ytdl from "ytdl-core";

type Resolution = "144p" | "240p" | "360p" | "480p" | "720p" | "1080p";

// If you use this type, you can remove the eslint-disable-next-line comment
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Quality =
	| "ultraHigh"
	| "high"
	| "medium"
	| "standard"
	| "low"
	| "ultraLow";

// If you use this interface, you can remove the eslint-disable-next-line comment
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface DownloadLinks {
	[quality: string]: {
		resolution: Resolution;
		format: string;
		link: string;
		size: number;
	};
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const videoIds = JSON.parse(req.query.videoIds as string);

	if (!videoIds) {
		return res.status(400).json({ error: "Missing videoIds" });
	}

	const qualityMap: any = {
		"1080p": "ultraHigh",
		"720p": "high",
		"480p": "standard",
		"360p": "medium",
		"240p": "low",
		"144p": "ultraLow",
	};
	try {
		const responses = await Promise.all(
			videoIds.map(async (videoId: string) => {
				try {
					const info = await ytdl.getInfo(
						`https://www.youtube.com/watch?v=${videoId}`,
					);
					const formats = ytdl.filterFormats(info.formats, "videoandaudio");

					const downloadLinks: any = {};
					formats.forEach((format) => {
						if (format.hasVideo && format.hasAudio && format.url) {
							downloadLinks[qualityMap[format.qualityLabel]] = {
								resolution: format.qualityLabel,
								format: format.container,
								link: format.url,
								size: format.contentLength,
							};
						}
					});
					return downloadLinks;
				} catch (e) {
					console.error(e);
					throw new Error("Internal server error");
				}
			}),
		);

		return res.status(200).json(responses);
	} catch {
		return res.status(500).json({ error: "Internal server error" });
	}
}
