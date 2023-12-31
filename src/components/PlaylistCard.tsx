import { Download, ExternalLink, Youtube } from "lucide-react";
import { useRouter } from "next/router";
import { PlaylistItem, VideoLinkData } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { formatBytes } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PlaylistCardProps = PlaylistItem & {
  quality: any;
};

export default function PlaylistCard({
  snippet,
  downloadLinks,
  quality,
}: PlaylistCardProps) {
  const router = useRouter();
  const {
    title,
    description,
    thumbnails,
    resourceId: { videoId },
  } = snippet;
  const { link, size, resolution } = (
    downloadLinks as Record<string, VideoLinkData>
  )[quality];
  return (
    <div className="mb-2 justify-between gap-3 border border-secondary p-5 sm:flex">
      <Image
        src={
          thumbnails?.default?.url ||
          "https://www.gravatar.com/avatar/18c42a6912b0288d4c6a5c0ec3e3553d?s=120&d=blank&r=g"
        }
        width={thumbnails?.default?.width || 160}
        height={thumbnails?.default?.height || 112}
        className="h-40 w-full bg-secondary sm:h-28 sm:w-40"
        alt={title || "Image not Available"}
      />
      <div className="mt-3 sm:mt-0 sm:w-3/4">
        <h4 className="line-clamp-2 h-12 w-full font-semibold sm:w-2/3 md:w-1/2">
          {title || "N/A"}
        </h4>
        <p className="mt-4 line-clamp-3 h-12 w-full text-xs md:w-2/3">
          {description || "N/A"}
        </p>
      </div>
      <div className="hidden flex-col justify-between sm:flex">
        <Link href={link || `${router.asPath}#`} target="_blank">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Download className="h-8 w-8 cursor-pointer hover:scale-[.90] active:scale-[.85]" />
              </TooltipTrigger>
              <TooltipContent>
                {` ${resolution} (${formatBytes(size)})`}
                {link ? "" : " (Not Available)"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Link>
        <Link href={`https://youtu.be/${videoId}`} target="_blank">
          <ExternalLink className="h-8 w-8 cursor-pointer hover:scale-[.90] active:scale-[.85]" />
        </Link>
      </div>
      <div className="mt-2 sm:hidden">
        <Link
          href={link || `${router.asPath}#`}
          target="_blank"
          className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-secondary"
        >
          Download ({formatBytes(size)}) <Download className="ml-2" />
        </Link>
        <Link
          href={`https://youtu.be/${videoId}`}
          target="_blank"
          className="mt-2 flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-secondary"
        >
          Watch <Youtube className="ml-2" />
        </Link>
      </div>
    </div>
  );
}
