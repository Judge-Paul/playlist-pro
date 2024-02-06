import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import VideoLoadingCard from "@/components/VideoLoadingCard";
import PlaylistCard from "@/components/PlaylistCard";
import { toast } from "sonner";
import useSWRImmutable from "swr/immutable";
import { cn, fetcher, getQualities } from "@/lib/utils";
import { PlaylistItem } from "@/types";
import Link from "next/link";

interface DownloadProps {
  id: string;
}

export default function Download({ id }: DownloadProps) {
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;

  const { data, error } = useSWRImmutable(
    `/api/playlistItems?id=${id}`,
    fetcher,
  );
  // let qualities = getQualities(data);
  if (data?.error || error) {
    toast.error("Failed to get playlists.\nReload the page to Try Again.");
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
            <Link
              href={`${serverURL}/createZip?id=${id}`}
              className={cn(
                "mt-2 block w-full",
                buttonVariants({ variant: "outline" }),
              )}
            >
              Download All
            </Link>
          </div>
        </div>
        <div className="mt-7">
          {data && !data?.error ? (
            data.map((playlist: PlaylistItem) => {
              const { title, description } = playlist.snippet;
              if (
                (title !== "Private video" &&
                  description !== "This video is private.") ||
                (title !== "Deleted video" &&
                  description !== "This video is unavailable.")
              ) {
                return <PlaylistCard key={playlist.id} {...playlist} />;
              }
            })
          ) : (
            <>
              <VideoLoadingCard />
              <VideoLoadingCard />
              <VideoLoadingCard />
            </>
          )}
        </div>
      </div>
    </main>
  );
}

interface ServerSideProps {
  params: { id: string };
}

export async function getServerSideProps({ params }: ServerSideProps) {
  const id = params.id;

  return { props: { id } };
}
