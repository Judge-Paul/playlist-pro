import { PlaylistItem } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPlaylistId(url: string): string {
  const parsedURL = new URL(url);
  const playlistId = parsedURL.searchParams.get("list") ?? "";
  return playlistId;
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes ?? 0) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const getQualities = (items: PlaylistItem[]): string[] => {
  if (!items?.length || items?.length === 0) return [];
  const qualities = ["high", "medium", "low"];
  const filteredQualities = qualities.filter(
    (level) => items?.every((item) => item.downloadLinks[level]),
  );

  return filteredQualities ?? [];
};
