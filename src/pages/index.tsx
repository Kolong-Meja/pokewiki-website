import { Hanken_Grotesk } from "next/font/google";
import Head from "next/head";
import { GetStaticPropsContext } from "next";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MainContent from "@/components/MainContent";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PokeWiki",
  description:
    "PokeWiki is a wiki website for finding information about Pokemon.",
};

export async function getStaticProps({locale}: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../../translate/${locale}.json`))
        .default,
    },
  };
}

export default function Home() {
  return (
    <>
      <Head>
        <title>PokeWiki</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {/* NAVBAR */}
      <Navbar />

      {/* HEADER */}
      <Header fontStyle={hankenGrotesk.className} />

      {/* CONTENT */}
      <MainContent />

      {/* FOOTER */}
      <Footer />
    </>
  );
}
