import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Playlist Pro</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Toaster richColors position="top-right" />
      <Component {...pageProps} />
    </>
  );
}
