import Link from "next/link";
import { Button } from "./ui/button";
import { Star, Coffee } from "lucide-react";
import XTwitter from "./ui/x-twitter";

export default function Footer() {
  return (
    <footer className="border border-t-primary bg-background py-10">
      <div className="container mx-auto flex max-w-6xl flex-wrap justify-between">
        <div className="mb-6 w-full md:mb-0 md:w-1/3 md:pr-4">
          <h2 className="mb-4 text-lg font-semibold">Playlist Pro</h2>
          <p>
            Playlist Pro is the only web application which allows you to easily
            download YouTube playlists no ads, no signups.
          </p>

          {/* <div className="flex items-center">
            <Avatar
              alt="Creator's avatar"
              className="mr-4"
              src="/placeholder.svg?height=50&width=50"
            />
            <div>
              <p className="font-bold">Judge-Paul</p>
              <Link className="text-sm text-blue-500" href="#">
                View on GitHub
              </Link>
            </div>
          </div> */}
        </div>
        <div className="mb-6 w-full md:mb-0 md:w-1/3">
          <h2 className="mb-4 text-lg font-semibold">Contribute</h2>
          <Link
            className="mb-2 block hover:text-gray-800 active:text-secondary dark:hover:text-gray-300"
            href="https://github.com/Judge-Paul/playlist-pro"
          >
            Check out the repo
          </Link>
          <Link
            className="mb-2 block hover:text-gray-800 active:text-secondary dark:hover:text-gray-300"
            href="https://github.com/Judge-Paul/playlist-pro/issues/new"
          >
            Open an Issue
          </Link>
          <Link
            className="mb-2 block hover:text-gray-800 active:text-secondary dark:hover:text-gray-300"
            href="mailto:judgepaulogebe@gmail.com?subject=Ideas%20for%20Playlist%20Pro&body=Hey%2C%20my%20name%20is%20_%20and%20I'd%20love%20to%20incorporate%20_%20to%20your%20playlist%20pro%20web%20application."
          >
            Send me a mail
          </Link>
        </div>
        <div className="mb-6 flex w-full flex-col md:mb-0 md:w-1/4">
          <h2 className="mb-4 text-lg font-semibold">Support</h2>
          <Link href="https://x.com/jadge_dev" target="_blank">
            <Button className="mb-2 w-full rounded-full" variant="outline">
              <XTwitter className="mr-1 h-4 w-4 text-primary" />
              Follow me
            </Button>
          </Link>
          <Link
            href="https://github.com/Judge-Paul/playlist-pro"
            target="_blank"
          >
            <Button className="mb-2 w-full rounded-full" variant="outline">
              <Star className="mr-1 h-4 w-4" />
              Star on GitHub
            </Button>
          </Link>
          <Button className="mb-2 rounded-full" variant="outline">
            <Coffee className="mr-1 h-4 w-4" />
            Buy Me a Coffee
          </Button>
        </div>
      </div>
    </footer>
  );
}