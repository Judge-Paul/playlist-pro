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
      high: { url: string; width: number; height: number };
      maxres: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      standard: { url: string; width: number; height: number };
    };
    title: string;
    videoOwnerChannelId: string;
    videoOwnerChannelTitle: string;
  };
  downloadLinks: {
    [high: string]: VideoLinkData;
    [medium: string]: VideoLinkData;
    [low: string]: VideoLinkData;
  };
};
