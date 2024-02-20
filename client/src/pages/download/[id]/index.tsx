import { ArrowLeft, ChevronDown } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import VideoLoadingCard from "@/components/VideoLoadingCard";
import VideoCard from "@/components/VideoCard";
import { toast } from "sonner";
import useSWRImmutable from "swr/immutable";
import { cn, fetcher, getQualities, resolutionMap } from "@/lib/utils";
import { PlaylistItem, Quality } from "@/types";
import Link from "next/link";
import Head from "next/head";
import { useTour } from "@reactour/tour";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DownloadProps {
  id: string;
}

export default function Download({ id }: DownloadProps) {
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;
  const { setSteps } = useTour();
  const [qualities, setQualities] = useState<Quality[]>([]);

  const { data, error } = useSWRImmutable(
    `/api/playlistItems?id=${id}`,
    fetcher,
  );

  if (data?.error || error) {
    toast.error("Failed to get playlists.\nReload the page to Try Again.");
  }

  if (data && !data.error && qualities.length === 0) {
    setQualities(getQualities(data.items));
    setSteps &&
      setSteps([
        {
          selector: ".first-step",
          content: "Playlist Title",
        },
        {
          selector: ".second-step",
          content: "Return back to homepage to get another Playlist.",
        },
        {
          selector: ".third-step",
          content: "Download all videos in playlist as a zip file.",
        },
        {
          selector: ".fourth-step",
          content: "Download a single video in the playlist.",
        },
        {
          selector: ".fifth-step",
          content: "Play this video on YouTube",
        },
      ]);
  }

  return (
    <main className="mx-auto max-w-6xl py-5">
      <Head>
        <title>Playlist Pro</title>
      </Head>
      {data && !data.error ? (
        <>
          <h2 className="first-step line-clamp-2 text-ellipsis px-8 text-center text-xl font-bold sm:px-20 md:px-40 lg:text-4xl">
            {data?.title ?? "Playlist Videos"}
          </h2>
          <h3 className="mt-3 line-clamp-2 px-8 text-center text-lg font-light lg:text-xl">
            {data?.description}
          </h3>
        </>
      ) : (
        <div className="mx-auto my-auto h-10 w-96 bg-secondary"></div>
      )}
      <div className="mx-auto mt-7 max-w-6xl px-8">
        <div className="flex justify-between">
          <Link
            href="/"
            className="second-step my-auto flex w-max gap-2 hover:text-gray-800 active:text-secondary dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-7 w-7" />{" "}
            <span className="text-md my-auto hidden font-semibold sm:flex md:text-xl">
              Get another playlist
            </span>
          </Link>
          <div className="flex gap-2 text-sm sm:text-lg">
            {data && !data?.error && qualities.length > 0 ? (
              <Popover>
                <PopoverTrigger>
                  <Button variant="outline">Download All</Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-52 px-3 py-2">
                  {qualities.map((quality) => {
                    return (
                      <Link
                        key={quality}
                        href={`${serverURL}/createZip?id=${id}&quality=${quality}`}
                        className={cn(
                          "third-step mb-1 mt-1 w-full",
                          buttonVariants({ variant: "outline" }),
                        )}
                      >
                        Download ({resolutionMap[quality]}) .zip
                      </Link>
                    );
                  })}
                </PopoverContent>
              </Popover>
            ) : (
              <Button
                className="third-step mt-2 block w-full cursor-not-allowed hover:cursor-not-allowed hover:bg-none"
                aria-disabled
                variant="secondary"
              >
                Download All
              </Button>
            )}
          </div>
        </div>
        <div className="mt-7">
          {data && !data?.error ? (
            data.items.map((playlist: PlaylistItem) => {
              const { title, description } = playlist.snippet;
              if (
                (title !== "Private video" &&
                  description !== "This video is private.") ||
                (title !== "Deleted video" &&
                  description !== "This video is unavailable.")
              ) {
                return <VideoCard key={playlist.id} {...playlist} />;
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
