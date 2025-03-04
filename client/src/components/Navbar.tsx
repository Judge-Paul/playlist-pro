import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/utils";
import { Github, XIcon, AlignRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWRImmutable from "swr/immutable";
import { useTour } from "@reactour/tour";
import StopScroll from "@/components/StopScroll";
import mixpanel from "@/lib/mixpanel";

export default function Navbar() {
  const { isOpen, setIsOpen } = useTour();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { data, error } = useSWRImmutable(
    "https://api.github.com/repos/Judge-Paul/playlist-pro",
    fetcher,
  );

  function startTour() {
    mixpanel.track("Walkthrough Started");
    setIsOpen(true);
    setIsNavOpen(false);
  }

  return (
    <>
      <StopScroll stop={isOpen} />
      <nav className="mx-auto my-5 flex w-full justify-between px-4 sm:max-w-6xl">
        <Link href="/" className="my-auto flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1"
            viewBox="0 0 500 500"
            className="h-12 w-12 fill-current text-foreground"
          >
            <path
              d="M3516 4839c-27-22-28-25-23-84l6-62-66-79c-36-43-103-128-148-189-127-169-111-164-192-54-37 52-105 143-150 203-79 104-95 137-73 151 6 3 10 19 10 35 0 47-69 87-106 62-33-22-44-86-19-118 20-27 18-68-10-234-14-80-32-203-41-275-9-71-17-141-19-155s-4-33-4-42c-1-17-52-18-936-18H810v-300l1333-1h1332l200-102 200-102 3-867 2-867-64 24c-220 83-539 87-763 11-165-56-302-154-358-257-42-79-47-185-12-263 65-142 241-258 472-312 64-15 118-19 275-18 177 0 204 3 292 27 197 52 368 166 428 283l25 49 3 1013c1 556 5 1012 7 1012 3 0 24-12 46-26 64-40 119-57 137-42 24 20 264 345 405 548 48 70 80 106 94 108 30 4 73 50 73 77 0 35-37 75-69 75s-53-20-74-71c-14-34-19-37-103-58-49-12-162-53-251-92-89-38-166-69-172-69-18 0-20 32-23 307l-2 273 33 27c29 25 31 31 22 54-12 32-47 59-77 59-29 0-63-43-59-75 2-23-21-40-224-169-247-158-277-174-290-160-5 5-12 63-16 129-3 66-13 194-21 285-21 222-21 218 4 236 28 19 29 73 3 102-28 34-71 38-105 11zm73-43c15-18 4-44-21-52-27-8-42 9-34 40 7 29 36 35 55 12zm-759-36c0-24-29-38-40-20-12 19-1 40 21 40 12 0 19-7 19-20zm116-372c23-35 63-100 90-146 32-54 54-80 62-77s95 57 193 121c98 63 186 114 196 112 20-4 36-56 83-270 22-99 37-148 46-148 7 0 107 27 221 59 251 71 255 72 271 62 9-5 24-82 43-212 16-112 29-206 29-208 0-4 137 6 180 13 80 14 208 25 228 20 43-12 29-33-162-230l-113-117-49 12c-52 13-183 67-322 132-46 21-85 39-88 39-2 0-52 23-110 50-58 28-107 50-109 50s-54 24-116 54c-63 30-181 84-264 120-82 37-163 73-180 81-16 8-75 34-130 57-150 65-139 53-127 134 6 38 16 107 22 154 11 86 29 179 37 193 11 19 32 2 69-55zm1304 37c13-16 6-35-15-35-18 0-28 17-21 35 7 19 20 19 36 0zm640-443c0-21-18-42-37-42-13 0-18 41-6 53 14 14 43 7 43-11zM3658 1540c149-42 222-98 222-170 0-94-173-174-411-187-258-15-509 79-509 190 0 84 122 156 315 187 94 14 298 4 383-20z"
              transform="matrix(.1 0 0 -.1 0 500)"
            ></path>
            <path
              d="M2906 4293c-20-92-32-224-22-232 19-16 226-112 716-333 611-275 663-298 684-298 18-1 216 215 201 218-8 2-75-4-149-12-183-22-195-21-205 7-5 13-19 103-32 200-12 97-26 182-30 189-5 8-74-7-246-56-131-36-241-66-244-66-13 0-37 79-74 243-22 94-43 167-49 167s-75-43-153-95c-157-104-219-139-237-132-6 3-39 52-73 110-35 58-67 108-72 111-5 4-12-6-15-21zM810 3220v-150h2760v300H810v-150zM812 2608l3-153 1377-3 1378-2v310H809l3-152zM810 1990v-150h1840v300H810v-150zM812 1378l3-153 763-3 762-2v310H809l3-152zM810 760V610h1220v300H810V760z"
              transform="matrix(.1 0 0 -.1 0 500)"
            ></path>
          </svg>
          <span className="my-auto text-xl font-semibold">YTPlay</span>
        </Link>
        <div className="my-auto hidden gap-6 font-semibold sm:flex">
          <span onClick={startTour} className="cursor-pointer">
            How it Works
          </span>
          <Link href="https://github.com/Judge-Paul/playlist-pro">
            Contribute
          </Link>
        </div>
        <AlignRight
          onClick={() => setIsNavOpen(true)}
          className="mr-2 h-10 w-10 cursor-pointer sm:hidden"
        />
        <Button
          variant="outline"
          className="sm:text-md hidden w-max gap-2  py-2 text-sm font-semibold sm:flex"
          asChild
        >
          <Link href="https://github.com/Judge-Paul/playlist-pro">
            <Github size="20px" /> Star on GitHub
            <span className="flex gap-2 rounded-full bg-secondary px-2 text-xs sm:text-sm">
              {data?.data?.stargazers_count ?? 0}
            </span>
          </Link>
        </Button>
      </nav>
      {isNavOpen && (
        <nav className="fixed inset-y-0 h-full w-full rounded-r-3xl bg-background px-8 py-7 sm:hidden">
          <span className="flex justify-between">
            <span className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1"
                viewBox="0 0 500 500"
                className="h-12 w-12 fill-current text-foreground"
              >
                <path
                  d="M3516 4839c-27-22-28-25-23-84l6-62-66-79c-36-43-103-128-148-189-127-169-111-164-192-54-37 52-105 143-150 203-79 104-95 137-73 151 6 3 10 19 10 35 0 47-69 87-106 62-33-22-44-86-19-118 20-27 18-68-10-234-14-80-32-203-41-275-9-71-17-141-19-155s-4-33-4-42c-1-17-52-18-936-18H810v-300l1333-1h1332l200-102 200-102 3-867 2-867-64 24c-220 83-539 87-763 11-165-56-302-154-358-257-42-79-47-185-12-263 65-142 241-258 472-312 64-15 118-19 275-18 177 0 204 3 292 27 197 52 368 166 428 283l25 49 3 1013c1 556 5 1012 7 1012 3 0 24-12 46-26 64-40 119-57 137-42 24 20 264 345 405 548 48 70 80 106 94 108 30 4 73 50 73 77 0 35-37 75-69 75s-53-20-74-71c-14-34-19-37-103-58-49-12-162-53-251-92-89-38-166-69-172-69-18 0-20 32-23 307l-2 273 33 27c29 25 31 31 22 54-12 32-47 59-77 59-29 0-63-43-59-75 2-23-21-40-224-169-247-158-277-174-290-160-5 5-12 63-16 129-3 66-13 194-21 285-21 222-21 218 4 236 28 19 29 73 3 102-28 34-71 38-105 11zm73-43c15-18 4-44-21-52-27-8-42 9-34 40 7 29 36 35 55 12zm-759-36c0-24-29-38-40-20-12 19-1 40 21 40 12 0 19-7 19-20zm116-372c23-35 63-100 90-146 32-54 54-80 62-77s95 57 193 121c98 63 186 114 196 112 20-4 36-56 83-270 22-99 37-148 46-148 7 0 107 27 221 59 251 71 255 72 271 62 9-5 24-82 43-212 16-112 29-206 29-208 0-4 137 6 180 13 80 14 208 25 228 20 43-12 29-33-162-230l-113-117-49 12c-52 13-183 67-322 132-46 21-85 39-88 39-2 0-52 23-110 50-58 28-107 50-109 50s-54 24-116 54c-63 30-181 84-264 120-82 37-163 73-180 81-16 8-75 34-130 57-150 65-139 53-127 134 6 38 16 107 22 154 11 86 29 179 37 193 11 19 32 2 69-55zm1304 37c13-16 6-35-15-35-18 0-28 17-21 35 7 19 20 19 36 0zm640-443c0-21-18-42-37-42-13 0-18 41-6 53 14 14 43 7 43-11zM3658 1540c149-42 222-98 222-170 0-94-173-174-411-187-258-15-509 79-509 190 0 84 122 156 315 187 94 14 298 4 383-20z"
                  transform="matrix(.1 0 0 -.1 0 500)"
                ></path>
                <path
                  d="M2906 4293c-20-92-32-224-22-232 19-16 226-112 716-333 611-275 663-298 684-298 18-1 216 215 201 218-8 2-75-4-149-12-183-22-195-21-205 7-5 13-19 103-32 200-12 97-26 182-30 189-5 8-74-7-246-56-131-36-241-66-244-66-13 0-37 79-74 243-22 94-43 167-49 167s-75-43-153-95c-157-104-219-139-237-132-6 3-39 52-73 110-35 58-67 108-72 111-5 4-12-6-15-21zM810 3220v-150h2760v300H810v-150zM812 2608l3-153 1377-3 1378-2v310H809l3-152zM810 1990v-150h1840v300H810v-150zM812 1378l3-153 763-3 762-2v310H809l3-152zM810 760V610h1220v300H810V760z"
                  transform="matrix(.1 0 0 -.1 0 500)"
                ></path>
              </svg>
              <span className="my-auto text-xl font-semibold">PlaylistPro</span>
            </span>
            <Button variant="outline" onClick={() => setIsNavOpen(false)}>
              <XIcon />
            </Button>
          </span>
          <ul className="flex flex-col gap-7 py-8 text-lg">
            <span onClick={startTour} className="cursor-pointer">
              How it Works
            </span>
            <Link href="https://github.com/Judge-Paul/playlist-pro">
              Contribute
            </Link>

            <Button
              variant="outline"
              className="sm:text-md w-max gap-2  py-2 text-sm font-semibold sm:flex"
              asChild
            >
              <Link href="https://github.com/Judge-Paul/playlist-pro">
                <Github size="20px" /> Star on GitHub
                <span className="flex gap-2 rounded-full bg-secondary px-2 text-xs sm:text-sm">
                  {data?.data?.stargazers_count ?? 0}
                </span>
              </Link>
            </Button>
          </ul>
        </nav>
      )}
    </>
  );
}
