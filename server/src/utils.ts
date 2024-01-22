import { PlaylistItem } from "./@types";

export const getQualities = (items: PlaylistItem[]): string[] => {
  if (!items?.length || items?.length === 0) return [];
  const qualities = ["high", "medium", "low"];
  const filteredQualities = qualities.filter((level) =>
    items?.every((item) => item.downloadLinks[level]),
  );

  return filteredQualities ?? [];
};
