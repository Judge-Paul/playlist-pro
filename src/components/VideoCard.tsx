import { Download, ExternalLink } from "lucide-react";
import { VideoCardProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";

export default function VideoCard({
  thumbnails,
  title,
  description,
  resourceId,
}: VideoCardProps) {
  const { videoId } = resourceId;
  const { data, error } = useSWR(
    `/api/downloadLinks?videoId=${videoId}`,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );
  return (
    <div className="mb-2 justify-between gap-3 border border-secondary p-5 sm:flex">
      <Image
        src={
          thumbnails?.default?.url ||
          "https://www.gravatar.com/avatar/18c42a6912b0288d4c6a5c0ec3e3553d?s=120&d=blank&r=g"
        }
        width={thumbnails?.default?.width || 160}
        height={thumbnails?.default?.height || 160}
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
      <div className="mt-3 flex justify-between sm:flex-col">
        {data ? (
          <Link href={data[0]?.link || ""}>
            <Download className="h-8 w-8 cursor-pointer hover:scale-[.90] active:scale-[.85]" />
          </Link>
        ) : (
          <div className="h-8 w-8 bg-secondary"></div>
        )}
        <Link href={`https://youtu.be/${videoId}`}>
          <ExternalLink className="h-8 w-8 cursor-pointer hover:scale-[.90] active:scale-[.85]" />
        </Link>
      </div>
    </div>
  );
}
