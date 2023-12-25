import Head from "next/head";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>YTPlaylistPro</title>
        <meta name="description" content="My App Description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {children}
      <footer>This is the footer</footer>
    </>
  );
}
