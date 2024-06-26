import { Download, ExternalLink, Youtube } from "lucide-react";
import { PlaylistItem } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { buttonVariants } from "@/components/ui/button";

export default function VideoCard({
  snippet,
  downloadLinks,
  qualities,
}: PlaylistItem) {
  const {
    title,
    description,
    thumbnails,
    resourceId: { videoId },
  } = snippet;

  let resolution = "";
  let link = "";
  if (qualities[0]) {
    link = downloadLinks[qualities[0]].link;
    resolution = downloadLinks[qualities[0]].resolution;
  }
  return (
    <div className="mb-2 justify-between gap-3 border border-secondary p-5 sm:flex">
      <Image
        src={
          thumbnails?.medium?.url ??
          thumbnails?.standard?.url ??
          thumbnails?.default?.url ??
          "https://www.gravatar.com/avatar/18c42a6912b0288d4c6a5c0ec3e3553d?s=120&d=blank&r=g"
        }
        width={thumbnails?.default?.width || 160}
        height={thumbnails?.default?.height || 112}
        className="aspect-video w-full bg-secondary sm:h-28 sm:w-40"
        alt={title ?? "Image not Available"}
        unoptimized
      />
      <div className="mt-3 sm:mt-0 sm:w-3/4">
        <h4 className="line-clamp-2 h-12 w-full font-semibold sm:w-2/3 md:w-1/2">
          {title ?? "N/A"}
        </h4>
        <p className="mt-4 line-clamp-3 h-12 w-full text-xs md:w-2/3">
          {description ?? "N/A"}
        </p>
      </div>
      <div className="sm:flex sm:flex-col sm:justify-between">
        <span className="fourth-step">
          <Link href={link} target="_blank" className="hidden sm:flex">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Download className="h-8 w-8 cursor-pointer hover:scale-[.90] active:scale-[.85]" />
                </TooltipTrigger>
                <TooltipContent>
                  {` ${resolution}`}
                  {link ? "" : " (Not Available)"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
          <Link
            href={link}
            target="_blank"
            className={cn(
              buttonVariants({ variant: "default" }),
              "fourth-step mt-3 w-full sm:hidden",
            )}
          >
            Download {resolution} video <Download className="ml-2" />
          </Link>
        </span>
        <span className="fifth-step">
          <Link
            href={`https://youtu.be/${videoId}`}
            target="_blank"
            className="fifth-step hidden sm:flex"
          >
            <ExternalLink className="h-8 w-8 cursor-pointer hover:scale-[.90] active:scale-[.85]" />
          </Link>
          <Link
            href={`https://youtu.be/${videoId}`}
            target="_blank"
            className={cn(
              buttonVariants({ variant: "default" }),
              "mt-3 w-full sm:hidden",
            )}
          >
            Watch <Youtube className="ml-2" />
          </Link>
        </span>
      </div>
    </div>
  );
}
