import { Hanken_Grotesk } from "next/font/google";
import Head from "next/head";

import Header from "@/components/Header/page";
import Content from "@/components/Content/page";
import Footer from "@/components/Footer/page";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <Head>
        <title>PokeWiki</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {/* HEADER */}
      <Header fontStyle={hankenGrotesk.className} />

      {/* CONTENT */}
      <Content />

      {/* FOOTER */}
      <Footer />
    </>
  );
}
