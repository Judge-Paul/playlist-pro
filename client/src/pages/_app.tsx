import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import Head from "next/head";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "@/components/Layout";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TourProvider } from "@reactour/tour";

export default function App({ Component, pageProps }: AppProps) {
  const steps = [
    {
      selector: ".first-step",
      content: "Enter a YouTube Playlist and press download.",
    },
  ];

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <TourProvider steps={steps}>
          <Head>
            <title>YTPlaylistPro - Download YouTube Playlists</title>
            <meta
              name="description"
              content="YTPlaylistPro is a free, easy to use, open source, YouTube playlist downloader, no ads, no signup, very fast."
            />
            <link rel="icon" href="/favicon.png" />
          </Head>
          <Layout>
            <Toaster richColors position="top-right" />
            <Component {...pageProps} />
          </Layout>
        </TourProvider>
        <Analytics />
        <SpeedInsights />
      </ThemeProvider>
    </>
  );
}
