type URL = string;
export type URL<T> = T extends null ? "" : T;

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
    [high?: string]: VideoLinkData;
    [medium?: string]: VideoLinkData;
    [low?: string]: VideoLinkData;
  };
  qualities: string[];
};
