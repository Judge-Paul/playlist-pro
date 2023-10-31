import { useRouter } from "next/router";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoLoadingCard from "@/components/VideoLoadingCard";
import VideoCard from "@/components/VideoCard";
import { toast } from "sonner";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Download() {
  const router = useRouter();
  const id = router.query.id;
  const { data, error } = useSWR(`/api/playlistItems?id=${id}`, fetcher, {
    revalidateOnFocus: false,
  });
  if (data?.error) {
    toast.error(data.error + ". Reload the page to Try Again.");
  }
  return (
    <main>
      <h1 className="mt-10 text-center text-3xl font-bold lg:text-5xl">
        Playlist Videos
      </h1>
      <div className="mx-auto mt-7 max-w-5xl px-8">
        <div className="flex justify-between">
          {data && !data?.error ? (
            <h4 className="my-auto text-lg">
              {data.length} Videos in Playlist
            </h4>
          ) : (
            <div className="my-auto h-6 w-40 bg-secondary"></div>
          )}
          <Popover>
            <PopoverTrigger className="flex rounded-md border border-primary px-4 py-2 dark:border-secondary">
              Download All <ChevronDown className="ml-2" />
            </PopoverTrigger>
            <PopoverContent className="max-w-max">
              <Button className="block">Download .zip</Button>
              <Button className="mt-2 block">Download .rar</Button>
            </PopoverContent>
          </Popover>
        </div>
        <div className="mt-7">
          {data && !data?.error ? (
            data.map((video: any) => (
              <VideoCard key={video.id} {...video.snippet} />
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
