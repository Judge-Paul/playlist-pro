import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoLoadingCard from "@/components/VideoLoadingCard";
import PlaylistCard from "@/components/PlaylistCard";
import { toast } from "sonner";
import useSWRImmutable from "swr/immutable";
import { fetcher } from "@/lib/utils";
import { PlaylistItem } from "@/types";
import Link from "next/link";

export default function Download() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = router.query;
  const quality = searchParams.get("quality") || "medium";
  const { data, error } = useSWRImmutable(
    `/api/playlistItems?id=${id}`,
    fetcher,
  );
  if (data?.error || error) {
    toast.error("Failed to get playlists.\nReload the page to Try Again.");
  }
  function changeQuality(quality: string) {
    toast.success(`Changed Video Download Quality to ${quality}`);
    quality = quality.toLowerCase();
    router.push(`/download/${id}?quality=${quality}`);
  }

  return (
    <main className="py-10">
      <h2 className="text-center text-2xl font-bold lg:text-5xl">
        Playlist Videos
      </h2>
      <div className="mx-auto mt-7 max-w-6xl px-8">
        {data && !data.error ? (
          <h4 className="my-auto text-lg">{data.length} Videos in Playlist</h4>
        ) : (
          <div className="my-auto h-6 w-40 bg-secondary"></div>
        )}
      </div>
      <div className="mx-auto mt-7 max-w-6xl px-8">
        <div className="flex justify-between">
          <Link
            href="/"
            className="my-auto flex w-max gap-2 hover:text-gray-800 active:text-secondary dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-8 w-8" />{" "}
            <span className="my-auto hidden text-lg font-semibold sm:flex md:text-xl">
              Get another playlist
            </span>
          </Link>
          <div className="flex gap-2 text-sm sm:text-lg">
            <Popover>
              <PopoverTrigger className="flex rounded-md border border-primary px-2 py-2 dark:border-secondary sm:mt-0 sm:px-4">
                Quality{" "}
                <ChevronDown className="my-auto ml-2 h-4 w-4 sm:h-6 sm:w-6" />
              </PopoverTrigger>
              <PopoverContent className="max-w-max">
                <Button
                  onClick={() => changeQuality("High")}
                  className="block w-full"
                >
                  High
                </Button>
                <Button
                  onClick={() => changeQuality("Medium")}
                  className="mt-2 block w-full"
                >
                  Medium
                </Button>
                <Button
                  // onClick={() => toast.error("Low Quality is not available")}
                  onClick={() => changeQuality("Low")}
                  className="mt-2 block w-full"
                >
                  Low
                </Button>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger className="flex rounded-md border border-primary px-2 py-2 dark:border-secondary sm:mt-0 sm:px-4">
                Download All
                <ChevronDown className="my-auto ml-2 h-4 w-4 sm:h-6 sm:w-6" />
              </PopoverTrigger>
              <PopoverContent className="max-w-max">
                <Button
                  onClick={() =>
                    toast.error("Downloading all isn't available yet")
                  }
                  className="block"
                >
                  Download .zip
                </Button>
                <Button
                  onClick={() =>
                    toast.error("Downloading all isn't available yet")
                  }
                  className="mt-2 block"
                >
                  Download .rar
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="mt-7">
          {data && !data?.error ? (
            data.map((playlist: PlaylistItem) => (
              <PlaylistCard key={playlist.id} {...playlist} quality={quality} />
            ))
          ) : (
            <>
              <VideoLoadingCard />
              <VideoLoadingCard />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
