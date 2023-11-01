export type VideoCardProps = {
  title: string;
  description: string;
  resourceId: {
    videoId: string;
  };
  thumbnails: {
    default: {
      url: string;
      height: number;
      width: number;
    };
  };
};

type URL = string;
export type URL<T> = T extends null ? "" : T;
