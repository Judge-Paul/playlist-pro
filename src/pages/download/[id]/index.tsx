import { useParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoLoadingCard from "@/components/VideoLoadingCard";

export default function Download() {
  const params = useParams();
  console.log(params);
  let response;
  // fetch(`/api/playlistItems?id=${params.id}`);
  return (
    <main>
      <h1 className="mt-10 text-center text-3xl font-bold lg:text-5xl">
        Playlist Videos
      </h1>
      <div className="mx-auto mt-7 max-w-5xl px-8">
        <div className="flex justify-between">
          <h4 className="my-auto text-lg">Videos in Playlist</h4>
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
          {/* <div className="justify-between gap-3 border border-secondary p-5 sm:flex">
            <div className="h-40 w-full bg-secondary sm:h-24 sm:w-36"></div>
            <div className="mt-3 sm:mt-0 sm:w-3/4">
              <div className="h-8 w-full bg-secondary sm:w-2/3 md:w-1/2"></div>
              <div className="mt-4 h-3 w-full bg-secondary md:w-2/3"></div>
              <div className="mt-1.5 h-3 w-full bg-secondary md:w-2/3"></div>
              <div className="mt-1.5 h-3 w-full bg-secondary md:w-2/3"></div>
            </div>
            <div className="mt-3 flex justify-between sm:flex-col">
              <div className="h-8 w-8 bg-secondary"></div>
              <div className="h-8 w-8 bg-secondary"></div>
            </div>
          </div> */}
          <VideoLoadingCard />
        </div>
      </div>
    </main>
  );
}
