import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPlaylistId(url: string) {
  // Regular expression to match a YouTube playlist URL
  const playlistRegex = /list=([A-Za-z0-9_-]+)/;

  // Use the regex to find and extract the playlist ID
  const match = url.match(playlistRegex);

  if (match && match[1]) {
    return match[1];
  }
  return "";
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
