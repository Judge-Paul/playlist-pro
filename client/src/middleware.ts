import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (process.env.MAINTENANCE_ON === "true") {
    const maintenancePage = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Service Unavailable</title>
        <link rel="icon" href="/favicon.png" />
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <main class="h-screen items-center justify-center border border-red-400">
          <div class="flex h-full w-full items-center justify-center text-center">
            <div class="md:w-[40rem]">
              <h1 class="text-ellipsis px-8 text-center text-xl font-bold lg:text-4xl">
                Service Unavailable
              </h1>
              <p class="mt-3 px-8 text-center text-sm font-light sm:mt-7 sm:text-lg lg:text-xl">
                Sorry our site is temporarily down.\nOur Engineers are working really
                hard to get it back up.\nPlease bear with us. The site should be back soon.
              </p>
              <img
                src="https://res.cloudinary.com/dyjxtk0dc/image/upload/v1721225698/penguin_iaszq6.webp"
                alt="penguin image"
                width="250"
                height="250"
                class="mx-auto mt-10"
              />
            </div>
          </div>
        </main>
      </body>
    </html>
    `;
    return new NextResponse(maintenancePage, {
      status: 503,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
