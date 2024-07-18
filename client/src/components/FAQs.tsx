import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export default function FAQs() {
  return (
    <div className="mx-auto my-10 px-4 md:w-[36rem] lg:w-[44rem] lg:px-0">
      <h4 className="text-xl font-bold lg:text-4xl">
        Frequently Asked Questions
      </h4>
      <Accordion type="single" collapsible className="mt-7 w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>How many videos can I download?</AccordionTrigger>
          <AccordionContent>
            You can download any playlist with up to 50 videos. If you paste a
            playlist that has more than 50 videos only the first 50 will be
            selected.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is this illegal?</AccordionTrigger>
          <AccordionContent>
            Downloading YouTube videos isn&apos;t inherently illegal. But gaining
            offline access to copyrighted content without permission is. You can
            use our tool to download any content you have the rights to or any
            content that is uploaded under a Creative Commons license.
            <br />
            <br />
            We do not support using this tool to as a pirating site.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            Why Playlists, not Videos, TikToks, Reels?
          </AccordionTrigger>
          <AccordionContent>
            I originally built this tool to as a personal project because I was
            trying to download a playlist of videos and all other services I
            found would have me download videos individually while going through
            a new set of ads each time. So to answer the question it&apos;s because I
            was just trying to solve that one problem and not build a full
            startup.
            <br />
            <br />
            But I am looking at adding other features to the app in the future.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>
            When I try to access the site it&apos;s down, why is that? :(
          </AccordionTrigger>
          <AccordionContent>
            Although the tool is Open Source, I am the sole developer of this
            project and I am not always available to work on it. When you add
            server downtimes or general failure coupled with YouTube always
            changing the way their site works you will find that there are alot
            of things that would cause the service to generally not be available
            and often times I won&apos;t even be aware.
            <br />
            <br />
            The site also barely got visitors in the past (like prior June 2024)
            so I didn&apos;t see the need to constantly check on it cause no one was
            using it.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>
            I have an idea for a new feature/ I found a bug, how do I contact
            you?
          </AccordionTrigger>
          <AccordionContent>
            If you have an idea for a new feature or found a bug you can{" "}
            <Link
              className="underline"
              href="https://github.com/Judge-Paul/playlist-pro/issues/new"
            >
              create a new issue
            </Link>{" "}
            or if you are not familiar with GitHub you can send me an email at{" "}
            <Link className="underline" href="malito:paul@ytplay.tech">
              paul@ytplay.tech
            </Link>{" "}
            or you can reach out to me via{" "}
            <Link className="underline" href="https://x.com/jadge_dev">
              twitter
            </Link>
            <br />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>
            How do you (the Developer) make money from this?
          </AccordionTrigger>
          <AccordionContent>
            You might have noticed that there&apos;s no ads or paid subscription on
            this site and might be wondering how I manage that. Well I built
            this app because I hated the alternatives which were very ad-heavy
            so as long as I can afford to run the site I can let it run for
            free.
            <br />
            <br />
            The project is also Open Source so self-hosting is an option if
            there&apos;s ever ads or a subscripton tier you aren&apos;t comfortable with.
            <br />
            <br />
            <span className="font-bold">TL DR:</span> I don&apos;t
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-7">
          <AccordionTrigger>
            I love this project. How can I contribute?
          </AccordionTrigger>
          <AccordionContent>
            You can check out the{" "}
            <Link
              className="underline"
              href="https://github.com/Judge-Paul/playlist-pro/issues"
            >
              open issues
            </Link>{" "}
            and see what you can work on, not all of them are for developers.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
