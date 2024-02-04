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
import { fetcher, getQualities } from "@/lib/utils";
import { PlaylistItem } from "@/types";
import Link from "next/link";
import axios from "axios";

export default function Download({ id }) {
  const router = useRouter();
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;

  const { data, error } = useSWRImmutable(
    `${serverURL}/playlistItems?id=${id}`,
    fetcher,
  );

  // let qualities = getQualities(data);
  async function downloadZip() {
    try {
      router.push(`${serverURL}/createZip?id=${id}`);
    } catch (error) {
      toast.error("Couldn't Generate Zip file. Please Try Again");
    }
  }

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
            <Popover>
              <PopoverTrigger className="flex rounded-md border border-primary px-2 py-2 dark:border-secondary sm:mt-0 sm:px-4">
                Download All
                <ChevronDown className="my-auto ml-2 h-4 w-4 sm:h-6 sm:w-6" />
              </PopoverTrigger>
              <PopoverContent className="max-w-max">
                {/* {qualities.map((quality) => {
                  return (
                    <Button
                      key={quality}
                      onClick={() => downloadZip(quality)}
                      className="mt-2 block w-full"
                    >
                      Download {quality} quality .zip
                    </Button>
                  );
                })} */}
                <Button onClick={downloadZip} className="mt-2 block w-full">
                  Download All
                </Button>
              </PopoverContent>
            </Popover>
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
            </>
          )}
        </div>
      </div>
    </main>
  );
}

interface Params {
  params: { id: string };
}

export async function getServerSideProps({ params }: Params) {
  const id = params.id;
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;

  // const data = await fetch(`${serverURL}/playlistItems?id=${params.id}`).then(
  //   (data) => {
  //     return data.json();
  //   },
  // );
  return { props: { id } };
}
