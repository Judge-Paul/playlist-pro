import Image from "next/image";
import { Inter } from "next/font/google";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="px-4 md:w-[36rem] lg:w-[44rem] lg:px-0">
          <h2 className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-center text-3xl font-bold text-transparent lg:text-6xl">
            Download any YouTube Playlist in a few clicks
          </h2>
          <p className="text-md mt-5 text-center">
            Our easy-to-use tool allows you to download as many YouTube videos
            as you want in only a few clicks. Just create a playlist or paste an
            already existing playlist into the input below and download videos
            immediately.
          </p>
          <div className="mt-5 flex gap-2 rounded-full bg-gradient-to-r from-pink-500 to-red-500 p-1">
            <div className="flex w-full gap-2 rounded-full bg-background p-1.5">
              <input className="text-md w-full rounded-l-full bg-transparent py-2.5 pl-4 pr-2 focus:outline-none md:text-xl" />
              <Button className="h-full rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-4 text-sm font-semibold hover:scale-95 dark:text-white md:px-7 md:text-lg">
                <Download className="mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
