import Image from "next/image";
import { Inter } from "next/font/google";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { URLSchema } from "@/lib/zod";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { cn, getPlaylistId } from "@/lib/utils";
import { FormEvent, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [playlistURL, setPlaylistURL] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      URLSchema.parse(playlistURL);
      let playlistId = getPlaylistId(playlistURL);
      if (playlistId) {
        router.push(`/download/${playlistId}`);
        toast.info("Generating Playlist Downloads...");
      } else {
        toast.error("Error Generating Playlist Downloads...");
      }
      setIsLoading(false);
    } catch (error: any) {
      toast.error("Enter a Valid YouTube Playlist URL");
      setIsLoading(false);
    }
  }

  return (
    <main
      className={cn(
        inter.className,
        "flex min-h-[90vh] w-full items-center justify-center",
      )}
    >
      <div className="px-4 md:w-[36rem] lg:w-[44rem] lg:px-0">
        <h2 className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-center text-3xl font-bold text-transparent lg:text-6xl">
          Download any YouTube Playlist in a few clicks
        </h2>
        <p className="text-md mt-8 text-center">
          Our easy-to-use tool allows you to download as many YouTube videos as
          you want in only a few clicks. Just create a playlist or paste an
          already existing playlist into the input below and download videos
          immediately.
        </p>
        <div className="mt-8 flex gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 p-1">
          <form
            onSubmit={handleSubmit}
            className="flex w-full gap-2  bg-background p-1.5"
          >
            <input
              onChange={(e) => setPlaylistURL(e.target.value)}
              className="sm:text-md w-full rounded-l-full bg-transparent py-2.5 pl-4 pr-2 text-xs focus:outline-none md:text-xl"
              placeholder="Enter a valid YouTube Playlist"
            />
            <Button
              disabled={isLoading}
              className="h-full  bg-gradient-to-r from-pink-500 to-red-500 px-4 text-sm font-semibold hover:scale-95 active:scale-90 dark:text-white md:px-7 md:text-lg"
            >
              <Download className="mr-2" />
              Download
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
