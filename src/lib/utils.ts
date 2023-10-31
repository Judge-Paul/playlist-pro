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
  } else {
    return null;
  }
}
