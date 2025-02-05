import * as ytdl from "@distube/ytdl-core";

const qualityMap: any = {
	"1080p": "ultraHigh",
	"720p": "high",
	"480p": "standard",
	"360p": "medium",
	"240p": "low",
	"144p": "ultraLow",
};

export async function getDownloadLinks(videoIds: string[]) {
	if (!videoIds) {
		throw new Error("Missing videoIds");
	}

	try {
		const responses = await Promise.all(
			videoIds.map(async (videoId: string) => {
				return ytdl
					.getInfo(`https://www.youtube.com/watch?v=${videoId}`, {
						// agent,
						// requestOptions: {
						// 	headers: {
						// 		"User-Agent":
						// 			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
						// 	},
						// },
						// playerClients: ["WEB"],
					})
					.then((info) => {
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
					})
					.catch((err) => {
						console.error(err);
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
