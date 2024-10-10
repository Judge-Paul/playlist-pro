import { ChevronDownIcon, Download, ExternalLink, Youtube } from "lucide-react";
import { PlaylistItem } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { cn, formatBytes } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  let baseResolution = "";
  let baseLink = "";
  let baseSize = 0;
  if (qualities[0]) {
    baseLink = downloadLinks[qualities[0]].link;
    baseResolution = downloadLinks[qualities[0]].resolution;
    baseSize = downloadLinks[qualities[0]].size;
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
          <Link target="_blank" href={baseLink} className="hidden sm:flex">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Download className="h-8 w-8 cursor-pointer hover:scale-[.90] active:scale-[.85]" />
                </TooltipTrigger>
                <TooltipContent>
                  {` ${baseResolution}`}
                  {baseLink ? "" : " (Not Available)"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
          <div className="relative mt-3 inline-flex w-full">
            <Link
              target="_blank"
              href={baseLink}
              className={cn(
                buttonVariants({ variant: "default" }),
                "fourth-step ml-auto w-full rounded-r-none sm:hidden",
              )}
            >
              {baseResolution} {baseSize && `(${formatBytes(baseSize)})`}{" "}
              <Download className="ml-2" />
            </Link>
            {Object.keys(downloadLinks).length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="rounded-l-none">
                    <ChevronDownIcon className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-max">
                  {qualities.map((quality) => (
                    <DropdownMenuItem key={quality}>
                      <Link
                        target="_blank"
                        href={downloadLinks[quality].link}
                        className="mx-auto flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                        <span>{downloadLinks[quality].resolution}</span>
                        {downloadLinks[quality].size && (
                          <span>
                            ({formatBytes(downloadLinks[quality].size)})
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
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
