export type Quality =
  | "ultraHigh"
  | "high"
  | "medium"
  | "standard"
  | "low"
  | "ultraLow";

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
type VideoLinkData = {
  format: "mp4" | "3gp";
  link: string;
  size: number;
  resolution: "144p" | "360p" | "720p";
};

export type Playlist = {
  title: string;
  description: string;
  items: PlaylistItem[];
};
