import { ArrowLeft } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import VideoLoadingCard from "@/components/VideoLoadingCard";
import VideoCard from "@/components/VideoCard";
import { cn, resolutionMap } from "@/lib/utils";
import { PlaylistItem, Quality } from "@/types";
import Link from "next/link";
import Head from "next/head";
import { useTour } from "@reactour/tour";
import { useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import usePlaylist from "@/hooks/usePlaylist";
import Loader from "@/components/loader";
import Image from "next/image";
import Penguin from "@/assets/penguin.png";

interface DownloadProps {
  id: string;
}

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;

export default function Download({ id }: DownloadProps) {
  const { setSteps } = useTour();
  const { error, isLoading, title, description, items, qualities } =
    usePlaylist(id);

  useEffect(() => {
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
  }, []);

  if (isLoading) {
    return (
      <main className="mx-auto py-5 sm:max-w-6xl">
        <Head>
          <title>Playlist Pro</title>
        </Head>
        <Loader className="mx-auto h-10 w-60 rounded-xl sm:w-96" />
        <div className="mx-6 mt-5 space-y-6 sm:mt-7">
          <VideoLoadingCard />
          <VideoLoadingCard />
          <VideoLoadingCard />
        </div>
      </main>
    );
  }

  if (error) {
    const notFound = error?.response?.status === 404;
    const title = notFound ? "Playlist Not Found" : "Failed To Get Playlists";
    return (
      <main className="mx-auto my-16 sm:max-w-6xl">
        <Head>
          <title>{title}</title>
        </Head>
        <div className="flex w-full items-center justify-center text-center">
          <div className="md:w-[40rem]">
            <h1 className="text-ellipsis px-8 text-center text-xl font-bold lg:text-4xl">
              {title}
            </h1>
            <p className="mt-3 px-8 text-center text-sm font-light sm:mt-7 sm:text-lg lg:text-xl">
              {notFound ? (
                <span>
                  The ID entered doesn&apos;t match a YouTube Playlist or the
                  playlist has been deleted. Please confirm the URL you pasted
                  and
                  <Link
                    href="/"
                    className="text-underline text-blue-400 hover:text-blue-500"
                  >
                    {" "}
                    try again
                  </Link>
                </span>
              ) : (
                <span>
                  Sorry an error occured while trying to get the playlist
                  download links. Please try reloading the page and if the error
                  persists
                  <Link
                    href="mailto:paul@ytplay.tech"
                    className="text-underline text-blue-400 hover:text-blue-500"
                  >
                    {" "}
                    contact us
                  </Link>
                </span>
              )}
              .
            </p>
            <Image
              src={Penguin}
              alt="not found penguin"
              width={250}
              height={250}
              className="mx-auto mt-10"
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto py-5 sm:max-w-6xl">
      <Head>
        <title>Playlist Pro {title}</title>
      </Head>
      <h1 className="first-step line-clamp-2 text-ellipsis px-8 text-center text-xl font-bold sm:px-20 md:px-40 lg:text-4xl">
        {title ?? "Playlist Videos"}
      </h1>
      <h3 className="mt-3 line-clamp-2 px-8 text-center text-lg font-light lg:text-xl">
        {description}
      </h3>
      <div className="mx-auto mt-5 sm:mt-7 sm:max-w-6xl">
        <div className="flex justify-between px-4">
          <Link
            href="/"
            className="second-step my-auto flex w-max gap-2 hover:text-gray-800 active:text-secondary dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-7 w-7" />{" "}
            <span className="sm:text-md my-auto text-sm font-semibold sm:flex md:text-xl">
              Get another playlist
            </span>
          </Link>
          <div className="flex gap-2 text-sm sm:text-lg">
            {qualities?.length > 0 ? (
              <Popover>
                <PopoverTrigger>
                  <Button variant="outline">Download All</Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-52 px-3 py-2">
                  {qualities.map((quality: Quality) => {
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
        <div className="mt-5 sm:mt-7">
          {items?.map((playlist: PlaylistItem) => {
            const { title, description } = playlist.snippet;
            if (
              (title !== "Private video" &&
                description !== "This video is private.") ||
              (title !== "Deleted video" &&
                description !== "This video is unavailable.")
            ) {
              return <VideoCard key={playlist.id} {...playlist} />;
            }
          })}
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
