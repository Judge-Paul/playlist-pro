export type Env = {
	GOOGLE_API_KEY: string;
};

export type Resolution = "144p" | "240p" | "360p" | "480p" | "720p" | "1080p";
export type Quality =
	| "ultraHigh"
	| "high"
	| "medium"
	| "standard"
	| "low"
	| "ultraLow";

export type VideoLinkData = {
	format: "mp4" | "3gp";
	link: string;
	size: number;
	resolution: "144p" | "240p" | "360p" | "480p" | "720p" | "1080p";
};

export type PlaylistItem = {
	id: string;
	snippet: {
		title: string;
		description: string;
		resourceId: {
			videoId: string;
		};
		thumbnails: {
			default: { url: string; width: number; height: number };
			high: { url: string; width: number; height: number };
			maxres: { url: string; width: number; height: number };
			medium: { url: string; width: number; height: number };
			standard: { url: string; width: number; height: number };
		};
	};
	downloadLinks: {
		[key in Quality]?: VideoLinkData;
	};
	qualities: string[];
};

export type Playlist = {
	title: string;
	description: string;
	items: PlaylistItem[];
	qualities: Quality[];
	nextPageToken?: string;
};
