type URL = string;
export type URL<T> = T extends null ? "" : T;

type VideoLinkData = {
  quality: "144p" | "360p" | "720p";
  format: "mp4" | "3gp";
  link: string;
  size: number;
  resolution: string;
};

export type PlaylistItem = {
  etag: string;
  id: string;
  kind: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    channelTitle: string;
    description: string;
    playlistId: string;
    position: number;
    publishedAt: string;
    resourceId: {
      kind: string;
      videoId: string;
    };
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
    };
    title: string;
    videoOwnerChannelId: string;
    videoOwnerChannelTitle: string;
  };
  downloadLinks: {
    high: VideoLinkData;
    medium: VideoLinkData;
    low: VideoLinkData;
  };
};
