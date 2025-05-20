import Image from "next/image";

import PokeWikiWhiteLogo from "../../public/images/black_bg.png";
import { useTranslations } from "next-intl";

type HeaderProps = {
  fontStyle: string;
};

export default function Header({ fontStyle }: HeaderProps) {
  const t = useTranslations("Header");

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
            className={`${fontStyle} px-6 sm:px-8 md:px-10 font-normal text-center text-base md:text-lg lg:text-xl text-gray-50 dark:text-white`}
          >
            <span className="text-yellow-500 font-bold uppercase">[NOTE] </span>
            <span className="font-bold underline underline-offset-4">
              {t("desc_bold")}
            </span>
            <span> {t("desc")}</span>
          </p>
        </div>
      </div>
    </header>
  );
}
