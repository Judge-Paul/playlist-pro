import React, { ReactNode } from "react";
import Head from "next/head";
import Navbar from "./Navbar";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>YTPlaylistPro</title>
        <meta name="description" content="My App Description" />
      </Head>
      <Navbar />
      {children}
      <footer>This is the footer</footer>
    </>
  );
};

export default Layout;
