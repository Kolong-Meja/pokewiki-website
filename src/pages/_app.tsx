import "@/styles/globals.css";
import type { AppProps } from "next/app";

/**
 * PUT YOUR GLOBAL LAYOUT, PROVIDER, AND GLOBAL CSS HERE! 
 */
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
