export default function VideoLoadingCard() {
  return (
    <div className="mb-2 justify-between gap-3 border border-secondary p-5 sm:flex">
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
    </div>
  );
}
