import { z } from "zod";

const isYouTubePlaylist = (url: string) => {
	const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
	const isPlaylist = url.includes("list=");
	return isYouTube && isPlaylist;
};

export const URLSchema = z.string().refine(
	(url) => {
		return isYouTubePlaylist(url);
	},
	{
		message: "Invalid YouTube playlist URL",
	},
);
