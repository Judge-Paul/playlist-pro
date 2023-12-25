import { Html, Head, Main, NextScript } from "next/document";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "@/components/Layout";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Layout>
            <Main />
          </Layout>
        </ThemeProvider>
        <NextScript />
      </body>
    </Html>
  );
}
