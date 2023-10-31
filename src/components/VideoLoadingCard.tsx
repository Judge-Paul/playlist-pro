import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function VideoLoadingCard() {
  return (
    <div className="justify-between gap-3 border border-secondary p-5 sm:flex">
      <div className="h-40 w-full sm:h-24 sm:w-36">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="mt-3 sm:mt-0 sm:w-3/4">
        <div className="h-8 w-full sm:w-2/3 md:w-1/2">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="mt-4 h-3 w-full md:w-3/4">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="mt-1.5 h-3 w-full md:w-3/4">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="mt-1.5 h-3 w-full md:w-3/4">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
      <div className="mt-3 flex justify-between sm:flex-col">
        <div className="h-8 w-8">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="h-8 w-8">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
