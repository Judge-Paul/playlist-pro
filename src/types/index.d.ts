export type VideoCardProps = {
  title: string;
  description: string;
  thumbnails: {
    default: {
      url: string;
      height: number;
      width: number;
    };
  };
};
