import Image from "next/image";

import PokeWikiWhiteLogo from "../../public/images/black_bg.png";

type HeaderProps = {
  fontStyle: string;
};

export default function Header({ fontStyle }: HeaderProps) {
  return (
    <header
      id="header"
      className="h-full max-h-full w-full max-w-full pt-12 bg-black dark:bg-soft-black transition-colors duration-300 ease-in-out"
    >
      <div className="container mx-auto">
        <div className="flex flex-col space-y-12 items-center px-8 py-10 sm:px-9 sm:py-11 md:px-10 md:py-12">
          <Image
            src={PokeWikiWhiteLogo}
            alt="PokeWiki Logo"
            width={400}
            height={200}
          />
          <p
            className={`${fontStyle} px-4 sm:px-5 md:px-6 font-normal text-center text-base md:text-lg lg:text-xl text-gray-50 dark:text-white`}
          >
            Welcome to PokeWiki. This is a side project I developed using
            Next.js.{" "}
            <span className="font-bold">
              This website does not take any profit from the Pokemon trademark.
            </span>{" "}
            This website was built with the aim of providing information about
            the fictional monsters or animals from Pokemon itself.
          </p>
        </div>
      </div>
    </header>
  );
}
