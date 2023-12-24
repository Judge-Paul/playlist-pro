import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoLoadingCard from "@/components/VideoLoadingCard";
import PlaylistCard from "@/components/PlaylistCard";
import { toast } from "sonner";
import useSWRImmtable from "swr/immutable";
import { fetcher } from "@/lib/utils";
import { PlaylistItem } from "@/types";
import useSWRImmutable from "swr/immutable";

export default function Download() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = router.query;
  const quality = searchParams.get("quality") || "medium";
  const { data, error } = useSWRImmutable(
    `/api/playlistItems?id=${id}`,
    fetcher,
  );
  if (data?.error) {
    toast.error(error + ". Reload the page to Try Again.");
  }
  function changeQuality(quality: string) {
    toast.success(`Changed Video Download Quality to ${quality}`);
    quality = quality.toLowerCase();
    router.push(`/download/${id}?quality=${quality}`);
  }

  return (
    <main>
      <h1 className="mt-10 text-center text-3xl font-bold lg:text-5xl">
        Playlist Videos
      </h1>
      <div className="mx-auto mt-7 max-w-5xl px-8">
        <div className="justify-between sm:flex">
          {data && !data.error ? (
            <h4 className="my-auto text-lg">
              {data.length} Videos in Playlist
            </h4>
          ) : (
            <div className="my-auto h-6 w-40 bg-secondary"></div>
          )}
          <div className="sm:flex sm:gap-2">
            <Popover>
              <PopoverTrigger className="ml-auto mt-2 flex rounded-md border border-primary px-4 py-2 dark:border-secondary sm:mt-0">
                Quality <ChevronDown className="ml-2" />
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
                  onClick={() => toast.error("Low Quality is not available")}
                  className="mt-2 block w-full"
                >
                  Low
                </Button>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger className="ml-auto mt-2 flex rounded-md border border-primary px-4 py-2 dark:border-secondary sm:mt-0">
                Download All <ChevronDown className="ml-2" />
              </PopoverTrigger>
              <PopoverContent className="max-w-max">
                <Button
                  onClick={() => toast.error("Downloading all isn't available")}
                  className="block"
                >
                  Download .zip
                </Button>
                <Button
                  onClick={() => toast.error("Downloading all isn't available")}
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
