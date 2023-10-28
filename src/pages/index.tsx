import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="px-4 md:w-[36rem] lg:w-[44rem] lg:px-0">
          <h2 className="text-3xl font-semibold lg:text-5xl">
            Download any Public Playlist in a few clicks
          </h2>
          <p className="mt-5">
            Our easy-to-use tool allows you to download as many YouTube videos
            as you want in only a few clicks. <br />
            Just create a playlist or paste an already existing playlist into
            the input below and download videos immediately.
          </p>
        </div>
      </div>
    </main>
  );
}
