import { PlaylistItem, Quality } from "@types";

export const getQualities = (items: PlaylistItem[]): Quality[] => {
	if (!items?.length || items?.length === 0) return [];
	const qualities: Quality[] = [
		"ultraHigh",
		"high",
		"medium",
		"standard",
		"low",
		"ultraLow",
	];
	const filteredQualities = qualities.filter((quality) =>
		items?.every((item) => item.downloadLinks[quality]),
	);

	return filteredQualities ?? [];
};

export const sanitizeFileName = (name: string): string => {
	return name.replace(/[\/\\:*?"<>|]/g, "_");
};
