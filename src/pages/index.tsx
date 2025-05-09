import { Hanken_Grotesk } from "next/font/google";
import Head from "next/head";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PokemonContent from "@/components/contents/PokemonContent";

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
      <PokemonContent />

      {/* FOOTER */}
      <Footer />
    </>
  );
}
