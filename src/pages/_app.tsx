import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import Head from "next/head";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <Head>
          <title>Playlist Pro</title>
          <link rel="icon" href="/favicon.png" />
        </Head>
        <Layout>
          <Toaster richColors position="top-right" />
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  );
}
